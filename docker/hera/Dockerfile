# 设置基础镜像
FROM node:20.9.0 as builder

# 在容器中创建/app/nocobase目录
WORKDIR /app/nocobase

# 设置npm和pnpm的registry为https://registry.npmmirror.com
RUN npm config set registry https://registry.npmmirror.com && \
    yarn config set registry https://registry.npmmirror.com

# 将当前目录中的所有文件复制到容器的/app/nocobase目录下
COPY . /app/nocobase

# 使用 pnpm 安装依赖
RUN yarn
RUN yarn build

# 使用 pm2-runtime 执行packages/core/app/lib/index.js文件
CMD ["yarn", "pm2-runtime", "packages/core/app/lib/index.js", "--", "start"]
