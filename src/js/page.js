const MAX_TEXT_LENGTH=15;
const TRANSITION_DELAY=2500;
const TIME_TO_SLEEP=90000;

var _websocket;
var _speah_recognition;
var _cur_page; //sleep,record,edit,share,info
var _frame_count=0;
var _in_transition=false;

var _record_qrcode;

var _repeat_count;

// sleep //
var _timer_sleep;

var console=(function(oldCons){
	return {
	    log: function(text){
	        oldCons.log(text);     
	        if(_websocket && _websocket.readyState==1) 
	        	_websocket.send('/log '+text); 	
	    },
	    info: function (text) {
	        oldCons.info(text);
	    },
	    warn: function (text) {
	        oldCons.warn(text);
	    },
	    error: function (text) {
	        oldCons.error(text);	        
	        if(_websocket && _websocket.readyState==1) 
	        	_websocket.send('/log '+text);  	
	    }
	};
}(window.console));
window.console = console;
	

window.onload=function(){
	$.getJSON("_param.json", function(json){
		PARAM=json;
		sendLog('set_up',PARAM.MACHINE_ID);
	});
	loadBackImage();
	addInputCheck();

	_record_qrcode=new QRCode("_record_qrcode",{
		text: "",
		width: 287,
		height: 287,
		colorDark : "#FF3264",
		colorLight : "#ffffff",
		correctLevel : QRCode.CorrectLevel.M
	});

	connectToWebsocket();
	setupSpeachRecognition();

	
	_cur_page='_page_home';
	

}

function getPageTransitionDelay(page_){
	var len=$('#'+page_).find(".Row").length;
	var t=(0.5+(len-1)*(0.3))*2;
	return t*1000;
}

function setPage(set_){

	if(set_===_cur_page) return;
	if(_in_transition) return;

	_in_transition=true;	
	var ttime=getPageTransitionDelay(set_);
	setTimeout(function(){
		_in_transition=false;
		$('#'+set_).find('.Button').removeClass('Disable');
	},ttime);

	hideItem($('#'+_cur_page));

	switch(set_){
		case '_page_home':
			
			setHideHomeButton(true);
			clearSleepTimer();

			_websocket.send('/home');	
			stopRecognition();
			_record_qrcode.clear();


			var api = $("#_title_animation").spritespin("api");
			api.updateFrame(0);			
			api.stopAnimation();
			setTimeout(function(){
				api.startAnimation();
			},500);
			break;
		case '_page_record':	
			setHideHomeButton(false,ttime);
			_websocket.send('/start');		
			_repeat_count=2;
			break;
		case '_page_edit':
			toggleTextError(false);
			setHideHomeButton(false,ttime);
			$('#_text_name').val('');
			break;
		case '_page_share':
			setHideHomeButton(false,ttime);
			break;
		case '_page_info':
			toggleInfoError(false);
			setHideHomeButton(false,ttime);
			$('#_text_info_name').val($('#_text_name').val());
			$('#_text_info_phone').val('');
			break;			
		case '_page_finish':
			setTimeout(function(){
				playSound('finish');
			},ttime);
			break;
	}

	showItem($('#'+set_));
	_cur_page=set_;
	$('#'+_cur_page).find('.Button').addClass('Disable');


}

function setHideHomeButton(set_,time_){
	if($('#_btn_home').hasClass('close')==set_) return;
	
	if(set_){	
		hideItem($('#_btn_home'));		
		$('#_btn_home').addClass('Disable');		
	}else{
		setTimeout(function(){
			showItem($('#_btn_home'));
			setTimeout(function(){
				$('#_btn_home').removeClass('Disable');
			},150);
		},time_+200);
	}
}

function onClickStart(){
	
	resetSleepTimer();

	if($('#_btn_start').hasClass('Disable')) return;

	playSound('button');
	setPage('_page_record');
	//startRecognition();

	sendLog('user_enter');
	
}
function onClickFinishRecord(){
	
	resetSleepTimer();
	if($('#_btn_next').hasClass('Disable')) return;
	
	playSound('button');
	stopRecognition();

	setPage('_page_edit');
	_websocket.send('/edit');

	
}
function onClickRecordAgain(){

	resetSleepTimer();

	if($('#_btn_again').hasClass('Disable')) return;

	if(_repeat_count<0) return;


	stopRecognition();
	$('#_text_wish').val('');
	
	_websocket.send('/again');

	setTimeout(function(){
		startRecognition();	
	},100);

	_repeat_count--;
	if(_repeat_count<=0) hideItem($('#_btn_again'));

}
function onClickFinish(){
	
	clearSleepTimer();

	if($('#_btn_finish').hasClass('Disable')) return;
	
	//check text
	if(!checkTextInput()){
		playSound('error');
		return;
	}
	
	playSound('button');
	$('#'+_cur_page).find('.Button').addClass('Disable');
	sendUserPic();
}
function onClickInfo(){

	resetSleepTimer();

	if($('#_btn_info').hasClass('Disable')) return;

	playSound('button');
	setPage('_page_info');
}
function onClickSend(){
	
	clearSleepTimer();

	if($('#_btn_send').hasClass('Disable')) return;
	
	if(!checkWishInput()){
		playSound('error');
		return;
	}

	playSound('button');
	$('#'+_cur_page).find('.Button').addClass('Disable');
	sendUserInfo();
}
function onClickHome(){
	
	resetSleepTimer();

	setPage('_page_home');
	playSound('button');
}


function hideItem(item_){
	
	if(item_.hasClass('hidden')) return;	
	
	item_.find('Button').addClass('Disable');

	item_.addClass('hidden');
	item_.children().addClass('hidden');
	
	setTimeout(function(){
		item_.addClass('close');
		item_.children().addClass('close');
	
	},600);
}
function showItem(item_){
	
	if(!item_.hasClass('hidden')) return;
	
	item_.removeClass('close');
	item_.children().not("#_button_record").removeClass('close');
	
	setTimeout(function(){		
		item_.removeClass('hidden');		
		item_.children().not("#_button_record").removeClass('hidden');
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

function resetSleepTimer(){

}
function playSound(type_){
	switch(type_){
		case 'button':
			document.getElementById('_sound_button').play();
			break;
		case 'finish':
			document.getElementById('_sound_finish').play();
			break;
		case 'error':
			document.getElementById('_sound_error').play();
			break;		
	}
}

function clearSleepTimer(){
	if(_timer_sleep!==null) clearTimeout(_timer_sleep);
}
function resetSleepTimer(){	
	clearSleepTimer();
	_timer_sleep=setTimeout(function(){
		console.log('----------- go sleep -----------');
		setPage('_page_home');
	},TIME_TO_SLEEP);
}

function sendLog(type_,message_){

	switch(type_){
		case 'user_enter':
			sendUserEnterRecord();
			break;
		default:
			sendJandiLog('['+type_+'] '+message_);
			break;		
	}

}
