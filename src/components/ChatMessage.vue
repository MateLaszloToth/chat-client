<script setup lang="ts">
defineProps({
  message: {
    type: String,
    required: true
  },
  isUser: {
    type: Boolean,
    default: false
  },
  timestamp: {
    type: Date,
    default: () => new Date()
  }
})

// Function to format time
const formatTime = (date: Date): string => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};
</script>

<template>
  <div class="message-container" :class="{ 'user-message': isUser, 'bot-message': !isUser }">
    <div class="message-bubble">
      <div class="message-text">{{ message }}</div>
      <div class="message-time">{{ formatTime(timestamp) }}</div>
    </div>
  </div>
</template>

<style scoped>
.message-container {
  display: flex;
  margin-bottom: 6px;
  padding: 0 12px;
}

.user-message {
  justify-content: flex-end;
}

.bot-message {
  justify-content: flex-start;
}

.message-bubble {
  max-width: 85%;
  padding: 8px 12px;
  border-radius: 16px;
  position: relative;
  word-wrap: break-word;
}

.user-message .message-bubble {
  background-color: #007aff;
  color: white;
  border-bottom-right-radius: 4px;
}

.bot-message .message-bubble {
  background-color: #e5e5ea;
  color: black;
  border-bottom-left-radius: 4px;
}

.message-text {
  margin-bottom: 3px;
  font-size: 0.95rem;
  white-space: pre-wrap;
  word-break: break-word;
}

.message-time {
  font-size: 0.65rem;
  opacity: 0.7;
  text-align: right;
}
</style> 