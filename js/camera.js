var socket = io.connect();
var imgDataArray = new Array();
var saveFlag=true;

/*==========Add click handler===============*/

$(document).ready(function() {
  


    var myImage = document.getElementById("picture");
    myImage.src="http://" + document.domain+ ":8080/?action=stream";
    readImageJsonData();
  
    $("#saveAlert #closePopUp").click(function(){
        $("#saveAlert").css("display","none");
        saveFlag=true;
    })
  
    $("#cameraSaveButton").click(function(){
        saveImageServer();
    });

    $("#cameraCaptureButton").click(function(){
       captureImage();
    })

    

});



/*====== Read saved images data from server ======== */
  

 function readImageJsonData(){

     socket.emit('readImageJson');  
   
 }

  socket.on('logsImgJsonData', function(response){
       
     if(response.Data.length>0){
             $.each(response.Data, function(idx, topic){
                    var obj = new Object();
                    obj.date = topic.date
                    obj.fileName = topic.fileName
                    imgDataArray.push(obj);
             });
      }
   
});

/*=============*/




/*========== Call image capture from the stream ==============*/

function captureImage(){
 
  var myImage = document.getElementById("photo");
  myImage.src="http://" + document.domain+ ":8080/?action=snapshot.jpg";
 
   /* var canvas = document.getElementById('myCanvas2');
    var img = new Image;
    img.src = imagePath;
    img.height = 578;
    img.width = 400;
    var context = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;
    context.scale(0.25, 0.25);
    var h = img.height * 4;
    var w = img.width * 4;
    context.drawImage(img, 0, 0, w, h);
    var imageData = canvas.toDataURL('image/png');
    var baseConvert = imageData
    imageData = imageData.split(";base64,")

    $("#newimg").attr("src",imageData);*/
    
 }


 
/*========== Save camera captured image to the node server ==============*/


function saveImageServer(){
   
   var d = new Date();
   var timeFormate = String(formatAMPM(d));
   var dateStr = ('0' + (d.getMonth()+1)).slice(-2)+':'+('0' + d.getDate()).slice(-2)+ ':' + d.getFullYear();
   fileName = dateStr+"_"+timeFormate.replace(" ","")+".jpg"
   var fileCreationDate = ('0' + (d.getMonth()+1)).slice(-2)+'/'+('0' + d.getDate()).slice(-2)+ '/' + d.getFullYear();
   var imageJsonObject  = new Object();
   imageJsonObject.date=fileCreationDate;
   imageJsonObject.fileName=fileName;
   imgDataArray.push(imageJsonObject);
 
   if(saveFlag){
   
    socket.emit('saveImageJson',imgDataArray); 
    socket.emit('saveImageFile',"http://" + document.domain+ ":8080/?action=snapshot.jpg",fileName); 
    saveFlag=false; 
 
    }
}


 
/*========== Image save complete handler ==============*/

 socket.on('imageSaveComplete', function(){
 
     $("#saveAlert").css("display","block");

 }) 






  
