var assert = require("assert");
var Scarlet = require("scarlet");
var log4js = require('log4js');
var clone = require("./extensions/clone");
var formatter = require("./extensions/formatter");

var ScarletLog4js = module.exports = exports = function(scarlet){
	var self = this;
	
	self.log4js = log4js;
	clone(log4js,self);

	self.initialize = function(){

		scarlet.plugins.log4js = self;
		return self;
	};

	self.logger = function(logger){

		assert(logger, "Scarlet-Log4js::logger === null");

		self.log4js = logger;
		return self;
	};

	self.bindTo = function(objectToLog, memberToLog){

		if(!objectToLog)
			throw new Error("Object to bind must be defined");

		var interceptor = null;
		if(memberToLog)
			interceptor = scarlet.intercept(objectToLog, memberToLog);
		else
			interceptor = scarlet.intercept(objectToLog);

		return interceptor
						.on("before", function(invocation){self.beforeMethodCall(invocation);})
						.on("after", function(invocation){self.afterMethodCall(invocation);})
						.on("error", function(error){self.errorMethodCall(error);})
						.resolve();
	};

	self.errorMethodCall = function(error){

		var stack = new Error().stack;

		var logger = self.log4js.getLogger();
		logger.error(error.message+" "+stack);
	};

	self.beforeMethodCall = function(invocation){

		var logger = self.log4js.getLogger(invocation.objectName);
		logger.info("calling - "+invocation.objectName+"::"+invocation.methodName+"("+formatter.formatArgs(invocation.args)+")");
	};

	self.afterMethodCall = function(invocation){

		var logger = self.log4js.getLogger(invocation.objectName);
		logger.info(invocation.objectName+"::"+invocation.methodName+"("+formatter.formatArgs(invocation.args)+") - returned:"+JSON.stringify(invocation.result)+" - execution time("+formatter.getFormatedTimeSpan(invocation.executionStartDate,invocation.executionEndDate)+")");
	};

};
