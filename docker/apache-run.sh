#!/usr/bin/env bash
sudo docker run -dit --name my-running-app -p 8090:80 -v /home/victor/WebstormProjects/pp/src:/usr/local/apache2/htdocs/ httpd:latest
