class Socket{
	constructor (socket) {
		this.ids = [];
		this.ons = [];

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
			if(req.event in this.ons)
			{
				this.ons[req.event](req.data, retour=>
					socket.emit("callbackReturn", {id: req.id, value: retour});
				, err=>
					socket.emit("callbackError", {id: req.id, value: err});
				);
			}else{
				socket.emit("callbackError", {id: req.id, value: "no event"});
			}
		});

		this.emit = socket.emit;
		this.socket = socket;

		return this;
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

			this.socket.emit('callback', {id: id, event: event, data: data})
		});
	};

	on(event, cb){
		this.ons[event] = cb;

		return this;
	}

}
try{
	module.exports = Socket;
}catch(e){}
