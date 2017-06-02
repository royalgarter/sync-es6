## About

The most native and simplest way to write-in-sync

This library is written purely in ES6 without any dependency

Still non-blocking node's event loop

Fully compatible with all other libraries (such as [async](https://www.npmjs.com/package/async))

NO Promise, async/await involved

## Install

* npm i sync-es6 --save

## Usage

**CALLBACK HELL**:

```javascript
main(callback) {
	async_function(arg1, (err, result1) => {
		another_async_function(arg2, (err, result2) => {
			return callback && callback(null, result1 + result2);
		});
	});
}
```

**Step 0**: make sure all of your callback functions will be callbacked as "function (err, result) {}" format
* 1st param: error indicated (usually null)
* 2nd param: real return value

**Step 1**: define wraper function as a generator function, and call inside functions in sync 
```javascript
function* writeSyncInside(args1, args2) { 
	let returnValue1 = yield [async_function, arg1];
	let returnValue2 = yield [another_async_function, arg2];

	return returnValue1 + returnValue2;
}
```

**Step 2**: CALL IT with sync
```javascript
const _sync = require('sync-es6');

_sync(writeSyncInside /*,args1, args2, ... , callback*/);
// optional callback function at last argument, nice to have in case of error occurred
```

### Sample code:
* [See here, it's very short I swear!!!](https://github.com/royalgarter/sync-es6/blob/master/test.js)

### Syntax:

```javascript
let iterator = _sync(runner,args1, args2, ... , finalcallback);
```

* Parameters
	* **runner** *(required)*: a generator function OR object ```{generator: function*, isTolerant: boolean}```
	    * **isTolerant** *(optional, default "false")*: if it's "true", when an error occurred in inside async function (when callback ```return (err)```) the runner will not throw & break to finalcallback (if existed) and just ```return undefined```
	* **args** *(optional)*: input params for generator function
	* **finalcallback** *(optional)*: catch error & final result for runner, if it's undefined the runner will throw() when error occurred

* Return
	* **iterator** *(optional)*: IT'S NOT final result value, just a [iterator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols). Normally you wouldn't use it.


### Credit:

I write this library in thanks of Mr.Luciotato that looking into his code help me learn about generator function. I guess that because of he want the wait.for-es6 should be backward compatible with wait.for (ES5) so there something messy if you wall to call multiple async functions inside each others (with the "onComplete" event) OR maybe just I don't know how to use it properly. So I decide to seperate with a little modification to make it easier to use.
* [wait.for-es6](https://www.npmjs.com/package/wait.for-es6) 