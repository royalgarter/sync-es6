const _sync = require('./sync.js');

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

_sync(function* demoGenerator(args1, args2) {

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
}, 'a', 'b', (err, val) => {
	console.log('finalcallback', err, val);
});
