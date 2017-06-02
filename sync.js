'use strict';

module.exports = (fn, ... args) => { 
	const cb = (args.length && typeof args[args.length-1] === 'function') 
						? args[args.length-1] : null;

	const callAsync = (funcAndArgs, callback) => {
		let argsOnly = Array.prototype.slice.call(funcAndArgs, 1);
		argsOnly.push(callback);
		funcAndArgs[0].apply(funcAndArgs[0], argsOnly);
	}

	let obj = {
		generator: typeof fn === 'function' ? fn : null, 
		isTolerant: false,
		// breaker: {flag: false, err: null, data: null},
	};

	if (typeof fn === 'object') obj = Object.assign(obj, fn);

	if (!obj.generator) return cb && cb('EMISSGENERATOR');

	let iter = obj.generator.apply(obj.generator, args);
	iter = Object.assign(iter, obj);

	// iter.break = (err, data) => iter.breaker = {flag: true, err: err, data: data};

	iter.loop = (err, data) => {
		if (err) {
			if (iter.isTolerant) data = void 0;
			else return cb ? iter.return() & cb(err) : iter.throw(err);
		} 

		const nextPart = iter.next(data);

		// if (iter.breaker.flag)
		// 	return iter.return() & (cb && cb(iter.breaker.err, iter.breaker.data));
		
		if (nextPart.done) return cb && cb(null, nextPart.value);
			
		return callAsync(nextPart.value, iter.loop);
	};
	iter.loop();
	
	return iter;
}