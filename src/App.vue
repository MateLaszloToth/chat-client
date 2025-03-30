<script setup lang="ts">
import ChatBot from './components/ChatBot.vue';
</script>

<template>
  <div class="chat-application">
    <ChatBot 
      title="Customer Support" 
      primaryColor="#4CAF50"
      buttonColor="#4CAF50"
      buttonActiveColor="#FF5722"
      buttonIcon="👋"
      position="right"
      :startOpen="false"
    />
  </div>
</template>

<style>
/* Global styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Arial', sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #f9f9f9;
}

.chat-application {
  width: 100%;
  min-height: 100vh;
  position: relative;
}
</style>
