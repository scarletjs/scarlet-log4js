scarlet-log4js
==============

A log4js Logger Using Scarlet's Method And Property Event Intercetion


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

## Motvation

Scarlet-log4js was created to allow applications to get the benefits of event based interception using [scarlet](https://github.com/scarletjs/scarlet) and log4js logging using [log4js](http://log4js.berlios.de/).

The project uses Scarlets event based interception, this allows the interception to be asynchronous and not to effect the application.  Scarlet emits an event *before* a method is called and *after* a method is called.  Scarlet-log4js listens for these events and uses log4js to log the events.

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

## Do I need Scarlet?

Scarlet-log4js extends all the scarlet methods.  This allows you to use all the scarlet methods using scarlet-log4js.  See the [Scarlet documentation](https://github.com/scarletjs/scarlet)  for more details.

Here is an example of how you can create a scarlet interceptor and utilize the scarletLog4js logging
```javascript
scarletLog4js.intercept(Math,'min')
              .on('before', function(invocation){
					var logger = scarletLog4js.getLogger();
					logger.info("Before calling "+invocation.objectName);
              })
```

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

### Start logging for an instance with custom log4js configuration

```javascript
var log4js = require('log4js');
var scarletLog4js = require('scarlet-log4js');

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
var scarletLog4js = require('scarlet-log4js');

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
var scarletLog4js = require('scarlet-log4js');

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
var scarletLog4js = require('scarlet-log4js');
 
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
