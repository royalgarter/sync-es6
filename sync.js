const _sync = function (fnGenerator /*, args1, args2,... callback*/) { 

	const args = Array.prototype.slice.call(arguments, 1);
	
	let finalCallback = null;
	if (args.length && typeof args[args.length-1] == 'function')
		finalCallback = args[args.length-1];

	const callAsync = (funcAndArgs, callback) => {
		const argsOnly = Array.prototype.slice.call(funcAndArgs, 1);
		argsOnly.push(callback);
		funcAndArgs[0].apply(null, argsOnly);
	}

	const iterator =  fnGenerator.apply(null, args);
	iterator.myCallback = (err, data) => {
		if (err) return finalCallback ? finalCallback(err) : iterator.throw(err);
		
		const nextPart = iterator.next(data);
		
		if (!nextPart.done) 
			return callAsync(nextPart.value, iterator.myCallback);

		return finalCallback && finalCallback(null, nextPart.value);
	};
	iterator.myCallback();
	
	return iterator;
}

module.exports = _sync;