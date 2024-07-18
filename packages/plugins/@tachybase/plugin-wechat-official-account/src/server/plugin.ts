import crypto from 'crypto';
import { Plugin } from '@tachybase/server';

import axios from 'axios';
import xml2js from 'xml2js';

export class PluginReplacePageServer extends Plugin {
  // 从数据库查询cofig表
  async config(): Promise<any> {
    const repo = this.app.db.getRepository('config');
    const config = (await repo.findById(1)) as any;
    return config.get(); // get()返回具体的data
  }

  // 从数据库查询message表
  async message(): Promise<any[]> {
    const repo = this.app.db.getRepository('message');
    const messages = (await repo.find()) as any;
    return messages; // 返回数组Type
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

    try {
      const response = await axios.get(url);
      return response.data.access_token;
    } catch (error) {
      console.error('Error getting access token:', error);
      return null;
    }
  }

  // 创建菜单
  async createCustomMenu() {
    const accessToken = await this.getAccessToken(); // 获取Wechat Token

    if (!accessToken) {
      console.error('Failed to get access token');
      return;
    }

    const url = `https://api.weixin.qq.com/cgi-bin/menu/create?access_token=${accessToken}`;
    const menu = {
      button: [
        {
          type: 'view',
          name: '音乐',
          url: 'https://music.163.com/', // 确保这个 URL 不超过 256 个字符
        },
        {
          type: 'view',
          name: '官网',
          url: 'https://daoyoucloud.com/',
        },
        {
          name: '服务',
          sub_button: [
            {
              type: 'view',
              name: '正在开发中...',
              url: 'https://daoyoucloud.com/coming-soon',
            },
            {
              type: 'view',
              name: '开发者管理',
              url: 'https://lu.dev.daoyoucloud.com/',
            },
          ],
        },
      ],
    };

    // 若通过accessToken验证，则发送Wechat请求，创建菜单
    try {
      const response = await axios.post(url, menu);
      console.log('Create menu response:', response.data);
    } catch (error) {
      console.error('Error creating menu:', error);
    }
  }

  // Wechat从用户这里获取签名， 若通过则允许后续交互
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
    // const keywordsList = keywords.map(keyword => keyword.keywords).join(`${keywords}`);
    const messagesList = messages.map((message, index) => `${index + 1}、 ${message.key}`).join('\n');

    let replyContent = `您好，欢迎关注道有云网络科技有限公司！您可以输入下面关键字来获取您要了解的信息！\n(输入序号即可)：\n${messagesList}`; // 默认回复内容

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

      if (msg.MsgType === 'text') {
        // 处理文本信息

        // 匹配用户输入的关键字和message表里的messages字段是否一致，一致则 filter()出一个数组
        const values = messages.filter((message) => msg.Content.includes(message.id));
        if (values?.length > 0) {
          // 问号? 异常处理
          replyContent = values[0].value;
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

  // 加载
  async load() {
    // load() 生命周期函数，在插件加载时执行
    // 定义资源动作
    this.app.resourcer.define({
      name: 'wechat',
      actions: {
        test: async (ctx) => {
          ctx.withoutDataWrapping = true;
          ctx.body = 'Hello World!';
          console.log('Hello World!');
        },
        createMenu: async (ctx) => {
          await this.createCustomMenu();
          console.log('Custom menu created successfully.');
          ctx.body = 'success';
        },
        handler: async (ctx) => {
          ctx.withoutDataWrapping = true;
          if (ctx.request.method.toLowerCase() === 'get') {
            //toLowerCase()转换字符串为小写
            await this.get(ctx);
          } else {
            await this.post(ctx);
          }
        },
      },
    });

    this.app.acl.allow('wechat', '*', 'public'); // 实体名称，允许所有资源，公共级别访问
  }
}

export default PluginReplacePageServer;
