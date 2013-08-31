var assert = require("assert");
var Scarlet = require("scarlet");
var log4js = require('log4js');

var scarlet = new Scarlet();

var ScarletLog4js = module.exports = exports = function(logInterceptor){
	var self = this;
	
	self.log4js = log4js;
	scarlet.extend(self);
	cloneLog4js(self);
};

var cloneLog4js = function(target){
	function addMemberToTarget(member){
		target[member] = function(){
			return log4js[member].apply(log4js,arguments);
		};
	}

	for(var member in log4js){
		addMemberToTarget(member);
	}
};

ScarletLog4js.prototype.logger = function(logger){
	var self = this;

	assert(logger, "Scarlet-Log4js::logger === null");

	self.log4js = logger;
	return self;
};

ScarletLog4js.prototype.bindTo = function(objectToLog, memberToLog){
	var self = this;

	if(!objectToLog)
		throw new Error("Object to bind must be defined");

	var interceptor = null;
	if(memberToLog)
		interceptor = self.intercept(objectToLog, memberToLog);
	else
		interceptor = self.intercept(objectToLog);

	return interceptor
					.on("before", function(invocation){self.beforeMethodCall(invocation);})
					.on("after", function(invocation){self.afterMethodCall(invocation);})
					.on("error", function(error){self.errorMethodCall(error);})
					.resolve();
};

ScarletLog4js.prototype.errorMethodCall = function(error){
	var self = this;
	var stack = new Error().stack;

	console.log(log4js);
	var logger = self.log4js.getLogger();
	logger.error(error.message+" "+stack);
};

ScarletLog4js.prototype.beforeMethodCall = function(invocation){
	var self = this;
	
	var logger = self.log4js.getLogger(invocation.objectName);
	logger.info("calling - "+invocation.objectName+"::"+invocation.methodName+"("+formatArgs(invocation.args)+")");
};

ScarletLog4js.prototype.afterMethodCall = function(invocation){
	var self = this;

	var logger = self.log4js.getLogger(invocation.objectName);
	logger.info(invocation.objectName+"::"+invocation.methodName+"("+formatArgs(invocation.args)+") - returned:"+JSON.stringify(invocation.result)+" - execution time("+getFormatedTimeSpan(invocation.executionStartDate,invocation.executionEndDate)+")");
};

var formatArgs = function(args){
	var formattedArgs = "";

	var argsArray = Array.prototype.slice.call(args);
	for (var i = 0; i < argsArray.length; i++) {
		if(i > 0)
			formattedArgs += ",";

		formattedArgs += argsArray[i];
	}

	return formattedArgs;
};

var getFormatedTimeSpan = function(fromDateTime,toDateTime){
    var milliSecondDifference = Math.abs(fromDateTime-toDateTime);
    var secondsDifference = Math.round(milliSecondDifference/1000);
    var minutesDifference = Math.round(secondsDifference/60);
    var hourDifference = Math.round(minutesDifference/60);

    return hourDifference+":"+minutesDifference+":"+secondsDifference+"."+milliSecondDifference;
};