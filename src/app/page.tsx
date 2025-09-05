'use client';

import Link from 'next/link';

export default function Home() {
  const examples = [
    {
      title: "Basic Text Generation",
      description: "Simple one-time text generation without streaming. Notice how you wait for the complete response.",
      href: "/basic",
      features: [
        "Synchronous response",
        "Basic error handling", 
        "Simple API call with generateText()"
      ],
      color: "bg-blue-500 hover:bg-blue-600"
    },
    {
      title: "Streaming Chat",
      description: "Real-time streaming chat interface with conversation history and immediate feedback.",
      href: "/chat",
      features: [
        "Real-time streaming responses",
        "Conversation history",
        "useChat hook integration",
        "Better user experience"
      ],
      color: "bg-green-500 hover:bg-green-600"
    },
    {
      title: "Chat with Tools",
      description: "AI chat enhanced with tools. Try asking about the weather to see tool calls in action.",
      href: "/chat-tools",
      features: [
        "Weather tool integration",
        "Tool call visualization",
        "Extended AI capabilities",
        "Real-time tool execution"
      ],
      color: "bg-purple-500 hover:bg-purple-600"
    },
    {
      title: "Multi-Step Tool Calls",
      description: "Advanced example showing how AI can use multiple tools in sequence to solve complex tasks.",
      href: "/chat-multi-step",
      features: [
        "Multi-step tool execution",
        "Temperature conversion tool",
        "Complex reasoning chains",
        "Up to 5 tool steps"
      ],
      color: "bg-orange-500 hover:bg-orange-600"
    },
    {
      title: "Advanced Features",
      description: "Comprehensive example with multiple tools: time, calculator, weather, and temperature conversion.",
      href: "/chat-advanced",
      features: [
        "Multiple tool types",
        "Time and date handling",
        "Mathematical calculations",
        "Up to 10 tool steps"
      ],
      color: "bg-indigo-500 hover:bg-indigo-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI SDK v5 Examples
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Comprehensive examples demonstrating the power of AI SDK v5. 
            From basic text generation to advanced multi-step tool calls.
          </p>
        </div>
      </div>

      {/* Examples Grid */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          {examples.map((example, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg border overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  {example.title}
                </h2>
                <p className="text-gray-600 mb-4">
                  {example.description}
                </p>
                
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Features:</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {example.features.map((feature, i) => (
                      <li key={i} className="flex items-center">
                        <span className="w-1.5 h-1.5 bg-rose-500 rounded-full mr-2"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href={example.href}
                  className={`inline-block w-full text-center ${example.color} text-white py-3 px-4 rounded-lg font-medium transition-colors`}
                >
                  Try Example
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Learning Path */}
      <div className="bg-white border-t">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Recommended Learning Path
          </h2>
          
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-8">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">1</div>
              <div>
                <h3 className="font-semibold">Basic Generation</h3>
                <p className="text-sm text-gray-600">Start with simple text generation</p>
              </div>
            </div>
            
            <div className="hidden md:block text-gray-400">→</div>
            
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">2</div>
              <div>
                <h3 className="font-semibold">Streaming Chat</h3>
                <p className="text-sm text-gray-600">Experience real-time responses</p>
              </div>
            </div>
            
            <div className="hidden md:block text-gray-400">→</div>
            
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">3</div>
              <div>
                <h3 className="font-semibold">Tools Integration</h3>
                <p className="text-sm text-gray-600">Add external capabilities</p>
              </div>
            </div>
            
            <div className="hidden md:block text-gray-400">→</div>
            
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">4</div>
              <div>
                <h3 className="font-semibold">Multi-Step Tools</h3>
                <p className="text-sm text-gray-600">Complex reasoning chains</p>
              </div>
            </div>
            
            <div className="hidden md:block text-gray-400">→</div>
            
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold">5</div>
              <div>
                <h3 className="font-semibold">Advanced Features</h3>
                <p className="text-sm text-gray-600">Multiple tools working together</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">AI SDK v5 Complete Lesson</h3>
            <p className="text-gray-400">
              Based on the official Next.js App Router Quickstart
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}