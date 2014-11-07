    var armObject = new Object();
    var settingObject = new Object();
    var droObject = new Object();
    var probeObject = new Object();
    var resultString="";
    var dataArray = new Array();
    var MeasureStep = 0;
    var feature = 0;    
    var socket = io.connect();
    var MyMeasureObject;
    var MaxPointsToTake = 0;
    var settingUnits;
    var pointsRequire;
    var pointsTaken;  
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
	var MeasureObject = [MeasureACircle, MeasureACircle, MeasureASlot, MeasureARectangle, MeasureAnExtCircle, MeasurePtToPt,MeasurePlnToPln, MeasureCirtoCir, MeasurePtToLine, MeasurePtToPln, MeasureAngle2PLn, 					MeasureAngle2Lines, MeasureAngleLin2Pln];
	var SphereDiameter = 25.0;
	var MeasureType = "";

    $(document).ready(function() {
    	GetSettings();
	   
    /*======Check the selected measurement and show its respective setting image ==============*/



	    MeasureType =  localStorage.getItem('MeasureType');
        $("#measurePlaneNextButton .btn-blue").css('background','#F1F1F1');
        $(".diameterContainer").hide();
   	    if(MeasureType=="holeDiameter"){
	    SetMeasurement(Measurements.MeasureACircle);
		$("#headerText").html("Measure Circle")
		$("#selectedIconId").attr("src","images/circle_breadcrumb_200x200.png")
		$("#resultId").html('<h2>Circle Diameter</h2><h1 id="diameterId"></h1>');
        


        }else if(MeasureType=="slotDimensions"){

      	SetMeasurement(Measurements.MeasureASlot)
        $("#headerText").html("Measure Slot")
		 $("#selectedIconId").attr("src","images/measure_slot_200x200.png")
		$("#resultId").html('<h2>Slot length is</h2><h1 id="diameterId"></h1><h2>Slot width is</h2><h1 id="diameterId"></h1>');
	   }else if(MeasureType=="rectangleDimensions"){

	    SetMeasurement(Measurements.MeasureARectangle);
        $("#headerText").html("Measure Rectangle")
		$("#selectedIconId").attr("src","images/rectangle_breadcrumb_200x200.png")
	//	$("#measureTypeImage").attr("src","images/RectangleImage.png")
    	$("#resultId").html('<h2>Slot length is:</h2><h1 id="diameterId"></h1><h2>Slot width is:</h2><h1 id="diameterId"></h1>');

	   }else if(MeasureType=="diameterOfAShaft"){

	     SetMeasurement(Measurements.MeasureAnExtCircle)
		 $("#headerText").html("Measure Shaft")
		 $("#selectedIconId").attr("src","images/shaft_breadcrumb_200x200.png")
		 $("#resultId").html('<h2>Circle Diameter</h2><h1 id="diameterId"></h1>');

	  }else if(MeasureType=="distanceBetweenTwoPoints"){
	  	 
	  	   SetMeasurement(Measurements.MeasurePtToPt);
		   $("#headerText").html("Measure Distance Between Two Points")
     	   $("#selectedIconId").attr("src","images/points_breadcrumb_200x200.png")
		   $("#resultId").html('<h2>Distance Between points is:</h2><h1 id="diameterId"></h1>');

	  }else if(MeasureType=="distanceBetweenTwoSurfaces"){
	  
	    SetMeasurement(Measurements.MeasurePlnToPln)
	   
	    $("#headerText").html("Measure Distance Between Two Surfaces")
	    $("#selectedIconId").attr("src","images/surface_breadcrumb_200x200.png")
	    $("#resultId").html('<h2>Distance Between planes is:</h2><h1 id="diameterId"></h1>');
	 
	  }else
	  
	   if(MeasureType=="distanceBetweenTwoCirclesHoles"){
		 SetMeasurement(Measurements.MeasureCirtoCir)
		$("#headerText").html("Measure Distance Between Two Circles")
		$("#selectedIconId").attr("src","images/holes_breadcrumb_200x200.png")
		$("#resultId").html('<h2>Distance Between holes is:</h2><h1 id="diameterId"></h1>');
	 
	  }else if(MeasureType=="distancePointToLine"){
	     SetMeasurement(Measurements.MeasurePtToLine)
	     $("#headerText").html("Measure")
	     $("#headerText").html("Measure Distance From a Point to a Line")
		 $("#selectedIconId").attr("src","images/pointtoline_breadcrumb_200x200.png")
		 $("#resultId").html('<h2>Distance Between point and line is:</h2><h1 id="diameterId"></h1>');
		 
	  
	  }else if(MeasureType=="distancePointToPlaneSurface"){
          SetMeasurement(Measurements.MeasurePtToPln) 
		  $("#headerText").html("Measure Distance From a Point to Surface")
		  $("#selectedIconId").attr("src","images/pointtosurface_breadcrumb_200x200.png")
		  $("#resultId").html('<h2>Distance From a Point to a Plane is:</h2><h1 id="diameterId"></h1>');
		  
	
	  }else if(MeasureType=="angleBetweenTwoSurfaces"){
	  	  SetMeasurement(Measurements.MeasureAngle2PLn);
		  $("#headerText").html("Measure Angle Between Two Surfaces");
		  $("#selectedIconId").attr("src","images/angle_breadcrumb_200x200.png")
	  	  $("#resultId").html('<h2>Angle between Surfaces is:</h2><h1 id="diameterId"><h1>');
	  
	  }else if(MeasureType=="angleBetweenTwoLinesEdges"){
		 SetMeasurement(Measurements.MeasureAngle2Lines)

		 $("#headerText").html("Measure Angle Between Two Lines")
		 $("#selectedIconId").attr("src","images/angle_lines_breadcrumb_200x200.png")
	   $("#resultId").html('<h2>Angle between Lines is:</h2><h1 id="diameterId"><h1>');
		
	  }else if(MeasureType=="angleBetweenLineAndSurface"){
	     SetMeasurement(Measurements.MeasureAngleLin2Pln)
		 $("#headerText").html("Measure Angle Between Line And Surface")
		 $("#selectedIconId").attr("src","images/angleline_breadcrumb_200x200.png")
		 $("#resultId").html('<h2>Angle between Lines and Surface is:</h2><h1 id="diameterId"><h1>');
	  } 
     
      
    /*====save result in the log file ================*/

   
      $("#saveCircleButton").click(function(){
          saveInLogFile($("#headerText").html(),resultString,dataArray);
      })


   
        /*====save result in the log file ================*/

	  $("#saveAlert #closePopUp").click(function(){
	  
	   $("#saveAlert").css("display","none");
     
       })


   

      readJsonFile();

	});
  
   /*========= Read updated log files json data and push the into array ============= */

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
/*================*/







 /*========Result save string to show the result on the html page=================*/
 

 	socket.on('Result', function(data){
 	
 	if(data.Valid == 0)
 	{
      $("#saveAlert #headingId").html("Error")
      $("#saveAlert #popUpText").html("Calculation failed")
      $("#saveAlert").css("display","block");

	}
	else
	{
 		if(MyMeasureObject.Type == "Calibration")
 		{
 			string = "\nResidual: " + data.Residual;
 			string += "\n\nSave Data?";
 			YesNo.response = 0;
 			socket.emit('client_data', YesNo);
 		}
 		else
 		{
 			$(".diameterContainer").show(); 
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

              if(dataUnits=="mm")         
                   
                resultDiameter  = data.Diameter.toFixed(4)
                resultLength =data.Length.toFixed(4)
                resultWidth = data.Width.toFixed(4)
                resultDistance = data.Distance.toFixed(4)
                resultAngle = data.Degrees.toFixed(4);
              }else{
                
                resultDiameter  = data.Diameter.toFixed(4)
                resultLength =data.Length.toFixed(4)
                resultWidth = data.Width.toFixed(4)
                resultDistance = data.Distance.toFixed(4)
                resultAngle = data.Degrees.toFixed(4);
              	resultAngle = data.Degrees.toFixed(4);
              }



            if(MeasureName[feature]=="MeasureACircle"){
             
              $("#resultId").html('<h2>Circle Diameter</h2><h1 id="diameterId">'+resultDiameter+" "+dataUnits+'</h1>');

              resultString = "Circle Diameter is: "+resultDiameter+" "+dataUnits 

            }else if(MeasureName[feature]=="MeasureASlot"){

            $("#resultId").html('<h2>Slot length is:</h2><h1 id="diameterId">'+resultLength+" "+dataUnits+'</h1><h2>Slot width is:</h2><h1 id="diameterId">'+resultWidth+" "+dataUnits+'</h1>');
            
               resultString = "Slot length is: "+resultLength+" "+dataUnits+" Slot width is: "+resultWidth+" "+dataUnits  
            }
             
            else if(MeasureName[feature]=="MeasureARectangle"){
            
            $("#resultId").html('<h2>Rectangle length is:</h2><h1 id="diameterId">'+resultLength+" "+dataUnits+'</h1><h2>Rectangle width is:</h2><h1 id="diameterId">'+resultWidth+" "+dataUnits+'</h1>');

               resultString = "Rectangle length is: "+resultLength+" "+dataUnits+" Rectangle width is: "+resultWidth+" "+dataUnits  
         
              
            }else if(MeasureName[feature]=="MeasureAnExtCircle"){
        
                $("#resultId").html('<h2>Circle Diameter</h2><h1 id="diameterId">'+resultDiameter+" "+dataUnits+'</h1>');
                 resultString = "Circle Diameter is: "+resultDiameter+" "+dataUnits 
            }
              
            else if(MeasureName[feature]=="MeasurePtToPt"){
        
                $("#resultId").html('<h2>Distance Between points is:</h2><h1 id="diameterId">'+resultDistance+" "+dataUnits+'</h1>');
                resultString = "Distance Between points is: "+resultDistance+" "+dataUnits 
            }

           else if(MeasureName[feature]=="MeasurePlnToPln"){
        
               $("#resultId").html('<h2>Distance Between planes is:</h2><h1 id="diameterId">'+resultDistance+" "+dataUnits+'</h1>');
               resultString = "Distance Between planes is: "+resultDistance+" "+dataUnits 
            }
            else if(MeasureName[feature]=="MeasureCirtoCir"){
 
              $("#resultId").html('<h2>Distance Between holes is:</h2><h1 id="diameterId">'+resultDistance+" "+dataUnits+'</h1>');
               resultString = "Distance Between holes is: "+resultDistance+" "+dataUnits  
            }

            else if(MeasureName[feature]=="MeasurePtToLine"){
            
               $("#resultId").html('<h2>Distance Between point and line is:</h2><h1 id="diameterId">'+resultDistance+" "+dataUnits+'</h1>');
               resultString = "Distance Between point and line is: "+resultDistance+dataUnits 
            }

            else if(MeasureName[feature]=="MeasurePtToPln"){
            
              $("#resultId").html('<h2>Distance From a Point to a Plane is:</h2><h1 id="diameterId">'+resultDistance+" "+dataUnits+'</h1>');
              resultString = "Distance From a Point to a Plane is: "+resultDistance+dataUnits  
            }
             
            else if(MeasureName[feature]=="MeasureAngle2PLn"){
            
               $("#resultId").html('<h2>Angle between Surfaces is:</h2><h1 id="diameterId">'+resultAngle+' Degree<h1>');
                resultString = "Angle between Surfaces is: "+resultAngle+" Degree";  
            }
            
            else if(MeasureName[feature]=="MeasureAngle2Lines"){
              
               $("#resultId").html('<h2>Angle between lines is:</h2><h1 id="diameterId">'+resultAngle+' Degree<h1>');
              resultString = "Angle between lines is: "+resultAngle+" Degree";    
            }
           
              
             else if(MeasureName[feature]=="MeasureAngleLin2Pln"){
            
               $("#resultId").html('<h2>Angle between Line & Surfaces is:</h2><h1 id="diameterId">'+resultAngle+' Degree<h1>');
                resultString = "Angle between Line & Surfaces is: "+resultAngle+" Degree";  

            }
          }
		}
 	 });

   /*========================*/





   
   /*===========Track the points take and click of Arm button 1, 2, & 3======== */
    
    socket.on('DRO', function(data){
   
    droObject.X = data.X.toFixed(3);
    droObject.Y = data.Y.toFixed(3);
    droObject.Z = data.Z.toFixed(3);
    droObject.I = data.I.toFixed(3);
    droObject.J = data.J.toFixed(3);
    droObject.K = data.K.toFixed(3);

    localStorage["droData"] = JSON.stringify(data);
	
	if(data.Button2 != 0){
	  console.log("second button press")	
       TakeAPoint(data);
    }	
	
	else if(data.Button1 != 0){
     console.log("first button press")			
	  EraseAPoint();
	}
		
	else if(data.Button3 != 0)
	{      
           console.log("third button press")			

	    switch(MeasureStep)
            {               
            case 0:

               if(pts1.length>=$("#pointsRequire2").val()){
			     firstStepClick();
			    }
            
              break;  
           
            case 1:
             
                if(pts2.length>=$("#pointsRequire2").val()){  
			     secondStepClick();
			      
                }
             break; 
                 case 2:
               
                 if(pts3.length>=$("#pointsRequire2").val()){  
                 thirdStepClick();

                 }
                break; 
                 
                 case 3:
               
                 if(pts4.length>=$("#pointsRequire2").val()){  
                  fourthStepClick();
                
                 }
                break; 
            }                           
       
	      }	      
});

/*===================*/






 /*=====First step cmplete=============*/

  function firstStepClick(){
                  MakeMeasureSound();  
                   $("#pointsTakenId2").val(0);
                    MeasureStep++;
                   updateImage(MyMeasureObject.SubFeature2)

                    if(MeasureType=="distanceBetweenTwoPoints"){
                      $("#measureTitleText").html("Step 2:  Take second Point");   	
                    }else{
                      $("#measureTitleText").html("Step 2: Measure the "+MyMeasureObject.SubFeature2) 
                    }

                   $("#measurePlaneNextButton .btn-blue").css('background','#F1F1F1');
                  
   }

    /*=====Second step cmplete=============*/
  
  function secondStepClick(){
                    MakeMeasureSound();  
                    $("#pointsTakenId2").val(0);
                    MeasureStep++;
                    if(MeasureStep==maxSteps[feature]){
                      showResult();
                    }else{
                    updateImage(MyMeasureObject.SubFeature3)
                     $("#measureTitleText").html("Step 3: Measure the "+MyMeasureObject.SubFeature3) 
                     $("#measurePlaneNextButton .btn-blue").css('background','#F1F1F1');

                   }         
   }

  
    /*=====Third step cmplete=============*/


   function thirdStepClick(){
       
                  MakeMeasureSound();  
                   $("#pointsTakenId2").val(0);
                   MeasureStep++;
                   if(MeasureStep==maxSteps[feature]){
                      showResult();
                   }else{
                   updateImage(MyMeasureObject.SubFeature4)
                   $("#measureTitleText").html("Step 4: Measure the "+MyMeasureObject.SubFeature4)
                   $("#measurePlaneNextButton .btn-blue").css('background','#F1F1F1'); 
                   }
   }

 

       /*=====fourth step cmplete=============*/

   function fourthStepClick(){
           
               MakeMeasureSound();  
                   $("#pointsTakenId2").val(0);
                   MeasureStep++;
                   if(MeasureStep==maxSteps[feature]){
                      showResult();
                   }
   }
   


  

    /*========Get setting data form the ARM==============*/ 



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

	}else{

	    dataUnits='inch'
        settingObject.dataUnits=1;

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

	/*	elem = document.getElementById("headlighton");
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


	  /*	var	elem = document.getElementById("type");


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
   			if(data.Saved == 0)
   				string = "Probe Specs not saved.";
   				else
   				string = "Probe Specs saved.";
   				//alert(string);
          });
      var pts1 = []; 
      var pts2 = []; 
      var pts3 = []; 
      var pts4 = []; 
  

    //});  
      

/*============track point taken and update the click event and input box value==================*/


 function TakeAPoint(data)
 { 


    TakePointSound();
     var x = {"X": data.X, "Y":data.Y, "Z": data.Z, "I": data.I, "J": data.J, "K": data.K, "ANGLES": data.ANGLES, "RawPositions" : data.RawPositions};	
     switch(MeasureStep)
     {
        case 0:
      	pts1.push(x);
	   
	    $("#pointsTakenId2").val(pts1.length)
	    if(pts1.length>=$("#pointsRequire2").val()){
                   $("#measurePlaneNextButton .btn-blue").css('background','#0474b2');
                   $("#measurePlaneNextButton").click(function(){
                   firstStepClick();
                   event.preventDefault();
          });
        }else {
           	$("#measurePlaneNextButton .btn-blue").css('background','#F1F1F1');
        }
       
        break;

        case 1:

          pts2.push(x);
             $("#pointsTakenId2").val(pts2.length)
             if(pts2.length>=$("#pointsRequire2").val()){
             
             if(MeasureStep==maxSteps[feature]-1){
             
               $("#measurePlaneNextButton").hide();
               $("#CalculateResultId").show();
               $(".pointsContainer .btn-green").css('background','#1db79b');
			               $("#CalculateResultId").click(function(){
			                  secondStepClick();
			                  event.preventDefault();
			                });
              }else{
	                    $("#measurePlaneNextButton .btn-blue").css('background','#0474b2');
	                    $( "#measurePlaneNextButton").unbind("click");
		                 $("#measurePlaneNextButton").click(function(){
		                    secondStepClick();
		                   event.preventDefault();
		                 });
                   }
             }      
           break;
           case 2:
           pts3.push(x);
           $("#pointsTakenId2").val(pts3.length)
           if(pts3.length>=$("#pointsRequire2").val()){
          
           if(MeasureStep==maxSteps[feature]-1){
           	   
           	    $("#measurePlaneNextButton").hide();
                $("#CalculateResultId").show();
                $(".pointsContainer .btn-green").css('background','#1db79b');
                $( "#CalculateResultId").unbind( "click" );
                $("#CalculateResultId").click(function(){
	                  thirdStepClick();
	                  event.preventDefault();
	               });


            }else{
             
              $("#measurePlaneNextButton .btn-blue").css('background','#0474b2');  
               
               $( "#measurePlaneNextButton").unbind( "click" );
             
               $("#measurePlaneNextButton").click(function(){
                  thirdStepClick();
                  event.preventDefault();
               });
            }
         }
           break; 
           case 3:
           pts4.push(x);
           $("#pointsTakenId2").val(pts4.length)
           if(pts4.length>=$("#pointsRequire2").val()){
          
           if(MeasureStep==maxSteps[feature]-1){
           	   
           	    $("#measurePlaneNextButton").hide();
                $("#CalculateResultId").show();
                $(".pointsContainer .btn-green").css('background','#1db79b');
                $( "#CalculateResultId").unbind( "click" );
                $("#CalculateResultId").click(function(){
	                  fourthStepClick();
	                  event.preventDefault();
	            });
             
            }else{
                $("#measurePlaneNextButton .btn-blue").css('background','#0474b2');  
            }
          break;      
       }
    }
}



 /*=====Track deleted poitn and update the click event and input box value=============*/


 
 function EraseAPoint()
   {
  
   	ErasePointSound();
	elem = document.getElementById("pointsTakenId2");
	
	switch(MeasureStep)
	{
		case 0:
		   pts1.pop();
		   elem.value = pts1.length;
          
           if(pts1.length<$("#pointsRequire2").val()){
           	       $( "#measurePlaneNextButton").unbind( "click" );
           	    $("#measurePlaneNextButton .btn-blue").css('background','#F1F1F1');
           }

	       break;
		case 1:
		 	pts2.pop();
		 	elem.value = pts2.length;
            if(MeasureStep==maxSteps[feature]-1){
                if(pts2.length<$("#pointsRequire2").val()){
                   $( "#CalculateResultId").unbind( "click" );  	
	              $(".pointsContainer .btn-green").css('background','#F1F1F1'); 
	            }
            }else{
	            if(pts2.length<$("#pointsRequire2").val()){
	            	  $( "#measurePlaneNextButton").unbind( "click" );
	           	  $("#measurePlaneNextButton .btn-blue").css('background','#F1F1F1');
	            }
            }
		break;
		case 2:
		 	pts3.pop();
			elem.value = pts3.length;
             if(MeasureStep==maxSteps[feature]-1){
                if(pts3.length<$("#pointsRequire2").val()){
                  $( "#CalculateResultId").unbind( "click" ); 	
	              $(".pointsContainer .btn-green").css('background','#F1F1F1'); 
	            }
            }else{
	            if(pts3.length<$("#pointsRequire2").val()){
	              $( "#measurePlaneNextButton").unbind( "click" );
	           	  $("#measurePlaneNextButton .btn-blue").css('background','#F1F1F1');
	            }
            }


		break;
		
		case 3:
		 	pts4.pop(d);
		    elem.value = pts4.length;
              if(MeasureStep==maxSteps[feature]-1){
                
                if(pts4.length<$("#pointsRequire2").val()){
                   $( "#CalculateResultId").unbind( "click" ); 
	              $(".pointsContainer .btn-green").css('background','#F1F1F1'); 
	            }
            }else{
            	$( "#measurePlaneNextButton").unbind( "click" );
	            if(pts4.length<$("#pointsRequire2").val()){
	              $( "#measurePlaneNextButton").unbind( "click" ); 	
	           	  $("#measurePlaneNextButton .btn-blue").css('background','#F1F1F1');
	            }
            }

		    break;
	}	

 }




/*==========Measure feature called===========*/
 
 function MeasureFeature()
{ 

	MakeMeasureSound();
	MyMeasureObject.ProbeDiameter =  probeObject.Diameter;
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


/*=======Set the measuremnt setting based on respective selection===========*/

function SetMeasurement(meas)
{	
    ClearData();
    feature = meas;
	MyMeasureObject = MeasureObject[meas];
    console.log(MyMeasureObject.SubFeature1);
   
   if(MeasureType=="distanceBetweenTwoPoints"){
     
       $("#measureTitleText").html("Step 1:  Take first Point");   	

   }else{

    $("#measureTitleText").html("Step 1:  Measure the "+MyMeasureObject.SubFeature1)

   } 

    updateImage(MyMeasureObject.SubFeature1);
    $("#measureTypeTitle").html(MyMeasureObject.SubFeature1);
}


function SetCheckout(meas)
{
     /*ClearData();
	feature = meas;
 	var	elem = document.getElementById("TYPE");
	elem.value = CheckoutName[meas];
 	elem = document.getElementById("PTSNEEDED");
	elem.value = maxChkPts[meas];
	MaxPointsToTake = maxChkPts[meas];
	MyMeasureObject = Checkout;
	MyMeasureObject.Feature = meas;
	MyMeasureObject.SphereDiameter = 25.0;
	MyMeasureObject.BarLength = 711.;*/
}

function SetCalibration(meas)
{/*
	ClearData();
	
	feature = meas;
 	var	elem = document.getElementById("TYPE");
	elem.value = CalibrationName[meas];
	elem = document.getElementById("PTSNEEDED");
	elem.value = maxCalPts[meas];
	MaxPointsToTake = maxCalPts[meas];
	MyMeasureObject = Calibration;
	MyMeasureObject.Feature = meas;*/
}

function ClearData()
{
	pts1 = [];
	pts2 = [];
	pts3 = [];
	pts4 = [];
	MeasureStep = 0;
	MaxPointsToTake = 0;
	
	//var elem = document.getElementById("PTSTAKEN");
	   if(MeasureStep==0){
			//var elem = document.getElementById("pointsTakenId");
		}else
		{
          //var elem = document.getElementById("pointsTakenId2");

		}
	//elem.value = 0;

	//elem = document.getElementById("PTSNEEDED");
	//elem.value = 0;
}

function GetSettings()
{
	socket.emit('client_data', Update);
}


/*=======enable result section and called the measumrent function to get the result===========*/


function showResult(){

      $(".pointsContainer .btn-green").css('background','#F1F1F1'); 
  	  $(".pointsContainer .btn-red").css('background','#F1F1F1'); 
      $("#measureTextId2").addClass("grayFont");
	    $( "#measureDetails2CancelButton").unbind( "click" );

      MeasureFeature();
   
}

/*====save data to log file complete==================*/


   socket.on('writeDone', function(data){

        $("#saveAlert").css("display","block");
        $("#saveCircleButton").hide();
        $("#homeNavigateButton").show();
        $("#homeNavigateButton").click(function(){
              window.location = "home.html";
        })
   });



/*====Update image and instruction on based on the current selection==============*/



function updateImage(str){
   $("#measureTypeTitle").html(str);

   if(str=="Circle"){

    	$("#measureTypeImage").attr("src","images/circle_Img.png");
     	$("#pointsRequire2").val(3)
   
      if(MeasureStep==maxSteps[feature]-1){
       $("#measureTextId2").html("Take at least 3 points on the "+str+" and click Calculate or Arm button 3") 
      }else{
       $("#measureTextId2").html("Take at least 3 points on the "+str+" and click Next or Arm button 3") 
      }

   }else if(str=="Plane"){
   	$("#measureTypeImage").attr("src","images/planePoints.png");
   	$("#pointsRequire2").val(3)
  
    if(MeasureStep==maxSteps[feature]-1){

      $("#measureTextId2").html("Take at least 3 points on the "+str+" and click Calculate or Arm button 3") 

    }else{
    
       $("#measureTextId2").html("Take at least 3 points on the "+str+" and click Next or Arm button 3") 

   }

   }else if(str=="Point"){

   	 $("#pointsRequire2").val(1)
   	 
   	  if(MeasureStep==maxSteps[feature]-1){
       
        
       
      if(MeasureType!="distanceBetweenTwoPoints"){

      $("#measureTypeImage").attr("src","images/cen_pointer.png");

      }else{
       $("#measureTypeImage").attr("src","images/up_point.png");

       }
  
      $("#measureTextId2").html("Take at least 1 Point and click Calculate or Arm button 3") 

       }else{
     


       if(MeasureType!="distanceBetweenTwoPoints"){

      $("#measureTypeImage").attr("src","images/cen_pointer.png");

      }else{
        $("#measureTypeImage").attr("src","images/down_point.png");

        }

       $("#measureTextId2").html("Take at least 1 Point and click Next or Arm button 3") 


       } 

       


   }
   else if(str=="Line"){

   	 $("#measureTypeImage").attr("src","images/line.png");
   	 $("#pointsRequire2").val(2)
  
      if(MeasureStep==maxSteps[feature]-1){

   	   $("#measureTextId2").html("Take at least 2 points on the "+str+" and click Calculate or Arm button 3") 
    
     	}else{
       $("#measureTextId2").html("Take at least 2 points on the "+str+" and click Next or Arm button 3") 
      }
   }
   else if(str=="Rectangle"){
      $("#measureTypeImage").attr("src","images/RectangleImage.png");
   	 $("#pointsRequire2").val(4)
   
         if(MeasureStep==maxSteps[feature]-1){
    	   $("#measureTextId2").html("Take at least 4 points on the "+str+" and click Calculate or Arm button 3") 
  
        	}else{

            $("#measureTextId2").html("Take at least 4 points on the "+str+" and click Next or Arm button 3") 
     	  }

        }


  else if(str=="Slot"){
    
      $("#measureTypeImage").attr("src","images/planePoints.png");
      $("#pointsRequire2").val(6)
      if(MeasureStep==maxSteps[feature]-1){
      
      $("#measureTextId2").html("Take at least 6 points on the "+str+" and click Calculate or Arm button 3") 

     }else{

      $("#measureTextId2").html("Take at least 6 points on the "+str+" and click Next or Arm button 3") 

   	 }
   }

   	  

}
/*==============*/