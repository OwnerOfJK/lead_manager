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

  async function handleChatSubmit() {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ context, message }),
    });

    const data = await res.json();
    setMessage('');
    setResponse(data.reply);
  }

  return (
    <div className="fixed bottom-4 right-4 w-[350px] h-[500px] bg-gray-400 rounded-xl shadow-xl border flex flex-col p-4 z-50">
      <div className='flex items-center justify-between mb-2'>
        <h3 className="font-semibold">💬 AI Assistant</h3>
        <button onClick={(onClose)}>
          ❌
        </button>
      </div>
      <div className="flex-1 overflow-auto text-sm text-gray-700 mb-2 whitespace-pre-wrap">
        {response}
      </div>
      <input
        type="text"
        placeholder="Type your question..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="px-2 py-1 border rounded w-full text-sm mb-2"
      />
      <button onClick={handleChatSubmit} className="bg-blue-600 text-white rounded px-3 py-1 text-sm z-60">
        Send
      </button>
    </div>
  );
}