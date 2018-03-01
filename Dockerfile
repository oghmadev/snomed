ARG NODE_VERSION
FROM node:${NODE_VERSION}
WORKDIR /usr/app/snomed
RUN ["npm", "install", "-g", "gulp-cli"]
CMD ["gulp", "serve"]
