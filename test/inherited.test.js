TestCase("InheritedTest", {
    setUp: function () {
        this.TestA = Object.extend('test.TestA',
            /** @lends TestA */
            {
                /** @constructs */
                constructor: function () {
                    this.prop = 0;
                },

                testMethod1: function () {
                    console.log('TestA.testMethod1');
                },

                /**
                 * @param {number} param
                 */
                testMethod2: function (param) {
                    this.prop = param;
                    console.log('TestA.testMethod2 ' + param);
                }
            }
        );
    },

    testEmptyCall: function() {
        try {
            var TestClass = Object.extend();
        } catch (e) {
            fail(e);
        }
    },

    testClassA: function () {
        var testA = new this.TestA();
        assertSame("Wrong class name", testA.className_, 'test.TestA');
        assertSame("Constructor TestA wasn't called", testA.prop, 0);
    },

    testWrongInheritedInConstructor: function () {
       var TestClass = Object.extend('TestClass',
            /** @lends TestClass */
            {
                constructor: function () {
                    this.inherited();
                }
            }
        );

        try {
            var testB = new TestClass();
            fail("Trying to call not existing inherited method should throw an exception");
        } catch (e) {
            assertString(e);
        }
    },

    testInheritedInConstructor: function () {
        var TestClass = this.TestA.extend('TestClass',
            /** @lends TestClass */
            {
                constructor: function () {
                    this.a = true;
                    this.inherited();
                }
            }
        );

        var test;
        try {
            test = new TestClass();
        } catch (e) {
            fail(e);
        }
        assertSame("Wrong class name", test.className_, 'TestClass');
        assertTrue("Constructor wasn't called", test.a);
        assertSame("Inherited constructor wasn't called", test.prop, 0);
    },

    testEmptyName: function () {
        var TestClass = Object.extend({
            constructor: function () {
                this.prop = true;
            }
        });

        var test = new TestClass();
        assertTrue(test.prop);
    },

    testEmptyNameInheritance: function () {
        var TestClass1 = Object.extend({
            constructor: function () {
                this.prop = true;
            }
        });

        var TestClass2 = TestClass1.extend({
            constructor: function () {
                this.inherited();
            }
        });

        var test = new TestClass2();
        assertTrue(test.prop);
    },

    testNoConstructor: function () {
        var TestClass = Object.extend({
            method: function () {
                this.prop = true;
            }
        });

        var test = new TestClass();
        test.method();
        assertTrue(test.prop);
    },

    testNoConstructorInheritance: function () {
        var TestClass1 = Object.extend({
            method: function () {
                this.prop = true;
            }
        });

        var TestClass2 = TestClass1.extend({
            method: function() {
                this.inherited();
            }
        });

        var test = new TestClass2();
        test.method();
        assertTrue(test.prop);
    },

    testOverChildInheritance: function () {
        var TestClass1 = Object.extend({
            method: function () {
                this.prop = true;
            }
        });

        var TestClass2 = TestClass1.extend({});

        var TestClass3 = TestClass2.extend({
            method: function () {
                this.prop = false;
                this.inherited();
            }
        });

        var test = new TestClass3();
        test.method();
        assertTrue(test.prop);
    },

    testOverConstructorInheritance: function () {
        var TestClass1 = Object.extend({
            constructor: function () {
                this.prop = true;
            }
        });

        var TestClass2 = TestClass1.extend({
        });

        var TestClass3 = TestClass2.extend({
            constructor: function () {
                this.prop = false;
                this.inherited();
            }
        });

        var test = new TestClass3();
        assertFalse(test.prop);
    }
});
