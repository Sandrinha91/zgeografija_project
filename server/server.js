const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const  vsPlayer = require('./vsPlayer');

const app = express();
const server = http.createServer(app);
const clientPath = `${__dirname}/../public`;
console.log(`Serving static from ${clientPath}`);

app.use(express.static(clientPath));

const io = socketio(server);
let waitingPlayer = null;
let username;

io.on( 'connection', (sock) =>{
    console.log('someone connected');
    
    if( waitingPlayer ){
        //start a game
        sock.on('userName', (data1) => {
            if ( username == undefined ) {
                console.log(username, 'undefineeed');
                username = data1;
                waitingPlayer = sock;
                waitingPlayer.emit('message', 'Uparivanje u toku!');
                console.log(data1, 'data1  undefineeed');
            }else if( username == data1 ){
                waitingPlayer = sock;
                waitingPlayer.emit('message', 'Uparivanje u toku!');
                console.log('NICKNAME1', username);
                console.log('NICKNAME2', data1);
            } else {
                console.log('NICKNAME1', username);
                console.log('NICKNAME2', data1);
                new vsPlayer(waitingPlayer, sock);
                waitingPlayer=null;
                //
            }
        });
    } else{
        waitingPlayer = sock;
        waitingPlayer.on('userName', (data) => {
            //io.emit('chat', 'socket OFF');
            console.log('NICKNAME', data);
            username = data;
        });
        waitingPlayer.emit('message', 'Uparivanje u toku!');
    }

    //emit chat msg
    sock.on('chat', (text) => {
        io.emit('chat', text);
    });
});

//if ther is error due to conection
server.on('error', (err) =>{
    console.log('Server error:',err);
});

//which port to listen
server.listen(5050, () =>{
    console.log('RPS STARTED on 5050');
});