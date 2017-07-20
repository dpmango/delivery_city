<?php
require_once __DIR__ . "/Request.php";

$host = isset($_POST['host']) ? $_POST['host'] : '';
$method = isset($_POST['methodApi']) ? $_POST['methodApi'] : '';
if ($host && $method) {
	$vars =  isset($_POST['vars']) ? $_POST['vars'] : [];
	$vals =  isset($_POST['vals']) ? $_POST['vals'] : [];
	if (count($vars) && count($vars) == count($vals)) {
		$url = $host . '/' . $method;
		$data = [];
		for ($i = 0; $i < count($vars); $i++) {
			$data[ $vars[$i] ] = $vals[$i];
		}
		$request = new Request();
		$response = $request->sendRawPost($url, json_encode($data));
		if ($response->responseStatus != 200) {
			echo "<pre>";
			print_r($url);
			print_r($response);
			echo "</pre>";
			die('Remote server return code ' . $response->responseStatus);
		} else {
			echo "<pre>";
			print_r($url);
			echo "<br>";
			print_r($data);
			echo "</pre>";
			echo $response->responseText;
		}
		
	} else {
		die('Get ' . count($vars) . ' variables and  ' . count($vals) . ' values. Expect ' . count($vars) . ' values.');
	}
} else {
	die('Unable send request to ' . $host . '/' . $method);
}
