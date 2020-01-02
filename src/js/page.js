
var _websocket;

window.onload=function(){
	
	connectToWebsocket();

	$('#_text_wish').bind("change keyup",function(){
		sendTextUpdate();
	});
}

function connectToWebsocket(){
	_websocket=new WebSocket('ws://localhost:3000/');
	_websocket.onopen=()=>{
        console.log('ws: open connection');
        _websocket.send('hello from js!');
    };
    _websocket.onclose=()=>{
        console.log('ws: close connection');
    };         
    _websocket.onerror=event=>{
        console.log('ws: websocket error: ',event);
    };   
}

function sendTextUpdate(){
	var text_=$('#_text_wish').val();
	_websocket.send(text_);
}