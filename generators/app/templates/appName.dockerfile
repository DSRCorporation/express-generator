# Development
FROM node:7.3.0

RUN npm install -g nodemon
<% if (locals.usePostgres) {%>
RUN apt-get update && apt-get install -y postgresql
<%}%>
<% if (locals.useMysql) {%>
RUN apt-get update && apt-get install -y mysql-client
<%}%>
# package.json changes will require image rebuild that way
RUN mkdir -p /usr/src/<%= appName%>
ADD package.json /usr/src/<%= appName%>/package.json
<% if (locals.useSequelize) {%>
ADD wait-for-it.sh /usr/src/<%= appName%>/wait-for-it.sh
RUN chmod +x /usr/src/<%= appName%>/wait-for-it.sh
<%}%>
WORKDIR /usr/src/<%= appName%>
RUN npm install
