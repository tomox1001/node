# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|

  config.vm.box = "ameba/proteus-mongodb-v3"

  # mongodb
  config.vm.network :forwarded_port, guest: 27017, host: 27017
  config.vm.network :forwarded_port, guest: 27017, host: 27018

  # redis
  config.vm.network :forwarded_port, guest: 6379, host: 6379

  # Create a private network, which allows host-only access to the machine
  # using a specific IP.
  config.vm.network "private_network", ip: "192.168.33.10"

  # VM option
  config.vm.provider "virtualbox" do |v|
    v.customize ["modifyvm", :id, "--memory","2048"]
    v.customize ["modifyvm", :id, "--cpus","1"]
    v.customize ["modifyvm", :id, "--natdnshostresolver1", "on"]
  end

end
