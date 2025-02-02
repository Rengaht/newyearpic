var _guid;


function addInputCheck(){
	$('#_text_name').bind("change paste keyup",function(){
		resetSleepTimer();
		toggleTextError(false);		

		$('#_text_name').val($('#_text_name').val().replace(/ /g,'').toUpperCase());
	});
	$('#_text_wish').bind("change paste keyup",function(){
		resetSleepTimer();
		toggleTextError(false);
		$('#_text_wish').val($('#_text_wish').val().replace(/ /g,'').toUpperCase());

		sendTextUpdate();
	});

	$('#_text_info_name').bind("change paste keyup",function(){
		resetSleepTimer();
		toggleInfoError(false);
	});
	$('#_text_info_phone').bind("change paste keyup",function(){
		resetSleepTimer();
		$(this).val($(this).val().replace(/[^\d]+/g,''));
		toggleInfoError(false);
	});
}

function toggleTextError(show_,text_){
	if(show_){
		$('#_error_text').text(text_);
		$('#_error_text').removeClass('hidden');
		$('#_btn_finish').addClass('Disabled');
	}else{
		$('#_error_text').addClass('hidden');
		$('#_btn_finish').removeClass('Disabled');
	}
}

function toggleInfoError(show_,text_){
	if(show_){
		$('#_error_info').text(text_);
		$('#_error_info').removeClass('hidden');
		$('#_btn_send').addClass('Disabled');
	}else{
		$('#_error_info').addClass('hidden');
		$('#_btn_send').removeClass('Disabled');
	}
}
function checkTextInput(){
	var error_text="";
	if($('#_text_name').val().length<1) error_text=error_text+"*姓名不可空白\n";
	if($('#_text_wish').val().length<1) error_text=error_text+"*新年願望不可空白\n";

	$('#_text_name').val($('#_text_name').val().replace(/ /g,'').toUpperCase());
	$('#_text_wish').val($('#_text_wish').val().replace(/ /g,'').toUpperCase());

	toggleTextError(error_text.length>0,error_text);
	return error_text.length==0;
}
function checkWishInput(){
	var error_text="";
	if($('#_text_info_name').val().length<1) error_text=error_text+"*姓名不可空白\n";

	var mobileReg = /^(13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$/i;
	var phoneReg = /^\d{7,12}$/;
	var input_phone_=$('#_text_info_phone').val();
	if(!mobileReg.test(input_phone_) && !phoneReg.test(input_phone_)) error_text=error_text+"*電話格式錯誤\n";

	toggleInfoError(error_text.length>0,error_text);
	return error_text.length==0;
}

function sendUserPic(){
	
	var fd=new FormData();
	fd.append('action','add_pic');
	fd.append('wish_name',$('#_text_name').val());
	fd.append('wish_text',$('#_text_wish').val());
	fd.append('store',PARAM.MACHINE_ID);

	$.ajax({
		url:'https://mmlab.com.tw/project/newyearpic/backend/action.php',
		type:'POST',
		data:fd,
		processData: false,
		contentType: false,
		cache:false,
		error:function(xhr){
			console.log('[send_pic] something went wrong...');
			//goPage('_page_home');
		},
		success:function(response){
			console.log('[send_pic]'+JSON.stringify(response));
			_guid=response.user_id;
						
			if(_cur_page==='_page_edit') {
				
				_record_qrcode.makeCode(response.share_url);

				_websocket.send('/name|'+response.wish_name+'|'+response.frame_type+'|'+response.user_id);				
				
				showItem($('#_qrcode_spinner'));
				hideItem($('#_record_qrcode'));
				hideItem($('#_btn_info'));

				sendLog('send_pic','user= '+_guid+' url='+response.share_url);

				setPage('_page_share');				
			}
		}
	});
}
function sendUserInfo(){
	var fd=new FormData();
	fd.append('action','add_info');
	fd.append('name',$('#_text_info_name').val());
	fd.append('phone',$('#_text_info_phone').val());
	fd.append('user_id',_guid);
	
	$.ajax({
		url:'https://mmlab.com.tw/project/newyearpic/backend/action.php',
		type:'POST',
		data:fd,
		processData: false,
		contentType: false,
		cache:false,
		error:function(xhr){
			console.log('[send_info] something went wrong...');
			//goPage('_page_home');
		},
		success:function(response){
			console.log('[send_info]'+JSON.stringify(response));
			
			if(response.result==='success'&&_cur_page==='_page_info') {

				sendLog('send_info','user= '+_guid+' phone= '+$('#_text_info_phone').val());

				setPage('_page_finish');	
				resetSleepTimer();			
			}
		}
	});
}

function sendUserEnterRecord(){
	var fd=new FormData();
	fd.append('action','user_enter');
	fd.append('store',PARAM.MACHINE_ID);
	
	$.ajax({
		url:'https://mmlab.com.tw/project/newyearpic/backend/action.php',
		type:'POST',
		data:fd,
		processData: false,
		contentType: false,
		cache:false,
		error:function(xhr){
			console.log('[send_enter] something went wrong...');
			//goPage('_page_home');
		},
		success:function(response){
			console.log('[send_enter]'+JSON.stringify(response));			
		}
	});	
}

function sendJandiLog(message_){


	var data_='{"body":"['+PARAM.MACHINE_ID+'] '+'#js'+message_+'"}';
	//console.log(data_);
	$.ajax({
		url:'https://wh.jandi.com/connect-api/webhook/14606752/85c2cde12a7e37b4cbcfd65690e049bc',
		type:'POST',
		data:data_,
		contentType: 'application/json',
		error:function(xhr){
			console.log('[send jandi] something went wrong...');			
		},
		success:function(response){
			//console.log('[send jandi]'+response);			
		}
	});
}