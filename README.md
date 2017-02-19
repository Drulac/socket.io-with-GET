# socket.io-with-GET
socket.io surcouche who allow you to perform get request trought websockets

use is really easy :

you can use it in the client :
```js
var soc = io(':8080');
let socket = new Socket(soc);

socket.get("ping", {start: new Date().getTime()}, (err, data)=>{
	let pingTime = new Date().getTime() - data.start;
	console.log(pingTime+" ms");
});

socket.on('name', (data, cb)=>{
	cb("My name is Jhon... Jhon Doe...");
});
```
(you must include the socket.io source code before include our code)


and this on the server :
```js
var io = require('socket.io')(8080);
var Socket = require('socket.io-with-get');

io.on('connection', function(socket){
	let client = new Socket(socket);

	client.on('ping', (data, cb)=>{
		cb(data);
	});

	client.get("name", {}, (err, data)=>{
		console.log(data);
	});
});
```