import { render } from '@tachybase/test/client';
import React from 'react';
import App1 from '../demos/demo1';

describe('GridCard', () => {
  it('should render correctly', () => {
    render(<App1 />);
  });
});
