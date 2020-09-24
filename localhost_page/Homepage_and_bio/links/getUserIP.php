<?php
header('Content-Type:text/json;charset=utf-8');

$str = array(
    'IP'=>$_SERVER["REMOTE_ADDR"],
);

echo 'var ip = ' . json_encode($str) . ';';
