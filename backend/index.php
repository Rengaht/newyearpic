
<?php
	$host='https://mmlab.com.tw/project/newyearpic/backend';
	$page_url=$host;	
	// echo $page_url;
	$img_url=$host.'/output/'.$_GET['id'].'.gif';	
	// echo $img_url;
?>
<html>
<head>	
	<!-- Global site tag (gtag.js) - Google Analytics -->
	

	<meta charset="UTF-8">

	<meta property="fb:app_id" content="824886678029278" />
	<meta property="og:title" content="大年之初繪歲朝" />
	<meta property="og:description" content="" />
	<meta property="og:url" content="<?php echo $img_url?>" />	
	<meta property="og:image" content="<?php echo $img_url?>" />	
	
</head>
<body>
	<script>
		setTimeout(function(){
			window.location.href="https://meet.eslite.com/tw/tc/news/201912100003";
		},100);
	</script>	
</body>

</html>