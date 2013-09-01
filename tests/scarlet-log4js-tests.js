var should = require('should');
var Scarlet = require('scarlet');

var scarlet = new Scarlet("../lib/scarlet-log4js");
var scarletLog4js = scarlet.plugins.log4js;

var ObjectLiteral = require("./dummies/object-literal");
var NamedFunction = require("./dummies/named-function");
var UnnamedFunction = require("./dummies/unnamed-function");
var PrototypeFunction = require("./dummies/prototype-function");

describe('Given using a Scarlet Log4js Logger',function(){

	var didAppend = false;
	var appendMessage = "";

	var MockLog4js = function(){};
	MockLog4js.prototype.getLogger = function(loggerName){
		var self = this;
		return {
			log : self.log,
			error : self.log,
			info : self.log,
			debug : self.log
		};
	};
	MockLog4js.prototype.log = function(type,message){
		didAppend = true; 
		appendMessage = message;
	};

	beforeEach(function() {
		didAppend = false;
		appendMessage = "";
		var mockLog4js = new MockLog4js();
		scarletLog4js.logger(mockLog4js);
	});

	describe('When logging a Prototype function',function(){
		var LogPrototypeFunction = scarletLog4js.bindTo(PrototypeFunction);

		it("should return method results without modification",function(){
						
			var loggedInstance = new LogPrototypeFunction();
			var result = loggedInstance.methodWithReturn();
			result.should.be.eql("any");
		});
		it("should append to the logger",function(){
			var loggedInstance = new LogPrototypeFunction();
			var result = loggedInstance.methodWithReturn();
			didAppend.should.be.eql(true);
		});
	});

	describe('When logging a object literal',function(){

		var LogObjectLiteral = Object.create(ObjectLiteral);

		var LogPrototypeFunction = scarletLog4js.bindTo(LogObjectLiteral);

		it("should return method results without modification",function(){
						
			var result = LogObjectLiteral.methodWithReturn();
			result.should.be.eql("any");
		});
		it("should append to the logger",function(){
						
			var result = LogObjectLiteral.methodWithReturn();
			didAppend.should.be.eql(true);
		});
	});

	describe('When logging a named function',function(){
		var LogNamedFunction = scarletLog4js.bindTo(NamedFunction);

		it("should return method results without modification",function(){
			var loggedInstance = new LogNamedFunction();
			var result = loggedInstance.methodWithReturn();
			result.should.be.eql("any");
		});

		it("should append to the logger",function(){
			var loggedInstance = new LogNamedFunction();
			var result = loggedInstance.methodWithReturn();
			didAppend.should.be.eql(true);
		});
	});

	describe('When logging a named function',function(){
		var LogUnnamedFunction = scarletLog4js.bindTo(UnnamedFunction);

		it("should return method results without modification",function(){
			var loggedInstance = new LogUnnamedFunction();
			var result = loggedInstance.methodWithReturn();
			result.should.be.eql("any");
		});
		
		it("should append to the logger",function(){
			var loggedInstance = new LogUnnamedFunction();
			var result = loggedInstance.methodWithReturn();
			didAppend.should.be.eql(true);
		});
	});

});