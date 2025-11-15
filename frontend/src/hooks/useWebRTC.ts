import { useState, useEffect, useRef, useCallback } from 'react';

interface UseWebRTCProps {
  conversationId: string;
  userId: string;
  isAudioOnly?: boolean;
}

const STUN_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

export const useWebRTC = ({ conversationId, userId, isAudioOnly = false }: UseWebRTCProps) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(isAudioOnly);
  const [callStatus, setCallStatus] = useState<'idle' | 'calling' | 'ringing' | 'connected'>('idle');

  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Listen for signaling messages
    const handleSignaling = (e: StorageEvent) => {
      if (e.key === `webrtc_signal_${conversationId}` && e.newValue) {
        try {
          const signal = JSON.parse(e.newValue);
          if (signal.to === userId) {
            handleSignalingMessage(signal);
          }
        } catch (error) {
          console.error('Error parsing signaling message:', error);
        }
      }
    };

    window.addEventListener('storage', handleSignaling);
    return () => window.removeEventListener('storage', handleSignaling);
  }, [conversationId, userId]);

  const sendSignal = useCallback(
    (signal: any) => {
      const message = JSON.stringify({ ...signal, timestamp: Date.now() });
      localStorage.setItem(`webrtc_signal_${conversationId}`, message);
    },
    [conversationId]
  );

  const handleSignalingMessage = async (signal: any) => {
    if (!peerConnection.current) {
      await createPeerConnection();
    }

    if (signal.type === 'offer') {
      setCallStatus('ringing');
      await peerConnection.current!.setRemoteDescription(new RTCSessionDescription(signal.offer));
      const answer = await peerConnection.current!.createAnswer();
      await peerConnection.current!.setLocalDescription(answer);
      sendSignal({ type: 'answer', answer, from: userId, to: signal.from });
      setCallStatus('connected');
      setIsCallActive(true);
    } else if (signal.type === 'answer') {
      await peerConnection.current!.setRemoteDescription(new RTCSessionDescription(signal.answer));
      setCallStatus('connected');
    } else if (signal.type === 'ice-candidate') {
      await peerConnection.current!.addIceCandidate(new RTCIceCandidate(signal.candidate));
    } else if (signal.type === 'end-call') {
      endCall();
    }
  };

  const createPeerConnection = async () => {
    const pc = new RTCPeerConnection(STUN_SERVERS);

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        sendSignal({ type: 'ice-candidate', candidate: event.candidate, from: userId });
      }
    };

    pc.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === 'connected') {
        setCallStatus('connected');
      } else if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
        endCall();
      }
    };

    peerConnection.current = pc;
  };

  const startCall = async (targetUserId: string) => {
    try {
      setCallStatus('calling');
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: !isAudioOnly,
      });

      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      await createPeerConnection();

      stream.getTracks().forEach((track) => {
        peerConnection.current!.addTrack(track, stream);
      });

      const offer = await peerConnection.current!.createOffer();
      await peerConnection.current!.setLocalDescription(offer);

      sendSignal({ type: 'offer', offer, from: userId, to: targetUserId });
      setIsCallActive(true);
    } catch (error) {
      console.error('Error starting call:', error);
      setCallStatus('idle');
    }
  };

  const answerCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: !isAudioOnly,
      });

      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      stream.getTracks().forEach((track) => {
        peerConnection.current!.addTrack(track, stream);
      });
    } catch (error) {
      console.error('Error answering call:', error);
    }
  };

  const endCall = useCallback(() => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
    }

    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }

    setRemoteStream(null);
    setIsCallActive(false);
    setCallStatus('idle');
    sendSignal({ type: 'end-call', from: userId });
  }, [localStream, userId, sendSignal]);

  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  return {
    localStream,
    remoteStream,
    isCallActive,
    isMuted,
    isVideoOff,
    callStatus,
    localVideoRef,
    remoteVideoRef,
    startCall,
    answerCall,
    endCall,
    toggleMute,
    toggleVideo,
  };
};