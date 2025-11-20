'use client';
import React from 'react'
import { UserContext } from '@/app/types';
import { useState } from 'react';

type Props = {
    context: UserContext;
}

export default function ChatCard({ context, onClose }: Props & { onClose: () => void }) {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleChatSubmit() {
    if (!message.trim()) return;

    setIsLoading(true);
    setResponse(''); // Clear previous response

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ context, message }),
      });

      if (!res.ok) {
        throw new Error('Failed to get response');
      }

      // Read the stream
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No reader available');
      }

      let accumulatedResponse = '';

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        // Decode the chunk and append to response
        const chunk = decoder.decode(value, { stream: true });
        accumulatedResponse += chunk;
        setResponse(accumulatedResponse);
      }

      setMessage(''); // Clear input after successful submission
    } catch (error) {
      console.error('Error streaming response:', error);
      setResponse('Error: Failed to get response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading) {
      handleChatSubmit();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-[350px] h-[500px] bg-gray-400 rounded-xl shadow-xl border flex flex-col p-4 z-50">
      <div className='flex items-center justify-between mb-2'>
        <h3 className="font-semibold">💬 AI Assistant</h3>
        <button onClick={onClose}>
          ❌
        </button>
      </div>
      <div className="flex-1 overflow-auto text-sm text-gray-700 mb-2 whitespace-pre-wrap">
        {response || (isLoading && 'Thinking...')}
      </div>
      <input
        type="text"
        placeholder="Type your question..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        disabled={isLoading}
        className="px-2 py-1 border rounded w-full text-sm mb-2 disabled:bg-gray-200 disabled:cursor-not-allowed"
      />
      <button
        onClick={handleChatSubmit}
        disabled={isLoading || !message.trim()}
        className="bg-blue-600 text-white rounded px-3 py-1 text-sm z-60 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Sending...' : 'Send'}
      </button>
    </div>
  );
}