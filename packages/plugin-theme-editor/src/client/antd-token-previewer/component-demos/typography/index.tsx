import type { ComponentDemo } from '../../interface';
import error from './error';
import Heading4 from './Heading4';
import success from './success';
import TypographyDemo from './typography';
import warning from './warning';

const previewerDemo: ComponentDemo[] = [TypographyDemo, Heading4, error, warning, success];

export default previewerDemo;
