'use strict';

module.exports = (fn, ... args) => { 
	const cb = (args.length && typeof args[args.length-1] === 'function') 
				? args[args.length-1] : null;

	const isPromise = x => !!x && ~['object', 'function'].indexOf(typeof x)
							&& typeof x.then === 'function' 
							&& typeof x.catch === 'function';
	
	const finish = (error, result, iterator) => {
		if (iterator) {
			if (iterator.isFinished) return;

			iterator.isFinished = true;
			iterator.return();
		}

		return cb && cb(error, result);
	}

	const callAsync = (fnNArgs, callback) => {
		const argsOnly = Array.prototype.slice.call(fnNArgs, 1);
		argsOnly.push(callback);

		let tmp = fnNArgs[0].apply(fnNArgs[0], argsOnly);

		if (isPromise(tmp)) {
			// console.log('tmp is Promise')
			tmp.then( pPesult => callback(null, pPesult) )
				.catch( pError => callback(pError) );
		}
	}

	const TEMPLATE = {
		generator: typeof fn === 'function' ? fn : null, 
		breaker: {flag: false, err: null, data: null},
		isTolerant: false,
		isFinished: false,
		isPromise: isPromise
	};

	if (typeof fn === 'object') Object.assign(TEMPLATE, fn);

	if (!TEMPLATE.generator) return finish('EGENERATORMISSING');

	const _iter = TEMPLATE.generator.apply(TEMPLATE.generator, args);
	Object.assign(_iter, TEMPLATE);

	_iter.break = (err, data) => _iter.breaker = {flag: true, err: err, data: data};

	_iter._loop = (err, data) => {
		if (err) {
			if (_iter.isTolerant) data = void 0;
			else return cb ? finish(err, data, _iter) : _iter.throw(err);
		} 

		const nextPart = _iter.next(data);

		if (_iter.breaker.flag) 
			return finish(_iter.breaker.err, _iter.breaker.data, _iter);
		
		if (nextPart.done) 
			return finish(null, nextPart.value, _iter);
		
		return callAsync(nextPart.value, _iter._loop);
	};
	_iter._loop();
	
	return _iter;
}