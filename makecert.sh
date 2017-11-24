#!/bin/sh

openssl genrsa -out server.key 2048
openssl req -new -key server.key > server.csr
openssl x509 -in server.csr -req -outform der -out server.cer -days 3650 -signkey server.key -sha256 -extfile v3.txt
openssl sha1 -binary server.cer | base64 > customKeyIdentifier.txt
base64 < server.cer > value.txt
cp -p customKeyIdentifier.txt x5t.txt
