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
  const test = Math.random();
  let navPath = 11111;

  if(test > 0.5) {
     navPath = 12477;
  }

  page.goto(`/movies/${navPath}`);

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
