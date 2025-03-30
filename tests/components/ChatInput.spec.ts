import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ChatInput from '../../src/components/ChatInput.vue'

describe('ChatInput.vue', () => {
  it('renders the input field correctly', () => {
    const wrapper = mount(ChatInput)
    
    // Check if textarea exists
    expect(wrapper.find('.message-input').exists()).toBe(true)
    
    // Check if send button exists and is disabled initially (since input is empty)
    const sendButton = wrapper.find('.send-button')
    expect(sendButton.exists()).toBe(true)
    expect(sendButton.attributes('disabled')).toBeDefined()
  })
  
  it('enables send button when input is not empty', async () => {
    const wrapper = mount(ChatInput)
    
    const input = wrapper.find('.message-input')
    await input.setValue('Hello')
    
    // Check if send button is enabled
    const sendButton = wrapper.find('.send-button')
    expect(sendButton.attributes('disabled')).toBeUndefined()
  })
  
  it('emits send-message event when form is submitted', async () => {
    const wrapper = mount(ChatInput)
    
    // Set input value
    const input = wrapper.find('.message-input')
    await input.setValue('Test message')
    
    // Submit form
    const form = wrapper.find('form')
    await form.trigger('submit')
    
    // Check if event was emitted with correct message
    const emitted = wrapper.emitted('send-message')
    expect(emitted).toBeTruthy()
    expect(emitted?.[0]).toEqual(['Test message'])
    
    // Check if input is cleared after sending
    expect((input.element as HTMLTextAreaElement).value).toBe('')
  })
  
  it('sends message when Enter key is pressed without Shift', async () => {
    const wrapper = mount(ChatInput)
    
    // Set input value
    const input = wrapper.find('.message-input')
    await input.setValue('Test message')
    
    // Simulate Enter key press without Shift
    await input.trigger('keydown', { key: 'Enter', shiftKey: false })
    
    // Check if event was emitted
    const emitted = wrapper.emitted('send-message')
    expect(emitted).toBeTruthy()
    expect(emitted?.[0]).toEqual(['Test message'])
  })
  
  it('does not send message when Enter+Shift is pressed', async () => {
    const wrapper = mount(ChatInput)
    
    // Set input value
    const input = wrapper.find('.message-input')
    await input.setValue('Test message')
    
    // Simulate Enter key press with Shift
    await input.trigger('keydown', { key: 'Enter', shiftKey: true })
    
    // Check that no event was emitted
    expect(wrapper.emitted('send-message')).toBeUndefined()
  })
  
  it('does not emit event for empty messages', async () => {
    const wrapper = mount(ChatInput)
    
    // Set empty input (just spaces)
    const input = wrapper.find('.message-input')
    await input.setValue('   ')
    
    // Submit form
    const form = wrapper.find('form')
    await form.trigger('submit')
    
    // Check that no event was emitted
    expect(wrapper.emitted('send-message')).toBeUndefined()
  })
}) 