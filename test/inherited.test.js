TestCase("InheritedTest", {
    testEmptyCall: function() {
        try {
            var TestClass = Object.__extend__();
        } catch (e) {
            fail(e);
        }
    },

    testClassA: function () {
        var TestClass = Object.__extend__('test.TestA', {
            constructor: function () {
                this.prop = 0;
            }
        });
        var testA = new TestClass();
        assertSame("Wrong class name", testA.className_, 'test.TestA');
        assertSame("Constructor TestA wasn't called", testA.prop, 0);
    },

    testWrongInheritedInConstructor: function () {
       var TestClass = Object.__extend__('TestClass',
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
        var TestA = Object.__extend__('test.TestA', {
            constructor: function () {
                this.prop = 0;
            }
        });

        var TestClass = TestA.__extend__('TestClass', {
            constructor: function () {
                this.a = true;
                this.inherited();
            }
        });

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
        var TestClass = Object.__extend__({
            constructor: function () {
                this.prop = true;
            }
        });

        var test = new TestClass();
        assertTrue(test.prop);
    },

    testEmptyNameInheritance: function () {
        var TestClass1 = Object.__extend__({
            constructor: function () {
                this.prop = true;
            }
        });

        var TestClass2 = TestClass1.__extend__({
            constructor: function () {
                this.inherited();
            }
        });

        var test = new TestClass2();
        assertTrue(test.prop);
    },

    testNoConstructor: function () {
        var TestClass = Object.__extend__({
            method: function () {
                this.prop = true;
            }
        });

        var test = new TestClass();
        test.method();
        assertTrue(test.prop);
    },

    testNoConstructorInheritance: function () {
        var TestClass1 = Object.__extend__({
            method: function () {
                this.prop = true;
            }
        });

        var TestClass2 = TestClass1.__extend__({
            method: function() {
                this.inherited();
            }
        });

        var test = new TestClass2();
        test.method();
        assertTrue(test.prop);
    },

    testOverChildInheritance: function () {
        var TestClass1 = Object.__extend__({
            method: function () {
                this.prop = true;
            }
        });

        var TestClass2 = TestClass1.__extend__({});

        var TestClass3 = TestClass2.__extend__({
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
        var TestClass1 = Object.__extend__({
            constructor: function () {
                this.prop = true;
            }
        });

        var TestClass2 = TestClass1.__extend__({
        });

        var TestClass3 = TestClass2.__extend__({
            constructor: function () {
                this.prop = false;
                this.inherited();
            }
        });

        var test = new TestClass3();
        assertFalse(test.prop);
    },

    testInheritedReturn: function () {
        var TestClass = Object.__extend__({
            method: function () {
                return true;
            }
        });

        var TestClass2 = TestClass.__extend__({
            method: function () {
                return this.inherited();
            }
        });

        var test = new TestClass2();
        assertTrue(test.method());
    },

    testSimpleStatic: function () {
        var TestClass = Object.__extend__({
            item: __static__(true)
        });

        var test = new TestClass();
        assertTrue(test.__static.item);
        TestClass.item = false;
        assertFalse(test.__static.item);
        var test2 = new TestClass();
        test2.__static.item = true;
        assertTrue(test.__static.item);
    },

    testInheritedStatic: function () {
        var TestClass = Object.__extend__({
            item: __static__(true)
        });
        var TestClass2 = TestClass.__extend__({
        });

        var test = new TestClass();
        TestClass.item = false;
        assertTrue(TestClass2.item);
    }
});
