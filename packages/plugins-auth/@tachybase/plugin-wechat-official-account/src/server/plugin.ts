import crypto from 'crypto';
import { BasicAuth } from '@tachybase/plugin-auth';
import { Plugin } from '@tachybase/server';

import axios from 'axios';
import { Op } from 'sequelize';
import xml2js from 'xml2js';

import { authType } from '../constants';

export class PluginReplacePageServer extends Plugin {
  // 从数据库查询wechatConfig表
  async getWeChatConfig() {
    const repo = this.app.db.getRepository('wechatConfig');
    const config = await repo.findById(1);
    const { appid, appsecret, token, accesstoken, token_expires_at } = config.get();
    return { appid, appsecret, token, accesstoken, token_expires_at };
  }

  // 从数据库查询wechatMessage表
  async getWeChatMessage() {
    const repo = this.app.db.getRepository('wechatMessage');
    const messages = await repo.find();
    return messages;
  }

  // 从数据库查询wechatMenu表
  async getWeChatMenu() {
    const repo = this.app.db.getRepository('wechatMenu');

    // 查询三个一级菜单并按 createdAt 倒序排序
    const primaryMenus = await repo.find({
      where: { button: null },
      order: [['createdAt', 'DESC']],
      limit: 3,
    });

    // 查询所有二级菜单并按 createdAt 倒序排序
    const secondaryMenus = await repo.find({
      where: { button: { [Op.ne]: null } },
      order: [['createdAt', 'DESC']],
      limit: 5,
    });

    // 将数据库中的数据构建成菜单结构
    const menuStructure = { button: [] };

    // 反转一级菜单数组，以便从倒数第三新的开始处理
    const reversedPrimaryMenus = primaryMenus.reverse();

    // 处理一级菜单
    reversedPrimaryMenus.forEach((menu) => {
      if (!menu.button) {
        // 一级菜单
        let name = menu.name;
        if (Buffer.byteLength(name, 'utf8') > 12) {
          while (Buffer.byteLength(name, 'utf8') > 12 - 2) {
            // 预留2字节给省略号
            name = name.slice(0, -1);
          }
          name += '..';
        }
        menuStructure.button.push({
          type: menu.type,
          name: name,
          key: menu.key || undefined,
          url: menu.url || undefined,
          sub_button: [],
        });
      }
    });

    // 反转二级菜单数组
    const reversedSecondaryMenus = secondaryMenus.reverse();

    // 为一级菜单添加二级菜单
    reversedSecondaryMenus.forEach((menu) => {
      if (menu.button) {
        // 二级菜单
        const parentMenu = menuStructure.button.find((btn) => btn.name === menu.button);
        if (parentMenu) {
          let name = menu.name;
          if (Buffer.byteLength(name, 'utf8') > 32) {
            while (Buffer.byteLength(name, 'utf8') > 32 - 2) {
              // 预留2字节给省略号
              name = name.slice(0, -1);
            }
            name += '..';
          }
          parentMenu.sub_button.push({
            type: menu.type,
            name: name,
            key: menu.key || undefined,
            url: menu.url || undefined,
          });
        }
      }
    });
    return menuStructure;
  }

  // 从数据库查询wechatArticle表
  async getWeChatArticle() {
    const repo = this.app.db.getRepository('wechatArticle');
    const articles = await repo.find({ order: [['id', 'desc']], limit: 1 });
    if (articles.length > 0) {
      return articles[0];
    } else {
      this.app.logger.error('No articles found in the database');
      return null;
    }
  }

  // 验证Wechat平台的请求签名
  async checkSignature(query) {
    const { signature, timestamp, nonce } = query;
    const hash = crypto.createHash('sha1');
    const { token } = await this.getWeChatConfig(); // 获取配置的token，完成Wechat签名认证
    const str = [token, timestamp, nonce].sort().join('');
    hash.update(str);
    const result = hash.digest('hex') === signature;
    return result;
  }

  // 获取AccessToken
  async getAccessToken(forceRefresh = false) {
    const configRepo = this.app.db.getRepository('wechatConfig');
    const config = await this.getWeChatConfig();
    const { appid, appsecret, accesstoken, token_expires_at } = config;

    const now = Date.now();
    const bufferTime = 10 * 60 * 1000; // 提前10分钟，转换为毫秒

    // 判断是否需要刷新access token
    if (!forceRefresh && accesstoken && token_expires_at && now < token_expires_at - bufferTime) {
      return accesstoken;
    }

    const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${appsecret}`;

    try {
      const response = await axios.get(url);
      const newAccessToken = response.data.access_token;
      const expiresIn = response.data.expires_in * 1000; // 转换为毫秒
      const newTokenExpiresAt = now + expiresIn; // 实际过期时间

      await configRepo.update({
        filter: { id: 1 },
        values: { accesstoken: newAccessToken, token_expires_at: newTokenExpiresAt },
      });

      return newAccessToken;
    } catch (error) {
      this.app.logger.error(`Error getting access token: ${JSON.stringify(error)}`);
      return null;
    }
  }

  // 生成OAuth授权URL
  async generateAuthUrl() {
    const { appid } = await this.getWeChatConfig(); // 获取appid
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
      this.app.logger.error('Failed to generate OAuth URL');
      return null;
    }

    // TODO: 修改为前端使用库，生成授权二维码
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(authUrl)}&size=300x300`;
    return qrCodeUrl;
  }

  // 创建菜单
  async createCustomMenu() {
    const accessToken = await this.getAccessToken(); // 获取Wechat Token
    const menu = await this.getWeChatMenu(); // 获取菜单数据

    if (!accessToken) {
      this.app.logger.error('Failed to get access token');
      return;
    }

    const url = `https://api.weixin.qq.com/cgi-bin/menu/create?access_token=${accessToken}`;

    // 若通过accessToken验证，则发送Wechat请求，创建菜单
    try {
      const response = await axios.post(url, menu);
      this.app.logger.info(`Create menu response: ${JSON.stringify(response.data)}`);
    } catch (error) {
      this.app.logger.error(`Error creating menu: ${JSON.stringify(error)}`);
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

    const messages = await this.getWeChatMessage(); // 调用当前对象的 message方法
    const messagesList = messages.map((message) => `${message.id}、 ${message.key}`).join('\n');

    // TODO: 用户可以在前端配置默认回复
    // 可以把默认回复添加到wechat_cofig表里面
    let replyContent = `您好，欢迎关注道有云网络科技有限公司！您可以输入下面关键字来获取您要了解的信息！\n(输入序号或关键字)：\n${messagesList}`;

    // 解析 POST 请求的 XML 格式消息体
    xml2js.parseString(body, { explicitArray: false }, (err, result) => {
      if (err) {
        this.app.logger.error(`Error parsing XML: ${JSON.stringify(err)}`);
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

    if (!code) {
      ctx.status = 400;
      ctx.body = 'Authorization code not found';
      return;
    }

    try {
      const { appid, appsecret } = await this.getWeChatConfig();
      // 获取 access_token 和 openid
      const tokenUrl = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${appid}&secret=${appsecret}&code=${code}&grant_type=authorization_code`;

      const tokenResponse = await axios.get(tokenUrl);
      const { access_token, openid } = tokenResponse.data;

      if (!access_token || !openid) {
        throw new Error('Failed to get access token or openid');
      }

      const userInfoUrl = `https://api.weixin.qq.com/sns/userinfo?access_token=${access_token}&openid=${openid}&lang=zh_CN`;
      // 通过tokenUrl 获取用户message
      const userInfoResponse = await axios.get(userInfoUrl);

      // 用户信息
      const userInfo = userInfoResponse.data;

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
            username: openid.slice(-6),
            password: openid,
            nickname: userInfo.nickname,
          },
        });
        this.app.logger.info(`新用户已创建: ${JSON.stringify(userInfo.nickname)}`);
      } else {
        // 如果用户存在，直接登录
        this.app.logger.info(`用户已存在:' ${JSON.stringify(existingUser.nickname)}`);
      }

      // 这里可以设置登录态或返回登录成功的信息
      ctx.body = '完成注册，登录成功!';
    } catch (error) {
      this.app.logger.error(`Error handling OAuth callback: ${JSON.stringify(error)}`);
      ctx.status = 500;
      ctx.body = 'Server Error';
    }
  }

  // 从素材库获取素材列表
  async getMaterialList() {
    const accessToken = await this.getAccessToken(); // 获取WeChat的access token

    if (!accessToken) {
      this.app.logger.error('Failed to get access token');
      return null;
    }

    const url = `https://api.weixin.qq.com/cgi-bin/material/batchget_material?access_token=${accessToken}`;
    const data = {
      type: 'image', // 需要检查的素材类型，如：image, video, voice, news
      offset: 0,
      count: 20, // 每次获取的素材数量，可以根据需要调整
    };

    try {
      const response = await axios.post(url, data);
      if (response.data.item) {
        response.data.item.forEach((material) => {
          this.app.logger.info(
            `Media ID: ${JSON.stringify(material.media_id)}, Name: ${JSON.stringify(material.name)}, Update Time: ${JSON.stringify(material.update_time)}`,
          );
        });
        return response.data.item;
      } else {
        this.app.logger.error(`Failed to get material list: ${JSON.stringify(response.data)}`);
        return null;
      }
    } catch (error) {
      this.app.logger.error(`Error getting material list: ${JSON.stringify(error)}`);
      return null;
    }
  }

  // 检查素材是否为永久素材
  async checkMaterialType(mediaId) {
    const materials = await this.getMaterialList();
    if (materials) {
      const material = materials.find((item) => item.media_id === mediaId);
      if (material) {
        this.app.logger.info(`Material ID: ${JSON.stringify(mediaId)} is a permanent material.`);
        return true; // 表示是永久素材
      } else {
        this.app.logger.info(`Material ID: ${JSON.stringify(mediaId)} is not found in permanent materials.`);
        return false; // 表示不是永久素材
      }
    } else {
      this.app.logger.error('No materials found.');
      return false;
    }
  }

  // 更新articles表中的thumb_media_id字段
  async updateLatestArticleWithLatestMediaId() {
    const materialList = await this.getMaterialList();
    if (materialList && materialList.length > 0) {
      const latestMediaId = materialList[materialList.length - 1].media_id;

      // 获取articles表中的最后一条记录
      const repo = this.app.db.getRepository('wechatArticle');
      const articles = await repo.find({ order: [['id', 'desc']], limit: 1 });

      if (articles.length > 0) {
        const latestArticle = articles[0];
        await repo.update({
          filter: { id: latestArticle.id },
          values: { thumb_media_id: latestMediaId },
        });
        this.app.logger.info(
          `Article ${JSON.stringify(latestArticle.id)} thumb_media_id updated to ${JSON.stringify(latestMediaId)}`,
        );
      } else {
        this.app.logger.error('No articles found in the database');
      }
    } else {
      this.app.logger.error('No materials found in WeChat material list');
    }
  }

  // 上传图文到草稿箱
  async uploadNewsToDraft(article) {
    const isPermanent = await this.checkMaterialType(article.thumb_media_id);
    if (!isPermanent) {
      this.app.logger.error(`Thumb media ID: ${JSON.stringify(article.thumb_media_id)} is not a permanent material.`);
      return null;
    }

    const accessToken = await this.getAccessToken(); // 获取WeChat的access token

    if (!accessToken) {
      this.app.logger.error('Failed to get access token');
      return null;
    }

    const url = `https://api.weixin.qq.com/cgi-bin/draft/add?access_token=${accessToken}`;

    const articleData = {
      articles: [
        {
          title: article.title,
          thumb_media_id: article.thumb_media_id, // 确保这是一个永久素材的 thumb_media_id
          author: article.author,
          digest: article.digest || '',
          show_cover_pic: 1,
          content: article.content,
          content_source_url: article.content_source_url || '',
        },
      ],
    };

    try {
      const response = await axios.post(url, articleData);
      this.app.logger.info(`Upload news to draft response: ${JSON.stringify(response.data)}`);
      if (response.data.errcode) {
        this.app.logger.error(
          `Error code: ${JSON.stringify(response.data.errcode)}, message: ${JSON.stringify(response.data.errmsg)}`,
        );
        return null;
      }
      return response.data.media_id;
    } catch (error) {
      this.app.logger.error(`Error uploading news to draft: ${JSON.stringify(error)}`);
      return null;
    }
  }

  // 发送推文接口
  async sendNewsToAll(mediaId) {
    const accessToken = await this.getAccessToken();

    if (!accessToken) {
      this.app.logger.error('Failed to get access token');
      return null;
    }

    const url = `https://api.weixin.qq.com/cgi-bin/message/mass/sendall?access_token=${accessToken}`;

    const messageData = {
      filter: {
        is_to_all: true, // 发送给所有用户
      },
      mpnews: {
        media_id: mediaId,
      },
      msgtype: 'mpnews',
      send_ignore_reprint: 0,
    };

    try {
      const response = await axios.post(url, messageData);
      this.app.logger.info(`Send news response: ${JSON.stringify(response.data)}`);
      if (response.data.errcode) {
        this.app.logger.error(
          `Error code: ${JSON.stringify(response.data.errcode)}, message: ${JSON.stringify(response.data.errmsg)}`,
        );
        return null;
      }
      return response.data;
    } catch (error) {
      this.app.logger.error(`Error sending news: ${JSON.stringify(error)}`);
      return null;
    }
  }

  // 发布文章接口
  async publishLastArticleToWeChat() {
    const article = await this.getWeChatArticle(); // 获取最后一条文章

    if (article) {
      const mediaId = await this.uploadNewsToDraft(article); // 上传图文消息到草稿箱获取media_id

      if (mediaId) {
        const result = await this.sendNewsToAll(mediaId); // 使用media_id进行群发
        return result;
      }
    }
    return null;
  }

  // load() 生命周期函数，在插件加载时执行
  async load() {
    // 监听 message 表的 afterCreate 事件
    this.app.db.on('wechatMessage.afterCreate', this.handleMessageCreate.bind(this));
    // 监听 menu 表的 afterUpdate 事件
    this.app.db.on('wechatMenu.afterUpdate', this.handleMenuUpdate.bind(this));

    // 注册认证（前端显示按钮）
    this.app.authManager.registerTypes(authType, {
      auth: BasicAuth,
    });

    this.app.resourcer.define({
      name: 'wechat',
      actions: {
        // 创建菜单接口
        createMenu: async (ctx) => {
          await this.createCustomMenu();
          this.app.logger.info('Custom menu created successfully.');
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
            this.app.logger.info(`我是生成二维码接口的URL: ${JSON.stringify(qrCodeUrl)}`);
          } else {
            ctx.status = 500;
            ctx.body = 'Failed to generate QR code';
          }
        },
        // 处理OAuth回调接口
        handleOAuthCallback: async (ctx) => {
          await this.handleOAuthCallback(ctx);
        },
        // 获取素材列表并更新最新文章的封面图片接口
        updateLatestArticleWithLatestMediaId: async (ctx) => {
          await this.updateLatestArticleWithLatestMediaId();
          ctx.body = 'Latest article updated with latest media ID';
        },
        // 发布最新文章到微信公众号接口
        publishLastArticleToWeChat: async (ctx) => {
          const result = await this.publishLastArticleToWeChat();
          if (result) {
            ctx.body = 'Article published to WeChat successfully';
          } else {
            ctx.status = 500;
            ctx.body = 'Failed to publish article to WeChat';
          }
        },
      },
    });

    this.app.acl.allow('wechat', '*', 'public');
  }

  // 处理 message 表的 afterCreate 事件
  async handleMessageCreate(model, options) {
    const { id, key, value } = model.get();
    this.app.logger.info(`New message created: ${JSON.stringify(key)} - ${JSON.stringify(value)}`);

    // 获取所有关注公众号的用户 ID
    const userIds = await this.getAllFollowers();
    this.app.logger.info(`Follower IDs: ${JSON.stringify(userIds)}`);

    // 推送消息content
    await this.pushMessageToFollowers(userIds, `目前系统提示已经更新，大家可以使用新的关键字 "${key}" 来获取信息！`);
  }

  // 处理 menu 表的 afterUpdate 事件
  async handleMenuUpdate(model, options) {
    const { id, name } = model.get();
    this.app.logger.info(`Menu item updated: ${JSON.stringify(name)} (ID: ${JSON.stringify(id)})`);

    // 获取所有关注公众号的用户 ID
    const userIds = await this.getAllFollowers();
    this.app.logger.info(`Follower IDs: ${JSON.stringify(userIds)}`);

    // 推送消息content
    await this.pushMessageToFollowers(userIds, '用户你好，菜单项已经更新');
  }

  // 获取用户列表
  async getAllFollowers() {
    const accessToken = await this.getAccessToken();
    if (!accessToken) {
      this.app.logger.error('Failed to get access token');
      return [];
    }

    const url = `https://api.weixin.qq.com/cgi-bin/user/get?access_token=${accessToken}`;
    try {
      const response = await axios.get(url);
      if (response.data.errcode) {
        this.app.logger.error(`Error getting followers: ${JSON.stringify(response.data.errmsg)}`);
        return [];
      }
      return response.data.data.openid; // 返回关注者的OpenID数组
    } catch (error) {
      this.app.logger.error(`Error getting followers: ${JSON.stringify(error)}`);
      return [];
    }
  }

  // 给用户发送消息
  async pushMessageToFollowers(userIds, message) {
    const accessToken = await this.getAccessToken();
    if (!accessToken) {
      this.app.logger.error('Failed to get access token');
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
          this.app.logger.error(
            `Error pushing message to user ${JSON.stringify(userId)}: ${JSON.stringify(response.data.errmsg)}`,
          );
        } else {
          this.app.logger.info(`Message pushed to user ${JSON.stringify(userId)} successfully.`);
        }
      } catch (error) {
        this.app.logger.error(`Error pushing message to user ${JSON.stringify(userId)}: ${JSON.stringify(error)}`);
      }
    }
  }
}

export default PluginReplacePageServer;
