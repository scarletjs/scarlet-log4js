scarlet-log4js
==============

> Scarlet plugin for using Log4js with method and property event interception

[![Build Status](https://travis-ci.org/scarletjs/scarlet-log4js.png?branch=master)](https://travis-ci.org/scarletjs/scarlet-log4js)

##Install

`npm install scarlet-log4js`

##Start logging

```javascript
var scarletLog4js = require('scarlet-log4js');

//Define a function to log
function FunctionToLog(){
	this.logMe = function(){ 
		var logger = scarletLog4js.getLogger("FunctionToLog");
		logger.info("In logMe"); 
	}
};
var functionToLogInstance = new FunctionToLog();

//Attach Logger to object
scarletLog4js.bindTo(functionToLogInstance);

//Now use intercepted object with logging!
functionToLogInstance.logMe();
//->info: [2013-08-31 11:15:59.965] [INFO] [FunctionToLog] calling - FunctionToLog::logMe()
//->info: [2013-08-31 11:15:59.965] [INFO] [FunctionToLog] In logMe
//->info: [2013-08-31 11:15:59.965] [INFO] [FunctionToLog] FunctionToLog::logMe() - returned:undefined - execution time(0:0:0.1)
```

By default the name of the object being intercepted will be used as the logger name
```
function FunctionToLog(){};
var functionToLogInstance = new FunctionToLog();

//Attach Logger to object
scarletLog4js.bindTo(functionToLogInstance);

//FunctionToLog is the name of the object being intercepted and is in the thrid [] of the message
[2013-08-31 11:15:59.965] [INFO] [FunctionToLog] someMessage
```

## Getting Started
This plugin requires Scarlet `~0.5.x`

If you haven't used [Scarlet](https://github.com/scarletjs/scarlet) before, be sure to check out the [Documentation](https://github.com/scarletjs/scarlet).  To use this plugin perform the following:

Install scarlet
```shell
npm install scarlet --save
```

Install plugin
```shell
npm install scarlet-log4js --save
```

Once the plugin has been installed, you can use it in your application as follows:

```js
//load scarlet
var Scarlet = require('scarlet');

//Initialize scarlet with the plugin
var scarlet = new Scarlet('scarlet-log4js');
var scarletLog4js = scarlet.plugins.log4js;
```

## Motvation

Scarlet-log4js was created to allow applications to get the benefits of event based interception using [scarlet](https://github.com/scarletjs/scarlet) and logging using [log4js](http://log4js.berlios.de/).

Scarlets event based interception is asynchronous and gets events on methods/properties before, after, and on error. Scarlet-log4js listens for these events and logs them.

## How do I Configure log4js?

You can easily override the default log4js implementation by passing the custom configured log4js logger to scarlet-log4js as follows:

```javascript
scarletLog4js.logger(myCustomLogger).bindTo(functionToLog);
```

Also, scarletLog4js extends log4js so has all its methods, in addition you can access log4js as follows:

```javascript
//getting instance used to log
scarletLog4js.log4js

//getting a new log4js logger and logging with it
var logger = scarletLog4js.getLogger();
logger.info("Important Log Message");
```

For more information on how to configure log4js please go [here](http://log4js.berlios.de/).

## Custom messages during the before and after events.

If you want to customize the before and after event logs do the following:

```javascript
scarletLog4js.beforeMethodCall = function(invocation){
	var logger = scarletLog4js.getLogger();
	logger.info( "Before Method Call");
};

scarletLog4js.afterMethodCall = function(invocation){
	var logger = scarletLog4js.getLogger();
	logger.info("After Method Call");
};
```

## Examples


### Start logging for an instance

```javascript
var Scarlet = require('scarlet');
var scarlet = new Scarlet('scarlet-log4js');
var scarletLog4js = scarlet.plugins.log4js;

//Define a function to log
function FunctionToLog(){
	this.logMe = function(){ 
		var logger = scarletLog4js.getLogger("FunctionToLog");
		logger.info("In logMe"); 
	}
};
var functionToLogInstance = new FunctionToLog();

//Attach Logger to object
scarletLog4js.bindTo(functionToLogInstance);

//Now use intercepted object with logging!
functionToLogInstance.logMe();
//->info: [2013-08-31 11:15:59.965] [INFO] [FunctionToLog] calling - FunctionToLog::logMe()
//->info: [2013-08-31 11:15:59.965] [INFO] [FunctionToLog] In logMe
//->info: [2013-08-31 11:15:59.965] [INFO] [FunctionToLog] FunctionToLog::logMe() - returned:undefined - execution time(0:0:0.1)
```

### Start logging for an instance with custom log4js configuration

```javascript
var Scarlet = require('scarlet');
var scarlet = new Scarlet('scarlet-log4js');
var scarletLog4js = scarlet.plugins.log4js;

//Define a function to log
function FunctionToLog(){
	this.logMe = function(){ 
		var logger = scarletLog4js.getLogger("FunctionToLog");
		logger.info("In logMe"); 
	}
};
var functionToLogInstance = new FunctionToLog();

//Create a custom log4js configuration
scarletLog4js.configure({
  appenders: [
    { type: 'console' },
    { type: 'file', filename: 'logs/functionToLog.log', category: 'FunctionToLog' }
  ]
});

//Attach Logger to object
scarletLog4js.bindTo(functionToLogInstance);

//Now use intercepted object with logging!
functionToLogInstance.logMe();
//->info: [2013-08-31 11:15:59.965] [INFO] [FunctionToLog] calling - FunctionToLog::logMe()
//->info: [2013-08-31 11:15:59.965] [INFO] [FunctionToLog] In logMe
//->info: [2013-08-31 11:15:59.965] [INFO] [FunctionToLog] FunctionToLog::logMe() - returned:undefined - execution time(0:0:0.1)
```

### Start logging an instances member

```javascript
var Scarlet = require('scarlet');
var scarlet = new Scarlet('scarlet-log4js');
var scarletLog4js = scarlet.plugins.log4js;

//Define a function to log
function FunctionToLog(){
	var logger = scarletLog4js.getLogger("FunctionToLog");
	this.logMe = function(){ logger.info("In logMe"); }
	this.dontLogMe = function(){ logger.info("In Don't logMe"); }
};
var functionToLogInstance = new FunctionToLog();

//Attach Logger to object
scarletLog4js.bindTo(functionToLogInstance,'logMe');

//Call a non intercepted method
functionToLogInstance.dontLogMe();
//-> no output

//Now use intercepted object with logging!
functionToLogInstance.logMe();
//->info: [2013-08-31 11:15:59.965] [INFO] [FunctionToLog] calling - FunctionToLog::logMe()
//->info: [2013-08-31 11:15:59.965] [INFO] [FunctionToLog] In logMe
//->info: [2013-08-31 11:15:59.965] [INFO] [FunctionToLog] FunctionToLog::logMe() - returned:undefined - execution time(0:0:0.1)
```

###Start logging all instances of a function

 ```javascript
var Scarlet = require('scarlet');
var scarlet = new Scarlet('scarlet-log4js');
var scarletLog4js = scarlet.plugins.log4js;

function FunctionToLog(){
	var logger = scarletLog4js.getLogger("FunctionToLog");
	this.logMe = function(){ logger.info("In logMe"); }
};

//Attach Logger to object
FunctionToLog = scarletLog4js.bindTo(FunctionToLog);

//Now use intercepted object with logging!
var functionToLogInstance = new FunctionToLog();
//-> Outputs the following to the console:
//->info: [2013-08-31 11:15:59.965] [INFO] [FunctionToLog] calling - FunctionToLog::FunctionToLog()
//->info: [2013-08-31 11:15:59.965] [INFO] [FunctionToLog] FunctionToLog::FunctionToLog() - returned:undefined - execution time(0:0:0.1)

functionToLogInstance.logMe();
//-> Outputs the following to the console:
//->info: [2013-08-31 11:15:59.965] [INFO] [FunctionToLog] calling - FunctionToLog::logMe()
//->info: [2013-08-31 11:15:59.965] [INFO] [FunctionToLog] In logMe
//->info: [2013-08-31 11:15:59.965] [INFO] [FunctionToLog] FunctionToLog::logMe() - returned:undefined - execution time(0:0:0.1)
```

###Start logging all instances of a prototype function

 ```javascript
var Scarlet = require('scarlet');
var scarlet = new Scarlet('scarlet-log4js');
var scarletLog4js = scarlet.plugins.log4js;
 
//Define a prototype object to log
var ObjectToLog = function (){};
ObjectToLog.prototype.someMethod = function(){ 
	var logger = scarletLog4js.getLogger("ObjectToLog");
	logger.info("In logMe"); 
};
  
//Attach Logger to object
ObjectToLog = scarletLog4js.bindTo(ObjectToLog);
  
//Now use intercepted object 
var objectToLog = new ObjectToLog();
//-> Outputs the following to the console:
//->info: [2013-08-31 11:15:59.965] [INFO] [ObjectToLog] calling - ObjectToLog::ObjectToLog()
//->info: [2013-08-31 11:15:59.965] [INFO] [ObjectToLog] ObjectToLog::ObjectToLog() - returned:undefined - execution time(0:0:0.1)

//When called will now get logged
var result = objectToLog.someMethod();
//-> Outputs the following to the console:
//->info: [2013-08-31 11:15:59.965] [INFO] [ObjectToLog] calling - ObjectToLog::logMe()
//->info: [2013-08-31 11:15:59.965] [INFO] [ObjectToLog] In logMe
//->info: [2013-08-31 11:15:59.965] [INFO] [ObjectToLog] ObjectToLog::logMe() - returned:undefined - execution time(0:0:0.1)
```
