function connectToWebsocket(){
	_websocket=new WebSocket('ws://localhost:3000/');
	_websocket.onopen=()=>{
        console.log('ws: open connection');
        _websocket.send('hello from js!');
        _websocket.send('/home');
    };
    _websocket.onclose=()=>{
        console.log('ws: close connection');
    };         
    _websocket.onerror=event=>{
        console.log('ws: websocket error: ',event);
    };   
    _websocket.onmessage=event=>{
    	console.log('ws: websocket message: ',event.data);
    	var str_=event.data.split("|");
    	switch(str_[0]){
    		case '/upload':
		    	if(str_[1]===_guid){
		    		//setPage('_page_share');
		    		hideItem($('#_qrcode_spinner'));
					showItem($('#_record_qrcode'));
					showItem($('#_btn_info'));

					playSound('finish');

					sendLog('gif_upload','finish');
					resetSleepTimer();
		    	}
		    	break;
		    case '/input':
		    	startRecognition();
		    	$('#_btn_next').addClass('Disable');
		    	$('#_btn_again').addClass('Disable');
		    	showItem($('#_button_record'));

		    	resetSleepTimer();

		    	break;
		}
    };
}

function sendTextUpdate(){
	var text_=$('#_text_wish').val();
	_websocket.send(text_);
}

function setupSpeachRecognition(){
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

	if(_cur_page==='_page_record'){
		var text_=$('#_text_wish').val();
		if(text_.length<1) setPage('_page_home');
	}

}
function onSpeachRecognitionResult(event){
	console.log(event);

	//var i=event.resultIndex;
  	//var j=event.results[i].length-1;

  	var text_="";
  	var text_to_send="";
  	var count_=0;
  	for(var i=0;i<event.results.length;++i){

  		var tmp_=event.results[i][0].transcript;
  		tmp_=tmp_.slice(0,Math.min(MAX_TEXT_LENGTH-count_,tmp_.length));
  		text_+=tmp_
  		//text_to_send+=tmp_+'|';

  		count_+=tmp_.length;
  	}

	// check length  	
	if(text_.length>0){
		$('#_btn_next').removeClass('Disable');
		$('#_btn_again').removeClass('Disable');		    	
		//  $('#_button_record').removeClass('close');
		// setTimeout(function(){		
		// 	 $('#_button_record').removeClass('hidden');		
		// },10);
	}

  	text_.slice(0,Math.min(MAX_TEXT_LENGTH,text_.length));
  	text_=text_.toUpperCase().replace(/ /g,'');

  	$('#_text_wish').val(text_);
	_websocket.send('/text|'+text_); 
 	
 	if(text_.length>=MAX_TEXT_LENGTH){
 		stopRecognition();
 		onClickFinishRecord();
 	}
 	
}
function startRecognition(){
	$('#_text_wish').val('');
	_speah_recognition.start();
}
function stopRecognition(){
	_speah_recognition.stop();
}