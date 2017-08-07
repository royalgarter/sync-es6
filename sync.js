'use strict';

module.exports = (fn, ... args) => { 
	const cb = (args.length && typeof args[args.length-1] === 'function') 
				? args[args.length-1] : null;
	
	const finish = (err, result, iter) => (iter && iter.return()) & (cb && cb(err, result));

	const callAsync = (fnNArgs, callback) => {
		const argsOnly = Array.prototype.slice.call(fnNArgs, 1);
		argsOnly.push(callback);
		
		let obj = fnNArgs[0].apply(fnNArgs[0], argsOnly);

		if (!!obj && (typeof obj === 'object' || typeof obj === 'function') 
			&& typeof obj.then === 'function' && typeof obj.catch === 'function') {
			// console.log('obj is Promise')
			obj.then(pPesult => callback(null, pPesult)).catch(pError => callback(pError));
		}
			
	}

	const obj = {
		generator: typeof fn === 'function' ? fn : null, 
		breaker: {flag: false, err: null, data: null},
		isTolerant: false,
	};

	if (typeof fn === 'object') Object.assign(obj, fn);

	if (!obj.generator) return finish('EMISSGENERATOR');

	const iter = obj.generator.apply(obj.generator, args);
	Object.assign(iter, obj);

	iter.break = (err, data) => iter.breaker = {flag: true, err: err, data: data};

	iter._loop = (err, data) => {
		if (err) {
			if (iter.isTolerant) data = void 0;
			else return cb ? finish(err, data, iter) : iter.throw(err);
		} 

		const nextPart = iter.next(data);

		if (iter.breaker.flag)
			return finish(iter.breaker.err, iter.breaker.data, iter);
		
		if (nextPart.done) return finish(null, nextPart.value);
			
		return callAsync(nextPart.value, iter._loop);
	};
	iter._loop();
	
	return iter;
}