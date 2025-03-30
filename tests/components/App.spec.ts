import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import App from '../../src/App.vue'
import ChatBot from '../../src/components/ChatBot.vue'

describe('App.vue', () => {
  it('renders the ChatBot component', () => {
    const wrapper = mount(App)
    
    // Check if the ChatBot component is rendered
    expect(wrapper.findComponent(ChatBot).exists()).toBe(true)
  })
  
  it('passes the correct props to ChatBot component', () => {
    const wrapper = mount(App)
    const chatBot = wrapper.findComponent(ChatBot)
    
    // Check that the props are passed correctly
    expect(chatBot.props('title')).toBe('Customer Support')
    expect(chatBot.props('primaryColor')).toBe('#4CAF50')
    expect(chatBot.props('buttonColor')).toBe('#4CAF50')
    expect(chatBot.props('buttonActiveColor')).toBe('#FF5722')
    expect(chatBot.props('buttonIcon')).toBe('👋')
    expect(chatBot.props('position')).toBe('right')
    expect(chatBot.props('startOpen')).toBe(false)
  })
  
  it('renders with the correct container class', () => {
    const wrapper = mount(App)
    
    // Check that the container class is applied
    expect(wrapper.find('.chat-application').exists()).toBe(true)
  })
}) 