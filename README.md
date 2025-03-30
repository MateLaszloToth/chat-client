# Chat Client

A Vue.js-based chat client interface with TypeScript for interacting with an AI chatbot. Features a non-intrusive floating chat button that expands into a compact chat window.

## Features

- Floating chat button that opens a compact, non-intrusive chat window
- Modern chat interface with separate styling for user and AI messages
- Proper handling of newlines and whitespace in messages
- Typing indicators when waiting for AI responses
- Chat session management with UUID-based conversation tracking
- Error handling with user-friendly messages
- Responsive design for both desktop and mobile
- Support for Kotlin-based backend integration
- Clean, modern UI with animations

## Prerequisites

- Node.js (v14 or newer recommended)
- npm or yarn

## Installation

1. Clone the repository
2. Navigate to the project directory
3. Install dependencies:

```bash
npm install
```

## Configuration

The chat client is configured to communicate with a backend API endpoint. Configuration details:

- API proxy is set up in `vite.config.ts` to avoid CORS issues
- The chat service is configured in `src/services/chatService.ts`
- By default, it connects to a local backend at http://localhost:8080 through the proxy

The API expects the following formats:

- **Request Format**:
  ```typescript
  {
    chatId: string, // UUID for the conversation
    userInput: string // User's message
  }
  ```

- **Response Format**:
  ```typescript
  {
    chatId: string, // UUID for the conversation
    answer: string // The AI's response
  }
  ```

## Development

To start the development server:

```bash
npm run dev
```

The application will be available at [http://localhost:5173](http://localhost:5173) by default.

## Testing

The application includes comprehensive unit tests for all components and services:

```bash
# Run tests once
npm test

# Run tests in watch mode (development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

Tests are written using Vitest and Vue Test Utils, providing coverage for:
- Chat components (ChatMessage, ChatInput, ChatWindow)
- Main App component
- Chat service with API communication

## Building for Production

To build the application for production:

```bash
npm run build
```

The built files will be in the `dist` directory, ready to be deployed to a web server.

## Usage

The chat interface can be integrated into any web page:

1. The chat starts as a floating button in the bottom-right corner
2. Clicking the button opens a chat window
3. Messages can be sent by typing and pressing Enter or clicking the send button
4. Press Shift+Enter for multi-line messages
5. The chat window can be minimized by clicking the minimize button
6. Conversations can be reset with the reset button in the header

## Customization

- Colors and styling can be adjusted in the component CSS
- Modify the component dimensions in App.vue
- The chat service can be extended to support additional features

## License

MIT
