
var _websocket;
var _speah_recognition;
window.onload=function(){
	
	connectToWebsocket();
	startSpeachRecognition();

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

function startSpeachRecognition(){
	if(!('webkitSpeechRecognition' in window)){
		console.log("No Speach Recognition Supported!!!");
		return;
  	}
	_speah_recognition=new webkitSpeechRecognition();
	_speah_recognition.lang="cmn-Hant-TW";
	_speah_recognition.continuous=true;
	_speah_recognition.interimResults=true;

	_speah_recognition.onstart=onSpeachRecognitionStart;
	_speah_recognition.onend=onSpeachRecognitionStop;
	_speah_recognition.onresult=onSpeachRecognitionResult;
}
function onSpeachRecognitionStart(){
	console.log("start speach...");
}
function onSpeachRecognitionStop(){
	console.log("stop speach...");
}
function onSpeachRecognitionResult(event){
	console.log(event);

	//var i=event.resultIndex;
  	//var j=event.results[i].length-1;

  	var text_="";

  	for(var i=0;i<event.results.length;++i){
  		text_+=event.results[i][0].transcript;	
  	}

  	$('#_text_wish').val(text_);

 	_websocket.send(text_); 
 	
 	// TODO: check length

}
function startRecognition(){
	_speah_recognition.start();
}
function stopRecognition(){
	_speah_recognition.stop();
}