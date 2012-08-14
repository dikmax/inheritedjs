a = {};

TestA = createClass(
    /** @lends TestA */
    {
        name: 'st.a.very.long.namespace.TestA',

        /** @constructs */
        constructor: function () {
            console.log('Constructor TestA');
            this.a = 1;
        },

        testMethod1: function () {
            console.log('TestA.testMethod1');
        },
        testMethod2: function (param) {
            console.log('TestA.testMethod2 ' + param);
        }
    }
);

console.log(new TestA);
/**
 * @type {*}
 * @extends TestA
 */
TestB = createClass({
    name: 'st.TestB',

    constructor: function TestB() {
        console.log('Constructor TestB');
        this.b = 2;
        this.inherited();
    },
    extend: TestA,

    testMethod1: function () {
        this.inherited();
        console.log('TestB.testMethod1');
    },
    testMethod2: function (param) {
        this.inherited(param + 'asdf');
        console.log('TestB.testMethod2 ' + param);
    }
});

var testB = new TestB;
testB.testMethod1();
testB.testMethod2('qwer');
