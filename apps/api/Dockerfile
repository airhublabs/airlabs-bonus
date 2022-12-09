FROM public.ecr.aws/docker/library/node:16-alpine as builder

RUN apk add --update python3 make g++ && rm -rf /var/cache/apk/*

WORKDIR /app

# COPY & INSTALL PACKGES
COPY ./package*.json ./
RUN npm install --force

COPY ./tsconfig.base.json ./
COPY ./nx.json ./
COPY ./prisma ./prisma
COPY /apps/api ./apps/api

# COPY REQUIRED PACKAGES
COPY /libs/types ./libs/types
COPY /libs/utils ./libs/utils
COPY /libs/bonus-calculator ./libs/bonus-calculator

# BUILD
RUN npx prisma generate
# RUN npx prisma migrate deploy
RUN npx nx build --project=api
COPY ./prisma ./dist/apps/api

# PRODUCTION STAGE
FROM public.ecr.aws/docker/library/node:16-alpine

ENV NODE_ENV=production
WORKDIR /app

COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/dist ./dist

RUN npm install --prefix ./dist/apps/api --only=production --force
RUN (cd ./dist/apps/api && npx prisma generate)

EXPOSE 5000

CMD ["node", "dist/apps/api/main.js"]
