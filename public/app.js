// const Swal = require('sweetalert2')

$(document).ready(function() {
  if (location.hash) {
      $("a[href='" + location.hash + "']").tab("show");
  }
  $(document.body).on("click", "a[data-toggle='tab']", function(event) {
      location.hash = this.getAttribute("href");
  });
});
$(window).on("popstate", function() {
  var anchor = location.hash || $("a[data-toggle='tab']").first().attr("href");
  $("a[href='" + anchor + "']").tab("show");
  $("a[href='" + location.hash + "']").tab("show");
});

/* particlesJS.load(@dom-id, @path-json, @callback (optional)); */
particlesJS.load('particles-js', 'particles.js/demo/particles.json', function() {
  console.log('callback - particles.js config loaded');
});

import {Quiz} from "./quiz.js";
import {QuizUI} from "./ui.js";
import {Game} from "./game.js";

// DOM
let formSuggestTerm = document.querySelector('#formSuggestTerm');
let suggestedTerm = document.querySelector('#suggestedTerm');
let divTermError = document.querySelector('#divTermError');
let usernameContainer = document.querySelector('#usernameContainer');
let usernamePosition = document.querySelector('#usernamePosition');
let inputUsername = document.querySelector('#inputUsername');

let selecteSuggestCategory = document.querySelector('#selectSuggestCategory');
let rangList = document.querySelector('#rangList');
let profilesTab = document.querySelector('#navContentUser');
let loader = document.querySelector('.loader1');
let logOut = document.querySelector('#logOut');
let blurTable = document.querySelector('#blur');
let refreshListBtn = document.querySelector('#refreshBtn');
let userAvatar = document.querySelector('#userAvatar');
let rangListTemplate = new QuizUI(rangList);


//avatar boxes
let avatarOneBox = document.querySelector('#avatarOneBox');
let avatarTwoBox = document.querySelector('#avatarTwoBox');
let avatarThreeBox = document.querySelector('#avatarThreeBox');
let avatarFourBox = document.querySelector('#avatarFourBox');

let username = () => {
    if( localStorage.username ){
        return localStorage.username;
    }else{
        return false;
    }
}

// TIMER FOR DISAPEAR DIV
let disapearAfter = (div) => {
  setTimeout( () => {
    // div.classList.add('d-none');
    div.innerText="";
  },3000);
}

// take all users , sort them and display first 5
let makeRangList = (qi) => {
  qi.getAllUsers( data => {
    let username = data[0];
    let counter = 0;
    let rangListArray = [];
    let lastChild = data.length;
  
    // filter users
    for ( let i = 0; i <= data.length; i++) {
      if(username == data[i]){
        counter++;
      } else if ( username != data[i] ) {
        if ( i == lastChild ) {
          rangListArray.push([username,counter]);
          counter = 0;
        }
        else {
          rangListArray.push([username,counter]);
          counter = 1;
          username = data[i];
        }
      } 
    }
    // array sort
    let  finalSort = rangListArray.sort(function(a, b) {
      return b[1] - a[1];
    });
    // make html list template
    rangListTemplate.templateRangLI(finalSort, usernamePosition);
  });
}

//define active avatar
let defineBorder = ( avatarImg, avatarOneBox, avatarTwoBox , avatarThreeBox, avatarFourBox) => {
  if( avatarImg == 1){
    avatarOneBox.classList.add('border', 'border-success');
    avatarTwoBox.classList.remove('border', 'border-success');
    avatarThreeBox.classList.remove('border', 'border-success');
    avatarFourBox.classList.remove('border', 'border-success');
  } else if ( avatarImg == 2){
    avatarOneBox.classList.remove('border', 'border-success');
    avatarTwoBox.classList.add('border', 'border-success');
    avatarThreeBox.classList.remove('border', 'border-success');
    avatarFourBox.classList.remove('border', 'border-success');
  } else if ( avatarImg == 3){
    avatarOneBox.classList.remove('border', 'border-success');
    avatarTwoBox.classList.remove('border', 'border-success');
    avatarThreeBox.classList.add('border', 'border-success');
    avatarFourBox.classList.remove('border', 'border-success');
  } else if ( avatarImg == 4){
    avatarOneBox.classList.remove('border', 'border-success');
    avatarTwoBox.classList.remove('border', 'border-success');
    avatarThreeBox.classList.remove('border', 'border-success');
    avatarFourBox.classList.add('border', 'border-success');
  }
}

//update avatar
let defineAvatar = ( avatarImg) => {
  if( qi == undefined ){
    let qi2 = new Quiz(localStorage.username);

    if( avatarImg == 1){
      qi2.updateAvatar('img/avatarOne', avatarImg);
    } else if ( avatarImg == 2){
      qi2.updateAvatar('img/avatarTwo', avatarImg);
    } else if ( avatarImg == 3){
      qi2.updateAvatar('img/avatarThree', avatarImg);
    } else if ( avatarImg == 4){
      qi2.updateAvatar('img/avatarFour', avatarImg);
    }
  } else {
    if( avatarImg == 1){
      qi.updateAvatar('img/avatarOne', avatarImg);
    } else if ( avatarImg == 2){
      qi.updateAvatar('img/avatarTwo', avatarImg);
    } else if ( avatarImg == 3){
      qi.updateAvatar('img/avatarThree', avatarImg);
    } else if ( avatarImg == 4){
      qi.updateAvatar('img/avatarFour', avatarImg);
    }
  }

  
}

//succesfull login
const Toast = Swal.mixin({
    toast: true,
    position: 'bottom-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    onOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })
  
// if usernmame not true sweetalert ON
if( !username() ){
    Swal.fire({
        title: 'Unesite korisničko ime',
        input: 'text',
        confirmButtonText: 'Potvrdi',
        showLoaderOnConfirm: true,
        allowOutsideClick: false
      }).then((result) => {
        
        if( result.value.trim().length == 0){
            console.log('Morate uneti korisničko ime!');
            Swal.fire({
                title: `Morate uneti korisničko ime!`,
                icon: 'warning',
                allowOutsideClick: false,
                showConfirmButton: false,
                }); 
        }else{
            localStorage.setItem('username',result.value);
            profilesTab.innerHTML = ` ( ${localStorage.username} )`;
            inputUsername.setAttribute('value', `${localStorage.username}`);
            usernameContainer.innerHTML = `${localStorage.username}`;
            var qi = new Quiz(username());

            qi.ifUserExist(result.value, data => {
              if( data ){
                //data.avatar;
                defineBorder( data.avatar_id, avatarOneBox, avatarTwoBox , avatarThreeBox, avatarFourBox);
              } else {
                userAvatar.setAttribute('src', `img/genericAvatar.png`);
                //napravi novi dokument za korisnika
                qi.insertNewUser( result.value );
              }
            });
            //makeRangList(qi);
            //
            if( localStorage.picture ){
              userAvatar.setAttribute('src', `${localStorage.picture}`);
              defineBorder( localStorage.picID, avatarOneBox, avatarTwoBox , avatarThreeBox, avatarFourBox);
            } else{
              userAvatar.setAttribute('src', `img/genericAvatar.png`);
            }
            
            Swal.fire({
                title: `Dobrodošli ${result.value}!`,
                }).then( () => {
                    Toast.fire({
                        icon: 'success',
                        title: 'Uspešno logovanje!'
                      });
                      // setTimeout(function() {
                        // location.reload();
                        // reload-comm
                      // }, 300);
                });
        }
      })
} else {
  profilesTab.innerHTML = ` ( ${localStorage.username} )`;
  inputUsername.setAttribute('value', `${localStorage.username}`);
  usernameContainer.innerHTML = `${localStorage.username}`;
  var qi = new Quiz(username());
  qi.setAvatar(userAvatar);
  //makeRangList(qi);
  defineBorder( localStorage.pictureID, avatarOneBox, avatarTwoBox , avatarThreeBox, avatarFourBox);
}

// reloadForList.addEventListener('click', e =>{
//   location.reload();
// });

// update avatar iz input polja
let formUpdateAvatar = document.querySelector('#formUpdateAvatar');
// let divUpdatedAvatar = document.querySelector('#divUpdatedAvatar');
// let btnChangeAvatar = document.querySelector('#btnChangeAvatar');
let selectedAvatar = document.querySelectorAll('#selectedAvatar');

// form update
formUpdateAvatar.addEventListener('submit', e => {
    e.preventDefault();
    
    let avatarImg = selectedAvatar[0].value;
    console.log(avatarImg);
    defineAvatar(avatarImg);
    userAvatar.setAttribute('src', `${localStorage.picture}.png`);
    defineBorder( avatarImg, avatarOneBox, avatarTwoBox , avatarThreeBox, avatarFourBox);
    console.log(`${localStorage.picture}`);

    // if( newUsername.trim().length == 0 ){
    //     divUpdatedUsername.innerHTML= `<span class="alert alert-warning">Unesite korisničko ime!</span>`;
    //     disapearAfter(divUpdatedUsername);
    // }else{
    //     qi.updateUsername(newUsername);
    //     divUpdatedUsername.innerHTML = `<span class='alert alert-success'>Vaše korisničko ime je promenjeno u <b>${newUsername}</b></span>`;
    //     usernameContainer.innerHTML = `${localStorage.username}`;
    //     inputUsername.setAttribute('value', `${localStorage.username}`);
    //     profilesTab.innerHTML = ` ( ${localStorage.username} )`;
    //     formUpdateUsername.reset();
    //     disapearAfter(divUpdatedUsername);
    // }
});


//suggest term validation
formSuggestTerm.addEventListener( 'submit', e =>{
    e.preventDefault();
    
    let sugestedTrim = suggestedTerm.value.replace(/ /g,'');
    console.log(sugestedTrim);
    let category = selecteSuggestCategory.value;
    console.log(category);

    let result = qi.inputValidation(sugestedTrim,divTermError,formSuggestTerm);
    disapearAfter(divTermError);
    
    if( result !== false && result !== undefined && result !== null ) {
        qi.isUnique( sugestedTrim, category ,  data => {
            if ( data ) {
                if( localStorage.username !== false && localStorage.username !== undefined && localStorage.username !== null ){
                  qi.insertTerm( category, sugestedTrim);
                  divTermError.innerHTML = `<span class='alert alert-success mt-2'>Pojam: ${sugestedTrim} je uspešno dodat!</span>`;
                  loader.style.display = "block";
                  blurTable.classList.add('blur');
                } else {
                  divTermError.innerHTML = `<span class='alert alert-success mt-2'>Samo ulogovani korisnici mogu predložiti pojam!</span>`;
                }
                disapearAfter(divTermError);
                formSuggestTerm.reset();
            } else {
                divTermError.innerHTML = `<span class='alert alert-warning mt-2'>Pojam: ${sugestedTrim} je već unet!</span>`;
                disapearAfter(divTermError);
                formSuggestTerm.reset();
            }
        })  
    }
});

//blur table after insert new term
refreshListBtn.addEventListener('click', () =>{
  location.reload();
  loader.style.display = "none";
  blurTable.classList.remove('blur');
});

// menu responsive
$(document).ready(function() {
  var fixHeight = function() {
    $('.navbar-nav').css(
      'max-height',
      document.documentElement.clientHeight - 150
    );
  };
  fixHeight();
  $(window).resize(function() {
    fixHeight();
  });
  $('.navbar .navbar-toggler').on('click', function() {
    fixHeight();
  });
  $('.navbar-toggler, .overlay').on('click', function() {
    $('.mobileMenu, .overlay').toggleClass('open');
  });
});

// LOG OUT USER AND CLEAR LOCAL STORAGE ON CLICK
logOut.addEventListener("click", () => {
  localStorage.clear();
});

// QUIZ TIME VS COMP
let startGame = document.querySelector("#startGame");
let startGameDiv = document.querySelector("#startGameDiv");
let timer = document.querySelector("#timer");
let gameUserAvatar = document.querySelector("#gameUserAvatar");
let submitGame = document.querySelector("#submitGame");
let firstLetter = document.querySelector("#firstLetter");
let tableResultDiv = document.querySelector("#tableResultDiv");
let gameInputsDiv = document.querySelector('#gameInputsDiv');
let gameContent = document.querySelector('#gameContent');
let tableResetButton = document.querySelector('#tableResetButton');
let startGameVsBot = document.querySelector('#startGameVsBot');
let playMode = document.querySelector('#playMode');
let clock;
let clockIsSet = false;
let arrayLetters = ["A", "B", "C", "Č", "Ć", "D", "Dž", "Đ", "E", "F", "G", "H", "I", "J", "K", "L", "Lj", "M", "N", "Nj", "O", "P", "R", "S", "Š", "T", "U", "V", "Z", "Ž"];

tableResetButton.addEventListener('click', e => {
  location.reload();
});

//open div to choose option / player or comp
startGame.addEventListener( 'click', () => {
  vsWho.classList.add('d-block');
});

//start game / set timer / define first letter
startGameVsBot.addEventListener('click', () => {

  // console.log(playMode);
  startGameDiv.classList.add('d-none');
  tableResultDiv.classList.add('d-none');
  vsWho.classList.add('d-none');
  gameInputsDiv.classList.remove('d-none');
  gameContent.classList.remove('d-none');
  const randomElement = arrayLetters[Math.floor(Math.random() * arrayLetters.length)];
  localStorage.setItem('givenLetter',randomElement);
  firstLetter.innerHTML = `${randomElement}`;
  //gameUserAvatar.setAttribute('src', `${localStorage.picture}.png`);

  let counter = 90;
  
  if(!clockIsSet) {
    clockIsSet = true;
    
      timer.classList.add('timer');
      timer.innerHTML = counter;
      clock = setInterval(() => {
          counter--;
          
          if( counter == 0 ){
            timer.innerHTML = counter;
            clearInterval(clock);
            clockIsSet = false;
            checkData();
          }
          timer.innerHTML = counter;
      }, 1000);
  }

  //setTimer();
});

//submit game / clear interval
submitGame.addEventListener('submit' , e => {
  e.preventDefault();
  clearInterval(clock);
  clockIsSet = false;
  timer.classList.remove('timer');
  timer.innerHTML = '';
  checkData();
});

//define game mode
let defineGameMode = ( mode ) => {
  if( mode == 'Lako' ){
    let gameMode = 0.5;
    return gameMode;
  } else if(mode == 'Srednje' ){
    let gameMode = 0.7;
    return gameMode;
  } else if ( mode == 'Teško' ) {
    let gameMode = 0.9;
    return gameMode;
  }
}

//check data after submit
function checkData(){

  // get answers from dom input
  let country = document.querySelector("#country").value.replace(/ /g,'');
  let city = document.querySelector("#city").value.replace(/ /g,'');
  let river = document.querySelector("#river").value.replace(/ /g,'');
  let mountain = document.querySelector("#mountain").value.replace(/ /g,'');
  let animal = document.querySelector("#animal").value.replace(/ /g,'');
  let plant = document.querySelector("#plant").value.replace(/ /g,'');
  let objectInput = document.querySelector("#objectInput").value.replace(/ /g,'');
  
  //put answers in array
  let arrayAnswers = [ country, city, river, mountain, animal, plant, objectInput];

  //set game Mode
  let chosenMode = defineGameMode(playMode.value);
  var game = new Game(arrayAnswers, chosenMode);
  let myArray = [];
  let botAnswers = [];
  let checkArray = [];
  let finalResult = [];
 
  game.filterAnswers(arrayAnswers, data => {
    myArray = data;
  });

  game.categories.forEach( elem => {
    let rand = game.generateRandomNumber();
    if( rand > game.gameMode ){
      botAnswers.push('Empty');
    } else {
      botAnswers.push(true);
    }
  });

  let getBotAnswers = (category , index) => {

    let key = game.terms.doc().id;
    game.terms
        .where('kategorija', '==', category)
        .where('pocetnoSlovo', '==', localStorage.givenLetter)
        .where(firebase.firestore.FieldPath.documentId(), '>=', key)
        .limit(1)
        .get()
        .then(snapshot => {
            if (snapshot.size > 0) {
                snapshot.forEach(doc => {
                  let data = doc.data().pojam;
                  let term = data && data !== undefined ? doc.data().pojam : 'Empty';
                  //console.log(term);
                  botAnswers[index] = term;
                  checkArray.push(true);
                });
            }
            else {
                game.terms
                    .where('kategorija', '==', category)
                    .where('pocetnoSlovo', '==', localStorage.givenLetter)
                    .where(firebase.firestore.FieldPath.documentId(), '<', key)
                    .limit(1)
                    .get()
                    .then(snapshot => {
                        snapshot.forEach(doc => {
                          let data = doc.data().pojam;
                          let term = data && data !== undefined ? doc.data().pojam : 'Empty';
                          botAnswers[index] = term;
                          checkArray.push(true);
                        });
                    })
            }
        })
  }

  myArray.forEach( (elem,index) => {
      game.ifAnswerExist( game.capitalizeLetterTerm(elem), game.categories[index], myData => {
        // let term = elem;
        // let category = game.categories[index];

        game.userFilteredAnswers.push(myData);
        // game.getCompAnswers(category, compData => {
        //   finalResult.push(game.calculateScore(term, category, myData, compData));
        //   if( index == myArray.length-1) {
        //     printData(finalResult);
        //   }
        // });
        if( index == myArray.length - 1 ){
          botAnswers.forEach( (elem, index) => {
            if( elem != 'Empty' ){
              getBotAnswers( game.categories[index], index );
            } else {
              checkArray.push(true);
            }
          });
        }


      });
  });

  let checkIfIsDone = setInterval( () =>{
    if( checkArray.length == 7 && game.userFilteredAnswers.length == 7 &&  botAnswers.length == 7){
      clearInterval(checkIfIsDone);
      game.categories.forEach( (category,index) => {
        finalResult.push(game.calculateScore(myArray[index], category, game.userFilteredAnswers[index], botAnswers[index]));
        if( finalResult.length == 7 ){
          printData(finalResult);
        }
      });
    }
  },200 );

  let printData = (dataAll) => {
    startGameDiv.classList.add('d-none');
    tableResultDiv.classList.remove('d-none');
    gameInputsDiv.classList.add('d-none');
    
    let tableResult = document.querySelector('#tableResult');
    let usernameResultTable = document.querySelector('#usernameResultTable');
    usernameResultTable.innerHTML = `${localStorage.username}`;

    let userPoints = 0;
    let compPoints = 0;
    // console.log(dataAll);
    
    dataAll.forEach( (elem,index) => {
      userPoints += elem.player.score;
      compPoints += elem.computer.score;
      makeTableRow( tableResult, index , game.categories[index], elem.player.answer, elem.player.score,elem.computer.score, elem.computer.answer);
    });

    resultRow(7, userPoints, compPoints);
    isWinner(userPoints, compPoints); 
    submitGame.reset();
  }

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

  let addExtraRowPicture = (rowNumb, cellNumb, text, picture) => {
    let tableResult = document.querySelector('#tableResult');
    let row = tableResult.insertRow(rowNumb);
    let cell = row.insertCell(cellNumb);
    cell.setAttribute('colspan','5');
    cell.innerHTML = `<img src='img/${picture}.png' style='width:50px !important'><b>${text}</b>`;
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

  let isWinner = (userPoints, compPoints) => {
    
      if( userPoints < compPoints ){
        let text = ' Izgubili ste!!!';
        let picture = 'alienAngry';
        addExtraRowPicture( 8,0,text,picture);
      } else if( userPoints > compPoints ){
        let text = ` Čestitamo!!! Pobedili ste!!!`;
        let picture = 'alienHappy';
        addExtraRowPicture( 8,0,text,picture);
      } else{
        let text = ` Nerešeno!!!`;
        let picture = 'alienNeutral';
        addExtraRowPicture( 8,0,text,picture);
      }
  }
  
}

//open vs player mode
let startGameVsPlayer = document.querySelector('#startGameVsPlayer');

startGameVsPlayer.addEventListener('click', () => {
  window.location.replace("http://localhost:5050/vsPlayer.html");
});
  

//create 
let rangListContest = document.querySelector('#rangListContest');
let rangListTopThree = document.querySelector('.rangList');

rangListTopThree.addEventListener('click', () =>{
  
  let topThreeList = document.querySelector('#rangListContest');
  let ui = new QuizUI(topThreeList);

  ui.clear();

  qi.getTopThreePlayers( data =>{
      ui.templateTopThree(data);
  });
});

//rules pop up
let rules = document.querySelector('#rules');

rules.addEventListener( 'click', () => {
  
  Swal.fire({
    title: 'Pravila igre',
    text: "You won't be able to revert this!",
    allowOutsideClick: false,
    showClass: {
      popup: 'animate__animated animate__fadeInDown',
    },
    hideClass: {
      popup: 'animate__animated animate__fadeOutUp'
    }
  });

});

