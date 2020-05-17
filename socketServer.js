var dgram = require('dgram');

var socket = dgram.createSocket('udp4');
socket.bind(33333, '134.122.95.112');

//Type0: same nat type1: different nat type2: multiple nat 
var connectionType=1;
var publicEndpointA = null;
var publicEndpointB = null;




socket.on('listening', function () {
    console.log('UDP Server listening on ' + socket.address().address + ":" + socket.address().port);
});

socket.on('message', function (message, remote) {
    console.log(remote.address + ':' + remote.port +' - ' + message);
	var messageJson = JSON.parse(message);
	var payload = JSON.parse(messageJson.Payload);	

    if (messageJson.Type =="CreateGameLobby")
	{
		CreateGameLobby(payload,remote);
	}
	else if (messageJson.Type =="JoinGameLobby")
	{

    }
    else if (messageJson.Type =="StartHolePunch")
	{
		StartHolePunch(payload,remote);
	}

});



// Request Handler metotları 


// Random lobby id generator gerekiyor.
function CreateGameLobby(payload,remote)
{
	var response={}

}

function StartHolePunch(payload,remote)
{

	if(payload.name == 'A') {
    	publicEndpointA = {
    		name: 'A',
    		address: remote.address,
			port: remote.port,
			localAddress:payload.localAddress,
			localPort: payload.localPort,
			conType:connectionType
    	}
	}

    if(payload.name == 'B') {
		console.log("B setted")
    	publicEndpointB = {
    		name: 'B',
    		address: remote.address,
			port: remote.port,
			localAddress:payload.localAddress,
			localPort: payload.localPort,
			conType:connectionType
    	}
	}
	
    sendPublicDataToClients();
}

function JoinGameLobby(){
	
}

function sendPublicDataToClients () {
	if(publicEndpointA && publicEndpointB) {
		var portA, adressA,portB,addressB;

		// Nat type evaluation
		if(publicEndpointA.address==publicEndpointB.address)
		{
			publicEndpointA.conType=0;
			publicEndpointB.conType=0;
		}
	
		var messageForA = new Buffer(JSON.stringify(publicEndpointB));
		socket.send(messageForA, 0, messageForA.length, publicEndpointA.port,publicEndpointA.address, function (err, nrOfBytesSent) {
			if(err) return console.log(err);
			console.log('> public endpoint of B sent to A');
		});

		var messageForB = new Buffer(JSON.stringify(publicEndpointA));
		socket.send(messageForB, 0, messageForB.length, publicEndpointB.port, publicEndpointB.address, function (err, nrOfBytesSent) {
			if(err) return console.log(err);
			console.log('> public endpoint of A sent to B');
		});

	}
}







