jaggery-pipe
============

Jaggery-Pipe is a connect like middleware stack for the Jaggery Framework.It is HEAVILY inspired by the way connect does things! :)


Installation
============
Drop the jaggery-pipe module into the PRODUCT_HOME/modules/ directory to get started working with the Pipe.The plug-ins folder has a 
few other modules that you might find interesting.

The Jaggery-Pipe can be used as a simple routing mechanism but its real power comes from plug-ins (think of plug-ins as middleware).

Usage
=====

```javascript
  var pipe=require('pipe');
  var router=require('jaggery-router');
  
  pipe.plug(router);

```


Plug-ins
========
Plug-ins can come in two flavours;
1. Jaggery modules
2. Plain old JS files 



Writing a plug-in
=================
Writing a new plug-in is easy as defining a simple function callback.The Jaggery-Pipe requires a method named handle which is used to access the functionality of your plug-in as a request is serviced.




