# socket.io-with-GET
socket.io superset who allow you to perform get request through websockets
(the code source work both in the browser and in NodeJS)

use is really easy :

you can use it in the client :
```js
(async ()=>{
	const socket = new Socket(io(':8080'));

	socket.on('name', (data, cb)=>{
		cb("My name is Jhon... Jhon Doe...");
	});

	let data = await socket.get("ping", {start: new Date().getTime()}).catch(err=>{throw new Error(err)});
	let pingTime = new Date().getTime() - data.start;

	console.log(pingTime+" ms");
})().catch(err=>{throw new Error(err)});
```
(you must include the socket.io source code before include our code)


and this on the server :
```js
var io = require('socket.io')(8080);
var Socket = require('socket.io-with-get');

io.on('connection', async function(socket){
	socket = new Socket(socket);

	socket.on('ping', (data, cb)=>{
		cb(data);
	});

	let data = await socket.get("name", {}).catch(err=>throw new Error(err));
	console.log(data);
});
```

