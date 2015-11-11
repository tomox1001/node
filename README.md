# node

## Dependency
```
$ node --version
v0.12.7
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
- https://www.vagrantup.com/downloads.html
- https://www.virtualbox.org/wiki/Downloads

```
$ vagrant ssh
Welcome to Ubuntu 12.04 LTS (GNU/Linux 3.2.0-23-generic x86_64)

 * Documentation:  https://help.ubuntu.com/
New release '14.04.2 LTS' available.
Run 'do-release-upgrade' to upgrade to it.

Welcome to your Vagrant-built virtual machine.
Last login: Wed Nov 11 08:51:22 2015 from 10.0.2.2
vagrant@precise64:~$
```

Install the node_modules:
```
$ npm i
```

## Start
Start mongo/redis in Vagrant:
```
$ vagrant up
$ vagrant halt # 停止
```

Start the server:
```
$ npm start
```

Open in browser:
```
$ open http://localhost:8080
```

