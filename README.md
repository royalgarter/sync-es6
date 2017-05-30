## About

The most native and simplest way to write-in-sync
This library is written purely in ES6 without any dependency
Still non-blocking node's event loop
NO Promise, async/await involved

## Install

* npm i sync-es6 --save

## Usage

**Step 0**: make sure all of your callback functions will be callbacked as "function (err, result) {}" format
* 1st param: error indicated (usually null)
* 2nd param: real return value

**Step 1**: define wraper function as a generator function, and call inside functions in sync 
```javascript
function* writeSyncInside(args1, args2) { 
	let returnValue1 = yield [callback_function, arg1];
	let returnValue2 = yield [another_callback_function, arg2];

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

```javascript
const _sync = require('sync-es6');

const demoCallback = (v1, v2, callback) => {
	setTimeout( () => {
		console.log('\ndemoCallback v1', v1, 'v2', v2);
		
		// uncomment if you want to test error case
		// if (v1 == 5 || v1 == 'c') return callback('ECRASH');
		
		return callback(null, 'Done:' + v1 + v2);
	}, 1e3)
}

function* demoGeneratorSub(ref) {
	const dataA = yield [demoCallback, 'a', 'b'];
	console.log('dataA', dataA);

	const dataB = yield [demoCallback, 'c', 'd'];
	console.log('dataB', dataB);

	return dataB;
}

// Inside this function you can execute callback function in sync (Bye bye CALLBACK HELL!!!)
_sync(function* demoGenerator(args1, args2) {

	console.log('args', args1, args2);

	const data1 = yield [demoCallback, 1, 2];
	console.log('data1', data1);

	const data2 = yield [demoCallback, 3, 4];
	console.log('data2', data2);

	// You can even call another sub sync function as ease
	const data3 = yield [_sync, demoGeneratorSub]
	console.log('data3', data3);

	const data4 = yield [demoCallback, 5, 6];
	console.log('data4', data4);

	const data5 = yield [demoCallback, 7, 8];
	console.log('data5', data5);

	return data5;
}, 'a', 'b', (err, val) => {
	console.log('finalcallback', err, val);
});
```


### Credit:

I write this library in thanks of Mr.Luciotato that looking into his code help me learn about generator function. I guess that because of he want the wait.for-es6 should be backward compatible with wait.for (ES5) so there something messy if you wall to call multiple async functions inside each others (with the "onComplete" event) OR maybe just I don't know how to use it properly. So I decide to seperate with a little modification to make it easier to use.
* [wait.for-es6](https://www.npmjs.com/package/wait.for-es6) 