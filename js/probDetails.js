    var armObject = new Object();
    var settingObject = new Object();
    var droObject = new Object();
    var probeObject = new Object();
    var pointsNeededVal=0;
    var probType="";
    var dataArray = new Array();
    var probeResultStr="";
    var continueFlag=false;
    var failState=true;

    $(document).ready(function() {
       probType =  localStorage.getItem('ProbType');
       $("#CalculateResultId .btn-green").css('background','#F1F1F1');
       $(".diameterContainer").hide();
       GetSettings();
   
     /*========== Show seleced calibration type and its setting based on the selection=========== */


     if(probType=="Sphere Method"){
       
         SetCalibration(Calibrations.Sphere)
         $("#headerText").html("Probe Calibration - Sphere")
         $("#selectedIconId").attr("src","images/SpherebreadCrumb.png")
         $("#measureTypeImage").attr("src","images/probCal.png") 
         $("#headerText").html("Probe Calibration - Sphere")
         $("#measureTextId2").html("Take "+pointsNeededVal+" points on the Sphere and click Calculate or Button 3")  
         $(".pointText").addClass("grayFont");
         $("#pointsRequire2").addClass("grayFont");
         $(".lableClass").addClass("grayFont");
         $("#resultDiv").hide();
         $("#resultButton").hide();
         $("#pointsRequire2").addClass("grayBg");
         $("#CalculateResultId .btn-green").css('background','#F1F1F1');
         $("#checkOutCancelButton .btn-red").css('background','#F1F1F1');

        }else if(probType=="Plane Method"){
       
        SetCalibration(Calibrations.Plane)
       
        continueFlag=true;
        $("#barRequireId").hide();
        $("#headerText").html("Probe Calibration - Plane")   
        $("#selectedIconId").attr("src","images/plane_200x200.png")
        $("#measureTypeImage").attr("src","images/probCal.png") 
        $("#measureTextId2").html("Take "+pointsNeededVal+" points on the plane and click Calculate or Button 3")  
      
       }else if(probType=="Single Point"){
         continueFlag=true;
         SetCalibration(Calibrations.Point)
         $("#barRequireId").hide();
         $("#headerText").html("Probe Calibration - Point")
         $("#selectedIconId").attr("src","images/pointcheckoutBreadCrum.png")
         $("#measureTextId2").html("Take "+pointsNeededVal+" points on the plane and click Calculate or Button 3")  
        }
     
       $("#discardResult").click(function(){

          discardProbeData();
        });

       $("#saveResult").click(function(){
           saveInLogFile("Probe - "+probType ," Residual Value: "+$("#probResultId").html(),dataArray)          
        });


    $("#continueButton").click(function(){
  
     if($("#continueText").val()>0){
   
       $("#continueButton .btn-green").addClass("grayBg");
       continueFlag=true;
       saveSphereDiameter($("#continueText").val());  
       $("#measureDetails2CancelButton .btn-red").css('background','#df443f');
       $("#CalculateResultId .pointsContainer .btn-green").css('background','#F1F1F1');
       $(".pointText").removeClass("grayFont");
       $("#ptsReq").removeClass("lableClass grayFont");
       $("#ptsTk").removeClass("lableClass grayFont");
       $("#pointsRequire2").removeClass("grayFont");
       $("#pointsRequire2").removeClass("grayBg");
       $("#checkOutCancelButton .btn-red").css('background','#df443f');
       $("#ptsReq").removeClass("lableClass"); 

    }else if($("#continueText").val()==""){
      
         $("#probAlert").css('display','block');
         $("#probAlert #popUpText").html("Please enter the require field value")
        
       }else{
 
        $("#probAlert").css('display','block');
        $("#probAlert #popUpHeading").html("ALERT")
                $("#probAlert #popUpText").html("Bar Length/Sphere Length can not be 0.")
         }       
     }

    )

     
      $("#saveAlert #closePopUp").click(function(){
           $("#saveAlert").css("display","none");
      })


       $("#closePopUp").click(function(){
           $("#probAlert").css("display","none");

      })
    $("#animation").css("width",$('.planeMeasure').width()+"px");
    $("#animation").css("height",$('.planeMeasure').width()/1.3+"px");
    readJsonFile();
    init();
    loadObjects();
    render();
    if(localStorage["droData"]==null){
    }else{
      var droData = JSON.parse(localStorage["droData"]);
      UpdateAnimation(droData);
    }

    $("#probAlert #closePopUp").click(function(){
    $("#probAlert").css('display','none');


   });
 
});


    var MeasureStep = 0;
    var feature = 1;    
    var socket = io.connect();
    var MyMeasureObject;
    var MaxPointsToTake = 0;
    var settingUnits;
    // number of subfeatures for each measurement
    var maxSteps = [0,2,2,2,2,2,2,4,4,3,2,4,3];
   // number of points for each checkout
    var maxChkPts = [0,10,9,9,10];
   // number of points for each calibration
    var maxCalPts = [0,20,15,36];
    // indexed array of measurements.
     var MeasureName = ["Invalid", "MeasureACircle", "MeasureASlot", "MeasureARectangle", "MeasureAnExtCircle", "MeasurePtToPt",
          "MeasurePlnToPln", "MeasureCirtoCir", "MeasurePtToLine", "MeasurePtToPln", "MeasureAngle2PLn", 
          "MeasureAngle2Lines", "MeasureAngleLin2Pln"];
    var CheckoutName = ["Invalid", "Point Checkout", "Plane Checkout", "Sphere Checkout", "Length Checkout"];
    var CalibrationName = ["Invalid", "Calibration - Point", "Calibration - Plane", "Calibration - Sphere"];
          
  var MeasureObject = [MeasureACircle, MeasureACircle, MeasureASlot, MeasureARectangle, MeasureAnExtCircle, MeasurePtToPt,MeasurePlnToPln, MeasureCirtoCir, MeasurePtToLine, MeasurePtToPln, MeasureAngle2PLn,          MeasureAngle2Lines, MeasureAngleLin2Pln];
    
  var SphereDiameter = 25.0;




 /*==========Create result string in after the result event occur=================*/

  socket.on('Result', function(data){
  
  if(data.Valid == 0)
  {
    failState=false;
    $("#saveAlert #headingId").html("Error")
    $("#saveAlert #popUpText").html("Calculation failed")
    $("#saveAlert").css("display","block");
  }

  else
  {
   
    $(".diameterContainer").show();
    $("#measureTextId2").html("Click Save Calibration to save your result or click Discard to start over.")

    if(MyMeasureObject.Type == "Calibration")
    
      {
      
        if(dataUnits=="mm"){
        
        $("#probResultId").html(data.Residual+" "+dataUnits)
       
        }else{
       var resultStr  = Number(String(math.eval(data.Residual+' mm to inch')).split("inch")[0]).toFixed(4);   
   
         $("#probResultId").html(resultStr+" "+dataUnits)  
       }
    
     }
    else
    
    {
      string = "\nDiameter: " + data.Diameter;
      string += "\nMindev: " + data.Mindev;
      string += "\nMaxdev: " + data.Maxdev;
      string += "\nAveragedev: " + data.Averagedev;
      string += "\nXRange2: " + data.XRange2;
      string += "\nYRange2: " + data.YRange2;
      string += "\nZRange2: " + data.ZRange2;
      string += "\nMinimum: " + data.Minimum;
      string += "\nMaximum: " + data.Maximum;
      string += "\nAverage: " + data.Average;
      string += "\nRange2: " + data.Range2;
      string += "\nLength: " + data.Length;
      string += "\nWidth: " + data.Width;
      string += "\nDistance: " + data.Distance;
      string += "\nDegrees: " + data.Degrees;
      string += "\nStandardDeviation: " + data.StandardDeviation;
      string += "\nBest Fit: " + data.BestFit;
            
             if(dataUnits=="inch"){


                var resultDiameter  = Number(String(math.eval(data.Diameter+' mm to inch')).split("inch")[0]).toFixed(4);
                var resultLength =Number(String(math.eval(data.Length.toFixed(4)+' mm to inch')).split("inch")[0]).toFixed(4);
                var resultWidth = Number(String(math.eval(data.Width.toFixed(4)+' mm to inch')).split("inch")[0]).toFixed(4);
                var resultDistance = Number(String(math.eval(data.Distance.toFixed(4)+' mm to inch')).split("inch")[0]).toFixed(4);;
                var resultAngle = String(math.eval(data.Degrees+' mm to inch')).split("inch")[0];

              }else{               
                   
                resultDiameter  = data.Diameter.toFixed(4)
                resultLength =data.Length.toFixed(4)
                resultWidth = data.Width.toFixed(4)
                resultDistance = data.Distance.toFixed(4)
                resultAngle = data.Degrees;


              }

            if(MeasureName[feature]=="MeasureACircle"){
          
             $("#resultId").html('<h2>Circle Diameter</h2><h1 id="diameterId">'+resultDiameter+" "+dataUnits+'</h1>');
           
            }else if(MeasureName[feature]=="MeasureASlot"){




            
             $("#resultId").html('<h2>Slot length is:</h2><h1 id="diameterId">'+resultLength+" "+dataUnits+'</h1><h2>Slot width is:</h2><h1 id="diameterId">'+resultWidth+" "+dataUnits+'</h1>');
            }
             
            else if(MeasureName[feature]=="MeasureARectangle"){
            
            $("#resultId").html('<h2>Slot length is:</h2><h1 id="diameterId">'+resultLength+" "+dataUnits+'</h1><h2>Slot width is:</h2><h1 id="diameterId">'+resultWidth+" "+dataUnits+'</h1>');
              
            }else if(MeasureName[feature]=="MeasureAnExtCircle"){
        
                $("#resultId").html('<h2>Circle Diameter</h2><h1 id="diameterId">'+resultDiameter+" "+dataUnits+'</h1>');
            }
              
            else if(MeasureName[feature]=="MeasurePtToPt"){
        
                $("#resultId").html('<h2>Distance Between points is:</h2><h1 id="diameterId">'+resultDistance+" "+dataUnits+'</h1>');
            }

           else if(MeasureName[feature]=="MeasurePlnToPln"){
        
               $("#resultId").html('<h2>Distance Between plane is:</h2><h1 id="diameterId">'+resultDistance+" "+dataUnits+'</h1>');

            }
            else if(MeasureName[feature]=="MeasureCirtoCir"){
 
              $("#resultId").html('<h2>Distance Between holes is:</h2><h1 id="diameterId">'+resultDistance+" "+dataUnits+'</h1>');

            }

            else if(MeasureName[feature]=="MeasurePtToLine"){
               $("#resultId").html('<h2>Distance Between point and line is:</h2><h1 id="diameterId">'+resultDistance+" "+dataUnits+'</h1>');
            }

            else if(MeasureName[feature]=="MeasurePtToPln"){
              $("#resultId").html('<h2>Distance From a Point to a Plane is:</h2><h1 id="diameterId">'+resultDistance+" "+dataUnits+'</h1>');
             }
             
            else if(MeasureName[feature]=="MeasureAngle2PLn"){
            
               $("#resultId").html('<h2>Angle between Surfaces is:</h2><h1 id="diameterId">'+resultAngle+' Degree<h1>');
            }
            
            else if(MeasureName[feature]=="MeasureAngle2Lines"){
               $("#resultId").html('<h2>Angle between Surfaces is:</h2><h1 id="diameterId">'+resultAngle+' Degree<h1>');
            }
           
            else if(MeasureName[feature]=="MeasureAngleLin2Pln"){
                $("#resultId").html('<h2>Angle between Surfaces is:</h2><h1 id="diameterId">'+resultAngle+' Degree<h1>');
            }
          }
    }
   });  

   /*=========Points taken track, updated the input box and button enable/disable================*/


    socket.on('DRO', function(data){
   





   if(continueFlag){
   

   if(failState){

    UpdateAnimation(data);
    droObject.X = data.X.toFixed(3);
    droObject.Y = data.Y.toFixed(3);
    droObject.Z = data.Z.toFixed(3);
    droObject.I = data.I.toFixed(3);
    droObject.J = data.J.toFixed(3);
    droObject.K = data.K.toFixed(3);
  
   localStorage["droData"] = JSON.stringify(data);
  
  if(data.Button2 != 0)
    TakeAPoint(data);
  if(data.Button1 != 0)
    EraseAPoint();
    
  if(data.Button3 != 0)
    {  
        if(pts1.length>=pointsNeededVal){

             finalStep();
         } 
       //}
     }
    }else{
   
    }

   } 

      if(data.Button3 !=0){
              if(!continueFlag){
                 $("#continueButton").trigger("click");
              }
      }


  

});
 

  
  /*=========Get the setting from the Arm=====================*/


 
    socket.on('Settings', function(data){
    
    settingObject.SSID = data.SSID;
    settingObject.PASSWORD = data.PASSWORD;
    settingObject.CHANNEL = data.CHANNEL;
    settingObject.VOLUME = data.VOLUME;
    settingObject.BARLENGTH = data.BARLENGTH;
    settingObject.SPHEREDIAMETER = data.SPHEREDIAMETER;
    
     

  
  
  if(data.HAPTIC == 0)
   settingObject.HAPTIC = 0;
   
  if(data.HEADLIGHT == 0)
 
   settingObject.HEADLIGHT = 0;
  
  if(data.UNITS == 0){
  
    dataUnits="mm"
    settingObject.dataUnits=0;

    if(probType=="Sphere Method"){
      $("#barlengthText").html("Enter Sphere Size(mm)")
      $("#continueText").val(data.SPHEREDIAMETER)

    } 

  }else{
      dataUnits='inch'
      settingObject.dataUnits=1;
      if(probType=="Sphere Method"){
      $("#barlengthText").html("Enter Sphere Size(in)")
      $("#continueText").val(data.SPHEREDIAMETER)
    } 
  


  } 

       });
      
    socket.on('ARM', function(data){
    armObject.Battery = data.Battery;
     

    /*elem = document.getElementById("version");
    elem.value = data.Version;*/
        armObject.Version = data.Version;
    /*elem = document.getElementById("axes");
    elem.value = data.Axes;
    */armObject.Axes = data.Axes;
        armObject.Volume = data.Volume;
        armObject.HWVersion = data.HWVersion;
        armObject.SWVersionHi = data.SWVersionHi;
        armObject.SWVersionLo = data.SWVersionLo;
   
/*
    elem = document.getElementById("armvolume");
    elem.value = data.ArmVolume;
*/
          armObject.ArmVolume = data.ArmVolume;
/*
    elem = document.getElementById("temperature");
    elem.value = data.Ambient;*/

             armObject.Ambient = data.Ambient;
/*
    elem = document.getElementById("hapticon");
    elem.disabled = (0 == data.Haptic);
*/
         armObject.Haptic = data.Haptic;



    /*elem = document.getElementById("hapticoff");
    elem.disabled = (0 == data.Haptic);
*/
             armObject.Haptic = data.Haptic;    

  /*  elem = document.getElementById("headlighton");
    elem.disabled = (0 == data.Headlights);
*/
        armObject.Headlights = data.Headlights;    
/*
    elem = document.getElementById("headlightoff");
    elem.disabled = (0 == data.Headlights);
*/
        //armObject.headlightoff = data.headlightoff;      

  
       });
   



      socket.on('PROBE', function(data){


    /*  var elem = document.getElementById("type");


    elem.value = data.PType;*/
       probeObject.PType = data.PType
    



/*
      elem = document.getElementById("name");
    elem.value = data.PName;*/

    probeObject.PName = data.PName
      /*elem = document.getElementById("diameter");
    elem.value = data.Diameter;*/
    probeObject.Diameter = data.Diameter

/*
      elem = document.getElementById("pid");
    elem.value = data.PID;*/

    probeObject.PID = data.PID

       });
 
   socket.on('PROBESPECS', function(data){
        var string;
          if(data.Saved == 0){
          //string = "Probe Specs not saved.";
          $("#probAlert #popUpText").html("Probe Specs not saved")  
          $("#probAlert").css('display','block');
        }


          else{
          $("#probAlert #popUpText").html("Probe Specs saved")  
          $("#probAlert").css('display','block');
          }

          $("#probAlert #closePopUp").click(function(){
                  gotoHome();
          }) 
          

          });
      var pts1 = []; 
      var pts2 = []; 
      var pts3 = []; 
      var pts4 = []; 
 
  /*========Track take point and update the input box and click or next button ==============*/


 function TakeAPoint(data)
 {
   
      TakePointSound();
       var x = {"X": data.X, "Y":data.Y, "Z": data.Z, "I": data.I, "J": data.J, "K": data.K, "ANGLES": data.ANGLES, "RawPositions" : data.RawPositions};  
       elem = document.getElementById("pointsTakenId2");

  switch(MeasureStep)
  
  {
      case 0:
      pts1.push(x);
            
            $("#pointsTakenId").val(pts1.length)
            elem.value = pts1.length;
           if(pts1.length<=pointsNeededVal){
            $("#probPointsId").html(pts1.length+"/"+pointsNeededVal);
            $("#CalculateResultId").click(function(){
                  finalStep();
            })
            }else{
             
              $("#CalculateResultId").unbind("click");


            }
        // special case for calibration and checkout.

    if(MaxPointsToTake != 0 && MaxPointsToTake == pts1.length){
      $(".pointsContainer .btn-green").css('background','#1db79b'); 
    }

    break;
    case 1:
      pts2.push(x);
            elem.value = pts2.length;
    break;
    case 2:
      pts3.push(x);
      elem.value = pts3.length;
    break;
    case 3:
      pts4.push(x);
      elem.value = pts4.length;
    break;
  }
   
    
      
 }


/*========Step 1 handling ==============*/


function finalStep(){
  
          MakeMeasureSound(); 
          showResult(); 
          var elem = document.getElementById("pointsTakenId2");
          elem.value = 0;
}







 /*=========remove points handling ================*/


 
 function EraseAPoint()
 {
  ErasePointSound();

  elem = document.getElementById("pointsTakenId2");
 // elem.Value = pts1.length;
     

  switch(MeasureStep)
  {
    case 0:
      pts1.pop();
    elem.value = pts1.length;
     if(pts1.length<pointsNeededVal){
         $("#CalculateResultId .btn-green").css('background','#F1F1F1');  
         $("#CalculateResultId").unbind("click");

     } 
   
    break;
    case 1:
      pts2.pop();
      elem.value = pts2.length;
    break;
    case 2:
      pts3.pop();
      elem.value = pts3.length;
    break;
    case 3:
      pts4.pop(d);
    elem.value = pts4.length;
    break;
  } 
  
     
 }
 
 function MeasureFeature()
{  
  MakeMeasureSound();
  //var elem = document.getElementById("diameter");
  MyMeasureObject.ProbeDiameter =  probeObject.Diameter;
  //elem = document.getElementById("pid");
  MyMeasureObject.PID =   probeObject.PID;
  MyMeasureObject.SphereDiameter =  settingObject.SPHEREDIAMETER 
  MyMeasureObject.Points1 = pts1;
  MyMeasureObject.Points2 = pts2;
  MyMeasureObject.Points3 = pts3;
  MyMeasureObject.Points4 = pts4;
  socket.emit('client_data', MyMeasureObject);
  //ClearData();
}
      
function Sound()
{

sound.Frequency = 500;
sound.Duration = 50;
sound.Volume = 10;
socket.emit('client_data', sound);
}

function TakePointSound()
{

sound.Frequency = 500;
sound.Duration = 50;
sound.Volume = 100;
socket.emit('client_data', sound);

}

function ErasePointSound()
{
sound.Frequency = 750;
sound.Duration = 150;
sound.Volume = 100;
socket.emit('client_data', sound);
}

function MakeMeasureSound()
{

sound.Frequency = 1000;
sound.Duration = 500;
sound.Volume = 100;
socket.emit('client_data', sound);

}

function SetMeasurement(meas)
{ 
  ClearData();
  feature = meas;
  MyMeasureObject = MeasureObject[meas];
}




function SetCalibration(meas)
{
 // ClearData();
  feature = meas;
  $("#pointsRequire2").val(maxCalPts[meas])
  pointsNeededVal = maxCalPts[meas];
  MaxPointsToTake = maxCalPts[meas];
  MyMeasureObject = Calibration;
  MyMeasureObject.Feature = meas;
  $("#probPointsId").html(0+"/"+pointsNeededVal)
  
}

/*function ClearData()
{
  pts1 = [];
  pts2 = [];
  pts3 = [];
  pts4 = [];
  MeasureStep = 0;
  MaxPointsToTake = 0;
  
  //var elem = document.getElementById("PTSTAKEN");
     if(MeasureStep==0){
      //var elem = document.getElementById("pointsTakenId");\
    }else
      //var elem = document.getElementById("pointsTakenId2");
    }

}*/

function GetSettings()
{
  socket.emit('client_data', Update);
}

function showResult(){
  
  //  $(".diameterContainer").show();
    $("#CalculateResultId .btn-green").css('background','#F1F1F1');
    $("#probCancelButton .btn-red").css('background','#F1F1F1');
    MeasureFeature();
  
}


function saveProbeData(){
  
}


function discardProbeData(){

     gotoHome();
    // YesNo.response = 1;

     // socket.emit('client_data', YesNo);
}

   function readJsonFile(){
     socket.emit('readJsonObject');  
   }
  



 /*======Get log files  data from the server and pus the into the Array ================*/




  socket.on('logsJsonData', function(response){
   
      if(response.Data.length>0){
             $.each(response.Data, function(idx, topic){
                    var obj = new Object();
                    obj.date = topic.date
                    obj.fileName = topic.fileName
                    dataArray.push(obj);
              });
      }
  });


/*===== log file scussfully update event track and disable the save button and enable home button ============*/

socket.on('writeDone', function(data){
    $("#saveAlert").css("display","block");
    $("#saveResult").hide();
    $("#homeNavigationButton").show()
    $("#homeNavigationButton").click(function(){
          
            window.location = "home.html";        
    })


});

  