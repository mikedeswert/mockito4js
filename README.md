# mockito4js
A small JavaScript library that can be used to mock functions and spy on objects. The syntax is heavily inspired by the Mockito library used for testing Java applications.

## Installation

```shell
bower install mockito4js
```

## Documentation

### spy

Modifies and returns the given **Object** so that certain function calls can be verified.

*Currently this function only supports Objects. Support for Functions might be added in the future.*

var objectSpy = mockito4js.spy(**[Object]**);

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

mockito4js.verify([spy], [Verifier]).funcitonToVerify(**mockito4js.any([ArgumentType || 'argumentType'])**);

mockito4js.doReturn([return value]).when([Object | spy]).functionToMock(**mockito4js.any([ArgumentType || 'argumentType'])**);

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

mockito4js.doReturn(**[return value]**).when(**[Object | spy]**)**.functionToMock()**;

### doNothing

Replaces the **functionToMock** with a function that does nothing.

mockito4js.doNothing().when(**[Object | spy]**)**.functionToMock()**;

### doThrow

Throws the given **Error** when **functionToMock** is called.

mockito4js.doThrow(**[Error]**).when(**[Object | spy]**)**.functionToMock()**;

### doFire

Fires an event with the given **eventName** on the given **DOM element** when **functionToMock** is called.

mockito4js.doFire(**[eventName]**).on(**[DOM element]**).when(**[Object | spy]**)**.functionToMock()**;

## License

Licensed under GPLv3
