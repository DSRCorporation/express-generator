#!/bin/bash

cmd="$@"
<%if (locals.usePostgres) {%>
until psql -h "<%=appName%>-postgres" -U "postgres" -d <%=dbName%> -c '\l'  > /dev/null; do
>&2 echo "Postgres is unavailable - waiting"
sleep 1
done
>&2 echo "Postgres is up - start <%= appName%> service"
<%}%>
<% if (locals.useMysql) {%>
until mysql --host=<%=appName%>-mysql --port=3306 --user=root --password=root_password <%=dbName%> > /dev/null; do
>&2 echo "Mysql is unavailable - waiting"
sleep 1
done
>&2 echo "Mysql is up - start <%= appName%> service"
<%}%>

exec $cmd