FROM public.ecr.aws/docker/library/node:16-alpine as builder

# Install Python
RUN apk add --update python3 make g++ && rm -rf /var/cache/apk/*

WORKDIR /app

# COPY REQUIRED ROOT FOLDERS
COPY ./package*.json ./
RUN npm install --force

COPY ./apps/backoffice/package*.json ./apps/backoffice/
COPY ./tsconfig.base.json ./
COPY ./nx.json ./
COPY  /apps/backoffice ./apps/backoffice

# COPY NEEDED PACKAGES
COPY /libs/data-access ./libs/data-access
COPY /libs/bonus-calculator ./libs/bonus-calculator
COPY /libs/types ./libs/types
COPY /libs/utils ./libs/utils

RUN npx nx build --project=backoffice

# PRODUCTION STAGE
FROM public.ecr.aws/docker/library/node:16-alpine

WORKDIR /app

ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

COPY --from=builder /app/dist ./dist

WORKDIR /app/dist/apps/backoffice
RUN npm install --only=production

EXPOSE 3000

CMD ["npm", "start"]


