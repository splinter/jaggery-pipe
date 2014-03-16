jaggery-pipe
============

Jaggery-Pipe is a connect like middleware stack for the Jaggery Framework.It is HEAVILY inspired by the way connect does things! :)

Contents
========
1. Installation
2. Usage
3. Plug-ins

Installation
============
Drop the jaggery-pipe module into the PRODUCT_HOME/modules/ directory to get started working with the Pipe.The plug-ins folder has a set of plug-ins that offer commonly required functionality from a web application.


Usage
=====

Getting started with the pipe is easy as requiring the pipe module :)

```javascript
  var pipe=require('pipe');
  var router=require('router');
  
  pipe.plug(router);

```

The above code states that the router plug-in should be used for all requests. Lets get a bit more fancy and apply a plug-in to a specific route.

```javascript
  var common=require('pipe-common');
  
  pipe.plug('/friends'common.logger);
```

The common.logger is a plug-in which simply logs the request to the console.The above piece of code would log any request that contains the '/friend' component.



Plug-ins
========
Jaggery-Pipe ships with a few default plugins that allow you to get up and running with a basic application in little time as possible. This section will explore a few of the plugins that perform common application logic.


Router
------
The router plug-in allows routes to be defined in a simple and clean manner.

### Basic Usage

**fe.jag**:
```javascript
   var router=require('router');
   router.app.get('/hello',function(){
       print('Hello World!');    
  });

```

If you navigate to ; yourapp/hello you will be greeted by 'Hello World!'.

**fe.jag**:
```javascript
  router.app.get('/hello/:user',function(req){
    print('Hello '+req.params.user+'. How are you?');
  });
```

If you navigate to; yourapp/hello/sam you will be greeted by 'Hello sam. How are you?'

Although this is perfectly fine for smaller apps,having callbacks declared with routes quickly becomes unwiedly (and ugly!). Therefore to improve readability the router plug-in allows you to define routes in js files.

**hello.js**:
```javascript
   var sayHello=function(req){
      print('Hello '+req.params.user+'. How are you?');
   };
```

**fe.jag**:
```javascript
  var myHelloLogic=require('hello.js');
  
  router.app.get('/hello/:user',myHelloLogic.sayHello);
```

Much more readable,right? :)

### Using a renderer

In addition to using the print statement,the router plug-in can use a renderer to respond to a request. The router plug-in comes with a sample renderer which will send a json response.
 
```javascript
  var sayHelloInJSON=function(req,res){
     var data={
       msg: 'Hello, I am a json object'
     };
     
     res.render(data);
  }
```
You can also set your own renderer per request method type;

```javascript
  router.app.utils('get-renderer',function(data){
      print('This is a custom renderer : '+stringify(data));
  });
```

Similarly you can also set renderers for other methods by using:
* put-renderer
* delete-renderer
* post-renderer

Static Content Plug-in
----------------------
The static content plug-in serves static content from a user defined directory.It is one of the bundled plugins in the pipe-commons module.

```javascript
   var common=require('pipe-common');
   
   //Define the directory from which content will be served
   common.staticContent.app.setDir('/public');
   
   //Use the plugin for any routes with the particular components
   pipe.plug('themes/default/public/',common.staticContent);
   
```

It is a good idea to plugin the static content plug-in further up the chain of the pipe plugins.This would ensure that less plugins are hit before the content is served.

Body Parser Plug-in
-------------------
The body parse plug-in will process the request body and make the content available either as a JSON object or a string.The body can be accessed using ;

```javascript
  req.body
```

The plug-in is bundled with the pipe-common module.


Query Parser Plug-in
--------------------
The query parser plug-in will process a query string and make it available as a JSON object.The query string can be accessed using;

```javascript
  req.query
```

Writing a plug-in
=================
Writing a new plug-in is easy as defining a simple function callback.The Jaggery-Pipe requires a method named handle which is used to access the functionality of your plug-in as a request is serviced.

There are two types of plug-ins that can be used with the Pipe;
1. Functional plug-in
2. Error Handler plug-in

A functional plug-in can be created by defining a handle function with a specific sugnature as shown below;

**my-plugin.js**:

```javascript
var handle=function(req,res,session,handlers){
    var log=new Log();
    log.info('my pipe plugin, does nothing!');
    handlers();
};
```
Although, it is perfectly fine to omit calling the handlers method, it is polite to invoke it so that the request can transition to the rest of plug-ins in the chain.

A plugin for handling errors can be created in a similar manner to a functional plug-in with one difference.The handle method signature accepts an error object which is passed down from the rest of the plugins in the pipe.An error plugin is only activated if a functional plugin immediately above it in the plug-in chain invokes the handlers function with an object.

**my-err-plugin.js**:

```javascript
var handle=function(err,req,res,session,handlers){
   var log=new Log();
   log.info('my pipe plugin to catch errors!');
    handlers(err);
};
```


