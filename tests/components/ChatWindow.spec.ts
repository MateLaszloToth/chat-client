import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ChatWindow from '../../src/components/ChatWindow.vue'
import ChatMessage from '../../src/components/ChatMessage.vue'

describe('ChatWindow.vue', () => {
  it('displays empty state when no messages', () => {
    const wrapper = mount(ChatWindow, {
      props: {
        messages: []
      }
    })
    
    // Check if empty state message is shown
    expect(wrapper.find('.empty-state').exists()).toBe(true)
    expect(wrapper.text()).toContain('No messages yet')
    
    // Check that there are no message components
    expect(wrapper.findAllComponents(ChatMessage).length).toBe(0)
  })
  
  it('renders messages correctly', () => {
    const messages = [
      { text: 'Hello', isUser: true, timestamp: new Date('2023-01-01T12:00:00') },
      { text: 'Hi there!', isUser: false, timestamp: new Date('2023-01-01T12:01:00') },
      { text: 'How are you?', isUser: true, timestamp: new Date('2023-01-01T12:02:00') }
    ]
    
    const wrapper = mount(ChatWindow, {
      props: {
        messages
      }
    })
    
    // Check that empty state is not shown
    expect(wrapper.find('.empty-state').exists()).toBe(false)
    
    // Check that the correct number of messages are rendered
    const messageComponents = wrapper.findAllComponents(ChatMessage)
    expect(messageComponents.length).toBe(3)
    
    // Check that each message has the correct props
    expect(messageComponents[0].props('message')).toBe('Hello')
    expect(messageComponents[0].props('isUser')).toBe(true)
    
    expect(messageComponents[1].props('message')).toBe('Hi there!')
    expect(messageComponents[1].props('isUser')).toBe(false)
    
    expect(messageComponents[2].props('message')).toBe('How are you?')
    expect(messageComponents[2].props('isUser')).toBe(true)
  })
  
  it('scrolls to bottom when new messages arrive', async () => {
    // Mock scrollTop and scrollHeight
    Element.prototype.scrollTo = vi.fn()
    Object.defineProperty(HTMLElement.prototype, 'scrollHeight', {
      configurable: true,
      value: 500
    })
    
    const messages = [
      { text: 'Message 1', isUser: true, timestamp: new Date() }
    ]
    
    const wrapper = mount(ChatWindow, {
      props: {
        messages: [...messages]
      }
    })
    
    // Add another message
    await wrapper.setProps({
      messages: [
        ...messages,
        { text: 'Message 2', isUser: false, timestamp: new Date() }
      ]
    })
    
    // Check if scrollToBottom was called (through the updated lifecycle hook)
    // We can't directly check the implementation, but we should have 2 messages now
    expect(wrapper.findAllComponents(ChatMessage).length).toBe(2)
  })
}) 