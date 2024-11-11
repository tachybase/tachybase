import React from 'react';

import {
  Canvas,
  Circle,
  ClipPath,
  Defs,
  Ellipse,
  Font,
  G,
  Image,
  Line,
  LinearGradient,
  Link,
  Note,
  Page,
  Path,
  Polygon,
  Polyline,
  RadialGradient,
  Rect,
  Stop,
  StyleSheet,
  Svg,
  Text,
  Tspan,
  View,
} from '@react-pdf/renderer';
import { transform } from 'buble';

const Document = 'DOCUMENT';

const primitives = {
  Document,
  Page,
  Text,
  Link,
  Font,
  View,
  Note,
  Image,
  Canvas,
  G,
  Svg,
  Path,
  Rect,
  Line,
  Stop,
  Defs,
  Tspan,
  Circle,
  Ellipse,
  Polygon,
  Polyline,
  ClipPath,
  LinearGradient,
  RadialGradient,
  StyleSheet,
};

const transpile = (code, callback, onError) => {
  try {
    const result = transform(code, {
      objectAssign: 'Object.assign',
      transforms: {
        dangerousForOf: true,
        dangerousTaggedTemplateString: true,
      },
    });

    const res = new Function('React', 'ReactPDF', ...Object.keys(primitives), result.code);

    res(React, { render: (doc) => callback(doc) }, ...Object.values(primitives));
  } catch (e) {
    if (onError) {
      onError(e);
    }
  }
};

export default transpile;
