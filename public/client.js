/* particlesJS.load(@dom-id, @path-json, @callback (optional)); */
particlesJS.load('particles-js', 'particles.js/demo/particles.json', function() {
    console.log('callback - particles.js config loaded');
  });

window.onbeforeunload = function() {
    window.location.replace("http://localhost:8080/vsPlayer.html");
};

    
import {Game} from "./game.js";
const sock = io();

//function for writing events from socket
const writeEvent = (text) => {
    const parent = document.querySelector('#events');
    parent.innerHTML = text;
};

//function for writing events from socket
const writeChat = (text) => {
    const parentUl = document.querySelector('#chatUl');
    //li element
    const el = document.createElement('li');
    el.innerHTML = text;
    parentUl.appendChild(el);
};

let infoMessage = document.querySelector('#events');
let gameContent = document.querySelector('#gameContent');
let gameInputVsContainer = document.querySelector('#gameInputVsContainer');
let gameChatContainer = document.querySelector('#gameChatContainer');
let chosenLetterContainerVs = document.querySelector('#chosenLetterContainerVs');
let submitGameVs = document.querySelector('#submitGameVs');
let usernameContainerVs = document.querySelector('#usernameContainerVs');
let tableResetButton = document.querySelector('#tableResetButton');

tableResetButton.addEventListener('click', e => {
    window.location.replace("http://localhost:8080/vsPlayer.html");
  });

usernameContainerVs.innerText=`${localStorage.username}`;

//timer function
let timer = (numb) =>{
    
    let counter = numb;
    let clock;
    let clockIsSet = false;

    if(!clockIsSet) {
        clockIsSet = true;
        
        clock = setInterval(() => {
            infoMessage.innerText = `Igra počinje za ${counter}`;
            
            if( counter == 0 ){
                infoMessage.innerText = `Igra počinje za ${counter}`;
                gameContent.classList.remove('d-none');
                gameContent.classList.add('d-block');
                gameChatContainer.classList.remove('d-none');
                gameChatContainer.classList.add('d-flex');
                clearInterval(clock);
                clockIsSet = false;
                gameTimer(50);
            }
            counter--;
            timer.innerHTML = counter;
        }, 1000);
    }
}

//check data function
let checkData = () => {
    // get answers from dom input
    let countryVs = document.querySelector("#countryVs").value.replace(/ /g,'');
    let cityVs = document.querySelector("#cityVs").value.replace(/ /g,'');
    let riverVs = document.querySelector("#riverVs").value.replace(/ /g,'');
    let mountainVs = document.querySelector("#mountainVs").value.replace(/ /g,'');
    let animalVs = document.querySelector("#animalVs").value.replace(/ /g,'');
    let plantVs = document.querySelector("#plantVs").value.replace(/ /g,'');
    let objectInputVs = document.querySelector("#objectInputVs").value.replace(/ /g,'');
    
    //put answers in array
    let arrayAnswers = [ countryVs, cityVs, riverVs, mountainVs, animalVs, plantVs, objectInputVs];
    let myArray = [];
    var filteredAnswers = [];
    var game = new Game(arrayAnswers,'Lako');
    game.filterAnswers(arrayAnswers, data => {
        myArray = data;
      });
    //console.log(arrayAnswers);
    //console.log(myArray);

    myArray.forEach( (elem,index) => {
        game.ifAnswerExist( game.capitalizeLetterTerm(elem), game.categories[index], myData => {

        filteredAnswers.push(myData);
        //game.userBAnswers.push(myData);
          
        if( filteredAnswers.length == myArray.length ){
            filteredAnswers.push(localStorage.username);
            //console.log(filteredAnswers);
            sock.emit('turn', filteredAnswers);
          }
        });
    });
}

//game timer function
let gameTimer = (numb) =>{
    let timerVs = document.querySelector('#timerVs');

    let counter = numb;
    //var clockOne;
    let clockIsSet = false;

    infoMessage.innerText='';

    if(!clockIsSet) {
        clockIsSet = true;
        
        var clockOne = setInterval(() => {
            timerVs.innerText = counter;
            counter--;
            // if( counter == 3 ){
            //     //submitGameVs.disabled = true;
            // }
            if( counter == 0 ){
                
                timerVs.innerText = counter;
                clearInterval(clockOne);
                clockIsSet = false;
                checkData();
            }
        }, 1000);
    }

    //on quiz form submited check data
    submitGameVs.addEventListener('submit', e => {
        e.preventDefault();
        clearInterval(clockOne);
        checkData();
    });
}

//print given letter
const printLetter = (letter) =>{
    chosenLetterContainerVs.innerHTML = letter;
    localStorage.setItem('givenLetter', letter);
}

//function for chat form submit
const onFormSubmitied = (e) => {
    e.preventDefault();

    const input = document.querySelector('#chat');
    const text = input.value;
    input.value = '';

    sock.emit('chat', text);
};

//calling writeFunction on created event(wait for a player/game starts)
sock.on('message', writeEvent);

//calling function write chat messages on chat event
sock.on('chat', writeChat);

//calling gunction on form submited
document
    .querySelector('#chat-form')
    .addEventListener('submit', onFormSubmitied);


//turn on timer  3 2 1
sock.on('runPrepTime', timer);

//print firs letter 
sock.on('firstLetter', printLetter);


let makeTableRow = ( tableResult, index , category, usersTerm, usersPoints, compPoints, compAnswer ) => {
    //let tableResult = document.querySelector('#tableResult');
    let row = tableResult.insertRow(index);
    let cell0 = row.insertCell(0);
    let cell1 = row.insertCell(1);
    let cell2 = row.insertCell(2);
    let cell3 = row.insertCell(3);
    let cell4 = row.insertCell(4);
    cell0.innerHTML = `<b>${category}</b>`;
    cell0.classList.add('cell-width-term');
    cell1.innerHTML = `${usersTerm}`;
    cell1.classList.add('cell-width-answer');
    cell2.innerHTML = `${usersPoints}`;
    cell2.classList.add('cell-width-points');
    cell3.innerHTML = `${compPoints}`;
    cell3.classList.add('cell-width-points');
    cell4.innerHTML = `${compAnswer}`;
    cell4.classList.add('cell-width-answer');
}

let resultRow = (rowNumb, userResult, compResult) => {
    let tableResult = document.querySelector('#tableResult');
    let row = tableResult.insertRow(rowNumb);
    row.classList.add('bg-light');
    let cell0 = row.insertCell(0);
    cell0.innerHTML = ``;
    let cell1 = row.insertCell(1);
    cell1.innerHTML = `<b>Ukupno:</b>`;
    let cell2 = row.insertCell(2);
    cell2.innerHTML = `<b>${userResult}</b>`;
    let cell3 = row.insertCell(3);
    cell3.innerHTML = `<b>${compResult}</b>`;
    let cell4 = row.insertCell(4);
    cell4.innerHTML = ``;
} 

let printData = (dataAll) => {
    gameChatContainer.classList.remove('d-flex');
    gameChatContainer.classList.add('d-none');
    tableResultDivVs.classList.remove('d-none');
    // gameInputsDiv.classList.add('d-none');
    
    let tableResult = document.querySelector('#tableResult');
    let usernameResultTable = document.querySelector('#usernameResultTable');
    let usernameResultTable2 = document.querySelector('#usernameResultTable2');
    let array = [];
    let userPoints = 0;
    let player2Points = 0;
    let categories = ['Država', 'Grad', 'Reka', 'Planina', 'Životinja', 'Biljka', 'Predmet'];

    usernameResultTable.innerText = `${dataAll[0].player.username}`;
    usernameResultTable2.innerText = `${dataAll[0].player2.username}`;

    dataAll.forEach( (elem,index) => {
      userPoints += elem.player.score;
      player2Points += elem.player2.score;
      makeTableRow( tableResult, index , categories[index], elem.player.answer, elem.player.score,elem.player2.score, elem.player2.answer);
      //console.log(dataAll);
      if(index == 6){
        let game = new Game(array,'Easy');
        game.getUserPoints(localStorage.username, (data) =>{
            console.log(data);
            let arrPlayerOne = [userPoints, elem.player.username];
            let arrPlayerTwo = [player2Points, elem.player2.username];
            //console.log(sock.id);

            if( arrPlayerOne[1] == localStorage.username ){
                console.log(arrPlayerOne);
                let finalResultP1 = data[1] + arrPlayerOne[0];
                let finalGamePlayedP1 = data[0] + 1;
                //console.log(finalResultP1);
                //console.log(finalGamePlayedP1);
                game.updateData(finalResultP1, finalGamePlayedP1, data[2]);
            } else if( arrPlayerTwo[1] == localStorage.username ){
                console.log(arrPlayerTwo);
                let finalResultP2 = data[1] + arrPlayerTwo[0];
                let finalGamePlayedP2 = data[0] + 1;
                //console.log(finalResultP2); 
                //console.log(finalGamePlayedP2);
                game.updateData(finalResultP2, finalGamePlayedP2, data[2]); 
            }
        });
      }
    });

    resultRow(7, userPoints, player2Points);
}

//display results on event
sock.on('displayResults', printData);

//generate and upload bot answers when one player is disconnected
sock.on('playerDisconnected', (chikenPlayer) => {
    console.log(chikenPlayer);
    let game = new Game([],'Easy');

    //get chickenPlayer doc from db, give -35 points, upodate db with new data
    game.getUserPoints(chikenPlayer, (data) => {
        //console.log(data);
        let chickenPlayerGames = data[0] + 1;
        let chickenPlayerPoints = data[1];
        let chickenPlayerId = data[2];
        if(chickenPlayerPoints >= 35 ){
            chickenPlayerPoints = data[1] - 35;
        } else {
            chickenPlayerPoints = 0;
        }
        game.updateData(chickenPlayerPoints , chickenPlayerGames, chickenPlayerId); 
    });

});

//send username on sock request
sock.emit('userName', localStorage.username);

sock.on('returnNickname', (index) =>{
    let usernameArray = [index,localStorage.username,sock.id];
    //console.log(index,localStorage.username,sock.id);
    //console.log(usernameArray);
    sock.emit('usernameArray', usernameArray);
});