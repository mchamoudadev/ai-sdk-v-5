# AI SDK v5 Examples - Student Guide

This project contains comprehensive examples demonstrating the power of AI SDK v5. Each example builds upon the previous one, teaching you different concepts and capabilities.

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Set up your OpenAI API key:**
   Create a `.env.local` file in the project root:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ```

3. **Start the development server:**
   ```bash
   pnpm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📚 Learning Path

Follow these examples in order to build your understanding progressively:

### 1. Basic Text Generation (`/basic`)
**What you'll learn:**
- Simple AI text generation
- Synchronous API calls
- Basic error handling
- The difference between streaming and non-streaming

**Key concepts:**
- `generateText()` function
- Simple request/response pattern
- Loading states

**Try these prompts:**
- "Explain artificial intelligence in 3 sentences"
- "Write a haiku about programming"
- "List 5 benefits of renewable energy"

### 2. Streaming Chat (`/chat`)
**What you'll learn:**
- Real-time streaming responses
- Conversation history
- Better user experience
- React hooks integration

**Key concepts:**
- `streamText()` function
- `useChat()` hook
- `UIMessage` vs `ModelMessage`
- `convertToModelMessages()`
- `toUIMessageStreamResponse()`

**Notice the difference:**
- Responses appear word by word
- No waiting for complete response
- Natural conversation flow

### 3. Chat with Tools (`/chat-tools`)
**What you'll learn:**
- Tool integration
- Extending AI capabilities
- Tool call visualization
- Real-time tool execution

**Key concepts:**
- `tool()` function
- Zod schema validation
- Tool execution functions
- Message parts handling

**Try these prompts:**
- "What's the weather in Tokyo?"
- "How's the weather in London?"
- "Tell me about the weather in Paris"

### 4. Multi-Step Tool Calls (`/chat-multi-step`)
**What you'll learn:**
- Complex tool interactions
- Multi-step reasoning
- Tool result processing
- Advanced AI workflows

**Key concepts:**
- `stepCountIs()` function
- `stopWhen` parameter
- Tool result chaining
- Complex reasoning chains

**Try these prompts:**
- "What's the weather in Tokyo in celsius?"
- "How's the weather in London in celsius?"
- "Tell me the weather in Paris and convert it to celsius"

### 5. Advanced Features (`/chat-advanced`)
**What you'll learn:**
- Multiple tool types
- Complex tool interactions
- Advanced error handling
- Production-ready patterns

**Key concepts:**
- Multiple tool definitions
- Tool result aggregation
- Advanced UI patterns
- Error handling in tools

**Try these prompts:**
- "What time is it and what's 15 * 23?"
- "What's the weather in Tokyo and convert 75°F to Celsius?"
- "Calculate 2^8 and tell me the current time"

## 🛠️ Technical Details

### File Structure
```
src/
├── app/
│   ├── page.tsx                 # Main navigation
│   ├── basic/
│   │   └── page.tsx            # Basic text generation
│   ├── chat/
│   │   └── page.tsx            # Streaming chat
│   ├── chat-tools/
│   │   └── page.tsx            # Chat with tools
│   ├── chat-multi-step/
│   │   └── page.tsx            # Multi-step tools
│   ├── chat-advanced/
│   │   └── page.tsx            # Advanced features
│   └── api/
│       ├── generate/
│       │   └── route.ts        # Basic generation API
│       ├── chat/
│       │   └── route.ts        # Streaming chat API
│       ├── chat-tools/
│       │   └── route.ts        # Tools API
│       ├── chat-multi-step/
│       │   └── route.ts        # Multi-step API
│       └── chat-advanced/
│           └── route.ts        # Advanced API
```

### Key Dependencies
- `ai` - Core AI SDK
- `@ai-sdk/react` - React hooks
- `@ai-sdk/openai` - OpenAI provider
- `zod` - Schema validation

### Environment Variables
```env
OPENAI_API_KEY=your_openai_api_key_here
```

## 🎯 Learning Objectives

By the end of this tutorial, you should understand:

1. **Basic AI Integration**
   - How to make simple AI API calls
   - Synchronous vs asynchronous patterns
   - Basic error handling

2. **Streaming Responses**
   - Real-time user experience
   - React hooks for AI
   - Message handling

3. **Tool Integration**
   - Extending AI capabilities
   - Schema validation
   - Tool execution patterns

4. **Advanced Patterns**
   - Multi-step reasoning
   - Complex tool interactions
   - Production-ready code

## 🔧 Customization Ideas

Once you understand the basics, try these modifications:

1. **Add new tools:**
   - Calculator with more operations
   - Database query tool
   - File system operations
   - API integrations

2. **Enhance the UI:**
   - Better message styling
   - Typing indicators
   - Message timestamps
   - User avatars

3. **Add features:**
   - Message persistence
   - User authentication
   - Conversation history
   - Export functionality

## 🐛 Troubleshooting

### Common Issues

1. **"API key not found"**
   - Make sure your `.env.local` file exists
   - Check that `OPENAI_API_KEY` is set correctly
   - Restart your development server

2. **"Tool not working"**
   - Check the tool schema definition
   - Verify the execute function
   - Look at browser console for errors

3. **"Streaming not working"**
   - Ensure you're using `streamText()` not `generateText()`
   - Check that the API route returns `toUIMessageStreamResponse()`
   - Verify the frontend uses `useChat()` hook

### Getting Help

1. Check the browser console for errors
2. Look at the network tab in developer tools
3. Review the AI SDK documentation
4. Ask questions in the course discussion

## 📖 Additional Resources

- [AI SDK Documentation](https://ai-sdk.dev/)
- [Next.js App Router](https://nextjs.org/docs/app)
- [React Hooks](https://react.dev/reference/react)
- [Zod Schema Validation](https://zod.dev/)

## 🎉 Next Steps

After completing these examples:

1. Build your own AI application
2. Integrate with your preferred AI provider
3. Add authentication and user management
4. Deploy to production
5. Explore advanced AI features

Happy coding! 🚀
