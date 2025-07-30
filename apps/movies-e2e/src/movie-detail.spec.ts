import { test, expect } from '@playwright/test';
import { mockMovieDetails } from './mocks/movie-details.mock';

test.beforeEach(async ({ page }) => {
  // Mock the movie details endpoint
  page.route('/movie/12477', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockMovieDetails),
    });
  });
});

test('loads movie details correctly', async ({ page }) => {
  // Navigate to the movie detail page
  page.goto('/movies/12477');

  // Wait for the movie details to be loaded
  page.waitForResponse(
    (response) =>
      response.url().includes('/movies/12477') && response.status() === 200
  );

  // Check if the title is displayed correctly
  const title = page.locator('h4');
  await expect(title).toHaveText('Grave of the Fireflies (1988)');

  // Check if the overview/description is displayed correctly
  const overview = page.locator('p').first();
  await expect(overview).toContainText('In the final months of World War II');
});

// create flaky task for demonstration purposes
test('flaky test example', async ({ page }) => {
  // Navigate to the movie detail page
  page.goto('/movies/12477');

  // Randomly fail this test to demonstrate flaky behavior
  if (Math.random() < 0.5) {
    throw new Error('This is a flaky test that fails randomly.');
  }

  // If it doesn't fail, check if the title is displayed correctly
  const title = page.locator('h4');
  await expect(title).toHaveText('Grave of the Fireflies (1988)');
});
