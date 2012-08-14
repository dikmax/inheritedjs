/**
 * @function
 * @param {Object} specification
 * @return {Object}
 */
window['createClass'] = function () {
    var inherited = function () {
        var proto = this.__proto__;
        var method;
        var caller = arguments.callee.caller;
        for (var i in proto) {
            if (proto[i] === caller) {
                method = i;
                break;
            }
        }
        if (method) {
            proto.__proto__[method].apply(this, arguments);
        }
    };

    /**
     * @enum {number}
     */
    var Browser = {
        CHROME: 1,
        FIREFOX: 2,
        OTHER: 3
    };
    var browser = Browser.OTHER;

    if (navigator.userAgent.indexOf('Chrome') !== -1) {
        browser = Browser.CHROME;
    } else if (navigator.userAgent.indexOf('Firefox') !== -1) {
        browser = Browser.FIREFOX;
    }

    return function (specification) {
        eval('var cnstr=arguments[0].constructor||function(){}');
        specification.constructor = specification.constructor || function () {};
        var constructor = specification.constructor;
        var _class = constructor;
        /**
         * @function
         * @param name
         * @param body
         * @return {Object}
         */
        var nameGenerator;
        if (specification.name) {
            if (browser === Browser.CHROME) {
                // Chrome supports fullly qualified names
                nameGenerator = function (name, body) {
                    body = body || "";
                    name = name || "TempObject";
                    var namePeriodIndex = name.indexOf('.');
                    if (namePeriodIndex !== -1) {
                        var firstPart = name.substring(0, namePeriodIndex);
                        var rest = name.substring(namePeriodIndex + 1);

                        eval('var n_={}'); // Namespace
                        var subNamespace = eval('n_');
                        var restPeriodIndex = rest.indexOf('.');
                        while (restPeriodIndex !== -1) {
                            var part = rest.substring(0 , restPeriodIndex);
                            subNamespace[part] = {};
                            subNamespace = subNamespace[part];
                            rest = rest.substring(restPeriodIndex + 1);
                            restPeriodIndex = rest.indexOf('.');
                        }
                        eval('var ' + firstPart + '=n_;' +
                            name + '=function(){' + body + '};var result=' + name);
                    } else {
                        eval('var ' + name + '=function(){' + body + '};var result='+name);
                    }
                    return eval('result');
                };
            } else if (browser === Browser.FIREFOX) {
                // Firefox supports short names so replace all dots with underscores
                nameGenerator = function (name, body) {
                    /**
                     * @type {Function}
                     */
                    var result;
                    body = body || "";
                    name = name ? name.replace(/\./g, '_') : '';
                    eval('function ' + name + '(){' + body + '};var result=' + name);
                    return result;
                };
            } else {
                // Opera doesn't supports object names at all.
                // I know nothing about other browsers
                nameGenerator = function (name, body) {
                    if (body) {
                        return eval('function(){' + body + '}');
                    }
                    return function () {};
                }
            }

            _class = nameGenerator(specification.name, 'cnstr.apply(this,arguments)')
        } else {
            nameGenerator = function () {
                return function () {};
            }
        }

        var baseClass = specification.extend || Object; // TODO test for using object directly

        // tempCtor is used to replace constructor on base class
        var tempCtor = nameGenerator(specification.name);
        tempCtor.prototype = baseClass.prototype;
        _class.superClass_ = baseClass.prototype;
        _class.prototype = new tempCtor();
        _class.prototype.className_ = specification.name;
        _class.prototype.constructor = _class;
        _class.prototype.constructorFn_ = constructor;
        /** @expose */
        _class.prototype.inherited = inherited;

        delete specification.name;
        delete specification.constructor;
        delete specification.extend;

        for (var prop in specification) {
            if (specification.hasOwnProperty(prop)) {
                _class.prototype[prop] = specification[prop];
            }
        }
        return _class;
    };

}();
