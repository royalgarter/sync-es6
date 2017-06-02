'use strict';

// const _sync = require('sync-es6'); /*How to call in your code*/
const _sync = require('./sync.js');

const demoAsync = (v1, v2, callback) => {
	setTimeout( () => {
		console.log('\ndemoAsync v1', v1, 'v2', v2);
		
		// Uncomment if you want to test error case
		// if (v1 == 5 || v1 == 'c') return callback('ECRASH');
		
		return callback(null, 'Done: ' + v1 + v2);
	}, 1e3)
}

// A sub wrapper function in case you want to call it from multi main wrapper functions
function* demoGeneratorSub(ref) {
	const dataA = yield [demoAsync, 'a', 'b'];
	console.log('dataA', dataA);

	const dataB = yield [demoAsync, 'c', 'd'];
	console.log('dataB', dataB);

	return {a: dataA, b: dataB};
}

function* demoGenerator(args1, args2) {

	console.log('args', args1, args2);

	const data1 = yield [demoAsync, 1, 2];
	console.log('data1', data1);

	const data2 = yield [demoAsync, 3, 4];
	console.log('data2', data2);

	// You can even call another sub sync function as ease
	const data3 = yield* demoGeneratorSub(); 
	// OR: const data3 = yield [_sync, demoGeneratorSub];
	console.log('data3', data3);

	const data4 = yield [demoAsync, 5, 6];
	console.log('data4', data4);

	// Uncomment if you want to break soon
	// return data4;

	const data5 = yield [demoAsync, 7, 8];
	console.log('data5', data5);

	return data4 + data5;
}

// Simplest call 
// _sync(demoGenerator);

// Full call 
let iter = _sync({generator: demoGenerator, isTolerant: true}, 'hello', 'world', (err, val) => {
	console.log('fullcallback:', {err: err, val: val});
});
