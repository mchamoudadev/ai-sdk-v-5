'use client';

import { useChat } from '@ai-sdk/react';
import { useState } from 'react';

export default function ChatAdvanced() {
  const [input, setInput] = useState('');
  const { messages, sendMessage } = useChat({
    api: '/api/chat-advanced',
  });

  const renderToolCall = (part: any, i: number) => {
    switch (part.type) {
      case 'tool-getCurrentTime':
        return (
          <div key={i} className="mt-2 p-2 bg-rose-50 border border-rose-200 rounded">
            <div className="text-sm font-semibold text-rose-800">🕐 Time Tool:</div>
            <pre className="text-xs text-rose-700 mt-1">
              {JSON.stringify(part, null, 2)}
            </pre>
          </div>
        );
      case 'tool-calculate':
        return (
          <div key={i} className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
            <div className="text-sm font-semibold text-green-800">🧮 Calculator:</div>
            <pre className="text-xs text-green-700 mt-1">
              {JSON.stringify(part, null, 2)}
            </pre>
          </div>
        );
      case 'tool-weather':
        return (
          <div key={i} className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
            <div className="text-sm font-semibold text-yellow-800">🌤️ Weather:</div>
            <pre className="text-xs text-yellow-700 mt-1">
              {JSON.stringify(part, null, 2)}
            </pre>
          </div>
        );
      case 'tool-convertTemperature':
        return (
          <div key={i} className="mt-2 p-2 bg-purple-50 border border-purple-200 rounded">
            <div className="text-sm font-semibold text-purple-800">🌡️ Temperature Conversion:</div>
            <pre className="text-xs text-purple-700 mt-1">
              {JSON.stringify(part, null, 2)}
            </pre>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="text-center py-6 border-b">
        <h1 className="text-3xl font-bold mb-2">Advanced AI Chat</h1>
        <p className="text-gray-600">Multiple tools working together!</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map(message => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-md px-4 py-3 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-rose-500 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                {message.parts.map((part, i) => {
                  switch (part.type) {
                    case 'text':
                      return <div key={i} className="whitespace-pre-wrap">{part.text}</div>;
                    default:
                      return renderToolCall(part, i);
                  }
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fixed Input at Bottom */}
      <div className="border-t bg-white p-4">
        <form
          onSubmit={e => {
            e.preventDefault();
            sendMessage({ text: input });
            setInput('');
          }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex space-x-2">
            <input
              className="flex-1 p-3 border rounded-lg"
              value={input}
              placeholder="Try: What time is it and what's 15 * 23?"
              onChange={e => setInput(e.target.value)}
            />
            <button
              type="submit"
              className="px-4 py-3 bg-rose-500 text-white rounded-lg hover:bg-rose-600"
            >
              Send
            </button>
          </div>
        </form>
      </div>

      {/* Example prompts */}
      <div className="border-t bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Try these advanced prompts:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {[
              "What time is it and what's 15 * 23?",
              "What's the weather in Tokyo and convert 75°F to Celsius?",
              "Calculate 2^8 and tell me the current time",
              "Get weather for London, then convert 20°C to Fahrenheit"
            ].map((prompt) => (
              <button
                key={prompt}
                onClick={() => setInput(prompt)}
                className="px-3 py-2 text-xs bg-white border border-gray-300 rounded hover:bg-gray-100 text-left"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}



