# mockito4js
A small JavaScript library that can be used to mock functions and spy on objects. The syntax is heavily inspired by the Mockito library used for testing Java applications.

## API

### spy

Modifies and returns the given **Object** so that certain function calls can be verified.

*Currently this function only supports Objects. Support for Functions might be added in the future.

var objectSpy = mockito4js.spy(**[Object]**);

### verify

Verifies the number of **functionToVerify** invocations of the given **spy** based on the given **Verifier**. If no arguments are passed to the **functionToVerify** then all invocations to the function are counted.
If arguments are passed to the **functionToVerify**, then only invocations with those arguments in that specific order are counted.

mockito4js.verify(**[spy]**, **[Verifier]**)**.funcitonToVerify([arguments])**

#### verifiers
* mockito4js.never() 
   
   *verifies if there were no invocations*
* mockito4js.times(**[expectedInvocationCount]**) 
   
   *verifies if number of invocations is equal to the expectedInvocationCount*
* mockito4js.atLeast(**[expectedInvocationCount]**) 
   
   *verifies if number of invocations is equal to or greater than the expectedInvocationCount*
* mockito4js.atMost(**[expectedInvocationCount]**) 
   
   *verifies if number of invocations is equal to or less than the expectedInvocationCount*


### doReturn

Returns the **[return value]** when **functionToMock** is called. If the argument passed to when is a function, the **functionToMock** becomes optional.

*Currently the "do" methods return the value regardless of the arguments passed to the functionToMock. I'm planning to add this support in the future though.*

mockito4js.doReturn(**[return value]**).when(**[Object | Function | spy]**)**.functionToMock()**;

### doNothing

Replaces the **functionToMock** with a function that does nothing. If the argument passed to when is a function, the **functionToMock** becomes optional.

*Currently the "do" methods return the value regardless of the arguments passed to the functionToMock. I'm planning to add this support in the future though.*

mockito4js.doNothing().when(**[Object | Function | spy]**)**.functionToMock()**;

### doThrow

Throws the given **Error** when **functionToMock** is called. If the argument passed to when is a function, the **functionToMock** becomes optional.

*Currently the "do" methods return the value regardless of the arguments passed to the functionToMock. I'm planning to add this support in the future though.*

mockito4js.doThrow(**[Error]**).when(**[Object | Function | spy]**)**.functionToMock()**;

### doFire

Fires an event with the given **eventName** on the given **DOM element** when **functionToMock** is called. If the argument passed to when is a function, the **functionToMock** becomes optional.

*Currently the "do" methods return the value regardless of the arguments passed to the functionToMock. I'm planning to add this support in the future though.*

mockito4js.doFire(**[eventName]**).on(**[DOM element]**).when(**[Object | Function | spy]**)**.functionToMock()**;
