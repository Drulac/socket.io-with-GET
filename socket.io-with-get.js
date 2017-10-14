const EventEmitter = require('events');

class Socket extends EventEmitter{
	constructor (socket) {
		super();
		this.ids = [];

		this.write = socket.write || socket.emit;

		const callEvent = ([id, value])=>{
			if(id in this.ids)
			{
				this.ids[id](value);
				delete this.ids[id]
			}
		};

		socket.on(1, callEvent);
		socket.on(2, callEvent);

		socket.on(0, ([id, event, args])=> {
			this.emit(event, args, data=>{
				this.write(1, [id, data]);
			}, err=>{
				this.write(2, [id, err]);
			});
		});

		this.socket = socket;
	}

	get (event, data){
		return new Promise(async (resolve, reject)=>{
			const newID = length=>{
				const id = Math.floor(Math.random() * parseInt('9'.repeat(length)))

				if(id in this.ids)
				{
					return newID(length);
				}
				return id;
			}

			const id = newID(3);

			this.ids[id] = resolve;

			this.write(0, [id, event, data])
		});
	};
}
try{
	module.exports = Socket;
}catch(e){}
