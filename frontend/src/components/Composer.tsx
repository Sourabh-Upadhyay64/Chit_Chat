import React, { useState, useRef } from 'react';
import { Send, Paperclip, Smile, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface ComposerProps {
  onSend: (content: string, type: 'text' | 'image' | 'file') => void;
  disabled?: boolean;
}

export const Composer: React.FC<ComposerProps> = ({ onSend, disabled }) => {
  const [message, setMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSend(message.trim(), 'text');
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        if (file.type.startsWith('image/')) {
          onSend(dataUrl, 'image');
        } else {
          onSend(file.name, 'file');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="border-t border-border bg-background p-3">
      <div className="flex items-end gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
        >
          <Paperclip size={20} />
        </Button>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,application/pdf"
          className="hidden"
          onChange={handleFileSelect}
        />

        <div className="flex-1">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message"
            className="min-h-[44px] max-h-32 resize-none"
            disabled={disabled}
          />
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10"
          disabled={disabled}
        >
          <Smile size={20} />
        </Button>

        {message.trim() ? (
          <Button
            size="icon"
            className="h-10 w-10 bg-primary hover:bg-primary/90"
            onClick={handleSend}
            disabled={disabled}
          >
            <Send size={20} />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10"
            disabled={disabled}
          >
            <Mic size={20} />
          </Button>
        )}
      </div>
    </div>
  );
};