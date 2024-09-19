import React from 'react';
import { Icon, Plugin } from '@tachybase/client';

import { tval } from '../../locale';
import { WebhookManager } from './WebhookManager';

const DispatcherSvg = () => (
  <svg viewBox="0 0 1024 1024" width="1em" height="1em">
    <path
      d="M979.689326 108.982857H356.219611A144.530286 144.530286 0 0 0 217.028754 0c-64.804571 0.731429-121.124571 45.348571-137.654857 108.982857H44.045897a36.571429 36.571429 0 0 0-37.814857 15.798857 37.741714 37.741714 0 0 0 0 41.545143 36.571429 36.571429 0 0 0 37.814857 15.798857h35.328c15.945143 64.219429 72.411429 109.494857 137.654857 110.445715a144.530286 144.530286 0 0 0 139.117715-108.982858h623.542857a37.156571 37.156571 0 0 0 29.549714-36.571428 37.156571 37.156571 0 0 0-29.549714-36.571429v-1.462857zM144.909897 146.285714c0-40.374857 32.329143-73.142857 72.118857-73.142857s72.118857 32.768 72.118857 73.142857c0 19.382857-7.606857 38.034286-21.211428 51.712A71.533714 71.533714 0 0 1 217.101897 219.428571a72.630857 72.630857 0 0 1-72.118857-73.142857z m834.779429 694.125715H356.219611A144.530286 144.530286 0 0 0 217.028754 731.428571c-64.804571 0.731429-121.124571 45.348571-137.654857 108.982858H44.045897a36.571429 36.571429 0 0 0-37.814857 15.798857 37.741714 37.741714 0 0 0 0 41.545143 36.571429 36.571429 0 0 0 37.814857 15.798857h35.328c15.945143 64.219429 72.411429 109.494857 137.654857 110.445714a144.530286 144.530286 0 0 0 139.117715-108.982857h623.542857a36.571429 36.571429 0 0 0 37.814857-15.798857 37.741714 37.741714 0 0 0 0-41.545143 36.571429 36.571429 0 0 0-37.814857-15.798857v-1.462857zM144.909897 877.714286c0-40.374857 32.329143-73.142857 72.118857-73.142857s72.118857 32.768 72.118857 73.142857c0 19.382857-7.606857 38.034286-21.211428 51.712a71.533714 71.533714 0 0 1-50.907429 21.430857 72.630857 72.630857 0 0 1-72.118857-73.142857zM43.972754 474.697143h623.616A144.530286 144.530286 0 0 1 806.706469 365.714286c64.804571 0.731429 121.124571 45.348571 137.654857 108.982857h34.596571a36.571429 36.571429 0 0 1 37.814857 15.798857 37.741714 37.741714 0 0 1 0 41.545143 36.571429 36.571429 0 0 1-37.814857 15.798857h-34.596571A144.603429 144.603429 0 0 1 806.779611 658.285714a144.530286 144.530286 0 0 1-139.117714-108.982857H44.045897a36.571429 36.571429 0 0 1-37.814857-15.798857 37.741714 37.741714 0 0 1 0-41.545143 36.571429 36.571429 0 0 1 37.814857-15.798857v-1.462857zM807.803611 585.142857a73.142857 73.142857 0 1 0 0-146.285714 73.142857 73.142857 0 0 0 0 146.285714z"
      fill="#000000"
      opacity=".65"
    ></path>
  </svg>
);

const DesignSvg = () => (
  <svg viewBox="0 0 1024 1024" width="1em" height="1em">
    <path d="M832.256 133.162667l60.330667 60.373333a128 128 0 0 1 0 180.992l-108.16 108.202667 119.765333 119.765333a128 128 0 0 1 0 181.034667l-120.661333 120.661333a128 128 0 0 1-181.034667 0l-119.765333-119.765333-93.866667 93.866666a42.666667 42.666667 0 0 1-21.802667 11.648L140.757333 935.253333a42.666667 42.666667 0 0 1-50.176-50.218666l45.226667-226.261334a42.666667 42.666667 0 0 1 11.690667-21.76L651.221333 133.12a128 128 0 0 1 181.034667 0z m-93.098667 394.794666l-211.2 211.2 36.821334 36.821334 45.269333-45.226667a32 32 0 0 1 48.341333 41.642667l-3.072 3.584-45.226666 45.226666 37.674666 37.76a64 64 0 0 0 85.632 4.394667l4.864-4.394667 120.704-120.704a64 64 0 0 0 4.394667-85.632l-4.394667-4.864-119.808-119.808z m-155.818666-236.373333l-386.048 386.048-37.674667 188.586667 188.544-37.76 386.048-386.048-150.869333-150.826667zM415.36 114.048l6.144 5.76 121.557333 121.557333-45.226666 45.226667-121.6-121.557333a64 64 0 0 0-85.632-4.394667l-4.864 4.394667-120.704 120.704a64 64 0 0 0-4.394667 85.632l4.394667 4.864 37.717333 37.717333L278.186667 338.517333a32 32 0 0 1 48.341333 41.685334l-3.072 3.584-75.434667 75.434666 38.613334 38.570667-45.269334 45.226667-121.6-121.514667a128 128 0 0 1-5.717333-174.890667l5.76-6.144 120.661333-120.661333a128 128 0 0 1 174.890667-5.76z m281.173333 64.384l-67.925333 67.882667 150.869333 150.869333 67.84-67.882667a64 64 0 0 0 0-90.538666l-60.330666-60.330667a64 64 0 0 0-90.453334 0z"></path>
  </svg>
);

const Dispatcher = (props) => <Icon component={DispatcherSvg} {...props} />;
const Design = (props) => <Icon component={DesignSvg} {...props} />;

Icon.register({ Dispatcher, Design });

export class PluginWebhook extends Plugin {
  async load() {
    this.app.pluginSettingsManager.add('workflow.webhook', {
      title: tval('Dispatcher'),
      icon: 'Dispatcher',
      Component: WebhookManager,
    });
  }
}
