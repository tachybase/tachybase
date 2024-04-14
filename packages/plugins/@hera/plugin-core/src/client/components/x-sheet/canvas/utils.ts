export function dpr() {
  return window.devicePixelRatio ?? 1;
}
export function thinLineWidth() {
  return dpr() - 0.5;
}
export function npx(px: number | string) {
  if (typeof px === 'string') {
    return parseInt(px, 10) * dpr();
  }
  return px * dpr();
}
export function npxLine(px) {
  const n = npx(px);
  return n > 0 ? n - 0.5 : 0.5;
}
export function drawFontLine(
  type: 'underline' | 'strike',
  tx: number,
  ty: number,
  align: 'center' | 'right',
  valign: 'bottom' | 'top',
  blheight: number,
  blwidth: number,
) {
  const floffset = { x: 0, y: 0 };
  if (type === 'underline') {
    if (valign === 'bottom') {
      floffset.y = 0;
    } else if (valign === 'top') {
      floffset.y = -(blheight + 2);
    } else {
      floffset.y = -blheight / 2;
    }
  } else if (type === 'strike') {
    if (valign === 'bottom') {
      floffset.y = blheight / 2;
    } else if (valign === 'top') {
      floffset.y = -(blheight / 2 + 2);
    }
  }

  if (align === 'center') {
    floffset.x = blwidth / 2;
  } else if (align === 'right') {
    floffset.x = blwidth;
  }
  this.line([tx - floffset.x, ty - floffset.y], [tx - floffset.x + blwidth, ty - floffset.y]);
}
