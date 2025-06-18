'use client';

import React, { useState } from 'react';
import { UserContext } from '../types';

type Props = {
  context: UserContext[];
};

export default function ContextCard({ context }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [showFullTranscript, setShowFullTranscript] = useState(false);

  if (context.length === 0) return null;

  const latest = context[context.length - 1];
  const { linkedinProfile, transcription } = latest;

  return (
    <div className="mt-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        {isOpen ? '-' : '+'}
      </button>
    {isOpen && (<div className="mt-6 p-4 rounded-xl shadow-md space-y-4 border">
      <h2 className="text-lg font-semibold">🧠 Context Overview</h2>

      {linkedinProfile && (
        <div>
          <p className="font-medium">🔗 LinkedIn Info:</p>
          <ul className="list-disc list-inside text-sm text-gray-400">
            <li>Name: {linkedinProfile.name || "N/A"}</li>
            <li>Headline: {linkedinProfile.headline || "N/A"}</li>
            <li>Location: {linkedinProfile.location || "N/A"}</li>
          </ul>
        </div>
      )}

      {transcription && (
        <div>
          <p className="font-medium">🗣️ Call Summary:</p>
          <p className="text-sm text-gray-400 whitespace-pre-wrap">
            {showFullTranscript
              ? transcription
              : transcription.slice(0, 200) + (transcription.length > 200 ? '...' : '')}
          </p>
          {transcription.length > 200 && (
            <button
              onClick={() => setShowFullTranscript(!showFullTranscript)}
              className="mt-1 text-xs text-blue-600 underline hover:text-blue-800"
            >
              {showFullTranscript ? 'Show Less' : 'Show More'}
            </button>
          )}
        </div>
      )}
    </div>)}
    </div>
  );
}