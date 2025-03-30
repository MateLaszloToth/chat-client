import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import ChatBot from '../../src/components/ChatBot.vue'
import ChatWindow from '../../src/components/ChatWindow.vue'
import ChatInput from '../../src/components/ChatInput.vue'
import * as chatService from '../../src/services/chatService'

// Define the Message type to match ChatBot.vue
interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

// Mock the chat service
vi.mock('../../src/services/chatService', () => ({
  sendMessage: vi.fn(),
  resetChat: vi.fn()
}))

describe('ChatBot.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })
  
  it('renders with default props', () => {
    const wrapper = mount(ChatBot)
    
    // Chat button should be visible
    expect(wrapper.find('.chat-toggle-button').exists()).toBe(true)
    
    // Chat window should not be open
    const chatWidget = wrapper.find('.chat-widget')
    expect(chatWidget.exists()).toBe(true)
    expect(chatWidget.classes()).not.toContain('open')
    
    // Default title should be used
    expect(wrapper.find('.chat-header h1').text()).toBe('AI Chat')
  })
  
  it('renders with custom props', () => {
    const wrapper = mount(ChatBot, {
      props: {
        title: 'Custom Chat',
        primaryColor: '#FF0000',
        buttonColor: '#00FF00',
        buttonIcon: '🤖',
        position: 'left',
        startOpen: true
      }
    })
    
    // Check title
    expect(wrapper.find('.chat-header h1').text()).toBe('Custom Chat')
    
    // Check colors
    expect(wrapper.find('.chat-header').attributes('style')).toContain('background-color: rgb(255, 0, 0)')
    
    // Check button color
    const button = wrapper.find('.chat-toggle-button')
    expect(button.exists()).toBe(false) // Button should be hidden because chat is open
    
    // Check position
    expect(wrapper.find('.chat-widget').attributes('style')).toContain('left: 20px')
    
    // Check startOpen
    expect(wrapper.find('.chat-widget').classes()).toContain('open')
  })
  
  it('opens the chat window when button is clicked', async () => {
    const wrapper = mount(ChatBot)
    
    // Click the chat button
    await wrapper.find('.chat-toggle-button').trigger('click')
    
    // Chat window should now be open
    expect(wrapper.find('.chat-widget').classes()).toContain('open')
    
    // Button should be hidden
    expect(wrapper.find('.chat-toggle-button').exists()).toBe(false)
  })
  
  it('minimizes the chat when the minimize button is clicked', async () => {
    const wrapper = mount(ChatBot, {
      props: {
        startOpen: true
      }
    })
    
    // Chat should be open
    expect(wrapper.find('.chat-widget').classes()).toContain('open')
    
    // Click the minimize button
    await wrapper.find('.minimize-button').trigger('click')
    
    // Chat should be minimized
    expect(wrapper.find('.chat-widget').classes()).not.toContain('open')
    
    // Button should be visible
    expect(wrapper.find('.chat-toggle-button').exists()).toBe(true)
  })
  
  it('resets chat when reset button is clicked', async () => {
    const wrapper = mount(ChatBot, {
      props: {
        startOpen: true
      }
    })
    
    // Click the reset button
    await wrapper.find('.reset-button').trigger('click')
    
    // resetChat should be called
    expect(chatService.resetChat).toHaveBeenCalledTimes(1)
  })
  
  it('sends a message and displays response', async () => {
    // Mock the sendMessage function to return a response
    vi.mocked(chatService.sendMessage).mockResolvedValue('AI response')
    
    const wrapper = mount(ChatBot, {
      props: {
        startOpen: true
      }
    })
    
    // Find the ChatInput component and emit a send-message event
    const chatInput = wrapper.findComponent(ChatInput)
    await chatInput.vm.$emit('send-message', 'Hello AI')
    
    // Wait for the async operation to complete
    await flushPromises()
    
    // Check that sendMessage was called with the right message
    expect(chatService.sendMessage).toHaveBeenCalledWith('Hello AI')
    
    // Check that loading indicator was shown during api call
    expect(wrapper.find('.typing-indicator').exists()).toBe(false) // false after loading is complete
    
    // Now there should be two messages in the chat (user message and response)
    const messages = wrapper.findComponent(ChatWindow).props('messages') as Message[]
    expect(messages.length).toBe(2)
    expect(messages[0].text).toBe('Hello AI')
    expect(messages[0].isUser).toBe(true)
    expect(messages[1].text).toBe('AI response')
    expect(messages[1].isUser).toBe(false)
  })
  
  it('displays error message when API call fails', async () => {
    // Mock the sendMessage function to throw an error
    vi.mocked(chatService.sendMessage).mockRejectedValue(new Error('API error'))
    
    const wrapper = mount(ChatBot, {
      props: {
        startOpen: true
      }
    })
    
    // Find the ChatInput component and emit a send-message event
    const chatInput = wrapper.findComponent(ChatInput)
    await chatInput.vm.$emit('send-message', 'Hello AI')
    
    // Wait for the async operation to complete
    await flushPromises()
    
    // There should be two messages: the user message and the error message
    const messages = wrapper.findComponent(ChatWindow).props('messages') as Message[]
    expect(messages.length).toBe(2)
    expect(messages[0].text).toBe('Hello AI')
    expect(messages[1].text).toContain('Sorry, I encountered an error')
    expect(messages[1].isUser).toBe(false)
  })
}) 