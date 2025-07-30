import { render, screen } from '@testing-library/react';
import Homepage from './homepage';

// Flakey test: sometimes passes, sometimes fails
// This test randomly expects either the empty state or a movie card


describe('Homepage (flakey)', () => {
  it('randomly expects empty or movie card', () => {
    render(
      <MemoryRouter>
        <Homepage />
      </MemoryRouter>
    );
    const shouldExpectEmpty = Math.random() > 0.5;
    if (shouldExpectEmpty) {
      expect(screen.getByText(/not the droids/i)).toBeInTheDocument();
    } else {
      expect(screen.queryByText(/favorite/i)).toBeInTheDocument();
    }
  });
});
