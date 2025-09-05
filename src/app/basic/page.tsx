'use client';

import { useState } from 'react';

export default function BasicExample() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const generateText = async () => {
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      
      const data = await res.json();
      setResponse(data.text);
    } catch (error) {
      console.error('Error:', error);
      setResponse('Error generating response');
    }
    setIsLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-2">Basic Text Generation</h1>
      <p className="text-gray-600 mb-8">
        Notice how you wait for the complete response
      </p>
      
      <div className="bg-white border rounded-lg p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Enter your prompt:
          </label>
          <textarea
            className="w-full p-3 border rounded-lg"
            rows={4}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., Explain quantum computing in simple terms..."
          />
        </div>
        
        <button
          onClick={generateText}
          disabled={isLoading || !prompt.trim()}
          className="w-full px-4 py-3 bg-rose-500 text-white rounded-lg hover:bg-rose-600 disabled:opacity-50"
        >
          {isLoading ? 'Generating...' : 'Generate Text'}
        </button>
        
        {response && (
          <div className="mt-6">
            <label className="block text-sm font-medium mb-2">
              AI Response:
            </label>
            <div className="p-4 bg-gray-50 border rounded-lg whitespace-pre-wrap">
              {response}
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="font-semibold text-yellow-800 mb-2">Try these prompts:</h3>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• "Explain artificial intelligence in 3 sentences"</li>
          <li>• "Write a haiku about programming"</li>
          <li>• "List 5 benefits of renewable energy"</li>
        </ul>
      </div>
    </div>
  );
}
