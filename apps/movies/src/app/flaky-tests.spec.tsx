import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { App } from './app';

describe('Flaky Tests Suite', () => {
  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {
      // Do nothing
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('flaky test with random failures', () => {
    // This test will fail ~50% of the time
    const randomNumber = Math.random();
    expect(randomNumber).toBeGreaterThan(0.5);
  });

  test('flaky test with async timing issues', async () => {
    // Simulate an async operation that sometimes takes too long
    await new Promise(resolve => {
      setTimeout(resolve, Math.random() * 200);
    });
    
    // This will sometimes fail due to timing
    expect(Date.now()).toBeLessThan(Date.now() + 1);
  });

  test('flaky test with network simulation', async () => {
    // Simulate network request that sometimes fails
    const mockFetch = jest.fn().mockImplementation(() => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          // 30% chance of failure
          if (Math.random() < 0.3) {
            reject(new Error('Network error'));
          } else {
            resolve({ ok: true, json: () => Promise.resolve({ data: 'success' }) });
          }
        }, Math.random() * 100);
      });
    });

    global.fetch = mockFetch;

    try {
      const response = await fetch('/api/test');
      const data = await response.json();
      expect(data.data).toBe('success');
    } catch (error) {
      // This will sometimes throw due to the random failure
      expect(error.message).toBe('Network error');
    }
  });

  test('flaky test with DOM query timing', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    // Sometimes the DOM might not be ready
    const element = document.querySelector('[data-testid="mock-home"]');
    
    // This will fail intermittently
    expect(element).toBeInTheDocument();
  });

  test('flaky test with state race condition', () => {
    let state = 0;
    
    // Simulate multiple state updates
    const updateState = () => {
      setTimeout(() => {
        state += 1;
      }, Math.random() * 50);
    };
    
    // Trigger multiple updates
    updateState();
    updateState();
    updateState();
    
    // This will fail because state updates might not have completed
    expect(state).toBe(3);
  });

  test('flaky test with memory pressure simulation', () => {
    // Simulate memory pressure by creating many objects
    const objects = [];
    for (let i = 0; i < 1000; i++) {
      objects.push({ id: i, data: 'test'.repeat(100) });
    }
    
    // Sometimes garbage collection might affect timing
    const startTime = performance.now();
    
    // Simulate some work
    let result = 0;
    for (let i = 0; i < 10000; i++) {
      result += i;
    }
    
    const endTime = performance.now();
    
    // This will fail intermittently due to varying execution times
    expect(endTime - startTime).toBeLessThan(10);
  });

  test('flaky test with file system simulation', () => {
    // Simulate file system operations that sometimes fail
    const mockReadFile = jest.fn().mockImplementation(() => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          // 20% chance of file not found
          if (Math.random() < 0.2) {
            reject(new Error('File not found'));
          } else {
            resolve('file content');
          }
        }, Math.random() * 100);
      });
    });

    // This will sometimes throw an error
    expect(() => {
      mockReadFile().then(content => {
        expect(content).toBe('file content');
      });
    }).not.toThrow();
  });

  test('flaky test with database simulation', async () => {
    // Simulate database connection that sometimes fails
    const mockQuery = jest.fn().mockImplementation(() => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          // 15% chance of connection timeout
          if (Math.random() < 0.15) {
            reject(new Error('Connection timeout'));
          } else {
            resolve([{ id: 1, name: 'test' }]);
          }
        }, Math.random() * 150);
      });
    });

    try {
      const result = await mockQuery();
      expect(result).toHaveLength(1);
    } catch (error) {
      expect(error.message).toBe('Connection timeout');
    }
  });

  test('flaky test with UI rendering race condition', async () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    // Simulate UI updates that might not be synchronized
    const updateUI = () => {
      return new Promise(resolve => {
        setTimeout(() => {
          // Simulate DOM update
          const div = document.createElement('div');
          div.textContent = 'Updated';
          document.body.appendChild(div);
          resolve(true);
        }, Math.random() * 100);
      });
    };

    // Start multiple UI updates
    const promises = [updateUI(), updateUI(), updateUI()];
    
    await Promise.all(promises);
    
    // This will sometimes fail because updates might not be complete
    const elements = document.querySelectorAll('div');
    expect(elements.length).toBeGreaterThan(0);
  });
}); 