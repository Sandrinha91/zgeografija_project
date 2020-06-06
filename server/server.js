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

io.on( 'connection', (sock) =>{
    console.log('someone connected');
    // sock.emit('message', 'Hi, you are connected');

    if( waitingPlayer ){
        //start a game
        new vsPlayer(waitingPlayer, sock);
        waitingPlayer=null;
    } else{
        waitingPlayer = sock;
        waitingPlayer.emit('message', 'Uparivanje u toku!');
    }

    //emit chat msg
    sock.on('chat', (text) => {
        io.emit('chat', text);
    });

    //sock on disconect
    // sock.on('disconnect', () => {
    //     io.emit('chat', 'socket OFF');
    //     console.log('SOCK!', sock.id);
    // });
});

//if ther is error due to conection
server.on('error', (err) =>{
    console.log('Server error:',err);
});

//which port to listen
server.listen(8080, () =>{
    console.log('RPS STARTED on 8080');
});