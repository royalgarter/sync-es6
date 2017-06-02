'use strict';

module.exports = (fn, ... args) => { 
	const cb = (args.length && typeof args[args.length-1] === 'function') 
				? args[args.length-1] : null;
	
	const finish = (err, result, iter) => (iter && iter.return()) & (cb && cb(err, result));

	const callAsync = (funcAndArgs, callback) => {
		const argsOnly = Array.prototype.slice.call(funcAndArgs, 1);
		argsOnly.push(callback);
		funcAndArgs[0].apply(funcAndArgs[0], argsOnly);
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