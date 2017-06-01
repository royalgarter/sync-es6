'use strict';

module.exports = (generator, ... args) => { 
	const cb = (args.length && typeof args[args.length-1] === 'function') 
						? args[args.length-1] : null;

	const callAsync = (funcAndArgs, callback) => {
		let argsOnly = Array.prototype.slice.call(funcAndArgs, 1);
		argsOnly.push(callback);
		funcAndArgs[0].apply(funcAndArgs[0], argsOnly);
	}

	const iter = generator.apply(generator, args);
	
	iter.breaker = {flag: false, err: null, data: null};
	iter.break = (err, data) => iter.breaker = {flag: true, err: err, data: data};
	
	iter.loop = (err, data) => {
		if (err) return (cb ? (iter.return() & cb(err)) : iter.throw(err));
		
		const nextPart = iter.next(data);

		if (iter.breaker.flag)
			return iter.return() & (cb && cb(iter.breaker.err, iter.breaker.data));
		
		if (nextPart.done) return cb && cb(null, nextPart.value);
			
		return callAsync(nextPart.value, iter.loop);
	};
	iter.loop();
	
	return iter;
}