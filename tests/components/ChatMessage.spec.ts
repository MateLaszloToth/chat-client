import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ChatMessage from '../../src/components/ChatMessage.vue'

describe('ChatMessage.vue', () => {
  it('renders user message correctly', () => {
    const wrapper = mount(ChatMessage, {
      props: {
        message: 'Hello World',
        isUser: true,
        timestamp: new Date('2023-01-01T12:00:00')
      }
    })
    
    // Check if message text is rendered
    expect(wrapper.text()).toContain('Hello World')
    
    // Check proper styling for user message
    expect(wrapper.find('.user-message').exists()).toBe(true)
    expect(wrapper.find('.bot-message').exists()).toBe(false)
    
    // Check time formatting (assuming 12:00 PM format)
    expect(wrapper.find('.message-time').text()).toMatch(/12:00/)
  })
  
  it('renders bot message correctly', () => {
    const wrapper = mount(ChatMessage, {
      props: {
        message: 'I am an AI assistant',
        isUser: false,
        timestamp: new Date('2023-01-01T14:30:00')
      }
    })
    
    // Check if message text is rendered
    expect(wrapper.text()).toContain('I am an AI assistant')
    
    // Check proper styling for bot message
    expect(wrapper.find('.user-message').exists()).toBe(false)
    expect(wrapper.find('.bot-message').exists()).toBe(true)
    
    // Check time formatting (assuming 2:30 PM format)
    expect(wrapper.find('.message-time').text()).toMatch(/2:30/)
  })
  
  it('preserves newlines in message text', () => {
    const multilineMessage = 'First line\nSecond line\nThird line'
    const wrapper = mount(ChatMessage, {
      props: {
        message: multilineMessage,
        isUser: false,
        timestamp: new Date()
      }
    })
    
    const messageElement = wrapper.find('.message-text')
    
    // Check that the message text contains the entire message
    expect(messageElement.text()).toBe(multilineMessage)
    
    // In JSDOM we can't properly test CSS properties like white-space,
    // so we just verify the element exists and contains the text correctly
    expect(messageElement.exists()).toBe(true)
  })
}) 