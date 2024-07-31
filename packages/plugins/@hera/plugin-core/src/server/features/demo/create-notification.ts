function notificationTemplate(lang) {
  return {
    'zh-CN': {
      name: 'demo',
      subject: 'TachyBase 体验站点开通成功！',
      body: `
      <p>地址：https://<%= appId %>.v7.demo-cn.tachybase.com/</p>
      <p>账号：admin@tachybase.com</p>
      <p>密码：admin123</p>
      <p>该站点仅用于体验，你在体验站点所做的操作、所存储的数据可能会丢失。</p>
      <p>该站点将会在 48 小时后失效，之后你可以重新申请体验站点。</p>
      `,
      receiver_options: {},
    },
    'en-US': {
      name: 'demo',
      subject: 'TachyBase demo site deployed successfully!',
      body: `
      <p>URL: https://<%= appId %>.v7.demo.tachybase.com/</p>
      <p>Account: admin@tachybase.com</p>
      <p>Password: admin123</p>
      <p>The site is for preview purposes only, your actions and data stored on the site may be lost.</p>
      <p>The site will expire after 48 hours, after which you can reapply for the site.</p>
      `,
      receiver_options: {},
    },
  }[lang || 'en-US'];
}

export async function createNotificationRecord(app) {
  await app.db.getRepository('notifications').create({
    values: {
      ...notificationTemplate(app.i18n.language || 'en-US'),
      service: {
        type: 'email',
        title: '阿里云邮件推送',
        options: {
          auth: {
            pass: process.env.ALIYUN_MAIL_AUTH_PASS,
            user: 'noreply@demo.tachybase.com',
          },
          from: 'TachyBase<noreply@demo.tachybase.com>',
          host: 'smtpdm.aliyun.com',
          port: 465,
          secure: true,
        },
      },
    },
  });
}
