<script setup lang="ts">
import { ref } from 'vue';
import ChatWindow from './components/ChatWindow.vue';
import ChatInput from './components/ChatInput.vue';
import { sendMessage as sendMessageToAPI, resetChat } from './services/chatService';
import axios from 'axios';

interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const messages = ref<Message[]>([]);
const isLoading = ref<boolean>(false);
const isChatOpen = ref<boolean>(false);

const toggleChat = (): void => {
  isChatOpen.value = !isChatOpen.value;
};

const handleResetChat = (): void => {
  // Reset the chat session UUID
  resetChat();
  // Clear messages
  messages.value = [];
};

const sendMessage = async (text: string): Promise<void> => {
  // Add user message to chat
  const userMessage: Message = {
    text,
    isUser: true,
    timestamp: new Date()
  };
  messages.value.push(userMessage);
  
  // Show loading state
  isLoading.value = true;
  
  try {
    // Send message to API
    const response = await sendMessageToAPI(text);
    
    // Add bot response to chat
    const botMessage: Message = {
      text: response,
      isUser: false,
      timestamp: new Date()
    };
    messages.value.push(botMessage);
  } catch (error) {
    // Handle error case with more specific messages
    let errorText = "Sorry, I encountered an error. Please try again later.";
    
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        errorText = "Unable to connect to the server. Please check if the backend is running.";
      } else if (error.response) {
        // Server responded with an error status code
        if (error.response.status === 403) {
          errorText = "Access forbidden. CORS issues might be occurring.";
        } else if (error.response.status === 404) {
          errorText = "The API endpoint was not found.";
        } else if (error.response.status >= 500) {
          errorText = "The server encountered an error. Please try again later.";
        }
      }
    }
    
    const errorMessage: Message = {
      text: errorText,
      isUser: false,
      timestamp: new Date()
    };
    messages.value.push(errorMessage);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="app">
    <!-- Floating chat button -->
    <button 
      class="chat-toggle-button"
      @click="toggleChat"
      :class="{ 'active': isChatOpen }"
    >
      <span v-if="!isChatOpen" class="open-icon">💬</span>
      <span v-else class="close-icon">✕</span>
    </button>
    
    <!-- Chat widget -->
    <div class="chat-widget" :class="{ 'open': isChatOpen }">
      <header class="chat-header">
        <h1>AI Chat</h1>
        <div class="header-buttons">
          <button class="reset-button" @click="handleResetChat" title="Start a new conversation">
            <span>🔄</span>
          </button>
          <button class="minimize-button" @click="toggleChat" title="Minimize chat">
            ─
          </button>
        </div>
      </header>
      
      <main class="chat-container">
        <ChatWindow :messages="messages" />
        <div v-if="isLoading" class="typing-indicator">
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
        </div>
        <ChatInput @send-message="sendMessage" />
      </main>
    </div>
  </div>
</template>

<style>
/* Global styles */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #f0f2f5;
  color: #333;
}
</style>

<style scoped>
.app {
  /* Remove the full-page constraints */
  position: relative;
  width: 100%;
  min-height: 100vh;
}

/* Floating chat button */
.chat-toggle-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #007aff;
  color: white;
  border: none;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1000;
  transition: all 0.3s ease;
  font-size: 20px;
}

.chat-toggle-button:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.25);
}

.chat-toggle-button.active {
  background-color: #e74c3c;
}

/* Chat widget */
.chat-widget {
  position: fixed;
  bottom: 80px;
  right: 20px;
  width: 320px;
  height: 450px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 5px 25px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 999;
  transform: scale(0);
  opacity: 0;
  transform-origin: bottom right;
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.chat-widget.open {
  transform: scale(1);
  opacity: 1;
}

.chat-header {
  background-color: #007aff;
  color: white;
  padding: 10px 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.chat-header h1 {
  font-size: 1.1rem;
  font-weight: 600;
}

.header-buttons {
  display: flex;
  align-items: center;
}

.reset-button,
.minimize-button {
  background: none;
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
  padding: 0 5px;
  margin-left: 5px;
}

.reset-button {
  font-size: 16px;
}

.chat-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.typing-indicator {
  padding: 8px 12px;
  display: flex;
  align-items: center;
}

.typing-indicator .dot {
  height: 6px;
  width: 6px;
  border-radius: 50%;
  background-color: #b6b6b6;
  margin: 0 3px;
  animation: bounce 1.3s linear infinite;
}

.typing-indicator .dot:nth-child(2) {
  animation-delay: 0.15s;
}

.typing-indicator .dot:nth-child(3) {
  animation-delay: 0.3s;
}

@keyframes bounce {
  0%, 60%, 100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-5px);
  }
}

/* Responsive adjustments */
@media (max-width: 480px) {
  .chat-widget {
    width: 85%;
    height: 60vh;
    bottom: 70px;
    right: 7.5%;
  }
  
  .chat-toggle-button {
    bottom: 15px;
    right: 15px;
    width: 45px;
    height: 45px;
  }
}
</style>
