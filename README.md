## Install

* npm i sync-es6 --save

## Usage

Step 0: make sure all of your callback functions will be callbacked as (err, result) format
* 1st param: error indicated (usually null)
* 2nd param: real return value

Step 1: define wraper function as a generator function
* function* writeSyncInside(args1, args2) { }

Step 2: call functions in sync 
* let <returnValue> = yield [ <callback_function>, arg1, arg2 ... ]


### Sample code:

```javascript
const _sync = require('sync-es6');

const demoCallback = (v1, v2, callback) => {
	setTimeout( () => {
		console.log('\ndemoCallback v1', v1, 'v2', v2);
		return callback(null, 'demoCallback done' + v1 + v2);
	}, 1e3)
}

function* demoGeneratorSub(ref) {
	const dataA = yield [demoCallback, 'a', 'b'];
	console.log('dataA', dataA);

	const dataB = yield [demoCallback, 'c', 'd'];
	console.log('dataB', dataB);

	return dataB;
}

function* demoGenerator(args1, args2) {

	console.log('args', args1, args2);

	const data1 = yield [demoCallback, 1, 2];
	console.log('data1', data1);

	const data2 = yield [demoCallback, 3, 4];
	console.log('data2', data2);

	const data3 = yield [_sync, demoGeneratorSub]
	console.log('data3', data3);

	const data4 = yield [demoCallback, 5, 6];
	console.log('data4', data4);

	const data5 = yield [demoCallback, 7, 8];
	console.log('data5', data5);

	return data5;
}

_sync(demoGenerator, 'a', 'b', (err, val) => {
	console.log('finalcallback', val);
});
```