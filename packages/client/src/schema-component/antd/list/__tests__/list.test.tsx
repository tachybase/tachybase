import React from 'react';
import { render } from '@tachybase/test/client';

import App1 from '../demos/demo1';

describe('List', () => {
  it('should render correctly', () => {
    render(<App1 />);
  });
});
