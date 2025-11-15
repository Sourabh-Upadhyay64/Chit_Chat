import React from 'react';
import { Avatar } from './Avatar';
import { formatDistanceToNow } from 'date-fns';

interface ChatListItemProps {
  id: string;
  name: string;
  avatarUrl?: string;
  lastMessage: string;
  lastMessageAt: number;
  unreadCount: number;
  isOnline?: boolean;
  isActive?: boolean;
  onClick: () => void;
}

export const ChatListItem: React.FC<ChatListItemProps> = ({
  name,
  avatarUrl,
  lastMessage,
  lastMessageAt,
  unreadCount,
  isOnline,
  isActive,
  onClick,
}) => {
  return (
    <div
      className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-secondary transition-colors border-b border-border ${
        isActive ? 'bg-secondary' : ''
      }`}
      onClick={onClick}
    >
      <Avatar src={avatarUrl} alt={name} isOnline={isOnline} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-medium text-foreground truncate">{name}</h3>
          <span className="text-xs text-muted-foreground ml-2">
            {formatDistanceToNow(lastMessageAt, { addSuffix: false })}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground truncate">{lastMessage}</p>
          {unreadCount > 0 && (
            <span className="ml-2 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[hsl(var(--unread))] px-1.5 text-xs font-medium text-white">
              {unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};