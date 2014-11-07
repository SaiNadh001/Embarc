/*   var diameterData=0;
   var resultFlag=false;
  
   $( document ).ready(function() {
   
   $(".pointsContainer .btn-green").css('background','#F1F1F1');
   
   });

  var socket = io.connect();
  var sound;
 
  socket.on('RESULT', function(data){
   
     console.log("result call");
      var string  = data.Feature;
      if(data.Feature == 'Invalid')
      string += "\n" + data.Message;
      else if(data.Feature == 'Plane')
      {
      string += "\nBest Fit: " + data.BestFit;
      }
      else if(data.Feature == 'Circle')
      {
        string += "\nDiameter: " + data.Diameter;
        string += "\nBest Fit: " + data.BestFit;
        $("#diameterId").html(data.Diameter+"mm");
       }
      
      });
         
  socket.on('DRO', function(data){
      
  if(data.Button2 != 0)
    TakeAPoint(data);
  if(data.Button1 != 0)
    EraseAPoint();
     
  });
 
 function TakeAPoint(data)
 {
     TakePointSound();
     var x = {"X": data.X, "Y":data.Y, "Z": data.Z}; 
      Measure.Points.push(x);
     $("#pointsTakenId").val(Measure.Points.length) 

     if(Measure.Points.length>=3){
         $(".pointsContainer .btn-green").css('background','#1db79b');
      }

   

     
 }
 
  function EraseAPoint()
 {
 
  ErasePointSound();
  Measure.Points.pop();
  $("#pointsTakenId").val(Measure.Points.length) 

 }
 
 function MeasureFeature(Feature)
{
   
  MakeMeasureSound();
  Measure.ProbeDiameterd = 15.0;
  Measure.Feature = Feature;
  socket.emit('client_data', Measure);
  Measure.Points = [];
  $("#pointsTakenId").val(Measure.Points.length) 

}
      
function Sound()
{

sound.Frequency = 500;
sound.Duration = 50;
sound.Volume = 100;
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

function calculateDiameterData(){
   if(Measure.Points.length>=3){
    MeasureFeature('Circle');
  } 


   // if(resultFlag){
    //$("#diameterId").html(diameterData+"mm");
    //}
 }

function eraseAll(){
  resultFlag=false;
  Measure.Points=[];
  $("#pointsTakenId").val(Measure.Points.length) 
  $("#pointsTakenId").val("")
  $(".pointsContainer .btn-green").css('background','#F1F1F1'); 
  $("#diameterId").html("");
}


$( document ).ready(function() {
     // console.log( "ready!" );
   
});

*/