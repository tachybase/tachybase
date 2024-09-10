const user = {
  type: 'object',
  description: '用户',
  properties: {
    id: {
      type: 'integer',
      description: 'ID',
    },
    nickname: {
      type: 'string',
      description: '昵称',
    },
    email: {
      type: 'string',
      description: '邮箱',
    },
    phone: {
      type: 'string',
      description: '手机号',
    },
    appLang: {
      type: 'string',
      description: '用户使用语言',
    },
    systemSettings: {
      type: 'object',
      description: '系统设置',
      properties: {
        theme: {
          type: 'string',
          description: '用户使用主题',
        },
      },
    },
    createdAt: {
      type: 'string',
      format: 'date-time',
      description: '创建时间',
    },
    updatedAt: {
      type: 'string',
      format: 'date-time',
      description: '更新时间',
    },
    createdById: {
      type: 'integer',
      description: '创建人',
    },
    updatedById: {
      type: 'integer',
      description: '更新人',
    },
  },
};

export default {
  info: {
    title: 'TachyBase API - WeChat Auth plugin',
  },
  paths: {
    '/wechatAuth:getAuthCfg': {
      security: [],
      get: {
        description: 'Get WeChat authorization configuration',
        tags: ['WeChat'],
        parameters: [
          {
            name: 'X-Authenticator',
            description: '登录方式标识',
            in: 'header',
            schema: {
              type: 'string',
            },
            required: true,
          },
        ],
        responses: {
          200: {
            description: 'ok',
            content: {
              'application/json': {
                schema: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
    '/wechatAuth:signIn': {
      security: [],
      post: {
        description: 'WeChat sign in',
        tags: ['WeChat'],
        parameters: [
          {
            name: 'X-Authenticator',
            description: '登录方式标识',
            in: 'header',
            schema: {
              type: 'string',
            },
            required: true,
          },
          {
            name: 'tachybase_wechat_auth',
            description: 'state校验值',
            in: 'cookie',
            schema: {
              type: 'string',
            },
            required: true,
          },
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  code: {
                    type: 'string',
                  },
                  state: {
                    type: 'string',
                  },
                  iss: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'ok',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    token: {
                      type: 'string',
                    },
                    user,
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};
