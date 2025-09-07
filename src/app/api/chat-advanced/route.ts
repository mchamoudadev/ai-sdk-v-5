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
    stopWhen: stepCountIs(10),
    tools: {
      getCurrentTime: tool({
        description: 'Get the current time and date',
        inputSchema: z.object({}),
        execute: async () => ({
          time: new Date().toLocaleString(),
          timestamp: Date.now(),
        }),
      }),
      calculate: tool({
        description: 'Perform mathematical calculations',
        inputSchema: z.object({
          expression: z.string().describe('Mathematical expression to evaluate (e.g., "2 + 2", "10 * 5")'),
        }),
        execute: async ({ expression }) => {
          try {
            // Simple safe evaluation (in production, use a proper math parser)
            const result = Function(`"use strict"; return (${expression})`)();
            return {
              expression,
              result,
            };
          } catch (error) {
            return {
              expression,
              error: 'Invalid mathematical expression',
            };
          }
        },
      }),
      weather: tool({
        description: 'Get the weather in a location (fahrenheit)',
        inputSchema: z.object({
          location: z.string().describe('The location to get the weather for'),
        }),
        execute: async ({ location }) => {
          const temperature = Math.round(Math.random() * (90 - 32) + 32);
          const conditions = ['sunny', 'cloudy', 'rainy', 'snowy'][Math.floor(Math.random() * 4)];
          return {
            location,
            temperature,
            conditions,
            humidity: Math.round(Math.random() * 100),
          };
        },
      }),
      convertTemperature: tool({
        description: 'Convert temperature between fahrenheit and celsius',
        inputSchema: z.object({
          temperature: z.number().describe('The temperature to convert'),
          from: z.enum(['fahrenheit', 'celsius']).describe('The unit to convert from'),
          to: z.enum(['fahrenheit', 'celsius']).describe('The unit to convert to'),
        }),
        execute: async ({ temperature, from, to }) => {
          let result: number;
          
          if (from === to) {
            result = temperature;
          } else if (from === 'fahrenheit' && to === 'celsius') {
            result = Math.round((temperature - 32) * (5 / 9) * 100) / 100;
          } else {
            result = Math.round((temperature * (9 / 5) + 32) * 100) / 100;
          }
          
          return {
            original: { temperature, unit: from },
            converted: { temperature: result, unit: to },
          };
        },
      }),
    },
  });

  return result.toUIMessageStreamResponse();
}

