var Emitter = require('events').EventEmitter,
Utils = require('util')

var Watchable = function(name) {
	this._name = name
	Emitter.call(this)
}
Utils.inherits(Watchable, Emitter)

Watchable.prototype.emit = function() {
	var event = arguments[0]
	if (this.listeners(event).length > 0)
		return Emitter.prototype.emit.apply(this, arguments)

	if (event !== 'newListener') {
		var args = []
		for (var i=1; i<arguments.length; i++)
			args.push(arguments[i])
		return Emitter.prototype.emit.call(this, 'unhandled', event, args)
	}
}

Watchable.prototype.watch = function(obj) {
	var self = this
	this.on('unhandled', function(event, args) {
		var type = self._name
		var generic = '_on%s'.format(event.toCapCase())
		if (type) {
			var specific = '_on%s%s'.format(type.toCapCase(), event.toCapCase())
			callback = obj[specific]
		}
		if (!callback)
			callback = obj[generic]
		if (callback && typeof(callback) === 'function') {
			callback.apply(obj, args)
		}
	})
	return this
}

module.exports = Watchable