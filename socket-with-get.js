class EventEmitter{constructor(){this._events={},this._onces={}}on(a,b){this._events[a]=b,delete this._onces[a]}once(a,b){this._onces[a]=b,delete this._events[a]}emit(a,b){this._events[a]?this._events[a](b):this._onces[a]&&(this._onces[a](b),delete this._onces[a])}}class Socket extends EventEmitter{constructor(a){super(),this.ids=[],this.write=a.write||a.emit;const b=([c,d])=>{c in this.ids&&(this.ids[c](d),delete this.ids[c])};a.on(1,b),a.on(2,b),a.on(0,([c,d,e])=>{this.emit(d,e,f=>{this.write(1,[c,f])},f=>{this.write(2,[c,f])})}),this.socket=a}get(a,b){return new Promise(async c=>{const e=g=>{const h=Math.floor(Math.random()*parseInt('9'.repeat(g)));return h in this.ids?e(g):h},f=e(3);this.ids[f]=c,this.write(0,[f,a,b])})}}