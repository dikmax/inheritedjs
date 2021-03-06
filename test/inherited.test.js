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

    testInheritedStaticConstruct: function () {
        var TestClass = Object.__extend__({
            item: __static__(true)
        });
        var TestClass2 = TestClass.__extend__({
        });

        var test = new TestClass();
        TestClass.item = false;
        assertTrue(TestClass2.item);
    },

    testInheritedStaticCall: function () {
        var TestClass = Object.__extend__({
            method: __static__(function() {
                return true
            })
        });
        var TestClass2 = TestClass.__extend__({
            method: __static__(function () {
                return this.inherited();
            })
        });
        assertTrue(TestClass2.method());
    },

    testInheritedLateStaticBinding: function () {
        var TestClass = Object.__extend__({
            method: __static__(function() {
                this.item = true;
            })
        });
        var TestClass2 = TestClass.__extend__({
            method: __static__(function () {
                this.item = false;
                return this.inherited();
            })
        });
        TestClass2.method();
        assertTrue(TestClass2.item);
        assertUndefined(TestClass.item);
    },

    testPropertySimple: function () {
        var TestClass = Object.__extend__({
            prop: __property__({
                set: true,
                get: true,
                default: true
            })
        });

        var test = new TestClass();
        test.prop = true;
        assertTrue(test.prop);
    },

    testPropertyCustomGetter: function () {
        var TestClass = Object.__extend__({
            prop: __property__({
                set: true,
                get: function (storage) {
                    return storage.prop + 1;
                }
            })
        });

        var test = new TestClass();
        test.prop = 2;
        assertSame(3, test.prop);
    },

    testPropertyCustomSetter: function () {
        var TestClass = Object.__extend__({
            prop: __property__({
                set: function (value, storage) {
                    storage.prop = value + 1;
                },
                get: true
            })
        });

        var test = new TestClass();
        test.prop = 2;
        assertSame(3, test.prop);
    },

    testPropertyIndependence: function () {
        var TestClass = Object.__extend__({
            prop: __property__({
                set: true,
                get: true
            })
        });

        var test1 = new TestClass();
        test1.prop = 1;
        var test2 = new TestClass();
        test2.prop = 2;
        assertSame(1, test1.prop);
        assertSame(2, test2.prop);
    },

    testPropertyDefaultValue: function () {
        var TestClass = Object.__extend__({
            prop: __property__({
                set: true,
                get: true,
                default: 1
            })
        });

        var test = new TestClass();
        assertSame(1, test.prop);
        test.prop = 2;
        var test2 = new TestClass();
        assertSame(1, test2.prop);
    },

    testPropertyInheritance: function () {
        var TestClass = Object.__extend__({
            prop: __property__({
                set: true,
                get: function (storage) {
                    return storage.prop + 1;
                }
            })
        });

        var TestClass2 = TestClass.__extend__();

        var test = new TestClass2();
        test.prop = 2;
        assertSame(3, test.prop);
    },

    testPropertyInheritedDefaultValue: function () {
        var TestClass = Object.__extend__({
            prop: __property__({
                set: true,
                get: true,
                default: 1
            })
        });

        var TestClass2 = TestClass.__extend__();

        var test = new TestClass();
        assertSame(1, test.prop);
        test.prop = 2;
        var test2 = new TestClass2();
        assertSame(1, test2.prop);
        assertSame(2, test.prop);
    }

});
