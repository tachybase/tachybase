import React from 'react';
import { render } from '@tachybase/test/client';

import App1 from '../demos/demo1';
import App2 from '../demos/demo2';

describe('TableV2', () => {
  it('basic', async () => {
    render(<App1 />);
  });

  it('tree table', () => {
    render(<App2 />);
  });
});
