FROM node:lts-alpine3.20

# 设置工作目录
WORKDIR /usr/src/app

# 复制 package.json 和 package-lock.json 或 pnpm-lock.yaml (如果有)
COPY package*.json ./

# 安装 pnpm（如果未安装）
RUN npm install -g pnpm

RUN rm -rf node_modules

# 安装依赖
RUN pnpm install

# 复制其他源代码
COPY . .

RUN pnpm build

# 暴露端口
EXPOSE 56554

# 默认启动命令
CMD ["pnpm", "start"]
