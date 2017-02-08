# Development
FROM node:7.3.0

RUN npm install -g nodemon

# package.json changes will require image rebuild that way
RUN mkdir -p /usr/src/<%= appName%>
ADD package.json /usr/src/<%= appName%>/package.json
WORKDIR /usr/src/<%= appName%>
RUN npm install
