export abstract class Channel {
  name: string;
  title: string;
  send?(message: any): void; // send message to channel
  useAction?(): any;
}
