const PORT=3000;
const HTML_FOLDER_PATH="C://xampp/htdocs/newyearpic";

const express=require('express');
const SocketServer=require('ws').Server;
const path=require('path');


const server=express().listen(PORT,()=>console.log('websocket listen on '+PORT));
const wws=new SocketServer({server});

var _client_cpp,_client_js;

wws.on('connection',ws=>{
	
	console.log('connected!!!');
	//ws.send('hello from server!');

	ws.on('close',()=>{
		console.log('Close connected!');
	});
	ws.on('message',data=>{
		console.log('get message: '+JSON.stringify(data));		
			
		if(data==='hello from js!'){
			console.log("set js client");
			_client_js=ws;
		}else if(data==='hello from of!'){
			console.log("set cpp client");
			_client_cpp=ws;
		}else if(data.includes('/upload') || data.includes('/input')){

			if(_client_js) _client_js.send(data);

		}else{
			if(_client_cpp) _client_cpp.send(data);
		}
	});
});


const app=express();
app.use(express.static(HTML_FOLDER_PATH));
app.get('/',function(req,res){		
	res.sendFile(SURPRISE_FOLDER_PATH+'/index.html');	
});

var HttpServer=app.listen(5000,function(){
	console.log('http server listening at 5000');
});