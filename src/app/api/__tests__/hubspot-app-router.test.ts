import { GET } from '../hubspot/route';
import { jest, describe, beforeEach, test, expect } from '@jest/globals';

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch as unknown as typeof fetch;

// Test data
const mockHubSpotResponse = {
  results: [
    {
      id: '1',
      properties: {
        firstname: 'John',
        lastname: 'Doe',
        email: 'john.doe@example.com',
        hs_lead_status: 'New',
        createdate: '2025-06-15T09:30:00Z',
      },
    },
  ],
};

describe('HubSpot API Integration', () => {
  
  beforeEach(() => {
    // Clear mock data between tests
    mockFetch.mockClear();
    
    // Set up environment for tests
    process.env.HUBSPOT_API_KEY = 'test-hubspot-api-key';
    
    // Mock successful API response
    // @ts-expect-error - Mocking response object for testing
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockHubSpotResponse,
    });
  });
  
  test('should fetch and format HubSpot contacts', async () => {
    // Execute the API handler
    const response = await GET();
    
    // Verify correct status code
    expect(response.status).toBe(200);
    
    // Check response data
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
    
    // Verify HubSpot API was called with correct parameters
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('https://api.hubapi.com/crm/v3/objects/contacts'),
      expect.objectContaining({
        headers: {
          'Authorization': 'Bearer test-hubspot-api-key',
          'Content-Type': 'application/json',
        },
      })
    );
  });
});
