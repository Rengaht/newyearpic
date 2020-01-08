const MAX_TEXT_LENGTH=20;

var _websocket;
var _speah_recognition;
var _cur_page; //sleep,record,edit,share,info
var _frame_count=0;

window.onload=function(){
	
	loadBackImage();

	connectToWebsocket();
	setupSpeachRecognition();

	$('#_text_wish').bind("change keyup",function(){
		sendTextUpdate();
	});

	_cur_page='_page_home';
}


function setPage(set_){

	if(set_===_cur_page) return;

	hideItem($('#'+_cur_page));

	switch(set_){
		case '_page_home':
			
			_websocket.send('/home');	
			stopRecognition();

			var api = $("#_title_animation").spritespin("api");
			api.updateFrame(0);			
			api.stopAnimation();
			setTimeout(function(){
				api.startAnimation();
			},500);
			break;
		case '_page_record':	
			_websocket.send('/start');		
			break;
		case '_page_edit':
			$('#_text_name').val('');
			break;
		case '_page_share':
			
			break;
		case '_page_info':
			$('#_text_info_name').val($('#_text_name').val());
			$('#_text_info_phone').val('');
			break;					
	}

	showItem($('#'+set_));
	_cur_page=set_;

}
function onClickStart(){
	setPage('_page_record');
	startRecognition();
}
function onClickFinishRecord(){
	stopRecognition();
	setPage('_page_edit');
}
function onClickRecordAgain(){
	
	stopRecognition();
	$('#_text_wish').val('');
	
	_websocket.send('/again');

	setTimeout(function(){
		startRecognition();	
	},100);
}
function onClickFinish(){
	//TODO: check text
	var name_=$('#_text_name').val();

	// TODO: upload and get guid & frame id


	_websocket.send('/name|'+name_+'|'+(_frame_count%2));

	_frame_count++;

	setPage('_page_share');
}
function onClickInfo(){
	
	setPage('_page_info');
}
function onClickSend(){

	//TODO: check text,send info
	setPage('_page_home');
}
function onClickHome(){

	setPage('_page_home');
}


function hideItem(item_){
	
	if(item_.hasClass('hidden')) return;	
	
	item_.addClass('hidden');
	setTimeout(function(){
		item_.addClass('close');
	},500);
}
function showItem(item_){
	
	if(!item_.hasClass('hidden')) return;
	
	item_.removeClass('close');
	setTimeout(function(){		
		item_.removeClass('hidden');		
	},10);
}

function loadBackImage(){
	var src_=[];
	for(var i=0;i<144;++i) src_.push('asset/video/tablet_intro/tablet'+leftPad(i,3)+'.png');

	$('#_title_animation').spritespin({
		source:src_,			
		animate: true,
		loop:true,
		renderer:'background',
		//responsive:false,
		frames:144,
		width:1920,
		height:1080,
		frameTime:33,
		onFrameChanged:frameUpdate
	});	
}
function frameUpdate(e,data){
	var fr=data.frame;
	//if(fr==)
}

function leftPad(value, length){ 
    return ('0'.repeat(length) + value).slice(-length); 
}
