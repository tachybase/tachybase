import React from 'react';
import { render, screen, waitFor } from 'testUtils';
import App1 from '../demos/demo1';
import { GlobalThemeProvider } from '@nocobase/client';

describe('Page', () => {
  it('should render correctly', async () => {
    render(<App1 />, {
      wrapper: GlobalThemeProvider,
    });

    await waitFor(() => {
      expect(screen.getByText(/page title/i)).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText(/page content/i)).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(document.title).toBe('Page Title - NocoBase');
    });
  });
});
