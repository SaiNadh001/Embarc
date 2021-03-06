var socket = io.connect();
var dataArray = new Array();
var fileContent="";
var currentFile="";
var selectedDate="";
var FileName="";


/*=======Add click event handler==================*/




$(document).ready(function(){
    readJsonFile()
    $("#searchFile").click(function(){
       viewFilesList($("#calanderId").val())
    })

   $("#viewFile").click(function(){
       requestFileConetent(currentFile);
   }); 
   
    $("#emailFileId").click(function(){
       emailFile(currentFile);
    })

    $("#closePopUp").click(function () {
        $("#logAlert").css("display", "none");
    });

     $("#closePopUp").click(function () {
        $("#logAlert").css("display", "none");
    });
  

     $("#searchButton").click(function(){

   
  
    if($("#dateField").val()==""){
       
        $("#popUpId #popUpText").html("Please select a date")
        $("#popUpId").css("display","block");
   
      }else{
     
      var str =  $("#dateField").val();      
      var dateStr = str.split("-")[0];
      var finalDate = str.split(dateStr+"-")[1]+"-"+dateStr;
      var selecteddate  = finalDate.replace(/\-/g, '/');
      searchFiles(selecteddate);

    }

     })
  

     $("#popUpId #closePopUp").click(function(){
       $("#popUpId").css("display","none");


     })
   



});


/*====read json data form the server and push that into the array===============*/


function readJsonFile(){
    socket.emit('readJsonObject');  
   
}



socket.on('logsJsonData', function(response){

     if(response.Data.length>0){
             $.each(response.Data, function(idx, topic){
                    var obj = new Object();
                    obj.date = topic.date
                    obj.fileName = topic.fileName
                    dataArray.push(obj);
             });
      }
   
     viewFilesList("abc");
});


/*===show the list of total log files=============*/

function viewFilesList(str){
 
  $("#listIteams").html("");
       for(var i=0;i<dataArray.length;i++){
        var str = '<a href="#" class="list-group-item" onClick="openFile('+i+')">'+dataArray[i].fileName+'</a>'
        $("#listIteams").append(str);
       }
  }


/*===Get the data of a selected file from the server==============*/


function requestFileConetent(fname){
 socket.emit('requestFileData', fname);  


}


/*=========Get file name and show the file content=================*/

socket.on('fileContentDispatch', function(data){
  
    $("#containerOne").css("display","none");
    $("#containerTwo").css("display","block");
   
    $("#fileNameId").html(FileName)
   // $("#textArea").val(data)
    $("#fileData").html(data)
    fileContent = data;

});


/*=======Email the content of the selected file===================*/


 function emailFile(){
 
     window.location.href = "mailto:david.matic@mobileprogramming.com?subject="+selectedDate+"-"+FileName+"&body="+fileContent;
 
 }


/*======open the selected file ===================*/


function openFile(str){
  FileName = dataArray[str].fileName;
  requestFileConetent(dataArray[str].fileName);

}


/*=========Serach file based on the selected date===================*/



function searchFiles(datestr){
  var fileAvailabe=false;
  
  $("#listIteams").html("");
  
  for(var i=0;i<dataArray.length;i++){

       if(datestr==dataArray[i].date){
        fileAvailabe=true;
        var str = '<a href="#" class="list-group-item" onClick="openFile('+i+')">'+dataArray[i].fileName+'</a>'
        $("#listIteams").append(str);
       }
  
  }

/*======no file found handler==============*/

  if(!fileAvailabe){
 
     $("#popUpId #popUpText").html("No file availabe for the selected date");
     $("#popUpId").css("display","block");
  }

}