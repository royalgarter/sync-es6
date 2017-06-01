'use strict';

module.exports = (generator, ... args) => { 
	const callback = (args.length && typeof args[args.length-1] === 'function') 
						? args[args.length-1] : null;

	const callAsync = (funcAndArgs, callback) => {
		let argsOnly = Array.prototype.slice.call(funcAndArgs, 1);
		argsOnly.push(callback);
		funcAndArgs[0].apply(funcAndArgs[0], argsOnly);
	}

	const iterator =  generator.apply(generator, args);
	
	iterator.isBreak = false;
	iterator.dataBreak = null;
	iterator.break = (data) => {
		iterator.isBreak = true;
		iterator.dataBreak = data;
	}
	
	iterator.loop = (err, data) => {
		if (err) return (callback ? (iterator.return() & callback(err)) : iterator.throw(err));
		
		const nextPart = iterator.next(data);

		if (iterator.isBreak) {
			callback && callback(iterator.dataBreak ? null : 'EBREAK', iterator.dataBreak);
			return iterator.return()
		}
		
		if (nextPart.done) return callback && callback(null, nextPart.value);
			
		return callAsync(nextPart.value, iterator.loop);
	};
	iterator.loop();
	
	return iterator;
}