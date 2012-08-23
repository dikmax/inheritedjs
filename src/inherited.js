(function () {
    /**
     * @param {*} member
     * @constructor
     */
    var ClassMember = function (member) {
        this.member = member;
    };

    /**
     * @type {boolean}
     */
    ClassMember.prototype.isStatic = false;
    ClassMember.prototype.isProperty = false;
    /**
     * @type {*}
     */
    ClassMember.prototype.member = null;

    /**
     * @param {*} item
     * @return {ClassMember}
     */
    Object.prototype['__static__'] = function(item) {
        if (!(item instanceof ClassMember)) {
            item = new ClassMember(item);
        }
        item.isStatic = true;
        return item;
    };

    /**
     * @param {(ClassMember | {
     *   set:(boolean|function(*):undefined|null|undefined),
     *   get:(boolean|function():*|null|undefined),
     *   default:*
     * })} item
     * return {ClassMember}
     */
    Object.prototype['__property__'] = function(item) {
        if (!(item instanceof ClassMember)) {
            item = new ClassMember(item);
        }
        item.isProperty = true;
        return item;
    };

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
     * Calls parent static method
     *
     * @param {...*} args Arguments passed to parent method
     * @return {*} Return value of parent method
     */
    var inheritedStatic = function (args) {
        var method;
        var caller = arguments.callee.caller;
        for (var i in this) {
            //noinspection JSUnfilteredForInLoop
            if (this[i] === caller) {
                method = i;
                break;
            }
        }
        if (method) {
            if (this.superClass_['__static'] && this.superClass_['__static'][method] === undefined) {
                throw "No inherited method found";
            }
            return this.superClass_['__static'][method].apply(this, arguments);
        }
    };

    var classInit = function() {
        this.__propertiesStorage = {};
        for (var prop in this.__propertiesDefaults) {
            if (this.__propertiesDefaults.hasOwnProperty(prop)) {
                this.__propertiesStorage[prop] = this.__propertiesDefaults[prop];
            }
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
     * @param {Object|null|undefined} specification
     * @return Object
     */
    Object.prototype['__extend__'] = function (name, specification) {
        // TODO select shorter name for arguments
        eval('var args=arguments,cnstr=args[1]&&args[1].constructor||args[0]&&args[0].constructor||function(){}');
        if (typeof name !== 'string') {
            specification = name;
            name = null;
        }
        specification = specification || {};
        if (specification.constructor === Object || !specification.constructor) {
            specification.constructor = function () {};
        }
        var constructor = specification.constructor;
        //var _class = constructor;
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
                        return /** @type {!Function} */ eval('(function(){' + body + '})');
                    }
                    return function () {};
                }
            }
        } else {
            nameGenerator = /** @type {function (?string=, ?string=): (!Function)} */ function (name, body) {
                if (body) {
                    return /** @type {!Function} */ eval('(function(){' + body + '})');
                }
                return function () {};
            }
        }

        var _class = nameGenerator(name, 'this.__initFn();cnstr.apply(this,arguments)');

        var baseClass = this;

        // tempCtor is used to replace constructor on base class
        var tempCtor = nameGenerator(name);
        tempCtor.prototype = baseClass.prototype;
        _class.superClass_ = baseClass.prototype;
        _class.prototype = new tempCtor();
        /** @expose */
        _class.prototype.className_ = name;
        _class.prototype.constructor = _class;
        _class.prototype['__cnstrFn'] = constructor;
        _class.prototype['__initFn'] = classInit;
        /** @expose */
        _class.prototype.inherited = inherited;

        var prop;

        // Prepare statics
        var __staticBase = {};
        _class.inherited = inheritedStatic;
        if (baseClass.__staticBase) {
            for (prop in baseClass.__staticBase) {
                if (baseClass.__staticBase.hasOwnProperty(prop)) {
                    __staticBase[prop] = baseClass.__staticBase[prop];
                    _class[prop] = __staticBase[prop];
                }
            }
        }
        _class.prototype['__static'] = _class;
        _class.__staticBase = __staticBase;

        delete specification.constructor;

        _class.prototype.__propertiesDefaults = baseClass.prototype && baseClass.prototype.__propertiesDefaults || {};

        for (prop in specification) {
            if (specification.hasOwnProperty(prop)) {
                var property = specification[prop];
                if (property instanceof ClassMember) {
                    if (property.isProperty) {
                        var member = property.member;
                        if (member['default'] !== undefined) {
                            _class.prototype.__propertiesDefaults[prop] = member['default'];
                        }
                        if (member['get'] !== true && typeof member['get'] !== 'function' &&
                            member['set'] !== true && typeof member['set'] !== 'function') {
                            continue;
                        }
                        var propertyDescription = {};
                        if (member['get'] == true) {
                            propertyDescription['get'] = function(prop) {
                                return function () {
                                    return this.__propertiesStorage[prop];
                                }
                            }(prop);
                        } else {
                            propertyDescription['get'] = function (fun) {
                                return function() {
                                    return fun.call(this, this.__propertiesStorage);
                                }
                            }(member['get']);
                        }
                        if (member['set'] == true) {
                            propertyDescription['set'] = function(prop) {
                                return function (value) {
                                    this.__propertiesStorage[prop] = value;
                                }
                            }(prop);
                        } else {
                            propertyDescription['set'] = function (fun) {
                                return function (value) {
                                    return fun.call(this, value, this.__propertiesStorage);
                                }
                            }(member['set']);
                        }

                        Object.defineProperty(_class.prototype, prop, propertyDescription);
                    } else if (property.isStatic) {
                        _class[prop] = property.member;
                        __staticBase[prop] = property.member;
                    }
                } else {
                    _class.prototype[prop] = property;
                }
            }
        }
        return _class;
    };
}());
