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
Jaggery-Pipe ships with a few default plugins that allow you to get up and running with a basic application in little time as possible. This section will explore a few of the plugins that perform common application logic.


Router
------
The router plug-in allows routes to be defined in a simple and clean manner.

fe.jag:
```javascript
   var router=require('router');
   router.app.get('/hello',function(){
       print('Hello World!');    
  });

```

If you navigate to ; yourapp/hello you will be greeted by 'Hello World!'.

fe:jag:
```javascript
  router.app.get('/hello/:user',function(req){
    print('Hello '+req._params.user+'. How are you?');
  });
```

If you navigate to; yourapp/hello/sam you will be greeted by 'Hello sam. How are you?'

Although this is perfectly fine for smaller apps,having callbacks declared with routes quickly becomes unwiedly (and ugly!). Therefore to improve readability the router plug-in allows you to define routes in js files.

hello.js:
```javascript
   var sayHello=function(req){
      print('Hello '+req._params.user+'. How are you?');
   };
```

fe.jag:
```javascript
  var myHelloLogic=require('hello.js');
  
  router.app.get('/hello/:user',myHelloLogic.sayHello);
```

Much more readable,right? :)


Writing a plug-in
=================
Writing a new plug-in is easy as defining a simple function callback.The Jaggery-Pipe requires a method named handle which is used to access the functionality of your plug-in as a request is serviced.




