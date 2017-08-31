'use strict';

// const _sync = require('sync-es6'); /*How to call in your code*/
const _sync = require('./sync.js');
const _request = require('request-promise');

const demoPromise = (v1, v2) => {
	return new Promise( (resolve, reject) => {
		console.log('\demoPromise v1', v1, 'v2', v2);

		setTimeout( () => {
			return resolve('Promise success:' + v1 + v2);

			// return reject(new Error('Promise failed'));
		}, 1e3)
	});
}

const demoAsync = (v1, v2, callback) => {
	setTimeout( () => {
		console.log('\ndemoAsync v1', v1, 'v2', v2);
		
		// Uncomment if you want to test error case
		// if (v1 == 5 || v1 == 'c') return callback('ECRASH');
		
		return callback(null, 'Async success: ' + v1 + v2);
	}, 1e3)
}

function* demoGenerator() {
	let demo = yield [null, demoPromise, 'a', 'b'];
	console.log('demo', demo)

	let html = yield [null, _request, 'http://www.google.com'];
	console.log('google', html.length)

	html = yield [null, _request, 'http://www.bing.com'];
	console.log('bing', html.length)
	
	return html;
}

let iter = _sync({generator: demoGenerator, isTolerant: true}, (err, val) => {
	console.log('\nEND:', {err: err, val: typeof val});
});


// _request('http://www.google.com')
// .then(function (htmlString) {
// 	console.log('htmlString', htmlString.length) 
// })
// .catch(function (err) {
// 	console.log('err', err)
// });