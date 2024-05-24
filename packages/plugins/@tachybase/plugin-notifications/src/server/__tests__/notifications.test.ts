import Database from '@tachybase/database';
import { createMockServer } from '@tachybase/test';

import nodemailerMock from 'nodemailer-mock';

import { Notification, NotificationService } from '../models';

describe('notifications', () => {
  let db: Database;

  let app;
  beforeEach(async () => {
    app = await createMockServer({
      plugins: ['notifications'],
    });
    db = app.db;
    NotificationService.createTransport = nodemailerMock.createTransport;
  });

  afterEach(() => app.destroy());

  it('create', async () => {
    const Notification = db.getCollection('notifications');
    const notification = (await Notification.repository.create({
      values: {
        subject: 'Subject',
        body: 'hell world',
        receiver_options: {
          data: 'to@tachybase.com',
          fromTable: 'users',
          filter: {},
          dataField: 'email',
        },
        service: {
          type: 'email',
          title: '阿里云邮件推送',
          options: {
            host: 'smtpdm.aliyun.com',
            port: 465,
            secure: true,
            auth: {
              user: 'from@tachybase.com',
              pass: 'pass',
            },
            from: 'TachyBase<from@tachybase.com>',
          },
        },
      },
    })) as Notification;
    await notification.send();
  });
});
