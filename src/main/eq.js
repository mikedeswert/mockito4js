getMockito4jsBuilder().Eq = function(mockito4js) {
    mockito4js.eq = function (value) {
        return new Eq(value);
    };

    function Eq(value) {
        this.value = value;

        this.matches = function (argument) {
            try {
                return deepCompare(this.value, argument);
            } catch (error) {
                return false;
            }
        };
    }

    function deepCompare (x, y) {
        var leftChain = [],
            rightChain = [];

        return compareObjects(x, y);

        function compareObjects (x, y) {
            if(areBothNaN(x, y)) return true;

            if (x === y) {
                return true;
            }

            if ((typeof x === 'function' && typeof y === 'function') ||
                (x instanceof Date && y instanceof Date) ||
                (x instanceof RegExp && y instanceof RegExp) ||
                (x instanceof String && y instanceof String) ||
                (x instanceof Number && y instanceof Number)) {
                return x.toString() === y.toString();
            }

            if(!arePrototypesEqual(x, y)) return false;

            if(haveCircularReferences(x, y)) return false;

            if(!isSubset(x, y)) return false;

            return arePropertiesEqual(x, y);
        }

        function areBothNaN(x, y) {
            return isNaN(x) && isNaN(y) && typeof x === 'number' && typeof y === 'number';
        }

        function haveCircularReferences(x, y) {
            return leftChain.indexOf(x) > -1 || rightChain.indexOf(y) > -1;
        }

        function isSubset(x, y) {
            for (var p in y) {
                if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
                    return false;
                }
                else if (typeof y[p] !== typeof x[p]) {
                    return false;
                }
            }

            return true;
        }

        function arePrototypesEqual(x, y) {
            if (!(x instanceof Object && y instanceof Object)) {
                return false;
            }

            if (x.isPrototypeOf(y) || y.isPrototypeOf(x)) {
                return false;
            }

            if (x.constructor !== y.constructor) {
                return false;
            }

            return x.prototype === y.prototype;
        }

        function arePropertiesEqual(x, y) {
            for (var p in x) {
                if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
                    return false;
                }
                else if (typeof y[p] !== typeof x[p]) {
                    return false;
                }

                switch (typeof (x[p])) {
                    case 'object':
                    case 'function':

                        leftChain.push(x);
                        rightChain.push(y);

                        if (!compareObjects (x[p], y[p])) {
                            return false;
                        }

                        leftChain.pop();
                        rightChain.pop();
                        break;

                    default:
                        if (x[p] !== y[p]) {
                            return false;
                        }
                        break;
                }
            }

            return true;
        }
    }
};