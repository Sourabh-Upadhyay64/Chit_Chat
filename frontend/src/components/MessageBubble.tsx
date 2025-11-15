import React from 'react';
import { Check, CheckCheck } from 'lucide-react';
import { format } from 'date-fns';
import { Avatar } from './Avatar';

interface MessageBubbleProps {
  content: string;
  isOwn: boolean;
  senderName?: string;
  senderAvatar?: string;
  timestamp: number;
  status?: 'sent' | 'delivered' | 'read';
  type?: 'text' | 'image' | 'file' | 'audio';
  mediaUrl?: string;
  showAvatar?: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  content,
  isOwn,
  senderName,
  senderAvatar,
  timestamp,
  status = 'sent',
  type = 'text',
  mediaUrl,
  showAvatar = false,
}) => {
  return (
    <div className={`flex gap-2 mb-2 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
      {showAvatar && !isOwn && (
        <Avatar src={senderAvatar} alt={senderName || 'User'} size="sm" />
      )}
      {showAvatar && isOwn && <div className="w-8" />}
      
      <div className={`flex flex-col max-w-[70%] ${isOwn ? 'items-end' : 'items-start'}`}>
        {showAvatar && !isOwn && (
          <span className="text-xs text-muted-foreground mb-1 px-2">{senderName}</span>
        )}
        
        <div
          className={`rounded-lg px-3 py-2 ${
            isOwn
              ? 'bg-[hsl(var(--message-outgoing))] text-foreground'
              : 'bg-[hsl(var(--message-incoming))] text-foreground'
          }`}
        >
          {type === 'image' && mediaUrl && (
            <img src={mediaUrl} alt="Shared" className="rounded max-w-full mb-1" />
          )}
          
          {type === 'text' && <p className="text-sm whitespace-pre-wrap break-words">{content}</p>}
          
          <div className="flex items-center justify-end gap-1 mt-1">
            <span className="text-xs text-muted-foreground">
              {format(timestamp, 'HH:mm')}
            </span>
            
            {isOwn && (
              <span className="text-muted-foreground">
                {status === 'sent' && <Check size={14} />}
                {status === 'delivered' && <CheckCheck size={14} className="text-[hsl(var(--delivered))]" />}
                {status === 'read' && <CheckCheck size={14} className="text-[hsl(var(--read))]" />}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};