import React from 'react';
import { render, screen } from '@tachybase/test/client';

import App1 from '../demos/demo1';

describe('Details', () => {
  it('should render correctly', () => {
    render(<App1 />);

    expect(screen.getByText('No data')).toBeInTheDocument();
  });
});
