import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { db, Conversation, Message, User } from '@/lib/db';
import { useRealtime } from '@/hooks/useRealtime';
import { useWebRTC } from '@/hooks/useWebRTC';
import { ChatListItem } from '@/components/ChatListItem';
import { MessageBubble } from '@/components/MessageBubble';
import { Composer } from '@/components/Composer';
import { CallBar } from '@/components/CallBar';
import { Avatar } from '@/components/Avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LogOut, Search, Plus, Settings } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const Chat = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [otherUsers, setOtherUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [newContactEmail, setNewContactEmail] = useState('');
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const webrtc = useWebRTC({
    conversationId: selectedConversation?.id || '',
    userId: user?.id || '',
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadConversations();
    loadOtherUsers();
  }, [user, navigate]);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id);
    }
  }, [selectedConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const { broadcast } = useRealtime(`chat_${user?.id}`, (data) => {
    if (data.type === 'new_message' && data.conversationId === selectedConversation?.id) {
      loadMessages(selectedConversation.id);
    }
    if (data.type === 'conversation_updated') {
      loadConversations();
    }
  });

  const loadConversations = async () => {
    const allConvs = await db.getAll<Conversation>('conversations');
    const userConvs = allConvs
      .filter((c) => c.participantIds.includes(user!.id))
      .sort((a, b) => b.lastMessageAt - a.lastMessageAt);
    setConversations(userConvs);
  };

  const loadMessages = async (conversationId: string) => {
    const msgs = await db.getAllByIndex<Message>('messages', 'conversationId', conversationId);
    setMessages(msgs.sort((a, b) => a.createdAt - b.createdAt));
  };

  const loadOtherUsers = async () => {
    const allUsers = await db.getAll<User>('users');
    const others = allUsers.filter((u) => u.id !== user?.id);
    setOtherUsers(others);
  };

  const createOrOpenConversation = async (otherUserId: string) => {
    const existing = conversations.find(
      (c) =>
        c.type === '1:1' &&
        c.participantIds.includes(otherUserId) &&
        c.participantIds.includes(user!.id)
    );

    if (existing) {
      setSelectedConversation(existing);
      return;
    }

    const newConv: Conversation = {
      id: `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: '1:1',
      participantIds: [user!.id, otherUserId],
      lastMessageAt: Date.now(),
      createdAt: Date.now(),
    };

    await db.add('conversations', newConv);
    loadConversations();
    setSelectedConversation(newConv);
    broadcast({ type: 'conversation_updated' });
  };

  const handleAddContact = async () => {
    const foundUser = otherUsers.find((u) => u.email === newContactEmail);
    if (!foundUser) {
      toast({
        title: 'User not found',
        description: 'No user with that email exists',
        variant: 'destructive',
      });
      return;
    }

    await createOrOpenConversation(foundUser.id);
    setNewContactEmail('');
    setIsAddContactOpen(false);
    toast({
      title: 'Contact added',
      description: `You can now chat with ${foundUser.displayName}`,
    });
  };

  const handleSendMessage = async (content: string, type: 'text' | 'image' | 'file') => {
    if (!selectedConversation || !user) return;

    const newMessage: Message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      conversationId: selectedConversation.id,
      senderId: user.id,
      content,
      type,
      status: 'sent',
      createdAt: Date.now(),
      ...(type === 'image' && { mediaUrl: content }),
    };

    await db.add('messages', newMessage);
    await db.put('conversations', {
      ...selectedConversation,
      lastMessageAt: Date.now(),
    });

    loadMessages(selectedConversation.id);
    loadConversations();

    // Broadcast to other participants
    selectedConversation.participantIds.forEach((participantId) => {
      if (participantId !== user.id) {
        localStorage.setItem(
          `realtime_chat_${participantId}`,
          JSON.stringify({
            type: 'new_message',
            conversationId: selectedConversation.id,
            timestamp: Date.now(),
          })
        );
      }
    });
  };

  const getConversationName = (conv: Conversation) => {
    if (conv.name) return conv.name;
    const otherId = conv.participantIds.find((id) => id !== user?.id);
    const otherUser = otherUsers.find((u) => u.id === otherId);
    return otherUser?.displayName || 'Unknown';
  };

  const getConversationAvatar = (conv: Conversation) => {
    const otherId = conv.participantIds.find((id) => id !== user?.id);
    const otherUser = otherUsers.find((u) => u.id === otherId);
    return otherUser?.avatarUrl;
  };

  const getConversationOnlineStatus = (conv: Conversation) => {
    const otherId = conv.participantIds.find((id) => id !== user?.id);
    const otherUser = otherUsers.find((u) => u.id === otherId);
    return otherUser?.isOnline;
  };

  const getLastMessage = (conv: Conversation) => {
    const convMessages = messages.filter((m) => m.conversationId === conv.id);
    if (convMessages.length === 0) return 'No messages yet';
    const last = convMessages[convMessages.length - 1];
    return last.type === 'text' ? last.content : `[${last.type}]`;
  };

  const filteredConversations = conversations.filter((conv) =>
    getConversationName(conv).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStartVideoCall = () => {
    if (!selectedConversation) return;
    const otherId = selectedConversation.participantIds.find((id) => id !== user?.id);
    if (otherId) {
      webrtc.startCall(otherId);
    }
  };

  const handleStartAudioCall = () => {
    if (!selectedConversation) return;
    const otherId = selectedConversation.participantIds.find((id) => id !== user?.id);
    if (otherId) {
      webrtc.startCall(otherId);
    }
  };

  return (
    <div className="flex h-screen bg-[hsl(var(--chat-bg))]">
      {/* Sidebar */}
      <div className="w-full md:w-96 border-r border-border bg-background flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar src={user?.avatarUrl} alt={user?.displayName || 'User'} isOnline={true} />
            <h2 className="font-semibold text-foreground">{user?.displayName}</h2>
          </div>
          <div className="flex gap-2">
            <Dialog open={isAddContactOpen} onOpenChange={setIsAddContactOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Plus size={20} />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Contact</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact-email">Email Address</Label>
                    <Input
                      id="contact-email"
                      type="email"
                      value={newContactEmail}
                      onChange={(e) => setNewContactEmail(e.target.value)}
                      placeholder="friend@example.com"
                    />
                  </div>
                  <Button onClick={handleAddContact} className="w-full">
                    Add Contact
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button variant="ghost" size="icon" onClick={() => logout()}>
              <LogOut size={20} />
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder="Search chats"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto chat-scroll">
          {filteredConversations.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <p>No conversations yet</p>
              <p className="text-sm mt-2">Click the + button to start chatting</p>
            </div>
          ) : (
            filteredConversations.map((conv) => (
              <ChatListItem
                key={conv.id}
                id={conv.id}
                name={getConversationName(conv)}
                avatarUrl={getConversationAvatar(conv)}
                lastMessage={getLastMessage(conv)}
                lastMessageAt={conv.lastMessageAt}
                unreadCount={0}
                isOnline={getConversationOnlineStatus(conv)}
                isActive={selectedConversation?.id === conv.id}
                onClick={() => setSelectedConversation(conv)}
              />
            ))
          )}
        </div>
      </div>

      {/* Chat Panel */}
      <div className="flex-1 flex flex-col bg-[hsl(var(--chat-panel))]">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar
                  src={getConversationAvatar(selectedConversation)}
                  alt={getConversationName(selectedConversation)}
                  isOnline={getConversationOnlineStatus(selectedConversation)}
                />
                <div>
                  <h3 className="font-semibold text-foreground">
                    {getConversationName(selectedConversation)}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {getConversationOnlineStatus(selectedConversation) ? 'online' : 'offline'}
                  </p>
                </div>
              </div>

              <CallBar
                isCallActive={webrtc.isCallActive}
                isMuted={webrtc.isMuted}
                isVideoOff={webrtc.isVideoOff}
                callStatus={webrtc.callStatus}
                onStartAudioCall={handleStartAudioCall}
                onStartVideoCall={handleStartVideoCall}
                onEndCall={webrtc.endCall}
                onToggleMute={webrtc.toggleMute}
                onToggleVideo={webrtc.toggleVideo}
              />
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto chat-scroll p-4">
              {webrtc.isCallActive && (
                <div className="mb-4 grid grid-cols-2 gap-4">
                  <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                    <video
                      ref={webrtc.remoteVideoRef}
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-2 left-2 text-xs bg-black/50 text-white px-2 py-1 rounded">
                      {getConversationName(selectedConversation)}
                    </span>
                  </div>
                  <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                    <video
                      ref={webrtc.localVideoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-2 left-2 text-xs bg-black/50 text-white px-2 py-1 rounded">
                      You
                    </span>
                  </div>
                </div>
              )}

              {messages.map((msg, idx) => {
                const sender = otherUsers.find((u) => u.id === msg.senderId) || user;
                const showAvatar =
                  selectedConversation.type === 'group' &&
                  (idx === messages.length - 1 || messages[idx + 1].senderId !== msg.senderId);

                return (
                  <MessageBubble
                    key={msg.id}
                    content={msg.content}
                    isOwn={msg.senderId === user?.id}
                    senderName={sender?.displayName}
                    senderAvatar={sender?.avatarUrl}
                    timestamp={msg.createdAt}
                    status={msg.status}
                    type={msg.type}
                    mediaUrl={msg.mediaUrl}
                    showAvatar={showAvatar}
                  />
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Composer */}
            <Composer onSend={handleSendMessage} />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <h3 className="text-2xl font-semibold mb-2">Welcome to ChitChat</h3>
              <p>Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;