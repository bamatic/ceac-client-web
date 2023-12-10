#!/usr/bin/env bash
sudo docker run -dit --name ceac-web-client -p 8090:80 -v /home/victor/WebstormProjects/ceac-web-client/src:/usr/local/apache2/htdocs/ httpd:latest
