FROM nginx:latest

ARG APIURI

COPY . /usr/share/nginx/html

WORKDIR /usr/share/nginx/html

RUN echo "${APIURI}"
RUN echo sed -i "s/var serviceUri=.*/var serviceUri=\"${APIURI}\";/g" dashboard.js
RUN sed -i "s/var serviceUri=.*/var serviceUri=\"${APIURI}\";/g" dashboard.js

EXPOSE 80
