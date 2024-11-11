import React from 'react';
import { render, screen, waitFor } from '@tachybase/test/client';

import App1 from '../demos/demo1';

describe('FormItem', () => {
  it('should render correctly', async () => {
    render(<App1 />);

    await waitFor(() => {
      expect(screen.getByText('title')).toBeInTheDocument();
    });
  });
});
