import React from 'react';
import { Phone, Video, PhoneOff, Mic, MicOff, VideoOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CallBarProps {
  isCallActive: boolean;
  isMuted: boolean;
  isVideoOff: boolean;
  callStatus: 'idle' | 'calling' | 'ringing' | 'connected';
  onStartAudioCall: () => void;
  onStartVideoCall: () => void;
  onEndCall: () => void;
  onToggleMute: () => void;
  onToggleVideo: () => void;
}

export const CallBar: React.FC<CallBarProps> = ({
  isCallActive,
  isMuted,
  isVideoOff,
  callStatus,
  onStartAudioCall,
  onStartVideoCall,
  onEndCall,
  onToggleMute,
  onToggleVideo,
}) => {
  if (!isCallActive && callStatus === 'idle') {
    return (
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={onStartVideoCall}>
          <Video size={20} />
        </Button>
        <Button variant="ghost" size="icon" onClick={onStartAudioCall}>
          <Phone size={20} />
        </Button>
      </div>
    );
  }

  if (callStatus === 'calling' || callStatus === 'ringing') {
    return (
      <div className="flex items-center gap-2 p-2 bg-accent text-accent-foreground rounded-lg">
        <span className="text-sm">
          {callStatus === 'calling' ? 'Calling...' : 'Incoming call...'}
        </span>
        <Button variant="destructive" size="icon" onClick={onEndCall}>
          <PhoneOff size={20} />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 p-2 bg-accent text-accent-foreground rounded-lg">
      <span className="text-sm mr-2">Call active</span>
      
      <Button
        variant={isMuted ? 'destructive' : 'secondary'}
        size="icon"
        onClick={onToggleMute}
      >
        {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
      </Button>

      <Button
        variant={isVideoOff ? 'destructive' : 'secondary'}
        size="icon"
        onClick={onToggleVideo}
      >
        {isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
      </Button>

      <Button variant="destructive" size="icon" onClick={onEndCall}>
        <PhoneOff size={20} />
      </Button>
    </div>
  );
};