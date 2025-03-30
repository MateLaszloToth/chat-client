import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

// Use the proxy path instead of directly calling the backend
const API_URL = '/api/ai/chat';

// Store the chat ID to maintain a conversation session
let currentChatId = uuidv4();

interface ChatResponse {
  chatId: string; // UUID as string
  answer: string;
}

interface ChatRequest {
  chatId: string; // UUID as string
  userInput: string;
}

/**
 * Send a message to the AI chat endpoint and get the response
 * @param {string} message - User message to send to the AI
 * @returns {Promise<string>} - Promise resolving to the AI's response text
 */
export const sendMessage = async (message: string): Promise<string> => {
  try {
    // Format the request body to match what the Kotlin server expects
    const chatRequest: ChatRequest = {
      chatId: currentChatId,
      userInput: message
    };
    
    const response = await axios.post<ChatResponse>(API_URL, chatRequest);
    
    // Update the current chat ID with the one returned from the server
    if (response.data.chatId) {
      currentChatId = response.data.chatId;
    }
    
    // Return just the answer text from the response
    return response.data.answer;
  } catch (error) {
    console.error('Error sending message to AI:', error);
    throw error;
  }
};

// Reset chat session with a new UUID
export const resetChat = (): void => {
  currentChatId = uuidv4();
};

export default {
  sendMessage,
  resetChat
}; 