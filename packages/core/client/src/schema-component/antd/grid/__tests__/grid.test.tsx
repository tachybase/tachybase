import React from 'react';
import { render, screen, waitFor } from '@tachybase/test/client';

import App1 from '../demos/demo1';
import App2 from '../demos/demo2';
import App3 from '../demos/demo3';

describe('Grid', () => {
  it('block', async () => {
    render(<App1 />);
    await waitFor(() => {
      const blocks = document.querySelectorAll('.block-item');
      expect(blocks.length).toBe(6);
      expect(screen.getByText('Block 1')).toBeInTheDocument();
    });
  });

  it('input', async () => {
    render(<App2 />);

    await waitFor(() => {
      const inputs = document.querySelectorAll('.ant-input');
      expect(inputs.length).toBe(3);
    });
  });

  it('initializer', () => {
    render(<App3 />);
  });
});
