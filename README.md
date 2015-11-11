# node

## Dependency
```
$ node --version
v0.12.7

$ mongo --version
MongoDB shell version: 3.0.4

$ redis-cli --version
redis-cli 3.0.2
```

## Installation
Install the nodejs
```
$ brew install nodebrew
$ nodebrew install v0.12.7
$ nodebrew use v0.12.7
$ node -v
v0.12.7
```

Edit ~/.bashrc
```
export PATH=$HOME/.nodebrew/current/bin:$PATH
nodebrew use v0.12.7
```

Install Vagrant/VirtualBox
```
https://www.vagrantup.com/downloads.html
https://www.virtualbox.org/wiki/Downloads
```

Install the node_modules:
```
$ npm i
```

## Start
Start mongo/redis in Vagrant:
```
$ vagrant up
# $ vagrant halt 停止
```

Start the server:
```
$ npm start
```

Open in browser:
```
$ open http://localhost:8080
```
