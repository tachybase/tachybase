export type IMessage = {
  title: string;
  content: string;
  schemaName?: string;
};

export interface IMessageService {
  sendMessage: (receiverId: number, message: IMessage) => void;
}
