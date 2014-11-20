learnthecod.es
==============

shared javascript teaching tool


to run locally
====

<pre>node server [port]</pre>

in browser:
http://localhost


port things
====
if you don't want to specify the port when running, use this on wherever your node is to allow it to listen on port 80:
<pre>sudo apt-get install libcap2-bin
sudo setcap cap_net_bind_service=+ep /usr/local/bin/node</pre>
