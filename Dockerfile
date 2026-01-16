# syntax=docker/dockerfile:1

# ---- 基础镜像 ----
FROM node:24-alpine AS base

# 安装 pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# 设置工作目录
WORKDIR /app

# ---- 依赖安装阶段 ----
FROM base AS deps

# 复制依赖配置文件
COPY package.json pnpm-lock.yaml ./

# 安装依赖（包括 better-sqlite3 的原生依赖）
RUN apk add --no-cache python3 make g++ && \
    pnpm install --frozen-lockfile

# ---- 构建阶段 ----
FROM base AS builder

WORKDIR /app

# 复制依赖
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 构建 Next.js 应用
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm build

# ---- 生产运行阶段 ----
FROM node:24-alpine AS runner

WORKDIR /app

# 设置环境变量
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# 创建非 root 用户
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# 复制必要的文件
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# 复制 better-sqlite3 原生模块（Next.js standalone 不会自动包含）
COPY --from=builder /app/node_modules/better-sqlite3 ./node_modules/better-sqlite3

# 创建数据目录并设置权限
RUN mkdir -p /app/data && chown -R nextjs:nodejs /app

# 切换到非 root 用户
USER nextjs

# 暴露端口
EXPOSE 3000

# 启动命令
CMD ["node", "server.js"]
