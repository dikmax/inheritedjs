window.createClass=function(){function h(){var a=this.__proto__,c,b=arguments.callee.caller,d;for(d in a)if(a[d]===b){c=d;break}c&&a.__proto__[c].apply(this,arguments)}var e=3;-1!==navigator.userAgent.indexOf("Chrome")?e=1:-1!==navigator.userAgent.indexOf("Firefox")&&(e=2);return function(a){eval("var cnstr=arguments[0].constructor||function(){}");a.constructor=a.constructor||function(){};var c=a.constructor,b;a.name?(b=1===e?function(a,c){var c=c||"",a=a||"TempObject",b=a.indexOf(".");if(-1!==b){var d=
a.substring(0,b),b=a.substring(b+1);eval("var namespace={}");for(var e=eval("namespace"),g=b.indexOf(".");-1!==g;){var f=b.substring(0,g);e[f]={};e=e[f];b=b.substring(g+1);g=b.indexOf(".")}eval("var "+d+"=namespace;"+a+"=function(){"+c+"};var result="+a)}else eval("var "+a+"=function(){"+c+"};var result="+a);return eval("result")}:2===e?function(a,b){b=b||"";a=a?a.replace(/\./g,"_"):"";eval("function "+a+"(){"+b+"};var result="+a)}:function(a,b){return b?eval("function(){"+b+"}"):function(){}},c=
b(a.name,"cnstr.apply(this,arguments)")):b=function(){return function(){}};var d=a.extend||Object;b=b(a.name);b.prototype=d.prototype;c.a=d.prototype;c.prototype=new b;c.prototype.constructor=c;c.prototype.inherited=h;delete a.name;delete a.constructor;delete a.extend;for(var f in a)a.hasOwnProperty(f)&&(c.prototype[f]=a[f]);return c}}();
