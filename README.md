# mockito4js
A JavaScript API that can be used to spy on functions and objects using a syntax inspired by Mockito.

[![Build Status](https://travis-ci.org/mikedeswert/mockito4js.png)](https://travis-ci.org/mikedeswert/mockito4js)

## Installation

```shell
bower install mockito4js
```

## Documentation

### globalize

If you're convinced that the mockito4js API will not conflict with other libraries then you can use the globalize function at the start of your tests.  

```js
mockito4js.globalize();
```

The globalize function puts the mockito4js functions on the global scope, thus increasing readability by removing the need to call the functions on the mockito4js object.

```js
mockito4js.verify(spy, mockito4js.once()).functionToVerify();

// becomes

verify(spy, once()).functionToVerify();
```

### reset

Reset all invocation counts of a given spy to zero.

```js
mockito4js.reset(spy);
```

### spy

Modifies and returns the given **Object** or **Function** so that certain function calls can be verified. Creating a spy now also implicitly calls mockito4js.reset() if the object was already a spy.

```js
var object = {};
var spy = mockito4js.spy(object);

var fn = function() {};
var spy = mockito4js.spy(fn);
```

### verify

Verifies the number of **functionToVerify** invocations of the given **spy** based on the given **Verifier**.  
If no arguments are passed to **functionToVerify** then all invocations to the function are counted.  
If arguments are passed to **functionToVerify**, then only invocations with those arguments in that specific order are counted.  
Verify throws an error when its conditions are not satisfied and thus fails the test it is used in.

```js
mockito4js.verify(objectSpy, mockito4js.once()).functionToVerify("argument");
```

```js
mockito4js.verify(functionSpy, mockito4js.once()).wasCalled();  
mockito4js.verify(functionSpy, mockito4js.once()).wasCalledWith("argument");;
```

#### verifiers
```js
mockito4js.never();
// verifies that there were no invocations

mockito4js.once();
// verifies that there was exactly one invocation

mockito4js.times(2);
// verifies that the number of invocations is equal to the expected amount

mockito4js.atLeast(1);
// verifies that the number of invocations is equal to or greater than the expected amount

mockito4js.atMost(2);
// verifies that number of invocations is equal to or less than the expected amount
```

### any

Any can be used when you don't care about the specific value of an argument but do want to check its type.
It can be used either with the **mockito4js.verify()** or the **"doMethods"**.

```js
mockito4js.verify(spy, mockito4js.once()).functionToVerify(mockito4js.any(String));

mockito4js.doReturn("return value").when(spy).functionToMock(mockito4js.any('string'));
```

*Examples:*
```js
spy.someFunction(new String('string'));  
mockito4js.verify(spy, mockito4js.once()).someFunction(mockito4js.any(String)); // => No error

spy.someFunction('string');  
mockito4js.verify(spy, mockito4js.once()).someFunction(mockito4js.any(String)); // => Error
   
spy.someFunction(new String('string'));  
mockito4js.verify(spy, mockito4js.once()).someFunction(mockito4js.any('string')); // => Error
   
spy.someFunction('string');  
mockito4js.verify(spy, mockito4js.once()).someFunction(mockito4js.any('string')); // => No Error
```

### eq

Eq can be used when you want to compare arguments by value and not by reference.
It can be used either with the **mockito4js.verify()** or the **"doMethods"**.

```js
mockito4js.verify(spy, mockito4js.once()).functionToVerify(mockito4js.eq("argument"));

mockito4js.doReturn("return value").when(spy).functionToMock(mockito4js.eq("argument"));
```

*Examples:*
```js   
// Objects  
spy.someFunction({key: 'value'});  
mockito4js.verify(spy, mockito4js.once()).someFunction(mockito4js.eq({key:'value'})); // => No error
   
spy.someFunction({key: 'value'});  
mockito4js.verify(spy, mockito4js.once()).someFunction(mockito4js.eq({key: 'other value'})); // => Error

// Arrays  
spy.someFunction(['value']);  
mockito4js.verify(spy, mockito4js.once()).someFunction(mockito4js.eq(['value'])); // => No error
   
spy.someFunction(['value']);  
mockito4js.verify(spy, mockito4js.once()).someFunction(mockito4js.eq(['other value'])); // => Error
   
// Functions  
spy.someFunction(function() { return true; });  
mockito4js.verify(spy, mockito4js.once()).someFunction(mockito4js.eq(function() { return true; })); // => No error
   
spy.someFunction(function() { return true; });  
mockito4js.verify(spy, mockito4js.once()).someFunction(mockito4js.eq(function() { return false; })); // => Error
```

### Argument Captors

Argument captors can be used when you want to do assertions on an argument passed to a function.
It can be used either with the **mockito4js.verify()** or the **"doMethods"**.  
Calling verify with an argument captor will never throw an error **unless** the number of arguments passed to the actual method are not the same.  
The **getValue()** of the argument captor will always return the last value it captured.

```js
// Verify
var argumentCaptor = mockito4js.createArgumentCaptor();
mockito4js.verify(spy, mockito4js.once()).functionToVerify(argumentCaptor);

spy.functionToVerify("argument of verify");
alert(argumentCaptor.getValue()) // => "argument of verify"

// Do
mockito4js.doReturn("return value").when(spy).functionToVerify(argumentCaptor);

spy.functionToVerify("argument of do");
alert(argumentCaptor.getValue()) // => "argument of do"
```

### doReturn

Returns the **return value** when **functionToMock** is called with given **arguments**.

```js
// For object spy
mockito4js.doReturn("return value").when(spy).functionToMock("argument");

// For function spy
mockito4js.doReturn("return value").when(spy).isCalled();  
mockito4js.doReturn("return value").when(spy).isCalledWith("argument");
```

Return the **return value** when property with **propertyName** is accessed on given object spy.

```js
mockito4js.doReturn("return value").when(spy).readsProperty("propertyName");
```

### doNothing

Replaces the **functionToMock** with a function that does nothing when it is called with given **arguments**.

```js
// For object spy
mockito4js.doNothing().when(spy).functionToMock("argument");

// For function spy
mockito4js.doNothing().when(spy).isCalled();  
mockito4js.doNothing().when(spy).isCalledWith("argument");
```

### doThrow

Throws the given **Error** when **functionToMock** is called with given **arguments**.

```js
// For object spy
mockito4js.doThrow(new Error("Oh no!")).when(spy).functionToMock("argument");

// For function spy
mockito4js.doThrow(new Error("Oh no!")).when(spy).isCalled();  
mockito4js.doThrow(new Error("Oh no!")).when(spy).isCalledWith("argument");
```

### doFire

Fires an event with the given **eventName** on the given **DOM element** when **functionToMock** is called with given **arguments**.

```js
// For object spy
mockito4js.doFire("onclick").on(domElement).when(spy).functionToMock("argument");

// For function spy
mockito4js.doFire("onclick").on(domElement).when(spy).isCalled();  
mockito4js.doFire("onclick").on(domElement).when(spy).isCalledWith("argument");
```

## License

Licensed under MIT
