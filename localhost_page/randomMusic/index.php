<?php
@$str = $_GET["i"];

function getFileCounts () { // MP3 files count
    $dir = './';
    $handle = opendir($dir);
    $i = 0;
    
    while (false !== $file = (readdir($handle))) {
        if (preg_match( '~\.mp3~', $file)) {
            $i++;
        }
    }
    closedir ($handle);
    return $i;
}

function getAllFiles () { // MP3 files ls
    $dir = './';
    $sitePath = str_replace("?i=ls","",'http://' . $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI']);
    
    if (false != ($handle = opendir ($dir))) {
        $i = 0;
        while (false !== ($file = readdir($handle))) {
            if (preg_match( '~\.mp3~', $file)) {
                echo '<a href="' . $sitePath . $file .'" target="_blank">' . $file . '</a></br>';
            }
        }
        closedir($handle);
    }
}

function getRandomMusic() {
    $dir = './';
    $sitePath = str_replace("index.php","",'http://' . $_SERVER['SERVER_NAME'] . $_SERVER['PHP_SELF']);
    $arr = [];

    if (false != ($handle = opendir ($dir))) {
        $i = 0;
        while (false !== ($file = readdir($handle))) {
            if (preg_match( '~\.mp3~', $file)) {
                array_push($arr,$file);
            }
        }
        closedir($handle);
        $key = array_rand($arr,1);
    }
    return $sitePath .  rawurlencode($arr[$key]);
}

if ($str === "random") {
    header("Location:". getRandomMusic());
    exit();
} elseif ($str === "legacyRandom.mp3") {
    $file = getRandomMusic();
    if(ob_get_contents()) ob_end_clean();
    header("Content-Type: audio/mpeg");
    Header("Accept-Ranges: bytes");
    header("Content-Length: " . filesize($file));
    header("Content-disposition: attachment; filename=\"" . basename($file) . "\"");
    ob_clean();
    flush();
    readfile($file);
    exit();
} elseif ($str === "ls") {
    echo "<h1>All mp3 files in ShellBin's PC</h1>";
    echo getAllFiles ();
    exit();
} elseif ($str === null) {
    $sitePath = 'http://' . $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI'];
    echo "<p>Get a random mp3 file form ShellBin's PC，there are " . getFileCounts() . " mp3 files here！</p>";
    echo "<p>You can use GET parameter \"<b><a href='" . $sitePath ."?i=random'>?i=random</a></b>\" to redirect to a random mp3 file URL</p>";
    echo "<p>for some Devices that don't support redirection (like some embedded library), Can also be used \"<b><a href='" . $sitePath ."?i=legacyRandom.mp3'>?i=legacyRandom.mp3</a></b>\" to get mp3 binary</p>";
    echo "<p>or use \"<b><a href='" . $sitePath ."?i=ls'>?i=ls</a></b>\" to review all mp3 files</p>";
    echo "<P>The copyright of all .mp3 file belongs to NetEase.Inc</P>";
    exit();
} else {
    echo "Illegal parameter！";
    exit();
}
