const EventEmitter = require('events');

class Socket extends EventEmitter{
	constructor (socket) {
		super();
		this.ids = [];

		this.write = socket.write || socket.emit;

		const callEvent = retour=>{
			if(retour.id in this.ids)
			{
				this.ids[retour.id](retour.value);
				delete this.ids[retour.id]
			}
		};

		socket.on('callbackReturn', callEvent);
		socket.on('callbackError', callEvent);

		socket.on("callback", req=> {
			this.emit(req.event, req.data, retour=>{
				this.write("callbackReturn", {id: req.id, value: retour});
			}, err=>{
				this.write("callbackError", {id: req.id, value: err});
			});
		});

		this.socket = socket;
	}

	get (event, data){
		return new Promise(async (resolve, reject)=>{
			const possibleChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

			const newID = length=>{
				let id = "";

				for(let i=0; i < length; i++)
				id += possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));

				if(id in this.ids)
				{
					id = newID(length);
				}
				return id;
			}

			let id = newID(32);

			this.ids[id] = resolve;

			this.write('callback', {id: id, event: event, data: data})
		});
	};
}
try{
	module.exports = Socket;
}catch(e){}
