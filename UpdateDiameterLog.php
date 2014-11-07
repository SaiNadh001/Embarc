<?php
ob_start();
ini_set('display_errors',0);
$main_dir = dirname(__FILE__);

if(isset($_REQUEST['type']) && isset($_REQUEST['diameter'])){
    
    $curDate = date('Ymd');
    $fileName = $main_dir.'/logs/'.$curDate.'.txt';
    
    if(file_exists($fileName)){
      
        $content = file_get_contents($fileName);
        $content .= "\n".ucfirst($_REQUEST['type']).' Diameter'.$_REQUEST['diameter'];
        file_put_contents($fileName, $content);
        echo json_encode(array('message'=>'Success'));
        die;
    
    } else { 
 
        $content .= ucfirst($_REQUEST['type']).' Diameter'.$_REQUEST['diameter'];
        file_put_contents($fileName, $content);
        echo json_encode(array('message'=>'Success'));
        die;
    
    }    
    
} else {   
    echo json_encode(array('message'=>'Parameter Missing.'));
    die;
}

ob_end();
?>