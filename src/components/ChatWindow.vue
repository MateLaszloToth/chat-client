<script setup lang="ts">
import { ref, onMounted, onUpdated, watchEffect } from 'vue';
import ChatMessage from './ChatMessage.vue';

interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const props = defineProps({
  messages: {
    type: Array as () => Message[],
    default: () => []
  }
});

const chatContainer = ref<HTMLElement | null>(null);

const scrollToBottom = (): void => {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  }
};

onMounted(scrollToBottom);
onUpdated(scrollToBottom);

// Also set up a watchEffect to handle async message updates
watchEffect(() => {
  if (props.messages.length) {
    // Using nextTick would be better, but for simple cases setTimeout works
    setTimeout(scrollToBottom, 100);
  }
});
</script>

<template>
  <div class="chat-window" ref="chatContainer">
    <div v-if="messages.length === 0" class="empty-state">
      <div class="empty-message">No messages yet. Start a conversation!</div>
    </div>
    <div v-else class="messages-container">
      <ChatMessage 
        v-for="(message, index) in messages" 
        :key="index"
        :message="message.text"
        :isUser="message.isUser"
        :timestamp="message.timestamp"
      />
    </div>
  </div>
</template>

<style scoped>
.chat-window {
  flex: 1;
  overflow-y: auto;
  padding: 15px 0;
  background-color: #f5f5f5;
  border-radius: 10px 10px 0 0;
  box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.1);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #888;
}

.empty-message {
  font-size: 0.95rem;
  text-align: center;
  opacity: 0.7;
  padding: 15px;
}

.messages-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style> 