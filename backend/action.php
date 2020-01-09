<?php
	
	//set_time_limit(0);
	

	header("Access-Control-Allow-Origin: *");
	header('Content-Type: text/html; charset=utf-8');

	date_default_timezone_set("Asia/Taipei");

	//Return as json file
	header('Content-Type: application/json');


	require_once('utils/datetime.helper.php');
	require_once('utils/uuid.generator.php');

	function checkDuplicateID($sql_,$id_){
    	
    	$cmd='SELECT * FROM user_data WHERE id='.$id_;
		
		$result=$sql_->query($cmd);							
		
		if($result->num_rows>0) return true;
		return false;
    }
	
	$share_url='https://mmlab.com.tw/project/newyearpic/backend/direct.php?id=';
	$video_url='https://mmlab.com.tw/project/newyearpic/backend/video/';

	$server="localhost";
	$user="newyearpic_client";
	$pass="uEUY5MJDRTNZGTvU";
	$dbname="db_newyearpic";
	$idlength=6;
	$video_type=".gif";

	$conn=new mysqli($server,$user,$pass,$dbname);
	if($conn->connect_error){
		die("Connection failed: ".$conn->connect_error);
	}

	try{
		
		$get_action=isset($_POST['action']) ? $_POST['action'] : NULL;
		switch($get_action){
			case 'add_pic':
				

				$guid=random_strings($idlength);		
				while(checkDuplicateID($conn,$guid)) $guid=random_strings($idlength);

				// todo: by order??
				$frame_type=mt_rand()%2;


				// write to db!!!
				$cmd='INSERT INTO user_data (user_id,wish_name,store,wish_text,frame_type) VALUES ("'.$guid.'" , "'.$_POST['wish_name'].'","'.$_POST['store'].'","'.$_POST['wish_text'].'",'.$frame_type.')';

				if($conn->query($cmd)===TRUE){
					$json['result']='success';
					
					// TODO: generate share image!!!				
					//createImage($guid);

				}else{
					//echo $cmd.' error: '.$conn->error;
					$json['cmd']=$cmd;
					$json['result']='error: '.$conn->error;
				}
				//$json['path']=$guid.$video_type;
				$json['action']=$get_action;
				$json['user_id']=$guid;			
				$json['wish_name']=$_POST['wish_name'];
				$json['frame_type']=$frame_type;

				//$json['size']=$_FILES['file']['size'];					
				$json['share_url']=$share_url.$guid;
				
				echo json_encode($json);
				break;
			case 'load_pic':
			
				break;
		
			case 'add_info':
				
				$cmd='UPDATE user_data SET user_name="'.$_POST['name'].'",user_phone="'.$_POST['phone'].'" WHERE user_id="'.$_POST['user_id'].'"';				
				
				$json['cmd']=$cmd;

				if($conn->query($cmd)===TRUE){
					$json['result']='success';	
				}else{
					$json['result']='error: '.$conn->error;
				}
				echo json_encode($json);
				break;
			default:
				echo 'invalid action: '.$get_action;		
				break;				

		}
	}catch(Exception $e){
		echo 'Error: '.$e->getMessage();

	}
	$conn->close();


?>