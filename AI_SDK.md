# AI SDK v5 Complete Lesson

*Based on the official [Next.js App Router Quickstart](https://ai-sdk.dev/docs/getting-started/nextjs-app-router)*

## Table of Contents
1. [Introduction](#introduction)
2. [Prerequisites](#prerequisites)
3. [Create Your Application](#create-your-application)
4. [Basic Text Generation](#basic-text-generation)
5. [The Problem with Basic Generation](#the-problem-with-basic-generation)
6. [Solution: Streaming Responses](#solution-streaming-responses)
7. [Wire up the UI](#wire-up-the-ui)
8. [Enhance with Tools](#enhance-with-tools)
9. [Multi-Step Tool Calls](#multi-step-tool-calls)
10. [Advanced Features](#advanced-features)
11. [Best Practices](#best-practices)
12. [Where to Next](#where-to-next)

## Introduction

The AI SDK v5 is a powerful TypeScript library designed to help developers build AI-powered applications. This lesson will guide you through building a simple AI chatbot with a streaming user interface, teaching you key concepts fundamental to using the SDK.

Key features of AI SDK v5:
- **Unified API** across multiple providers (OpenAI, Anthropic, Google, etc.)
- **Streaming responses** for real-time user experiences
- **Tool calling** for extending LLM capabilities
- **React hooks** for easy UI integration
- **Type safety** throughout your application

### What's New in v5

- Enhanced tool calling with better type safety
- New `UIMessage` and `ModelMessage` types for better separation
- Improved streaming with `toUIMessageStreamResponse()`
- Support for latest models (GPT-5, Claude 4, DeepSeek R1)
- Enhanced multi-step tool calling with `stopWhen`

## Prerequisites

To follow this lesson, you'll need:
- Node.js 18+ and pnpm installed on your local development machine
- An OpenAI API key

If you haven't obtained your OpenAI API key, you can do so by [signing up on the OpenAI website](https://platform.openai.com/api-keys).

## Create Your Application

### 1. Create a New Next.js Project

Start by creating a new Next.js application:

```bash
pnpm create next-app@latest my-ai-app
```

Be sure to select **yes** when prompted to use the App Router and Tailwind CSS.

Navigate to the newly created directory:

```bash
cd my-ai-app
```

### 2. Install Dependencies

Install the AI SDK packages:

```bash
pnpm add ai @ai-sdk/react @ai-sdk/openai zod
```

The AI SDK is designed to be a unified interface to interact with any large language model. This means you can change model and providers with just one line of code!

### 3. Configure OpenAI API Key

Create a `.env.local` file in your project root:

```bash
touch .env.local
```

Add your OpenAI API Key:

```env
OPENAI_API_KEY=xxxxxxxxx
```

Replace `xxxxxxxxx` with your actual OpenAI API key. The AI SDK's OpenAI Provider will default to using the `OPENAI_API_KEY` environment variable.

## Basic Text Generation

Before we build a full chat interface, let's start with the simplest possible AI integration: basic text generation. This will help you understand the core concepts before we add complexity.

### Simple Text Generation Example

Create a basic API route at `app/api/generate/route.ts`:

```typescript
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const { text } = await generateText({
    model: openai('gpt-4o'),
    prompt,
  });

  return Response.json({ text });
}
```

And create a simple page to test it at `app/basic/page.tsx`:

```tsx
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
      
     
    </div>
  );
}
```

### Understanding Basic Generation

This example demonstrates:

1. **Simple API call**: Using `generateText()` for one-time text generation
2. **Synchronous response**: The entire response is generated before being returned
3. **Basic error handling**: Simple try-catch for API errors

Try this example with prompts like:
- "Explain artificial intelligence in 3 sentences"
- "Write a haiku about programming"
- "List 5 benefits of renewable energy"

## The Problem with Basic Generation

While the basic text generation works, you'll notice some issues:

### 1. **Waiting Time**
- Users see a loading state with no feedback
- Longer responses feel slow and unresponsive
- No indication of progress

### 2. **Poor User Experience**
- The interface "freezes" during generation
- Users might think the application is broken
- No way to see partial responses

### 3. **Memory Limitations**
- Each request is independent
- No conversation history
- Can't build upon previous responses

### 4. **Scalability Issues**
- Server holds connections open for entire generation
- Higher memory usage
- Potential timeouts for long responses

**Example of the problem**: Try asking for a long story or detailed explanation in the basic example above. You'll notice the poor user experience of waiting without feedback.

## Solution: Streaming Responses

Streaming solves these problems by sending the response in real-time chunks as the AI generates it. This creates a much better user experience similar to ChatGPT, where you see the response appear word by word.

### Benefits of Streaming

1. **Immediate Feedback**: Users see responses as they're generated
2. **Better UX**: Natural conversation flow
3. **Perceived Performance**: Feels faster even if generation time is the same
4. **Memory Efficiency**: Server can process and send chunks without holding full response
5. **Conversation Context**: Can maintain chat history

Now let's implement streaming with a full chat interface.

### Create a Streaming Route Handler

Create a route handler at `app/api/chat/route.ts` and add the following code:

```typescript
import { openai } from '@ai-sdk/openai';
import { streamText, UIMessage, convertToModelMessages } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: openai('gpt-4o'),
    messages: convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
```

### Understanding the Key Concepts

Let's break down what's happening and why these new types matter:

#### **1. UIMessage vs ModelMessage**

**UIMessage** (Frontend):
```typescript
// What your React components work with
{
  id: 'msg-123',
  role: 'user',
  content: 'Hello!',
  createdAt: Date,
  // UI-specific metadata
}
```

**ModelMessage** (Backend):
```typescript
// What AI models expect
{
  role: 'user', 
  content: 'Hello!'
  // No UI metadata - clean for AI processing
}
```

**Why the separation?**
- **UI needs**: timestamps, IDs, display formatting
- **AI models need**: clean conversation without UI clutter
- **Type safety**: Prevents accidentally sending UI data to AI models

#### **2. convertToModelMessages()**

This function transforms UI messages to model messages:

```typescript
// Frontend sends UIMessage[]
const uiMessages = [
  { id: '1', role: 'user', content: 'Hi', createdAt: new Date() }
];

// Backend converts to ModelMessage[] 
const modelMessages = convertToModelMessages(uiMessages);
// Result: [{ role: 'user', content: 'Hi' }]
```

#### **3. toUIMessageStreamResponse()**

This creates a streaming response that React can understand:

```typescript
// Old way (basic generation)
return Response.json({ text: "Complete response" });

// New way (streaming)
return result.toUIMessageStreamResponse();
// Streams: { type: 'text', text: 'Hello' }, { type: 'text', text: ' there' }...
```

This Route Handler creates a POST request endpoint at `/api/chat` that properly handles the conversation flow.

#### **4. Key Differences from Basic Generation**

| Aspect         | Basic Generation           | Streaming Chat                       |
| -------------- | -------------------------- | ------------------------------------ |
| **Function**   | `generateText()`           | `streamText()`                       |
| **Input**      | `string` prompt            | `UIMessage[]` array                  |
| **Conversion** | Not needed                 | `convertToModelMessages()`           |
| **Response**   | `Response.json({ text })`  | `result.toUIMessageStreamResponse()` |
| **Experience** | Wait for complete response | Real-time streaming                  |
| **Memory**     | No conversation history    | Full chat context                    |

#### **5. Why These Changes Matter**

**Better Architecture**:
- Clean separation between UI and AI concerns
- Type safety prevents bugs
- Scalable conversation management

**Better User Experience**:
- Immediate response feedback
- Natural conversation flow
- Context-aware responses

**Better Developer Experience**:
- Clear type definitions
- Intuitive API design
- Easy debugging with proper types

Now let's see how the frontend connects to this streaming backend.

## Wire up the UI

Now that you have a Route Handler that can query an LLM, it's time to setup your frontend. The AI SDK's UI package abstracts the complexity of a chat interface into one hook: `useChat`.

Update your root page (`app/page.tsx`) with the following code:

```tsx
'use client';

import { useChat } from '@ai-sdk/react';
import { useState } from 'react';

export default function Chat() {
  const [input, setInput] = useState('');
  const { messages, sendMessage } = useChat();

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="text-center py-6 border-b">
        <h1 className="text-3xl font-bold mb-2">AI SDK v5 Chat</h1>
        <p className="text-gray-600">Streaming chat example</p>
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
              placeholder="Say something..."
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
    </div>
  );
}
```

**Important**: Make sure you add the `"use client"` directive to the top of your file for client-side interactivity.

### Understanding the useChat Hook

The `useChat` hook provides multiple utility functions and state variables:

- **`messages`** - Current chat messages (array of objects with `id`, `role`, and `parts` properties)
- **`sendMessage`** - Function to send a message to the chat API

### Message Parts Structure

The LLM's response is accessed through the message `parts` array. Each message contains an ordered array of `parts` representing everything the model generated. These parts can include:
- Plain text
- Tool calls
- Reasoning tokens
- And more

The `parts` array preserves the sequence of the model's outputs, allowing you to display each component in the order it was generated.

### How It All Connects

Here's the complete flow from UI to AI and back:

```
1. User types message → UIMessage created with metadata
2. useChat sends UIMessage[] to /api/chat
3. Backend converts UIMessage[] → ModelMessage[] 
4. streamText processes ModelMessage[] with AI model
5. AI generates response chunks
6. toUIMessageStreamResponse() streams back to frontend
7. useChat receives stream and updates messages state
8. React renders new message parts in real-time
```

### Message Parts in Detail

When the AI responds, you get different types of parts:

```typescript
// Text part
{ type: 'text', text: 'Hello there!' }

// Tool call part (comes later in lesson)
{ type: 'tool-weather', toolCallId: '123', toolName: 'weather', args: {...}, result: {...} }
```

The UI handles each part type differently, allowing for rich interactions beyond just text.

## Running Your Application

With that, you have built everything you need for your chatbot! Start your application:

```bash
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. You should see an input field. Test it by entering a message and watch the AI respond in real-time!

## Enhance Your Chatbot with Tools

While large language models (LLMs) have incredible generation capabilities, they struggle with discrete tasks (e.g. mathematics) and interacting with the outside world (e.g. getting the weather). This is where **tools** come in.

Tools are actions that an LLM can call during generation. You can think of tools as functions that the model can invoke when it needs to perform specific tasks or gather information.

### Update Your Route Handler

Modify your `app/api/chat/route.ts` file to include a weather tool:

```typescript
import { openai } from '@ai-sdk/openai';
import { streamText, UIMessage, convertToModelMessages, tool } from 'ai';
import { z } from 'zod';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: openai('gpt-4o'),
    messages: convertToModelMessages(messages),
    tools: {
      weather: tool({
        description: 'Get the weather in a location (fahrenheit)',
        inputSchema: z.object({
          location: z.string().describe('The location to get the weather for'),
        }),
        execute: async ({ location }) => {
          const temperature = Math.round(Math.random() * (90 - 32) + 32);
          return {
            location,
            temperature,
          };
        },
      }),
    },
  });

  return result.toUIMessageStreamResponse();
}
```

In this updated code:

1. **Import tool dependencies**: Added `tool` from the `ai` package and `z` from `zod`
2. **Define weather tool**: Created a tool with description, input schema, and execution function
3. **Mock weather data**: The execute function returns mock weather data (in a real app, you'd call a weather API)

### Update the UI

To see tool calls in your chat interface, update your `app/page.tsx` file:

```tsx
'use client';

import { useChat } from '@ai-sdk/react';
import { useState } from 'react';

export default function Chat() {
  const [input, setInput] = useState('');
  const { messages, sendMessage } = useChat();

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {messages.map(message => (
        <div key={message.id} className="whitespace-pre-wrap">
          {message.role === 'user' ? 'User: ' : 'AI: '}
          {message.parts.map((part, i) => {
            switch (part.type) {
              case 'text':
                return <div key={`${message.id}-${i}`}>{part.text}</div>;
              case 'tool-weather':
                return (
                  <pre key={`${message.id}-${i}`}>
                    {JSON.stringify(part, null, 2)}
                  </pre>
                );
            }
          })}
        </div>
      ))}

      <form
        onSubmit={e => {
          e.preventDefault();
          sendMessage({ text: input });
          setInput('');
        }}
      >
        <input
          className="fixed dark:bg-zinc-900 bottom-0 w-full max-w-md p-2 mb-8 border border-zinc-300 dark:border-zinc-800 rounded shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={e => setInput(e.currentTarget.value)}
        />
      </form>
    </div>
  );
}
```

The key change is adding a case for `'tool-weather'` in the switch statement to display weather tool calls and results.

## Multi-Step Tool Calls

You may have noticed that while the tool is now visible in the chat interface, the model isn't using this information to answer your original query. This is because once the model generates a tool call, it has technically completed its generation.

To solve this, you can enable multi-step tool calls using `stopWhen`. By default, `stopWhen` is set to `stepCountIs(1)`, which means generation stops after the first step when there are tool results. By changing this condition, you can allow the model to automatically send tool results back to itself to trigger additional generations.

### Update Your Route Handler

Modify your `app/api/chat/route.ts` file to include the `stopWhen` condition:

```typescript
import { openai } from '@ai-sdk/openai';
import {
  streamText,
  UIMessage,
  convertToModelMessages,
  tool,
  stepCountIs,
} from 'ai';
import { z } from 'zod';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: openai('gpt-4o'),
    messages: convertToModelMessages(messages),
    stopWhen: stepCountIs(5),
    tools: {
      weather: tool({
        description: 'Get the weather in a location (fahrenheit)',
        inputSchema: z.object({
          location: z.string().describe('The location to get the weather for'),
        }),
        execute: async ({ location }) => {
          const temperature = Math.round(Math.random() * (90 - 32) + 32);
          return {
            location,
            temperature,
          };
        },
      }),
    },
  });

  return result.toUIMessageStreamResponse();
}
```

### Add Another Tool

Let's add a temperature conversion tool to demonstrate multi-step interactions:

```typescript
import { openai } from '@ai-sdk/openai';
import {
  streamText,
  UIMessage,
  convertToModelMessages,
  tool,
  stepCountIs,
} from 'ai';
import { z } from 'zod';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: openai('gpt-4o'),
    messages: convertToModelMessages(messages),
    stopWhen: stepCountIs(5),
    tools: {
      weather: tool({
        description: 'Get the weather in a location (fahrenheit)',
        inputSchema: z.object({
          location: z.string().describe('The location to get the weather for'),
        }),
        execute: async ({ location }) => {
          const temperature = Math.round(Math.random() * (90 - 32) + 32);
          return {
            location,
            temperature,
          };
        },
      }),
      convertFahrenheitToCelsius: tool({
        description: 'Convert a temperature in fahrenheit to celsius',
        inputSchema: z.object({
          temperature: z
            .number()
            .describe('The temperature in fahrenheit to convert'),
        }),
        execute: async ({ temperature }) => {
          const celsius = Math.round((temperature - 32) * (5 / 9));
          return {
            celsius,
          };
        },
      }),
    },
  });

  return result.toUIMessageStreamResponse();
}
```

### Update Your Frontend

Update your `app/page.tsx` file to handle the new temperature conversion tool:

```tsx
'use client';

import { useChat } from '@ai-sdk/react';
import { useState } from 'react';

export default function Chat() {
  const [input, setInput] = useState('');
  const { messages, sendMessage } = useChat();

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {messages.map(message => (
        <div key={message.id} className="whitespace-pre-wrap">
          {message.role === 'user' ? 'User: ' : 'AI: '}
          {message.parts.map((part, i) => {
            switch (part.type) {
              case 'text':
                return <div key={`${message.id}-${i}`}>{part.text}</div>;
              case 'tool-weather':
              case 'tool-convertFahrenheitToCelsius':
                return (
                  <pre key={`${message.id}-${i}`}>
                    {JSON.stringify(part, null, 2)}
                  </pre>
                );
            }
          })}
        </div>
      ))}

      <form
        onSubmit={e => {
          e.preventDefault();
          sendMessage({ text: input });
          setInput('');
        }}
      >
        <input
          className="fixed dark:bg-zinc-900 bottom-0 w-full max-w-md p-2 mb-8 border border-zinc-300 dark:border-zinc-800 rounded shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={e => setInput(e.currentTarget.value)}
        />
      </form>
    </div>
  );
}
```

Now when you ask "What's the weather in New York in celsius?", you'll see a complete multi-step interaction:

1. The model calls the weather tool for New York
2. It then calls the temperature conversion tool 
3. Finally, it provides a natural language response using both tool results

By setting `stopWhen: stepCountIs(5)`, you're allowing the model to use up to 5 "steps" for any given generation, enabling complex interactions where the model can gather and process information over several steps.

### Additional Tool Examples

```typescript
import { generateText, tool } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

const result = await generateText({
  model: openai('gpt-4'),
  prompt: 'What time is it and what\'s the weather in New York?',
  tools: {
    getCurrentTime: tool({
      description: 'Get the current time',
      inputSchema: z.object({}),
      execute: async () => ({
        time: new Date().toLocaleString(),
      }),
    }),
    getWeather: tool({
      description: 'Get weather information',
      inputSchema: z.object({
        location: z.string(),
      }),
      execute: async ({ location }) => ({
        location,
        temperature: 68,
        condition: 'partly cloudy',
      }),
    }),
    searchWeb: tool({
      description: 'Search the web for information',
      inputSchema: z.object({
        query: z.string(),
      }),
      execute: async ({ query }) => ({
        results: [`Mock result for: ${query}`],
      }),
    }),
  },
});
```



### Advanced Chat with Tool Results

```tsx
'use client';

import { useChat } from '@ai-sdk/react';
import { useState } from 'react';

export default function Chat() {
  const [input, setInput] = useState('');
  const { messages, sendMessage } = useChat();

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="text-center py-6 border-b">
        <h1 className="text-3xl font-bold mb-2">AI SDK v5 Chat</h1>
        <p className="text-gray-600">Streaming chat with tools</p>
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
                      return <div key={`${message.id}-${i}`} className="whitespace-pre-wrap">{part.text}</div>;
                    
                    case 'step-start':
                      return null; // Don't render step markers in UI
                    
                    case 'tool-weather':
                      return (
                        <div key={`${message.id}-${i}`} className="mt-2 p-2 bg-white border border-rose-200 rounded text-sm">
                          <div className="font-semibold text-rose-700">🌤️ Weather Info</div>
                          <div className="mt-1 text-gray-700">
                            <strong>Location:</strong> {part.output.location}<br/>
                            <strong>Temperature:</strong> {part.output.temperature}°F
                          </div>
                        </div>
                      );
                    
                    case 'tool-convertFahrenheitToCelsius':
                      return (
                        <div key={`${message.id}-${i}`} className="mt-2 p-2 bg-white border border-rose-200 rounded text-sm">
                          <div className="font-semibold text-rose-700">🌡️ Temperature Conversion</div>
                          <div className="mt-1 text-gray-700">
                            <strong>Celsius:</strong> {part.output.celsius}°C
                          </div>
                        </div>
                      );
                    
                    default:
                      return null;
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
              placeholder="Ask about weather in any city..."
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
    </div>
  );
}
```

## Advanced Features

### Working with GPT-5 Reasoning

```typescript
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

const result = await generateText({
  model: openai('gpt-5'),
  prompt: 'Solve this logic puzzle: If all roses are flowers and some flowers fade quickly, do all roses fade quickly?',
  providerOptions: {
    openai: {
      reasoning_effort: 'high',
      reasoningSummary: 'detailed',
    },
  },
});

console.log('Answer:', result.text);
console.log('Reasoning:', result.reasoning);
```

### Reasoning with useChat

```typescript
// app/api/reasoning-chat/route.ts
import { openai } from '@ai-sdk/openai';
import { streamText, UIMessage, convertToModelMessages } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: openai('gpt-4o'),
    messages: convertToModelMessages(messages),
    providerOptions: {
      openai: {
        reasoning_effort: 'high',
        reasoningSummary: 'detailed',
      },
    },
  });

  return result.toUIMessageStreamResponse();
}
```

```tsx
// app/reasoning/page.tsx
'use client';

import { useChat } from '@ai-sdk/react';
import { useState } from 'react';

export default function ReasoningChat() {
  const [input, setInput] = useState('');
  const { messages, sendMessage } = useChat({
    api: '/api/reasoning-chat'
  });

  return (
    <div className="flex flex-col h-screen">
      <div className="text-center py-6 border-b">
        <h1 className="text-3xl font-bold mb-2">AI Reasoning Chat</h1>
        <p className="text-gray-600">Ask complex questions and see the reasoning</p>
      </div>

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
                      return <div key={`${message.id}-${i}`} className="whitespace-pre-wrap">{part.text}</div>;
                    default:
                      return null;
                  }
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

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
              placeholder="Ask a complex question or logic puzzle..."
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
    </div>
  );
}
```

### Using Claude 4 with Thinking

```typescript
import { anthropic } from '@ai-sdk/anthropic';
import { generateText } from 'ai';

const { text, reasoning } = await generateText({
  model: anthropic('claude-4'),
  prompt: 'How many people will live in the world in 2040?',
});

console.log('Answer:', text);
console.log('Reasoning:', reasoning);
```

## Best Practices

### 1. Error Handling

```typescript
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

try {
  const { text } = await generateText({
    model: openai('gpt-4'),
    prompt: 'Your prompt here',
    maxRetries: 3,
  });
  
  console.log(text);
} catch (error) {
  if (error.name === 'AI_APICallError') {
    console.error('API call failed:', error.message);
  } else if (error.name === 'AI_InvalidDataError') {
    console.error('Invalid data:', error.message);
  } else {
    console.error('Unexpected error:', error);
  }
}
```


## Common Patterns

### 1. API Route Template

```typescript
import { [provider] } from '@ai-sdk/[provider]';
import { streamText } from 'ai';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: [provider]('[model-name]'),
    messages,
    // Add tools, settings, etc.
  });

  return result.toDataStreamResponse();
}
```

### 2. React Component Template

```tsx
'use client';

import { useChat } from '@ai-sdk/react';

export default function MyComponent() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat();

  return (
    <div>
      {/* Messages display */}
      {/* Input form */}
    </div>
  );
}
```

## Where to Next?

You've built an AI chatbot using the AI SDK v5! From here, you have several paths to explore:

### Learn More
- **Documentation**: Read through the [complete AI SDK documentation](https://ai-sdk.dev/docs) to understand all capabilities
- **Advanced Guides**: Check out guides on [RAG (Retrieval-Augmented Generation)](https://ai-sdk.dev/docs/guides) and multi-modal chatbots
- **Examples**: Explore [practical examples](https://ai-sdk.dev/examples) to see the SDK in action

### Deploy Your App
- **Vercel Templates**: Use ready-to-deploy [AI templates](https://vercel.com/templates?type=ai)
- **Production Setup**: Learn about deployment best practices and scaling

### Extend Your Knowledge
- **Multiple Providers**: Try different AI providers (Anthropic, Google, etc.)
- **Advanced Features**: Explore structured output, embeddings, and image generation
- **Real-world Integration**: Connect to actual APIs instead of mock data

## Key Takeaways

This lesson demonstrated the core concepts of AI SDK v5:

1. **Unified Interface**: One API works with multiple AI providers
2. **Streaming by Default**: Real-time responses enhance user experience  
3. **Tool Integration**: Extend LLM capabilities with custom functions
4. **Type Safety**: Full TypeScript support throughout
5. **Multi-Step Interactions**: Complex workflows with `stopWhen`

### Important Patterns to Remember

- Use `UIMessage` for frontend, `ModelMessage` for backend
- Always use `convertToModelMessages()` when sending to models
- Return `toUIMessageStreamResponse()` for streaming to React
- Handle different message `parts` types in your UI
- Set appropriate `stopWhen` conditions for tool calling

## Additional Resources

- [Official AI SDK Documentation](https://ai-sdk.dev/docs)
- [Next.js App Router Guide](https://ai-sdk.dev/docs/getting-started/nextjs-app-router)
- [AI SDK Examples Repository](https://github.com/vercel/ai/tree/main/examples)
- [AI SDK Cookbook](https://ai-sdk.dev/examples)
- [Vercel AI Templates](https://vercel.com/templates?type=ai)

---

*This lesson is based on the official [Next.js App Router Quickstart](https://ai-sdk.dev/docs/getting-started/nextjs-app-router). For the most up-to-date information, always refer to the official documentation.*
