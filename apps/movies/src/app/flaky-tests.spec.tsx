
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






});
