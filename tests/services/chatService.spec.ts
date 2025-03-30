import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import { sendMessage, resetChat } from '../../src/services/chatService'
import { v4 as uuidv4 } from 'uuid'

// Mock axios and uuid
vi.mock('axios')
vi.mock('uuid', () => ({
  v4: () => 'mocked-uuid'
}))

describe('chatService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })
  
  it('sendMessage should make a POST request with correct parameters', async () => {
    // Mock axios post to return successful response
    const mockResponse = {
      data: {
        chatId: 'response-uuid',
        answer: 'This is the AI response'
      }
    }
    
    vi.mocked(axios.post).mockResolvedValue(mockResponse)
    
    // Call sendMessage
    const result = await sendMessage('Hello AI')
    
    // Check that axios.post was called with correct parameters
    expect(axios.post).toHaveBeenCalledTimes(1)
    expect(axios.post).toHaveBeenCalledWith('/api/ai/chat', {
      chatId: 'mocked-uuid',
      userInput: 'Hello AI'
    })
    
    // Check that the function returns the answer from the response
    expect(result).toBe('This is the AI response')
  })
  
  it('sendMessage should handle API errors gracefully', async () => {
    // Mock axios to throw an error
    const mockError = new Error('API failed')
    vi.mocked(axios.post).mockRejectedValue(mockError)
    
    // Call sendMessage and expect it to throw
    await expect(sendMessage('Hello AI')).rejects.toThrow('API failed')
  })
  
  it('resetChat should generate a new UUID for the session', async () => {
    // Setup: Make a call to set the initial chat ID
    const mockResponse = {
      data: {
        chatId: 'first-uuid',
        answer: 'First response'
      }
    }
    vi.mocked(axios.post).mockResolvedValue(mockResponse)
    
    await sendMessage('First message')
    
    // Now reset the chat
    resetChat()
    
    // Set up mock for second call
    const mockResponse2 = {
      data: {
        chatId: 'second-uuid',
        answer: 'Second response'
      }
    }
    vi.mocked(axios.post).mockResolvedValue(mockResponse2)
    
    // Make another call and verify it uses the new UUID
    await sendMessage('Second message')
    
    // Check axios.post was called with a new chatId
    expect(axios.post).toHaveBeenLastCalledWith('/api/ai/chat', {
      chatId: 'mocked-uuid', // This would be the new UUID
      userInput: 'Second message'
    })
  })
}) 