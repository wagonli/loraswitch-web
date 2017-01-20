#LORASWITCH-WEB

This project describe the portal use to control and get a status of the Lorraswitch connected object.

## HOW TO RUN

The easiest way is to run the project in an nginx container. Like a local deployment, it enables modification to the code without relaunching anything.
```
docker run -it --name loraswitch-web --rm -p 8080:80 -v /local/path/to/this/project:/usr/share/nginx/html:ro -d nginx
```

## What is used :

- HTML
- Javascript
- jQuery
