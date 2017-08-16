class Socket{
	constructor (socket) {
		this.ids = [];
		this.ons = [];

		let callEvent = (req)=> {
			if(req.event in this.ons)
			{
				this.ons[req.event](req.data, (retour)=>{
					socket.emit("callbackReturn", {id: req.id, value: retour});
				}, (err)=>{
					socket.emit("callbackError", {id: req.id, value: err});
				});
			}else{
				let err = "no event";
				socket.emit("callbackError", {id: req.id, value: err});
			}
		};

		socket.on('callbackReturn', (retour)=>{
			try{
				this.ids[retour.id](retour.value);
			}catch(e){}
			try{
				delete this.ids[retour.id];
			}catch(e){}
		});

		socket.on('callbackError', (retour)=>{
			try{
				this.ids[retour.id](retour.value);
			}catch(e){}
			try{
				delete this.ids[retour.id];
			}catch(e){}
		});

		socket.on("callback", (req)=>{
			callEvent(req);
		});

		this.emit = socket.emit;
		this.socket = socket;

		return this;
	}

	get (event, data){
		return new Promise(async (resolve, reject)=>{
			const newID = (length)=>{
				const makeID = (length)=>{
					let text = "";
					let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

					for(let i=0; i < length; i++)
					text += possible.charAt(Math.floor(Math.random() * possible.length));

					return text;
				}

				let id = makeID(length);
				if(id in this.ids)
				{
					id = newID(length);
				}
				return id;
			}

			let id = newID(32);

			this.ids[id] = resolve;

			this.socket.emit('callback', {id: id, event: event, data: data})

			return this;
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