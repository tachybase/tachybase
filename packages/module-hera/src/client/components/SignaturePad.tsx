import * as React from 'react';

import SigPad, { Options, PointGroup, ToSVGOptions } from 'signature_pad';
import { debounce } from 'throttle-debounce';

type Props = {
  width?: number;
  height?: number;
  options?: Options;
  canvasProps?: { [key: string]: string | { [key: string]: string } };
} & DefaultProps;

type DefaultProps = {
  redrawOnResize: boolean;
  debounceInterval: number;
};

type State = {
  canvasWidth: number;
  canvasHeight: number;
};

/**
 * @class
 * @classdesc Signature pad component.
 * @extends {PureComponent}
 */
class SignaturePad extends React.PureComponent<Props, State> {
  static displayName = 'react-signature-pad-wrapper';

  static defaultProps: DefaultProps = {
    redrawOnResize: false,
    debounceInterval: 150,
  };

  private canvasRef = React.createRef<HTMLCanvasElement>();

  private signaturePad!: SigPad;

  private callResizeHandler!: debounce<() => void>;

  /**
   * Create a new signature pad.
   *
   * @param {Props} props
   */
  constructor(props: Props) {
    super(props);

    this.state = { canvasWidth: 0, canvasHeight: 0 };

    this.callResizeHandler = debounce<() => void>(this.props.debounceInterval, this.handleResize.bind(this));
  }

  /**
   * Initialise the signature pad once the canvas element is rendered.
   *
   * @return {void}
   */
  componentDidMount(): void {
    const canvas = this.canvasRef.current;

    if (canvas) {
      if (!this.props.width || !this.props.height) {
        canvas.style.width = '100%';
        window.addEventListener('resize', this.callResizeHandler);
      }

      this.signaturePad = new SigPad(canvas, this.props.options);

      this.scaleCanvas(canvas);
    }
  }

  /**
   * Remove the resize event listener and switch the signature pad off on
   * unmount.
   *
   * @return {void}
   */
  componentWillUnmount(): void {
    if (!this.props.width || !this.props.height) {
      window.removeEventListener('resize', this.callResizeHandler);
    }

    this.signaturePad.off();
  }

  /**
   * Get the original signature_pad instance.
   *
   * @return {SigPad}
   */
  get instance(): SigPad {
    return this.signaturePad;
  }

  /**
   * Get the canvas ref.
   *
   * @return {Object}
   */
  get canvas(): React.RefObject<HTMLCanvasElement> {
    return this.canvasRef;
  }

  /**
   * Set the radius of a single dot.
   *
   * @param {number} dotSize
   * @return {void}
   */
  set dotSize(dotSize: number) {
    this.signaturePad.dotSize = dotSize;
  }

  /**
   * Get the radius of a single dot.
   *
   * @return {number}
   */
  get dotSize(): number {
    return this.signaturePad.dotSize;
  }

  /**
   * Set the minimum width of a line.
   *
   * @param {number} minWidth
   * @return {void}
   */
  set minWidth(minWidth: number) {
    this.signaturePad.minWidth = minWidth;
  }

  /**
   * Get the minimum width of a line.
   *
   * @return {number}
   */
  get minWidth(): number {
    return this.signaturePad.minWidth;
  }

  /**
   * Get the maximum width of a line.
   *
   * @param {number} maxWidth
   * @return {void}
   */
  set maxWidth(maxWidth: number) {
    this.signaturePad.maxWidth = maxWidth;
  }

  /**
   * Get the maximum width of a line.
   *
   * @return {number}
   */
  get maxWidth(): number {
    return this.signaturePad.maxWidth;
  }

  /**
   * Set the throttle for drawing the next point at most once every x ms.
   *
   * @param {number} throttle
   * @return {void}
   */
  set throttle(throttle: number) {
    this.signaturePad.throttle = throttle;
  }

  /**
   * Get the throttle for drawing the next point at most once every x ms.
   *
   * @return {number}
   */
  get throttle(): number {
    return this.signaturePad.throttle;
  }

  /**
   * Set the color used to clear the background.
   *
   * @param {string} color
   * @return {void}
   */
  set backgroundColor(color: string) {
    this.signaturePad.backgroundColor = color;
  }

  /**
   * Get the color used to clear the background.
   *
   * @return {string}
   */
  get backgroundColor(): string {
    return this.signaturePad.backgroundColor;
  }

  /**
   * Set the color used to draw the lines.
   *
   * @param {string} color
   * @return {void}
   */
  set penColor(color: string) {
    this.signaturePad.penColor = color;
  }

  /**
   * Get the color used to draw the lines.
   *
   * @return {string}
   */
  get penColor(): string {
    return this.signaturePad.penColor;
  }

  /**
   * Set weight used to modify new velocity based on the previous velocity.
   *
   * @param {number} weight
   * @return {void}
   */
  set velocityFilterWeight(weight: number) {
    this.signaturePad.velocityFilterWeight = weight;
  }

  /**
   * Get weight used to modify new velocity based on the previous velocity.
   *
   * @return {number}
   */
  get velocityFilterWeight(): number {
    return this.signaturePad.velocityFilterWeight;
  }

  /**
   * Determine if the canvas is empty.
   *
   * @return {boolean}
   */
  isEmpty(): boolean {
    return this.signaturePad.isEmpty();
  }

  /**
   * Clear the canvas.
   *
   * @return {void}
   */
  clear(): void {
    this.signaturePad.clear();
  }

  /**
   * Draw a signature from a data URL.
   *
   * @param {string} dataUrl
   * @param {object} options
   * @return {void}
   */
  fromDataURL(
    dataUrl: string,
    options: Partial<{ ratio: number; width: number; height: number; xOffset: number; yOffset: number }> = {},
  ): void {
    this.signaturePad.fromDataURL(dataUrl, options);
  }

  /**
   * Get the signature data as a data URL.
   *
   * @param {?string} mime
   * @param {?number} encoderOptions
   * @return {string}
   */
  toDataURL(type?: string, encoderOptions?: number): string {
    return this.signaturePad.toDataURL(type, encoderOptions);
  }

  /**
   * Get the signature data as an SVG string without converting to base64.
   *
   * @param {?ToSVGOptions} svgOptions
   * @return {string}
   */
  toSVG(svgOptions?: ToSVGOptions): string {
    return this.signaturePad.toSVG(svgOptions);
  }

  /**
   * Draw a signature from an array of point groups.
   *
   * @param {PointGroup[]} data
   * @return {void}
   */
  fromData(data: PointGroup[]): void {
    this.signaturePad.fromData(data);
  }

  /**
   * Get the signature pad data an array of point groups.
   *
   * @return {PointGroup[]}
   */
  toData(): PointGroup[] {
    return this.signaturePad.toData();
  }

  /**
   * Turn the signature pad off.
   *
   * @return {void}
   */
  off(): void {
    this.signaturePad.off();
  }

  /**
   * Turn the signature pad on.
   *
   * @return {void}
   */
  on(): void {
    this.signaturePad.on();
  }

  /**
   * Handle a resize event.
   *
   * @return {void}
   */
  handleResize(): void {
    const canvas = this.canvasRef.current;

    if (canvas) {
      this.scaleCanvas(canvas);
    }
  }

  /**
   * Scale the canvas.
   *
   * @param {HTMLCanvasElement} canvas
   * @return {void}
   */
  scaleCanvas(canvas: HTMLCanvasElement): void {
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    const width = (this.props.width || canvas.offsetWidth) * ratio;
    const height = (this.props.height || canvas.offsetHeight) * ratio;

    // Avoid needlessly setting height / width if dimensions haven't changed
    const { canvasWidth, canvasHeight } = this.state;

    if (width === canvasWidth && height === canvasHeight) return;

    let data;

    if (this.props.redrawOnResize && this.signaturePad && !this.signaturePad.isEmpty()) {
      data = this.signaturePad.toDataURL();
    }

    canvas.width = width;
    canvas.height = height;

    this.setState({ canvasWidth: width, canvasHeight: height });

    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.scale(ratio, ratio);
    }

    if (data) {
      this.signaturePad.fromDataURL(data);
    } else if (this.signaturePad) {
      this.signaturePad.clear();
    }
  }

  /**
   * Render the signature pad component.
   *
   * @return {ReactNode}
   */
  render(): React.ReactNode {
    const { canvasProps } = this.props;

    return <canvas data-testid="canvas-element" ref={this.canvasRef} {...canvasProps} />;
  }
}

export default SignaturePad;
