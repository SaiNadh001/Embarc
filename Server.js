var sys = require("sys"), my_http = require("http"), path = require("path"), url = require("url"), filesys = require("fs");
var server;
net = require('net');
var tcpClient, ioClient;
var req = require("request");
var fs = require("fs");

// TCP side
var sockets = [];
// HTTP Server
server = my_http.createServer(function(request, response) {
	var my_path = url.parse(request.url).pathname;
   //	process.chdir('/usr/htdocs');
   //	process.stdout.write("path\n");	

	var full_path = path.join(process.cwd(), my_path);
	path.exists(full_path, function(exists) {
        if (!exists) {
			response.writeHeader(404, {
				"Content-Type" : "text/plain"
			});
			response.write("404 Not Found\n");
			response.end();
		} else {
			filesys.readFile(full_path, "binary", function(err, file) {
				if (err) {
					response.writeHeader(500, {
					"Content-Type" : "text/plain"
					});
					response.write(err + "\n");
					response.end();
				
				} else {
					response.writeHeader(200);
					response.write(file, "binary");
					response.end();
				}
			});
		}
	});
}).listen(8001);
sys.puts("Server Running on 8001");

// end HTTP server



function ParseJSON(string) {

  
	
 var obj = JSON.parse(string);
	if (ioClient) {
	    ioClient.emit(obj.Type, obj);

	}

}

// Create a TCP socket listener
    var s = net.Server(function(tcpSocket) {
	
	// Add the new client socket connection to the array of
	// sockets
	
	process.stdout.write("tcp client connected\n");
	sockets.push(tcpSocket);
	tcpClient = tcpSocket;
	
	// 'data' is an event that means that a message was just sent by the
	// tcp application (Dispatcher). These are in the form of JSON objects. They
	// can be parsed and sent to the HTML page(s).

	var chunk = "";
	tcpSocket.on('data', function(data) {
	chunk += data.toString(); // Add string on the end of the variable 'chunk'
    d_index = chunk.indexOf(';'); // Find the delimiter
   
   	    // While loop to keep going until no delimiter can be found
	   
	    while (d_index > -1) {         
	            string = chunk.substring(0,d_index); 
	            dataString = string;
	            // Create string up until the delimiter
	            ParseJSON(string); // Parse the current string
	            chunk = chunk.substring(d_index+1); // Cuts off the processed chunk
	            d_index = chunk.indexOf(';'); // Find the new delimiter
	    }		

	});
	// Use splice to get rid of the socket that is ending.
	// The 'end' event means tcp client has disconnected.

	tcpSocket.on('end', function() {
		var i = sockets.indexOf(tcpSocket);
		sockets.splice(i, 1);
	});
});
s.listen(1234);

// use socket.io
var io = require('socket.io').listen(server);

// define interactions with client (HTML page)
io.sockets.on('connection', function(ioSocket) {
	ioClient = ioSocket;
	process.stdout.write("socketio client connected\n");
    ioSocket.on('client_data', function(data) {
		if (tcpClient) {
			var str = JSON.stringify(data);
			var buf = new Buffer(2);
			buf.writeUInt16LE(str.length, 0);
			tcpClient.write(buf); // send length to Dispatcher
			tcpClient.write(str); // send command to Dispatcher
         	// process.stdout.write(str);
		}
	});

 
   ioSocket.on('readJsonObject', function() {
	    
	          fs.readFile("Data.json", 'utf8', function (err,data) {
              
              var jsonObject = JSON.parse(data);
              ioClient.emit('logsJsonData',jsonObject);
              
              });   
	});
   
    ioSocket.on('readImageJson', function() {

	      fs.readFile("imagedata.json", 'utf8', function (err,data) {
              var jsonObject = JSON.parse(data);
              // console.log(jsonObject);

              ioClient.emit('logsImgJsonData',jsonObject);
         });   
	});


    ioSocket.on('requestFileData', function(fileName) {
         fs.readFile("logs/"+fileName, 'utf8', function (err,data) {
              ioClient.emit('fileContentDispatch',data);
         });     
    }); 


    ioSocket.on('writeJsonFile', function(myData,fileName,flag,type,value) {

    	console.log(myData);
     
       if(flag){
	       var outputFilename = 'Data.json';
	       fs.writeFile(outputFilename, '{"Data":'+JSON.stringify(myData, null, 4)+"}", function(err) {
	       });  
	    }   
            
        var logFileName = fileName;
        var str = "Type = "+type+", value ="+value
        fs.appendFile("logs/"+logFileName,"\n"+str, function(err) {
          ioClient.emit("writeDone","yes");
        });  

  	 });           
     ioSocket.on('saveImageFile', function(imgURL,fileName) {
     
         var http = require('http');
         var fs = require('fs');
         var file = fs.createWriteStream("cameraimages/"+fileName);
         
         var request = http.get(imgURL, function(response) {
             response.pipe(file);
              ioClient.emit("imageSaveComplete");

          });
         
     });


    ioSocket.on('saveImageJson', function(data) {
       var outputFilename = 'imagedata.json';
	   fs.writeFile(outputFilename, '{"Data":'+JSON.stringify(data, null, 4)+"}", function(err) {
	    }); 

  	 });   

});
