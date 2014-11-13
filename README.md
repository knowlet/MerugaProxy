# Meruga SP Hack Proxy
A python proxy depend on [CherryProxy](http://www.decalage.info/python/cherryproxy)

## What can it do
It will hack the skill point when battle execute.

## Install CherryProxy
	wget https://bitbucket.org/decalage/cherryproxy/downloads/CherryProxy-0.13.zip
	unzip CherryProxy-0.13.zip
	cd CherryProxy-0.13
	sudo python setup.py install
	
**Notice:** if you don't have permission to install, just put the MerugaProxy folder under CherryProxy-0.13, or you con change the path by yourself.

## Run MerugaProxy
	git clone https://github.com/knowlet/MerugaProxy.git
	cd MerugaProxy
	python meruga.py
	
## Proxy Usage
* **Android:** Settings -> Wi-Fi -> The Wifi you are using -> Modify network -> Show advanced options -> Proxy -> Manual -> Set your proxy hostname and port
* **iOS:** Settings -> Wi-Fi -> The Wifi you are using -> information -> HTTP Proxy -> Manual -> Set your proxy hostname and port
