TestCase("InheritedTest", {
    setUp: function () {
        this.TestA = createClass(
            /** @lends TestA */
            {
                name: 'test.TestA',

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

    testClassA: function () {
        var testA = new this.TestA();
        assertSame("Wrong class name", testA.className_, 'test.TestA');
        assertSame("Constructor TestA wasn't called", testA.prop, 0);
    },

    testWrongInheritedInConstructor: function () {
       var TestClass = createClass(
            /** @lends TestClass */
            {
                name: 'TestClass',

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
        var TestClass = createClass(
            /** @lends TestClass */
            {
                name: 'TestClass',
                extend: this.TestA,

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
    }
});
