const EventEmitter = require('events')

class Socket extends EventEmitter {
	constructor(socket, idLength = 3) {
		super()
		this.ids = []

		this.write = socket.write || socket.emit

		const callEvent = ([id, value]) => {
			if (id in this.ids) {
				this.ids[id](value)
				delete this.ids[id]
			}
		}

		socket.on(1, callEvent)
		socket.on(2, callEvent)

		socket.on(0, ([id, event, args]) =>
			this.emit(
				event,
				args,
				(data) => this.write(1, [id, data]),
				(err) => this.write(2, [id, err])
			)
		)

		this.socket = socket

		const pow = Math.pow(10, idLength)

		this.newID = () => {
			const id = Math.floor(Math.random() * pow)

			if (id in this.ids) {
				return this.newID()
			}
			return id
		}
	}

	get(event, data) {
		return new Promise(async (resolve, reject) => {
			const id = this.newID()

			this.ids[id] = resolve

			this.write(0, [id, event, data])
		})
	}
}

module.exports = (socket) => {
	const soc = new Socket(socket)

	return {
		on: (event, cb) =>
			soc.on(event, (data, resolve, reject) =>
				cb(data).then(resolve, reject)
			),
		get: (...args) => soc.get(...args),
	}
}
