import { connect, mapProps, mapReadPretty } from '@tachybase/schema';

import { Slider as AntSlider } from 'antd';

import { ReadPretty } from '../input-number/ReadPretty';

type SliderProps = {};

export const Slider: SliderProps = connect(
  (props: any) => {
    return <AntSlider {...props} />;
  },
  mapProps((props) => {
    return {
      ...props,
    };
  }),
  mapReadPretty(ReadPretty),
);

export default Slider;
