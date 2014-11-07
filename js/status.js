

    var socket = io.connect();
    $(document).ready(function() {

         GetSettings();
    });	

 function GetSettings()
  {
    	socket.emit('client_data', Update);
  }


  /*=======Get status data from  the server and update the respective value */

  socket.on('ARM', function(data){
 
    $("#versionInput").val(data.Version);
    $("#axesInput").val(data.Axes);
    $("#volumeInput").val(data.ArmVolume);
    $("#hwVersionInput").val(data.HWVersion);
    $("#swInputHi").val(data.SWVersionHi);
    $("#swInputLo").val(data.SWVersionLo);
  
     var per = (data.Battery/255)*100
  
    $("#battryPercentageId").html(Math.floor(per)+"%");
    $("#batteryInput").val(" "+Math.floor(per)+"%")
    $(".batteryPer .battery em font").css("width",Math.floor(per)+"%");
    $("#temperatureInput").val(data.Ambient+" Celsius")



  });