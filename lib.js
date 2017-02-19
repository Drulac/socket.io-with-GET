var soc = io(':8080');
let surcouche = function(socket)
{
	let ids = [];

	let makeID = function(length)
	{
		let text = "";
		let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

		for(let i=0; i < length; i++)
			text += possible.charAt(Math.floor(Math.random() * possible.length));

		return text;
	};

	let newID = function(length)
	{
		let id = makeID(length);
		if(id in ids)
		{
			id = newID(length);
		}
		return id;
	};

	this.get = function(event, data){
		return new Promise(function(resolve, reject){
			let id = newID(32);

			ids[id] = function(result, retour){
				if(result)
				{
					resolve(retour);
				}else{
					reject(retour);
				}
			};

			socket.emit('callback', {id: id, event: event, data: data})
		});
	};

	socket.on('callbackReturn', function(retour){
		ids[retour.id](true, retour.value);
		delete ids[retour.id];
	});
	socket.on('callbackError', function(retour){
		ids[retour.id](false, retour.value);
		delete ids[retour.id];
	});

	this.emit = socket.emit;
	this.socket = socket;

	return this;
};
let socket = surcouche(soc);
