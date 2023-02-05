import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';

import {
  botTurn,
  callUno, challengeUno, finishTurn, generateUnoGame, newGame,
  pickupCard,
  playCard,
  setColor,
  setUnoCallPossible,
  shouldCallUno, startTimer
} from '../shared/game/uno';

import { getBotName } from '../shared/game/bot';
import { Card, GameState } from '../shared/types';

const PORT = 4000;
const app = express();
app.use(cors());

const http = createServer(app);
const io = new Server(http, {
  cors: {
      origin: "https://uno-online.onrender.com",
      methods: ["GET", "POST"]
  }
});
 


// SERVER INTERFACES
interface RoomState {
  roomID: string;

  clients: RoomClient[];
  host?: string;

  game: GameState;
  inLobby: boolean;
}

interface Client{
    id: string;
    name: string;
    game: GameState
}

interface RoomClient{
  id: string;
  name: string;
}

// Socket Methods
const rooms = new Map<string, RoomState>(); // <roomId, RoomState>
const clients = new Map<string, Client>(); // <socketId, Client>

// https://socket.io/docs/v4/emit-cheatsheet/

io.on('connection', (socket: Socket) => {

  socket.on('create-sp-game', (username: string) => {
    console.log(`+: Singleplayer game created`);
    
    // add client to clients map
    clients.set(socket.id, {id: socket.id, name: username, game: generateUnoGame()})

    // setup client game
    if(clients.get(socket.id)){ 
      console.log('setting up client game');
      
      const player = clients.get(socket.id)!.game.players[0]
      clients.get(socket.id)!.game.players[0] = {...player, socketID: socket.id, name: username, type: 'player'}
    }

    socket.emit('data-sp', clients.get(socket.id)?.game)
  })


  // CONNECTION METHODS
  socket.on('create-game', (room: string, username: string) => {
    console.log(`+: Room created: ${room}`);
    socket.join(room);

    // create room data
    const initRoomData: RoomState = {
        roomID: room,
  
        clients: [], // [{id: socket.id, name: username}]
        host: socket.id,
  
        game: generateUnoGame(),
        inLobby: true,
      };
    rooms.set(room, initRoomData)

    // add client to room
    addPlayerToRoom(socket.id, room, username)
    io.to(room).emit('data', rooms.get(room));
  })

  socket.on('join', (room: string, username: string) => {
    // check if room exists on server
    if(!io.sockets.adapter.rooms.has(room)) {
      console.log(`!: ${socket.id} tried to join room ${room} but it doesn't exist`)
      socket.emit('error', 'Room does not exist')
      return
    } 

    if(!socket.rooms.has(room)) {
      if(rooms.get(room)!.clients.length >= 4){
        // check if room is full
        console.log(`!: ${socket.id} tried to join room ${room} but it is full: ${rooms.get(room)!.clients.length}`)
        socket.emit('error', 'Room is full')
        return
      }      

    // check if user is already conencted to this room
    
      socket.join(room);

      addPlayerToRoom(socket.id, room, username)

      console.log(`+: ${socket.id} joined room ${JSON.stringify(rooms.get(room)!.clients)}`);

      io.to(room).emit('data', rooms.get(room));
      socket.emit('join-success');
    }
  })

  // todo methods:
    // start-timer

  // GAME METHODS
  socket.on('start-game', (room: string) => {
    rooms.get(room)!.inLobby = false;
    io.to(room).emit('data', rooms.get(room));
  })

  socket.on('finish-turn', (room: string) => {    
    let gameVar: GameState;
    room ? gameVar = rooms.get(room)!.game : gameVar = clients.get(socket.id)!.game


    const runfinishTurn = function() {
      if(room){
        rooms.get(room)!.game = finishTurn(rooms.get(room)!.game)
        io.to(room).emit('data', rooms.get(room));
      }
      else{
        clients.get(socket.id)!.game = finishTurn(clients.get(socket.id)?.game!)
        socket.emit('data-sp', clients.get(socket.id)?.game)
  
      }
    }

    runfinishTurn() // run once

    // if player is skipped, run again
    if(gameVar.players[gameVar.currentPlayer!].isSkipped === true){
      setTimeout(() => {
          runfinishTurn()
      }, 1000)}
  })

  socket.on('set-color', (room: string, color: string) => {
    if(room){
      rooms.get(room)!.game = setColor(rooms.get(room)!.game, color)
      io.to(room).emit('data', rooms.get(room));
    }
    else{
      clients.get(socket.id)!.game = setColor(clients.get(socket.id)?.game!, color)
      socket.emit('data-sp', clients.get(socket.id)?.game)
    }
  })

  socket.on('new-game', (room: string) => {
    const newGame = generateUnoGame();

    // Function to preserve socketID, name and type on game reset
    const prepPlayers = (newGame: GameState, oldGame: GameState) => {
      const newPlayers = newGame.players.map((player, index) => {
        const oldPlayer = oldGame.players[index]
        return {...player, socketID: oldPlayer.socketID, name: oldPlayer.name, type: oldPlayer.type}
      })

      return newPlayers
    }

    if(room){
      const oldGame = rooms.get(room)!.game;
      rooms.get(room)!.game = {...newGame, players: prepPlayers(newGame, oldGame)}

      io.to(room).emit('data', rooms.get(room));
    }
    else{
      const oldGame = clients.get(socket.id)!.game
      clients.get(socket.id)!.game = {...newGame, players: prepPlayers(newGame, oldGame)}
      
      socket.emit('data-sp', clients.get(socket.id)?.game)
    }
  })

  socket.on('play-card', (room:string, card: Card) => {
    if(room){
      rooms.get(room)!.game = playCard(rooms.get(room)!.game, card)
      io.to(room).emit('data', rooms.get(room));
    }
    else{
      clients.get(socket.id)!.game = playCard(clients.get(socket.id)?.game!, card)
      socket.emit('data-sp', clients.get(socket.id)?.game)
    }
  })

  socket.on('pickup-card', (room: string, index: number, quantity: number) => {
    if(room){
      rooms.get(room)!.game = pickupCard(rooms.get(room)!.game, index, quantity)
      io.to(room).emit('data', rooms.get(room));
    }
    else{
      clients.get(socket.id)!.game = pickupCard(clients.get(socket.id)?.game!, index, quantity)
      socket.emit('data-sp', clients.get(socket.id)?.game)
    }
  })

  socket.on('bot-turn', (room: string) => {
    if(room){
      rooms.get(room)!.game = botTurn(rooms.get(room)!.game)
      io.to(room).emit('data', rooms.get(room));
    }
    else{
      clients.get(socket.id)!.game = botTurn(clients.get(socket.id)?.game!)
      socket.emit('data-sp', clients.get(socket.id)?.game)
    }
  })

  socket.on('call-uno', (room: string, index: number) => {
    if(room){
      rooms.get(room)!.game = callUno(rooms.get(room)!.game, index)
      io.to(room).emit('data', rooms.get(room));
    }
    else{
      clients.get(socket.id)!.game = callUno(clients.get(socket.id)?.game!, index)
      socket.emit('data-sp', clients.get(socket.id)?.game)
    }
  })

  socket.on('set-uno-call-possible', (room: string, index: number) => {
    if(room){
      rooms.get(room)!.game = setUnoCallPossible(rooms.get(room)!.game, index)
      io.to(room).emit('data', rooms.get(room));
    }
    else{
      clients.get(socket.id)!.game = setUnoCallPossible(clients.get(socket.id)?.game!, index)
      socket.emit('data-sp', clients.get(socket.id)?.game)
    }
  })

  socket.on('set-uno-challenge', (room: string, index: number) => {
    if(room){
      rooms.get(room)!.game = shouldCallUno(rooms.get(room)!.game, index)
      io.to(room).emit('data', rooms.get(room));
    }
    else{
      clients.get(socket.id)!.game = shouldCallUno(clients.get(socket.id)?.game!, index)
      socket.emit('data-sp', clients.get(socket.id)?.game)
    }
  })

  socket.on('challenge-uno', (room:string) => {
    if(room){
      rooms.get(room)!.game = challengeUno(rooms.get(room)!.game)
      io.to(room).emit('data', rooms.get(room));
    }
    else{
      clients.get(socket.id)!.game = challengeUno(clients.get(socket.id)?.game!)
      socket.emit('data-sp', clients.get(socket.id)?.game)
    }
  })

  socket.on('start-timer', (room: string) => {
    if(room){
      roomTimer(room)
    }
  })

  function roomTimer(room: string) {
    let seconds = 10;

    while(seconds > 0){
      setTimeout(() => {
        seconds -= 1;
        io.to(room).emit('time-data', rooms.get(room));
      }, 1000)
    }
  }





 



  // DISCONNECTION METHODS

  // leave is fired when a socket leaves lobby/game screen
  socket.on('leave', (room: string) => {
    socket.leave(room);

    if (io.sockets.adapter.rooms.has(room)){
      if(rooms.has(room)){
        removePlayerFromRoom(socket.id, room)
        io.to(room).emit('data', rooms.get(room));
      }
    }
    else{
      rooms.delete(room); // No users in room
    }

    if(room){
      socket.emit('data', undefined); // Cleanup for room frontend code
    }
  });

  // disconnecting is fired when a socket disconnects from the whole server
  socket.on("disconnecting", (reason: string) => {
    // This is fired JUST BEFORE a socket disconnects. ()
    for (const room of socket.rooms) {
      if (room !== socket.id) {
        if(rooms.has(room)){
          removePlayerFromRoom(socket.id, room)
          io.to(room).emit('data', rooms.get(room));
        }
      }
    }
  });

  socket.on('disconnect', () => {
    // This is fired AFTER a socket disconnects. ()
    clients.delete(socket.id);    
  });
});









http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});




// Functions
function addPlayerToRoom(socketID: string, room: string, username: string){
    const roomData = rooms.get(room)!;

    roomData.clients.push({id: socketID, name: username})

    const openIndex = roomData.game.players.findIndex((player) => !player.socketID)
    if(openIndex !== undefined && openIndex !== -1){
      roomData.game.players[openIndex] = {...roomData.game.players[openIndex], type: 'player', socketID: socketID, name: username}
    }

    rooms.set(room, roomData)
}

function removePlayerFromRoom(socketID: string, room: string){
  const roomData = rooms.get(room)!;

  let arr = rooms.get(room)!.clients.filter((client: RoomClient) => client.id !== socketID)
  rooms.get(room)!.clients = arr

  const openIndex = roomData.game.players.findIndex((player) => player.socketID === socketID)
  if(openIndex !== undefined && openIndex !== -1){
    roomData.game.players[openIndex] = {...roomData.game.players[openIndex], type: 'bot', socketID: undefined, name: getBotName()}
  }

  // change host to next player
  if(roomData.clients[0]){
    roomData.host = roomData.clients[0].id || undefined
  }

  rooms.set(room, roomData)
}