// --10、解决数据库注册插入问题
import crypto from 'crypto';
import { BasicAuth } from '@tachybase/plugin-auth';
import { Plugin } from '@tachybase/server';

import axios from 'axios';
import xml2js from 'xml2js';

import { authType } from '../constants';

export class PluginReplacePageServer extends Plugin {
  // 从数据库查询config表
  async config() {
    const repo = this.app.db.getRepository('config');
    const config = await repo.findById(1);
    return config.get();
  }

  // 从数据库查询message表
  async message() {
    const repo = this.app.db.getRepository('message');
    const messages = await repo.find();
    return messages;
  }

  // 从数据库查询menu表
  async menu() {
    const repo = this.app.db.getRepository('menu');
    const menus = await repo.find();

    // 将数据库中的数据构建成菜单结构
    const menuStructure = { button: [] };

    menus.forEach((menu) => {
      if (!menu.button) {
        // 一级菜单
        if (menuStructure.button.length < 3) {
          if (Buffer.byteLength(menu.name, 'utf8') <= 16) {
            menuStructure.button.push({
              type: menu.type,
              name: menu.name,
              key: menu.key || undefined,
              url: menu.url || undefined,
              sub_button: [],
            });
          } else {
            console.warn(`一级菜单名称 "${menu.name}" 超过了 16 个字节的限制`);
          }
        } else {
          console.warn('超过了一级菜单的数量限制');
        }
      } else {
        // 二级菜单
        const parentMenu = menuStructure.button.find((btn) => btn.name === menu.button);
        if (parentMenu) {
          if (parentMenu.sub_button.length < 5) {
            if (Buffer.byteLength(menu.name, 'utf8') <= 40) {
              parentMenu.sub_button.push({
                type: menu.type,
                name: menu.name,
                key: menu.key || undefined,
                url: menu.url || undefined,
              });
            } else {
              console.warn(`二级菜单名称 "${menu.name}" 超过了 40 个字节的限制`);
            }
          } else {
            console.warn('超过了二级菜单的数量限制');
          }
        }
      }
    });

    console.log('-------------', JSON.stringify(menuStructure, null, 2));
    return menuStructure;
  }

  // 验证Wechat平台的请求签名
  async checkSignature(query) {
    const { signature, timestamp, nonce } = query;
    const hash = crypto.createHash('sha1');
    const { token } = await this.config(); // 获取配置的token，完成Wechat签名认证
    const str = [token, timestamp, nonce].sort().join('');
    hash.update(str);
    const result = hash.digest('hex') === signature;
    return result;
  }

  // 获取Wechat-Token
  async getAccessToken() {
    const { appid, appsecret } = await this.config(); // 使用config方法 查询config表
    const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${appsecret}`;

    console.log(`Fetching access token from URL: ${url}`);
    console.log(`App ID: ${appid}, App Secret: ${appsecret}`);

    try {
      const response = await axios.get(url);
      console.log('Access token response:', response.data);
      return response.data.access_token;
    } catch (error) {
      console.error('Error getting access token:', error);
      return null;
    }
  }

  // 生成OAuth授权URL
  async generateAuthUrl() {
    const { appid } = await this.config(); // 获取appid
    const redirectUri = encodeURIComponent('https://lu.dev.daoyoucloud.com/api/wechat@handleOAuthCallback');
    const scope = 'snsapi_userinfo'; // 获取用户信息的权限
    const state = 'STATE'; // 自定义的state参数

    const authUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&state=${state}#wechat_redirect`;
    return authUrl;
  }

  // 生成二维码URL
  async generateQrCode() {
    const authUrl = await this.generateAuthUrl();
    if (!authUrl) {
      console.error('Failed to generate OAuth URL');
      return null;
    }

    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(authUrl)}&size=300x300`;
    return qrCodeUrl;
  }

  // 创建菜单
  async createCustomMenu() {
    const accessToken = await this.getAccessToken(); // 获取Wechat Token
    const menu = await this.menu(); // 获取菜单数据

    if (!accessToken) {
      console.error('Failed to get access token');
      return;
    }

    const url = `https://api.weixin.qq.com/cgi-bin/menu/create?access_token=${accessToken}`;

    // 若通过accessToken验证，则发送Wechat请求，创建菜单
    try {
      const response = await axios.post(url, menu);
      console.log('Create menu response:', response.data);
    } catch (error) {
      console.error('Error creating menu:', error);
    }
  }

  // Wechat从用户这里获取签名，若通过则允许后续交互
  async get(ctx) {
    const { query } = ctx.request;
    if (await this.checkSignature(query)) {
      ctx.body = query.echostr;
    } else {
      ctx.status = 403;
    }
  }

  // 微信向服务发送post请求
  async post(ctx) {
    const { query, body } = ctx.request;
    // Wechat从用户这里获取签名
    if (!(await this.checkSignature(query))) {
      ctx.status = 403;
      ctx.body = 'Forbidden';
      return;
    }

    const messages = await this.message(); // 调用当前对象的 message方法
    const messagesList = messages.map((message) => `${message.id}、 ${message.key}`).join('\n');

    let replyContent = `您好，欢迎关注道有云网络科技有限公司！您可以输入下面关键字来获取您要了解的信息！\n(输入序号或关键字)：\n${messagesList}`;

    // 解析 POST 请求的 XML 格式消息体
    xml2js.parseString(body, { explicitArray: false }, (err, result) => {
      if (err) {
        console.error('Error parsing XML:', err);
        ctx.status = 500;
        ctx.body = 'Server Error';
        return;
      }

      const msg = result.xml;
      let replyMessage; // 处理用户输入后的回复结果

      if (msg.MsgType === 'event' && msg.Event === 'SCAN') {
        // 处理扫码事件
        replyContent = '扫码成功，欢迎您！';
        replyMessage = `
          <xml>
            <ToUserName><![CDATA[${msg.FromUserName}]]></ToUserName>
            <FromUserName><![CDATA[${msg.ToUserName}]]></FromUserName>
            <CreateTime>${Math.floor(Date.now() / 1000)}</CreateTime>
            <MsgType><![CDATA[text]]></MsgType>
            <Content><![CDATA[${replyContent}]]></Content>
          </xml>
        `;
      } else if (msg.MsgType === 'text') {
        // 处理文本信息
        const valueById = messages.find((message) => msg.Content.includes(message.id.toString()));
        const valueByKey = messages.find((message) => msg.Content.includes(message.key));

        // 异常处理
        if (valueById) {
          replyContent = valueById.value;
        } else if (valueByKey) {
          replyContent = valueByKey.value;
        }

        replyMessage = `
          <xml>
            <ToUserName><![CDATA[${msg.FromUserName}]]></ToUserName>
            <FromUserName><![CDATA[${msg.ToUserName}]]></FromUserName>
            <CreateTime>${Math.floor(Date.now() / 1000)}</CreateTime>
            <MsgType><![CDATA[text]]></MsgType>
            <Content><![CDATA[${replyContent}]]></Content>
          </xml>
        `;
      } else if (msg.MsgType === 'image') {
        // 处理图像信息
        replyMessage = `
          <xml>
            <ToUserName><![CDATA[${msg.FromUserName}]]></ToUserName>
            <FromUserName><![CDATA[${msg.ToUserName}]]></FromUserName>
            <CreateTime>${Math.floor(Date.now() / 1000)}</CreateTime>
            <MsgType><![CDATA[image]]></MsgType>
            <Image>
              <MediaId><![CDATA[${msg.MediaId}]]></MediaId>
            </Image>
          </xml>
        `;
      } else {
        // 处理非文本和非图像信息
        replyMessage = `
          <xml>
            <ToUserName><![CDATA[${msg.FromUserName}]]></ToUserName>
            <FromUserName><![CDATA[${msg.ToUserName}]]></FromUserName>
            <CreateTime>${Math.floor(Date.now() / 1000)}</CreateTime>
            <MsgType><![CDATA[text]]></MsgType>
            <Content><![CDATA[对不起，我只支持文本和图片消息。]]></Content>
          </xml>
        `;
      }
      ctx.type = 'application/xml';
      ctx.body = replyMessage;
    });
  }

  // 处理OAuth回调
  async handleOAuthCallback(ctx) {
    const { code } = ctx.query;
    console.log('code---:', code);

    if (!code) {
      ctx.status = 400;
      ctx.body = 'Authorization code not found';
      return;
    }

    try {
      const { appid, appsecret } = await this.config();
      console.log('appid---:', appid);
      console.log('appsecret---:', appsecret);
      // 获取 access_token 和 openid
      const tokenUrl = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${appid}&secret=${appsecret}&code=${code}&grant_type=authorization_code`;

      const tokenResponse = await axios.get(tokenUrl);
      const { access_token, openid } = tokenResponse.data;
      console.log('access_token---:', access_token, '\n openid---:', openid);

      if (!access_token || !openid) {
        throw new Error('Failed to get access token or openid');
      }

      const userInfoUrl = `https://api.weixin.qq.com/sns/userinfo?access_token=${access_token}&openid=${openid}&lang=zh_CN`;
      // 通过tokenUrl 获取用户message
      const userInfoResponse = await axios.get(userInfoUrl);

      // 用户信息
      const userInfo = userInfoResponse.data;
      console.log('用户信息:', userInfo);

      // 检查数据库中是否存在该用户
      const userRepo = this.app.db.getRepository('users');
      const existingUser = await userRepo.findOne({
        filter: {
          username: openid,
        },
      });

      if (!existingUser) {
        // 如果用户不存在，则插入新用户
        await userRepo.create({
          values: {
            username: openid.substring(0, 6),
            password: openid,
            nickname: userInfo.nickname,
          },
        });
        console.log('新用户已创建:', userInfo.nickname);
      } else {
        // 如果用户存在，直接登录
        console.log('用户已存在:', existingUser.nickname);
      }

      // 这里可以设置登录态或返回登录成功的信息
      ctx.body = '完成注册，登录成功!';
      // 返回手机端页面
      // ctx.redirect('https://lu.dev.daoyoucloud.com/admin/4tr7gnzlwni');
    } catch (error) {
      console.error('Error handling OAuth callback:', error);
      ctx.status = 500;
      ctx.body = 'Server Error';
      // ctx.body = '您已存在账户，登录成功!';
    }
  }

  // load() 生命周期函数，在插件加载时执行
  async load() {
    // 监听 message 表的 afterCreate 事件
    this.app.db.on('message.afterCreate', this.handleMessageCreate.bind(this));
    // 监听 menu 表的 afterUpdate 事件
    this.app.db.on('menu.afterUpdate', this.handleMenuUpdate.bind(this));

    // 注册认证（前端显示按钮）
    this.app.authManager.registerTypes(authType, {
      auth: BasicAuth,
    });

    // 定义资源动作
    this.app.resourcer.define({
      name: 'wechat',
      actions: {
        // 测试接口
        test: async (ctx) => {
          ctx.withoutDataWrapping = true;
          ctx.body = 'Hello World!';
          console.log('Hello World!');
        },
        // 创建菜单接口
        createMenu: async (ctx) => {
          await this.createCustomMenu();
          console.log('Custom menu created successfully.');
          ctx.body = 'success';
        },
        // Wechat 消息处理接口/服务器URL配置接口
        handler: async (ctx) => {
          ctx.withoutDataWrapping = true;
          if (ctx.request.method.toLowerCase() === 'get') {
            await this.get(ctx);
          } else {
            await this.post(ctx);
          }
        },
        // 生成二维码接口
        generateQrCode: async (ctx) => {
          const qrCodeUrl = await this.generateQrCode();
          if (qrCodeUrl) {
            ctx.body = { data: { url: qrCodeUrl } }; // 确保返回的数据格式正确
            console.log(`我是生成二维码接口的URL: ${qrCodeUrl}`);
          } else {
            ctx.status = 500;
            ctx.body = 'Failed to generate QR code';
          }
        },
        // 处理OAuth回调接口
        handleOAuthCallback: async (ctx) => {
          await this.handleOAuthCallback(ctx);
        },
      },
    });

    this.app.acl.allow('wechat', '*', 'public');
  }

  // 处理 message 表的 afterCreate 事件
  async handleMessageCreate(model, options) {
    const { id, key, value } = model.get();
    console.log(`New message created: ${key} - ${value}`);

    // 获取所有关注公众号的用户 ID
    const userIds = await this.getAllFollowers();
    console.log('Follower IDs:', userIds);

    // 推送消息content
    await this.pushMessageToFollowers(userIds, `目前系统提示已经更新，大家可以使用新的关键字 "${key}" 来获取信息！`);
  }

  // 处理 menu 表的 afterUpdate 事件
  async handleMenuUpdate(model, options) {
    const { id, name } = model.get();
    console.log(`Menu item updated: ${name} (ID: ${id})`);

    // 获取所有关注公众号的用户 ID
    const userIds = await this.getAllFollowers();
    console.log('Follower IDs:', userIds);

    // 推送消息content
    await this.pushMessageToFollowers(userIds, '用户你好，菜单项已经更新');
  }

  // 获取用户列表
  async getAllFollowers() {
    const accessToken = await this.getAccessToken();
    if (!accessToken) {
      console.error('Failed to get access token');
      return [];
    }

    const url = `https://api.weixin.qq.com/cgi-bin/user/get?access_token=${accessToken}`;
    try {
      const response = await axios.get(url);
      if (response.data.errcode) {
        console.error(`Error getting followers: ${response.data.errmsg}`);
        return [];
      }
      console.log('返回用户ID数组----');
      return response.data.data.openid; // 返回关注者的OpenID数组
    } catch (error) {
      console.error('Error getting followers:', error);
      return [];
    }
  }

  // 给用户发送消息
  async pushMessageToFollowers(userIds, message) {
    const accessToken = await this.getAccessToken();
    if (!accessToken) {
      console.error('Failed to get access token');
      return;
    }

    const url = `https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token=${accessToken}`;

    for (const userId of userIds) {
      const data = {
        touser: userId,
        msgtype: 'text',
        text: {
          content: message,
        },
      };

      // 调用Wechat API对用户发送消息
      try {
        const response = await axios.post(url, data);
        if (response.data.errcode) {
          console.error(`Error pushing message to user ${userId}: ${response.data.errmsg}`);
        } else {
          console.log(`Message pushed to user ${userId} successfully.`);
        }
      } catch (error) {
        console.error(`Error pushing message to user ${userId}:`, error);
      }
    }
  }
}

export default PluginReplacePageServer;
