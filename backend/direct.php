<?php
	$host='https://mmlab.com.tw/project/newyearpic/backend/';
	$page_url=$host.'direct.php';	
	// echo $page_url;
	$img_url=$host.'output/'.$_GET['id'].'.gif';	
	$share_url=$host.'index.php?id='.$_GET['id'];	
	$redirect_url=$host.'redirect.html';
	// echo $img_url;
?>

<html>
	<head>		
		<!-- Global site tag (gtag.js) - Google Analytics -->
		

		<title>大年之初 繪歲朝</title>
		<link href="https://fonts.googleapis.com/css?family=Noto+Serif+TC:700&display=swap" rel="stylesheet">
		<style type="text/css">
			body{
				border:0;
				margin:0;
				background-color: #FE3264;
				background-image: url("img/back_bgd.png");
				background-repeat: repeat;
				font-family: 'Noto Serif TC', serif;
				letter-spacing: 5px;
			}
			a{
				color:rgb(13,104,171);
			}
			.vertCenterWrapper{
				display: table;
				height:80%;
				width:100%;
			}
			.vertCenterChild{
				display:table-cell;
				vertical-align: middle;
			}
			.share_img{
				margin-top:80px;			
				height:50%;
				max-width: 90%;
				border:5px white solid;
				box-shadow: 12px 12px 7px rgba(0, 0, 0, 0.2);
			}
			.share_button{
				margin-top:50px;
				/*height:10%;*/
				cursor: pointer;
			}
			.center{
				display:block;
				text-align: center;
				margin-left: auto;
				margin-right: auto;
			}
			.title_img{
				margin-top: 80px;
				height:20%;			
			}
		</style>
		<script type="text/javascript">
			var _url=encodeURIComponent('<?php echo $share_url ?>');
			//var _text=encodeURIComponent("quote_here!");
			var _tag=encodeURIComponent("#大年之初繪歲朝");
			var _reurl=encodeURIComponent('<?php echo $redirect_url ?>');	

			var _share_url="https://www.facebook.com/dialog/share?"
							+"app_id=824886678029278"
							+"&href="+_url
							+"&hashtag="+_tag
							+"&redirect_uri="+_reurl;
			function onShareclick(){								
	    		console.log(_share_url);
				window.location = _share_url;
			}
		</script>
		
		
	</head>
	<body>		
		<div class="vertCenterWrapper">
			<div class="vertCenterChild RedirectText">
				<img class="title_img center" src="img/share-09.png"/>
				<?php 
					echo '<img class="share_img center" src="'.$img_url.'"/>';
				?>
			<img class="center share_button" onclick="onShareclick()" src="img/share-08.png"/> 

			</div>
		</div>
	</body>
</html>