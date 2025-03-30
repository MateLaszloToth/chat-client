<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits<{
  (e: 'send-message', message: string): void
}>();

const inputMessage = ref<string>('');

const sendMessage = (): void => {
  if (inputMessage.value.trim()) {
    emit('send-message', inputMessage.value);
    inputMessage.value = '';
  }
};

const handleKeydown = (event: KeyboardEvent): void => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
};
</script>

<template>
  <div class="chat-input">
    <form @submit.prevent="sendMessage" class="input-form">
      <textarea 
        v-model="inputMessage" 
        @keydown="handleKeydown"
        placeholder="Type your message here..." 
        class="message-input"
        rows="1"
      ></textarea>
      <button 
        type="submit" 
        class="send-button"
        :disabled="!inputMessage.trim()"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="22" y1="2" x2="11" y2="13"></line>
          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
        </svg>
      </button>
    </form>
  </div>
</template>

<style scoped>
.chat-input {
  padding: 10px;
  background-color: white;
  border-top: 1px solid #e0e0e0;
  border-radius: 0 0 10px 10px;
}

.input-form {
  display: flex;
  align-items: flex-end;
}

.message-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #d1d1d1;
  border-radius: 18px;
  font-size: 0.95rem;
  resize: none;
  outline: none;
  max-height: 100px;
  overflow-y: auto;
}

.message-input:focus {
  border-color: #007aff;
  box-shadow: 0 0 0 2px rgba(0, 122, 255, 0.2);
}

.send-button {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #007aff;
  color: white;
  border: none;
  margin-left: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.send-button:hover {
  background-color: #0062cc;
}

.send-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.send-button svg {
  width: 16px;
  height: 16px;
}
</style> 