var dgram = require('dgram');
const Client = require('./models/client');
require('./db/mongoose')

var socket = dgram.createSocket('udp4');
socket.bind(33333, '134.122.95.112');
//socket.bind(33333,'127.0.0.1');
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

    if (messageJson.Action =="CreateGameLobby")
	{
		CreateGameLobby(messageJson,payload,remote);
	}
	else if (messageJson.Action =="JoinGameLobby")
	{
		JoinGameLobby(messageJson,payload,remote); 
    }
    else if (messageJson.Action =="StartHolePunch")
	{
		StartHolePunch(payload,remote);
	}

});



// Request Handler metotları 

async function CreateGameLobby(reqMes,payload,remote)
{
	clientInfo = {
		userName: reqMes.User,
		userId:reqMes.UserId,
		roomId:payload.roomId,
		host:payload.Host,
		localIp:payload.localIp,
		localPort:payload.localPort,
		publicIp:remote.address,
		publicPort:remote.port,
	}

	const client = new Client(clientInfo)
    try {
		await client.save()
		console.log("Host has been saved")
    } catch (e) {
		console.log(e)
	}
	tempClientInfo = {
		roomId:payload.roomId,
		host:'0',
	}

	const tempClient=new Client(tempClientInfo)
	try {
		await tempClient.save()
		console.log("temp client has been saved")
	} catch (error) {
		console.log(error)
	}
}

async function JoinGameLobby(reqMes,payload,remote){

	const filter = { roomId:payload.roomId,host:'0' };
	const update = 
	{
		userId:reqMes.UserId,
		userName: reqMes.User,
		localIp:payload.localIp,
		localPort:payload.localPort,
		publicIp:remote.address,
		publicPort:remote.port
	};

	let doc = await Client.findOneAndUpdate(filter, update);
	sendDataToClients(payload.roomId);
}

async function sendDataToClients(RoomId){
	console.log("rom"+RoomId)
	var host = await Client.findOne({roomId:RoomId,host:'1'},function(err,data){
		if(!data){
			return null;
		}
		console.log(data.roomId)
		return data
	})
	console.log("host : "+ host.userId)

	var guest = await Client.findOne({roomId:RoomId,host:'0'},function(err,data){
		if(!data){
			return null;
		}

		return data
	})

	
	if(host && guest) {
		console.log("ifteyiz")
		publicEndpointA = {
    		userId:host.userId,
			name:host.userName,
    		address: host.publicIp,
			port: host.publicPort,
			localAddress:host.localIp,
			localPort: host.localPort,
			conType:1
		}
		publicEndpointB = {
			
			userId:guest.userId,
			name:guest.userName,
    		address: guest.publicIp,
			port: guest.publicPort,
			localAddress:guest.localIp,
			localPort: guest.localPort,
			conType:1
		}
		var RequestA = {
			Action:"RefreshLobby",
			User : "Server",
			Payload: JSON.stringify(publicEndpointA)
		}
		var RequestB = {
			Action:"RefreshLobby",
			User : "Server",
			Payload: JSON.stringify(publicEndpointB)
		}
		// Nat type evaluation
		if(publicEndpointA.address==publicEndpointB.address)
		{
			publicEndpointA.conType=0;
			publicEndpointB.conType=0;
		}
		console.log("A: "+JSON.stringify(publicEndpointA))
		console.log("B: "+JSON.stringify(publicEndpointB))

	
		var messageForA = new Buffer(JSON.stringify(RequestB));
		socket.send(messageForA, 0, messageForA.length, publicEndpointA.port,publicEndpointA.address, function (err, nrOfBytesSent) {
			if(err) return console.log(err);
			console.log('> public endpoint of B sent to A');
		});

		
		var messageForB = new Buffer(JSON.stringify(RequestA));
		socket.send(messageForB, 0, messageForB.length, publicEndpointB.port, publicEndpointB.address, function (err, nrOfBytesSent) {
			if(err) return console.log(err);
			console.log('> public endpoint of A sent to B');
		});
	}
}


