# Stage1: UI Build
FROM node:14-alpine AS client-build
WORKDIR /usr/src
COPY /client ./client
RUN cd client && npm install && npm run build

# Stage2: API Build
FROM node:14-alpine AS api-build
WORKDIR /usr/src
COPY . .
RUN npm install && ENVIRONMENT=production
RUN ls

# Stage3: Packaging the app
FROM node:14-alpine
WORKDIR /root/
COPY --from=client-build /usr/src/client/build ./client/build
COPY --from=api-build /usr/src/ .
RUN ls

EXPOSE 8000

CMD ["node", "server.js"]