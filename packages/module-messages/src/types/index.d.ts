import { MessageService } from '../server/MessageManager';

// Inject messageManager
declare module '@tachybase/server' {
  interface Application {
    messageManager: MessageService;
  }
}
