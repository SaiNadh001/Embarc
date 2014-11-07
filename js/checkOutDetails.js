    var armObject = new Object();
    var settingObject = new Object();
    var droObject = new Object();
    var probeObject = new Object();
    var pointNeededVal=0;
    var dataUnits="";
    var continueFlag=false;
    var resultStr="";
    var dataArray = new Array();
    // var inputFlag=false;
    var checkOutType =  localStorage.getItem('CheckOutType');

$(document).ready(function(){

     GetSettings();
       /*======Check selected checkout type show the respective images and settings==========*/

     if(checkOutType=="Length Checkout" || checkOutType=="Sphere Checkout"){
      inputFlag=true;

     $(".pointText").addClass("grayFont");
     $("pointsRequired").addClass("grayFont");
     $(".lableClass").addClass("grayFont");
     $("#resultDiv").hide();
     $("#resultButton").hide();
     $("#pointsRequire2").addClass("grayBg");
     $("#CalculateResultId .btn-green").css('background','#F1F1F1');
     $("#checkOutCancelButton .btn-red").css('background','#F1F1F1');
   
     if(checkOutType=="Sphere Checkout"){
       $("#barlengthText").html("Enter the size of Sphere")
     }else{

       $("#barlengthText").html("Enter the size of Sphere")
     }
  
    }else{
  
       $("#barRequireId").hide();
       $("#resultDiv").hide();
       $("#resultButton").hide();
       $("#CalculateResultId .btn-green").css('background','#F1F1F1');
       //$("#pointsRequire2").val(pointNeededVal)
       //$//("#instructionText").html('Take at least '+pointNeededVal+' points and Click Calculate to see results.')
    }

    if(checkOutType=="Point Checkout"){
        
         continueFlag=true;
         SetCheckout(Checkouts.Point);
         //$("#measureTypeImage").attr("src","images/probCal.png") 
         $("#headerText").html("Point Checkout")
         $("#selectedIconId").attr("src","images/pointcheckoutBreadCrum.png")
        
        
        }else if(checkOutType=="Length Checkout"){
		     SetCheckout(Checkouts.Length);

         $("#headerText").html("Length Checkout")
        // $("#measureTypeImage").attr("src","images/probCal.png") 
		     $("#selectedIconId").attr("src","images/lengthcheckoutBredCrum.png")
		
      }else if(checkOutType=="Plane Checkout"){
      
         continueFlag=true;
      SetCheckout(Checkouts.Plane);
	    //$("#measureTypeImage").attr("src","images/probCal.png") 
        $("#headerText").html("Plane Checkout")
		  $("#selectedIconId").attr("src","images/plane_200x200.png")
       
     }else if(checkOutType=="Sphere Checkout"){
        $("#headerText").html("Sphere Checkout")
        SetCheckout(Checkouts.Sphere);
       //$("#measureTypeImage").attr("src","images/probCal.png"); 
		   $("#selectedIconId").attr("src","images/SpherebreadCrumb.png");
    }
  
     $("#continueButton").click(function(){
    
     if($("#continueText").val()>0){
          $("#continueButton .btn-green").addClass("grayBg");

         if(checkOutType=="Sphere Checkout"){
            saveSphereDiameter($("#continueText").val());  
         }else if(checkOutType=="Length Checkout"){
            saveBarLength($("#continueText").val());  
         }
      continueFlag=true;
      localStorage.setItem('checkOutLengthData', $("#continueText").val());
     
      $("#pointsRequire2").val(pointNeededVal)
      $("#measureDetails2CancelButton .btn-red").css('background','#df443f');
      $("#CalculateResultId .pointsContainer .btn-green").css('background','#F1F1F1');
      $(".pointText").removeClass("grayFont");
      $("pointsRequired").removeClass("grayFont");
      $(".lableClass").removeClass("grayFont");
      $("#pointsRequire2").removeClass("grayBg");
      $("#checkOutCancelButton .btn-red").css('background','#df443f');
      $("#instructionText").html('  Take at least '+pointNeededVal+' points and click Calculate or Arm Button 3 to see the result. ')
   
     }else if($("#continueText").val()==""){

        $("#popUpId").css('display','block');
        $("#popUpId #popUpHeading").html("ALERT")
        $("#popUpId #popUpText").html("Please enter the require field value")


     }



     else{

	     $("#popUpId").css('display','block');
       $("#popUpId #popUpHeading").html("ALERT")

      

	  	 $("#popUpId #popUpText").html("Bar Length/Sphere Length can not be 0.")

	    
       }
    })

  
    $("#popUpId #closePopUp").click(function(){
         $("#popUpId").css('display','none');
     });
   
    $("#animation").css("width",$('.planeMeasure').width()+"px");
    $("#animation").css("height",$('.planeMeasure').width()/1.3+"px");
    init();
    loadObjects();
    render();
    if(localStorage["droData"]==null){
        
    }else{
        var droData = JSON.parse(localStorage["droData"]);
        UpdateAnimation(droData);
    }
    
     $("#saveCheckOutButton").click(function(){
         //var resultStr = "Min Deviation ="+$("#minDevi").html()+", Max Deviation="+$("#maxDevi").html()+",Average Deviation="+$("#aveDevi").html()+", Range Over 2-X="+$("#rangeX").html()+", Range Over 2-Y="+$("#rangeY").html()+", Range Over 2-Z="+$("#rangeZ").html()
          saveInLogFile(checkOutType,resultStr,dataArray);  
  
     });
   
     readJsonFile();

     $("#saveAlert #closePopUp").click(function(){
           $("#saveAlert").css("display","none");
      })
     if(checkOutType=="Sphere Checkout"){
          
           $("#r12").hide();
           $("#aveDevi").hide();
           $("#r22").hide();  
           $("#rangeZ").hide();
           $("#thirdRow").hide(); 
           $("#r20").html("Average Deviation");
           $("#r21").html("Diameter");
     }else if (checkOutType=="Length Checkout"){
           $("#r10").html("Minimum");
           $("#r11").html("Maximum");
           $("#r12").html("Average");
           $("#r20").html("Min Deviation")
           $("#r21").html("Max Deviation")
           $("#r22").html("Range2")
           $("#r30").html("Standrd Deviation") 
           $("#r30").html("Standrd Deviation")
     }else if(checkOutType=="Point Checkout"){
           $("#secondRow").hide(); 
           $("#thirdRow").hide(); 
           $("#r10").html("Range Over 2-X");
           $("#r11").html("Range Over 2-Y");
           $("#r12").html("Range Over 2-Z"); 

     }else if(checkOutType=="Plane Checkout"){

           $("#r12").hide();
           $("#aveDevi").hide();
           $("#r22").hide();  
           $("#rangeZ").hide();
           $("#secondRow").hide(); 
           $("#thirdRow").hide(); 
           $("#r10").html("Best Fit"); 
           $("#r11").html("Standrd Deviation"); 
 }

});



function showCheckOutdata(data){
  
}


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


  /*========Result event handling ================================*/
  
  
  socket.on('Result', function(data){

      if(data.Valid == 0)
      {
            



           // $("#resultDiv").hide(); 
            $("#saveAlert #headingId").html("Error")
            $("#saveAlert #popUpText").html("Calculation failed")
            $("#saveAlert").css("display","block");


         
      }
      else
      {
            $(".diameterContainer").show();
            $("#resultDiv").show(); 
            $("#resultButton").show(); 
        
            
            if(checkOutType=="Sphere Checkout"){

                
              if(dataUnits=='mm'){
              
              $("#minDevi").html(data.Mindev+" "+dataUnits);
              $("#maxDevi").html(data.Maxdev+" "+dataUnits);
              $("#rangeX").html(data.Averagedev+" "+dataUnits);
              $("#rangeY").html(data.Diameter+" "+dataUnits);

        



              } else{
             
              $("#minDevi").html(Number(String(math.eval(data.Mindev+' mm to inch')).split("inch")[0]).toFixed(4)+" "+dataUnits);
              $("#maxDevi").html(Number(String(math.eval(data.Maxdev+' mm to inch')).split("inch")[0]).toFixed(4)+" "+dataUnits);
              $("#rangeX").html(Number(String(math.eval(data.Averagedev+' mm to inch')).split("inch")[0]).toFixed(4)+" "+dataUnits);
              $("#rangeY").html(Number(String(math.eval(data.Diameter+' mm to inch')).split("inch")[0]).toFixed(4)+" "+dataUnits);
            
           
            }
 
        resultStr = "Min Deviation = "+$("#minDevi").html()+", Max Deviation = "+$("#maxDevi").html()+", Average Deviation = "+$("#rangeX").html()+", Diameter = "+$("#rangeY").html();            


            }else if(checkOutType=="Length Checkout"){
          
              if(dataUnits=='mm'){
              
              $("#minDevi").html(data.Minimum+" "+dataUnits);
              $("#maxDevi").html(data.Maximum+" "+dataUnits);
              $("#aveDevi").html(data.Average+" "+dataUnits);
              $("#rangeX").html(data.Mindev+" "+dataUnits);
              $("#rangeY").html(data.Maxdev+" "+dataUnits);
              $("#rangeZ").html(data.Range2+" "+dataUnits);              
              $("#rr30").html(data.StandardDeviation+" "+dataUnits);   
         
             } else{

              $("#minDevi").html(Number(String(math.eval(data.Minimum+' mm to inch')).split("inch")[0]).toFixed(4)+" "+dataUnits);
              $("#maxDevi").html(Number(String(math.eval(data.Maximum+' mm to inch')).split("inch")[0]).toFixed(4)+" "+dataUnits);
              $("#aveDevi").html(Number(String(math.eval(data.Average+' mm to inch')).split("inch")[0]).toFixed(4)+" "+dataUnits);
              $("#rangeX").html(Number(String(math.eval(data.Mindev+' mm to inch')).split("inch")[0]).toFixed(4)+" "+dataUnits);
              $("#rangeY").html(Number(String(math.eval(data.Maxdev+' mm to inch')).split("inch")[0]).toFixed(4)+" "+dataUnits);
              $("#rangeZ").html(Number(String(math.eval(data.Range2+' mm to inch')).split("inch")[0]).toFixed(4)+" "+dataUnits);              
              $("#rr30").html(Number(String(math.eval(data.StandardDeviation+' mm to inch')).split("inch")[0]).toFixed(4)+" "+dataUnits);           
             
            }
     resultStr = "Minimum = "+$("#minDevi").html()+", Maximum = "+$("#maxDevi").html()+", Average = "+$("#aveDevi").html()+", Min Deviation = "+$("#rangeX").html()+", Max Deviation = "+ $("#rangeY").html()+", Range2 = "+$("#rangeZ").html()+", Standrd Deviation = "+$("#rr30").html();                    

            }else if(checkOutType=="Plane Checkout"){
          
              if(dataUnits=='mm'){
              
              $("#minDevi").html(data.BestFit+" "+dataUnits);
              $("#maxDevi").html(data.StandardDeviation+" "+dataUnits);
             

             } else{
              $("#minDevi").html(Number(String(math.eval(data.BestFit+' mm to inch')).split("inch")[0]).toFixed(4)+" "+dataUnits);
              $("#maxDevi").html(Number(String(math.eval(data.StandardDeviation+' mm to inch')).split("inch")[0]).toFixed(4)+" "+dataUnits);
            }


     resultStr = "Best Fit = "+$("#minDevi").html()+", Standrd Deviation = "+$("#maxDevi").html()


            }
             else if(checkOutType=="Point Checkout"){
          
              if(dataUnits=='mm'){
              
              $("#minDevi").html(data.XRange2+" "+dataUnits);
              $("#maxDevi").html(data.YRange2+" "+dataUnits);
              $("#aveDevi").html(data.ZRange2+" "+dataUnits);
             
              } else{
            
              $("#minDevi").html(Number(String(math.eval(data.XRange2+' mm to inch')).split("inch")[0]).toFixed(4)+" "+dataUnits);
              $("#maxDevi").html(Number(String(math.eval(data.YRange2+' mm to inch')).split("inch")[0]).toFixed(4)+" "+dataUnits);
              $("#aveDevi").html(Number(String(math.eval(data.ZRange2+' mm to inch')).split("inch")[0]).toFixed(4)+" "+dataUnits);
            
       }
 
  resultStr = "Range Over 2-X = "+$("#minDevi").html()+", Range Over 2-Y = "+$("#maxDevi").html()+", Range Over 2-Z = "+$("#aveDevi").html();



            }
        }
   });
       
    
   /*======track points taken and button 1 2 & 3 handling =============*/


    socket.on('DRO', function(data){
    
   if(continueFlag){
   
    UpdateAnimation(data);
    droObject.X = data.X.toFixed(3);
    droObject.Y = data.Y.toFixed(3);
    droObject.Z = data.Z.toFixed(3);
    droObject.I = data.I.toFixed(3);
    droObject.J = data.J.toFixed(3);
    droObject.K = data.K.toFixed(3);
 
  localStorage["droData"] = JSON.stringify(data);

  if(data.Button2 != 0){
   console.log("second button hit") 
   TakeAPoint(data);
  } 
   
   else if(data.Button1 != 0){
     console.log("first button hit") 
     EraseAPoint();
   }  
  else if(data.Button3 != 0)
  {    
          console.log("third button hit") 
       
        
     //   MeasureStep++; 
       // if(MeasureStep==maxSteps[feature]-1){
          if(pts1.length>=pointNeededVal){
            MakeMeasureSound(); 
            finalStep();
         } 
      // }
     }
  }else{
 

  }
     if(data.Button3 !=0){
              if(!continueFlag){
                 $("#continueButton").trigger("click");
              }
      }


});
 
 
   /*=========Get data form the setting section=====================*/


    socket.on('Settings', function(data){
  
    settingObject.SSID = data.SSID;
    settingObject.PASSWORD = data.PASSWORD;
    settingObject.CHANNEL = data.CHANNEL;
    settingObject.VOLUME = data.VOLUME;
    settingObject.BARLENGTH = data.BARLENGTH;
     settingObject.SPHEREDIAMETER = data.SPHEREDIAMETER;
   
    if(checkOutType=="Length Checkout"){
   
     $("#continueText").val(data.BARLENGTH);
   
    }else if(checkOutType=="Sphere Checkout"){
    
     $("#continueText").val(data.SPHEREDIAMETER); 
    } 




  if(data.HAPTIC == 0)
  
      settingObject.HAPTIC = 0;
  if(data.HEADLIGHT == 0)
  
      settingObject.HEADLIGHT = 0;

  if(data.UNITS == 0){
  
    dataUnits="mm"
    settingObject.dataUnits=0;
         
  
         if(checkOutType=="Sphere Checkout")
        {
        $("#lengthId").html("Enter Sphere Size (mm)")
        }else{
        $("#lengthId").html("Enter Bar Length (mm)")
        }  

      }else{
  

      dataUnits='inch'

         if(checkOutType=="Sphere Checkout")
        {
        $("#lengthId").html("Enter Sphere Size (in)")
        }else{
        $("#lengthId").html("Enter Bar Length (in)")
        }
        settingObject.dataUnits=1;
  
      } 

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

                // $("#probAlert").css("display","none");             
                  gotoHome();
          }) 

          });



      var pts1 = []; 
      var pts2 = []; 
      var pts3 = []; 
      var pts4 = []; 
      

/*=========Take point and update the button visiblity and input box value =============*/


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
             
             if(pts1.length<=pointNeededVal){
             
              $("#calPointsId").html(pts1.length+"/"+pointNeededVal)
            }
             elem.value = pts1.length;


    if(MaxPointsToTake != 0 && MaxPointsToTake <= pts1.length){
      $(".pointsContainer .btn-green").css('background','#1db79b'); 
      $("#CalculateResultId").click(function(){
            finalStep();
          
       }) 


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

 
 function  finalStep(){
   
      showResult(); 
      var elem = document.getElementById("pointsTakenId2");
      elem.value = 0;


 }



/*========Delete point and update the buttons handling and input box value===========*/


 function EraseAPoint()
 {

  ErasePointSound();

  elem = document.getElementById("pointsTakenId2");

  switch(MeasureStep)
  {
    case 0:
      pts1.pop();
    elem.value = pts1.length;
   

    if(pts1.length<pointNeededVal){
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


/*======Set checkout type================*/



function SetCheckout(meas)
{

  ClearData();
  feature = meas;

pointNeededVal=maxChkPts[meas]
  if(checkOutType=="Length Checkout" || checkOutType=="Sphere Checkout"){
  
}else{
  $("#pointsRequire2").val(pointNeededVal)
  $("#instructionText").html('Take at least '+pointNeededVal+' points and click Calculate or Arm button 3 to see the result.')
   
}

 $("#calPointsId").html("0/"+pointNeededVal)
  MaxPointsToTake = maxChkPts[meas];
  MyMeasureObject = Checkout;
  MyMeasureObject.Feature = meas;
     if(checkOutType=="Length Checkout" || checkOutType=="Sphere Checkout"){

      MyMeasureObject.BarLength = $("#continueText").val();

    } 
 
    else{
    
       MyMeasureObject.BarLength = 711;

    }  
  
}


function ClearData()
{
  pts1 = [];
  pts2 = [];
  pts3 = [];
  pts4 = [];
  MeasureStep = 0;
  MaxPointsToTake = 0;
     if(MeasureStep==0){
    }else
    {
    }
 
}




  function GetSettings()
  {
    socket.emit('client_data', Update);
  }
 
  /*===disable button and measure feature called============*/


  function showResult(){
       $("#CalculateResultId .btn-green").css('background','#F1F1F1');
       $("#checkOutCancelButton .btn-red").css('background','#F1F1F1');
       $(".pointText").addClass("grayFont");
       MeasureFeature();    

  }

/*===== Read json data and save into the array ======== */  

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
 });
   

/*===== Data saved in the log file handler ================ */ 


 socket.on('writeDone', function(data){
    $("#saveAlert").css("display","block");
    $("#saveCheckOutButton").hide(); 
    $("#homeNavigationButton").show(); 
    $("#homeNavigationButton").click(function(){
     window.location = "home.html";      
    })
});