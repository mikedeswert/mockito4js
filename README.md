# mockito4js
A small JavaScript library that can be used to mock functions and spy on objects. The syntax is heavily inspired by the Mockito library used for testing Java applications.

[![Build Status](https://travis-ci.org/mikedeswert/mockito4js.png)](https://travis-ci.org/mikedeswert/mockito4js)

## Installation

```shell
bower install mockito4js
```

## Documentation

### globalize

If you're convinced that the mockito4js API will not conflict with other libraries then you can use the globalize function at the start of your tests.  
The globalize function puts the mockito4js functions on the global scope, thus increasing readability by removing the need to call the functions on the mockito4js object.

mockito4js.globalize();

**mockito4js.verify**(spy, **mockito4js.once**()).functionToVerify() **=>** **verify**(spy, **once**()).functionToVerify();

### spy

Modifies and returns the given **Object** or **Function** so that certain function calls can be verified.

var objectSpy = mockito4js.spy(**[Object | Function]**);

### verify

Verifies the number of **functionToVerify** invocations of the given **spy** based on the given **Verifier**.  
If no arguments are passed to the **functionToVerify** then all invocations to the function are counted.  
If arguments are passed to the **functionToVerify**, then only invocations with those arguments in that specific order are counted.  
Verify throws an error when its conditions are not satisfied and thus fails the test it is used in.

mockito4js.verify(**[spy]**, **[Verifier]**)**.funcitonToVerify([arguments])**

#### verifiers
* mockito4js.never() 
   
   *verifies if there were no invocations*
* mockito4js.once() 
   
   *verifies that there was exactly one invocation*
* mockito4js.times(**[expectedInvocationCount]**) 
   
   *verifies if number of invocations is equal to the expectedInvocationCount*
* mockito4js.atLeast(**[expectedInvocationCount]**) 
   
   *verifies if number of invocations is equal to or greater than the expectedInvocationCount*
* mockito4js.atMost(**[expectedInvocationCount]**) 
   
   *verifies if number of invocations is equal to or less than the expectedInvocationCount*

### any

Any can be used when you don't care about the specific value of an argument but do want to check its type.
It can be used either with the **mockito4js.verify()** or the **"doMethods"**.

mockito4js.verify([spy], [Verifier]).funcitonToVerify(**mockito4js.any([ArgumentType | 'argumentType'])**);

mockito4js.doReturn([return value]).when([spy]).functionToMock(**mockito4js.any([ArgumentType | 'argumentType'])**);

   *Ex.*
   
   *spy.someFunction(new String('string'));  
   mockito4js.verify(spy, mockito4js.once()).someFunction(mockito4js.any(String));* **=> No error**
   
   *spy.someFunction('string');  
   mockito4js.verify(spy, mockito4js.once()).someFunction(mockito4js.any(String));* **=> Error**
   
   *spy.someFunction(new String('string'));  
   mockito4js.verify(spy, mockito4js.once()).someFunction(mockito4js.any('string'));* **=> Error**
   
   *spy.someFunction('string');  
   mockito4js.verify(spy, mockito4js.once()).someFunction(mockito4js.any('string'));* **=> No Error**

### doReturn

Returns the **[return value]** when **functionToMock** is called.

mockito4js.doReturn(**[return value]**).when(**[spy]**)**.functionToMock()**;

Return the **[return value]** when property with **[propertyName]** is accessed.

mockito4js.doReturn(**[return value]**).when(**[spy]**).readsProperty(**[propertyName]**)

### doNothing

Replaces the **functionToMock** with a function that does nothing.

mockito4js.doNothing().when(**[spy]**)**.functionToMock()**;

### doThrow

Throws the given **Error** when **functionToMock** is called.

mockito4js.doThrow(**[Error]**).when(**[spy]**)**.functionToMock()**;

### doFire

Fires an event with the given **eventName** on the given **DOM element** when **functionToMock** is called.

mockito4js.doFire(**[eventName]**).on(**[DOM element]**).when(**[spy]**)**.functionToMock()**;

## License

Licensed under MIT
