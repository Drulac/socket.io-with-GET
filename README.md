# socket.io-with-GET
socket.io superset who allow you to perform get request through websockets
(for the browser you will find the code in [socket-with-get.js](./socket-with-get.js))

use is really easy :

you can use it in the client :
```js
(async ()=>{
	const socket = new Socket(io(':8080'));

	socket.on('name', async (data)=>{
		return "My name is Jhon... Jhon Doe...";
	});

	let data = await socket.get("ping", {start: new Date().getTime()}).catch(err=>{throw new Error(err)});
	let pingTime = new Date().getTime() - data.start;

	console.log(pingTime+" ms");
})().catch(err=>{throw new Error(err)});
```
(you must include the socket.io source code before include our code) (or use native websocket with [socket-with-on](https://github.com/Drulac/uws-with-on))

and this on the server :
```js
var io = require('socket.io')(8080);
var Socket = require('socket.io-with-get');

io.on('connection', async function(socket){
	socket = new Socket(socket);

	socket.on('ping', async (data)=>{
		return data;
	});

	let data = await socket.get("name", {}).catch(err=>throw new Error(err));
	console.log(data);
});
```
