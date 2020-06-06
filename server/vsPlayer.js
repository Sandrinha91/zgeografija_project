class vsPlayer {
    constructor(p1, p2){
        this._players = [p1, p2];
        this._usernames = [null,null];
        console.log(this._players[0].id);
        console.log(this._players[1].id);
        this._turns = [null, null];
        //this._arrayLetters = ["A", "B", "C", "Č", "Ć", "D", "Dž", "Đ", "E", "F", "G", "H", "I", "J", "K", "L", "Lj", "M", "N", "Nj", "O", "P", "R", "S", "Š", "T", "U", "V", "Z", "Ž"];
        this._arrayLetters = ["A"];

        //send mesage to players
        this._sendToPlayers('Igra počinje za 4');
        
        this._players.forEach( (player, idx) => {
            player.on('turn', (turn) => {
                this._onTurn( idx ,turn);
            });
            //console.log('111',this._turns);
        });

        this._players.forEach( (player, idx) => {
            // if( this._players[0] && this._players[1] ){
                player.on('userName', (user) => {
                    //this._onUsername( idx ,userName);
                    //console.log(player);
                    console.log(user);
                });
            //}
            console.log('111',this._usernames);
        });

        this._players.forEach( (player) => { 
            player.on('disconnect', () => {
                //io.emit('chat', 'socket OFF');
                //console.log('SOCK!', player.id);
                if( player.id ==  this._players[0].id){
                    this._onTurn( 0, ['Empty', 'Empty', 'Empty', 'Empty', 'Empty', 'Empty', 'Empty', 'Pizda'] );
                    this._sendDiscInfoToPlayer(1, 'Get bot answers!');
                } else {
                    this._onTurn( 1, ['Empty', 'Empty', 'Empty', 'Empty', 'Empty', 'Empty', 'Empty', 'Pizda'] );
                    this._sendDiscInfoToPlayer(0, 'Get bot answers 1!');
                   // console.log(this._turns);
                }
            });
        });
    }

    //funkcija ya slanje poruke jednom igracu
    _sendToPlayer(playerIndex, msg){
        this._players[playerIndex].emit('message',msg);
    }

    //funkcija ya slanje poruke jednom igracu
    _sendDiscInfoToPlayer(playerIndex, msg){
        this._players[playerIndex].emit('playerDisconnected',msg);
    }

    //send message to both players
    _sendToPlayers(msg) {
        const randomElement = this._arrayLetters[Math.floor(Math.random() * this._arrayLetters.length)];
        //console.log(randomElement);
        
        this._players.forEach( (player) => { 
            player.emit('message', msg);
            player.emit('runPrepTime', 3);
            player.emit('firstLetter', randomElement);
        });
    }

    //send message to both players for nereseno
    _sendDrawToPlayers(msg) {
        this._players.forEach( (player) => { 
            player.emit('message', msg);
        });
    }

    //send message to both players for nereseno
    _sendResultsToPlayers(result) {
        this._players.forEach( (player) => { 
            player.emit('displayResults', result);
        });
    }
  
    //on submited answers
    _onTurn(playerIndex,turn){
        this._turns[playerIndex] = turn;
        
        // this._sendToPlayer(playerIndex, `You selected ${turn}`);
        this._checkGameOver();
    }

    // //on submited answers
    // _onUsername(playerIndex,username){
    //     this._usernames[playerIndex] = username;
    //     // this._sendToPlayer(playerIndex, `You selected ${turn}`);
    //     //this._checkGameOver();
    // }

    _checkGameOver(){
        const turns = this._turns;
        if(turns[0] && turns[1]){
            this._getGameResult();
            this._turns = [null, null];
        }
    }

    _getGameResult() {

        const p0 = this._turns[0];
        const p1 = this._turns[1];
        let categories = ['Država', 'Grad', 'Reka', 'Planina', 'Životinja', 'Biljka', 'Predmet'];
        let finalArray = [];

        p0.forEach( (elem,index) => {
            if( index != 7 ){
                finalArray.push(this._calculateScore( elem, categories[index], p1[index] ,p0[7], p1[7]));
            } else if( index == 7 ){
                let scoreP1 = 0;
                let scoreP2 = 0;
                finalArray.forEach( (elem, index) => {
                    scoreP1 += elem.player.score;
                    scoreP2 += elem.player2.score;
                    if( index == 6 ){
                        if( scoreP1 < scoreP2 ){
                            this._sendResultsToPlayers(finalArray);
                            this._sendWinMessage(this._players[1], this._players[0]);
                        } else if( scoreP1 > scoreP2 ){
                            this._sendResultsToPlayers(finalArray);
                            this._sendWinMessage(this._players[0], this._players[1]);
                        } else{
                            this._sendResultsToPlayers(finalArray);
                            this._sendDrawToPlayers('<img src="img/alienNeutral.png" style="width:40px; margin-right:5px;">Nerešeno!!!');
                        }
                    }
                });
            }
        });
    }

    _sendWinMessage(winner, loser) {
        winner.emit('message', '<img src="img/alienHappy.png" style="width:40px; margin-right:5px;">Čestitamo, pobedili ste!!!');
        loser.emit('message', '<img src="img/alienAngry.png" style="width:40px; margin-right:5px;">Izgubili ste!!!');
    }
    
    _calculateScore( myData, category, compData, userOne, userTwo) {
        
        let data = {
            player:{
                'username': userOne,
                'answer': myData,
                'category': category,
                'score': 0,
            },
            player2:{
                'username': userTwo,
                'answer': compData,
                'category': category,
                'score': 0,
            },
          };

          if ( myData != 'Empty' && compData != 'Empty' ){
            if( myData !=  compData){
              data.player.score = 10;
              data.player2.score = 10;
            }else{
              data.player.score = 5;
              data.player2.score = 5;
            }
          } else if( myData == 'Empty' && compData == 'Empty' ){
            data.player.score = 0;
            data.player2.score = 0;
            data.player.answer = 'Ne znam';
            data.player2.answer = 'Ne znam';
          } else {
            if( myData == 'Empty' &&  compData != 'Empty' ){
              data.player.score = 0;
              data.player.answer = 'Ne znam';
              data.player2.score = 15;
            } else {
              data.player.score = 15;
              data.player2.score = 0;
              data.player2.answer = 'Ne znam';
            }
          }

        return data;
        }   

    }

module.exports = vsPlayer;