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
    $sitePath = str_replace("index.php?i=random","",'http://' . $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI']);
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
    return $sitePath . $arr[$key];
}

if ($str === "random") {
    header("Location:". getRandomMusic());
    // echo getRandomMusic();
    exit();
} elseif($str === "ls") {
    echo "<h1>All mp3 files in ShellBin's PC</h1>";
    echo getAllFiles ();
} elseif ($str === null) {
    $sitePath = 'http://' . $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI'];
    echo "<p>Get a random mp3 file form ShellBin's PC，there are " . getFileCounts() . " mp3 files here！</p>";
    echo "<p>You can use GET parameter \"<b><a href='" . $sitePath ."?i=random'>?i=random</a></b>\" to redirect to a random mp3 file URL</p>";
    echo "<p>or use \"<b><a href='" . $sitePath ."?i=ls'>?i=ls</a></b>\" to review all mp3 files</p>";
    echo "<P>The copyright of all .mp3 file belongs to NetEase.Inc</P>";
} else {
    echo "Illegal parameter！";
}
