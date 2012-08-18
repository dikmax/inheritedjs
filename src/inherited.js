/**
 * @param {{static: boolean}} flags
 * @param {*} member
 * @constructor
 */
var ClassMember = function (flags, member) {
    this._static = !!flags['static'];
    this.member = member;
};

/**
 * @type {boolean}
 */
ClassMember.prototype._static = false;
/**
 * @type {*}
 */
ClassMember.prototype.member = null;

Object.prototype['__static__'] = function(item) {
    return new ClassMember({'static': true}, item);
};

/**
 * @export
 */
Object.prototype['__extend__'] = function () {
    /**
     * Calls parent method
     *
     * @param {...*} args Arguments passed to parent method
     * @return {*} Return value of parent method
     */
    var inherited = function (args) {
        var proto = this.__proto__;
        var method;
        var caller = arguments.callee.caller;
        for (var i in proto) {
            //noinspection JSUnfilteredForInLoop
            if (proto[i] === caller) {
                method = i;
                break;
            }
        }
        if (method) {
            if (proto.__proto__[method] === undefined) {
                throw "No inherited method found";
            }
            return proto.__proto__[method].apply(this, arguments);
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
    /**
     * @type {number}
     */
    var browser = Browser.OTHER;

    /**
     * @type {string}
     */
    var userAgent = navigator.userAgent;
    if (userAgent.indexOf('Chrome') !== -1) {
        browser = Browser.CHROME;
    } else if (userAgent.indexOf('Firefox') !== -1) {
        browser = Browser.FIREFOX;
    }

    /**
     * @param {string|Object|null|undefined} name
     * @param {Object|null|undefined} specification}
     * @return Object
     */
    return function (name, specification) {
        if (typeof name !== 'string') {
            specification = name;
            arguments[1] = specification;
            name = null;
        }
        specification = specification || {};
        if (specification.constructor === Object || !specification.constructor) {
            specification.constructor = function () {};
        }
        eval('var cnstr=arguments[1] && arguments[1].constructor || function(){}');
        var constructor = specification.constructor;
        var _class = constructor;
        /**
         * @param {?string=} name
         * @param {?string=} body
         * @return {!Function}
         */
        var nameGenerator;
        if (name) {
            if (browser === Browser.CHROME) {
                // Chrome supports fullly qualified names
                nameGenerator = /** @type {function (?string=, ?string=): (!Function)} */ function (name, body) {
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
                    return /** @type {!Function} */ eval('result');
                };
            } else if (browser === Browser.FIREFOX) {
                // Firefox supports short names so replace all dots with underscores
                nameGenerator = /** @type {function (?string=, ?string=): (!Function)} */ function (name, body) {
                    body = body || "";
                    name = name ? name.replace(/\./g, '_') : '';
                    eval('function ' + name + '(){' + body + '};var result=' + name);
                    return /** @type {!Function} */ eval('result');
                };
            } else {
                // Opera doesn't supports object names at all.
                // I know nothing about other browsers
                nameGenerator = /** @type {function (?string=, ?string=): (!Function)} */ function (name, body) {
                    if (body) {
                        return /** @type {!Function} */ eval('function(){' + body + '}');
                    }
                    return function () {};
                }
            }

            _class = nameGenerator(name, 'cnstr.apply(this,arguments)')
        } else {
            nameGenerator = /** @type {function (?string=, ?string=): (!Function)} */ function (name, body) {
                if (body) {
                    return /** @type {!Function} */ eval('function(){' + body + '}');
                }
                return function () {};
            }
        }

        var baseClass = this;

        // tempCtor is used to replace constructor on base class
        var tempCtor = nameGenerator(name);
        tempCtor.prototype = baseClass.prototype;
        _class.superClass_ = baseClass.prototype;
        _class.prototype = new tempCtor();
        /** @expose */
        _class.prototype.className_ = name;
        _class.prototype.constructor = _class;
        //noinspection JSUnusedGlobalSymbols
        /** @expose */
        _class.prototype.constructorFn_ = constructor;
        /** @expose */
        _class.prototype.inherited = inherited;

        var prop;

        // Prepare statics
        var __staticBase = {};
        var __static = {};
        if (baseClass.__staticBase) {
            for (prop in baseClass.__staticBase) {
                if (baseClass.__staticBase.hasOwnProperty(prop)) {
                    __static[prop] = baseClass['__static'][prop];
                    __staticBase[prop] = __static[prop];
                }
            }
        }
        _class['__static'] = __static;
        _class.prototype['__static'] = __static;
        _class.__staticBase = __staticBase;

        delete specification.constructor;

        for (prop in specification) {
            if (specification.hasOwnProperty(prop)) {
                var property = specification[prop];
                if (property instanceof ClassMember) {
                    if (property._static) {
                        __static[prop] = property.member;
                        __staticBase[prop] = property.member;
                    }
                } else {
                    _class.prototype[prop] = property;
                }
            }
        }
        return _class;
    };
}();