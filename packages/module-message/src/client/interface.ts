export abstract class Channel {
  name: string;
  title: string;
  isServer?: boolean;
  send?(message: any): void; // send message to channel
  useAction?(): any;
}
