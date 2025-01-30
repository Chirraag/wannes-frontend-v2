import React from 'react';

interface WelcomeMessageProps {
  message: string;
  onChange: (message: string) => void;
}

export function WelcomeMessage({ message, onChange }: WelcomeMessageProps) {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium mb-2">Welcome message</label>
      <div className="mb-2">
        <select className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white">
          <option>Streaky begins with a fixed intro</option>
        </select>
      </div>
      <textarea
        value={message}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-200 rounded-lg h-24 focus:ring-2 focus:ring-blue-500"
        placeholder="Enter welcome message"
      />
    </div>
  );
}