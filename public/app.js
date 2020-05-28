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
let formUpdateUsername = document.querySelector('#formUpdateUsername');
let divUpdatedUsername = document.querySelector('#divUpdatedUsername');
let selecteSuggestCategory = document.querySelector('#selectSuggestCategory');
let rangList = document.querySelector('#rangList');
let profilesTab = document.querySelector('#navContentUser');
let loader = document.querySelector('.loader1');
let logOut = document.querySelector('#logOut');
let blurTable = document.querySelector('#blur');
let refreshListBtn = document.querySelector('#refreshBtn');
let rangListTemplate = new QuizUI(rangList);

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
            makeRangList(qi);
            
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
  //makeRangList(qi1);
}

// reloadForList.addEventListener('click', e =>{
//   location.reload();
// });

//ovo mora da se prekopira u else iznad
//let qi = new Quiz(username());

// update username iz input polja
formUpdateUsername.addEventListener('submit', e => {
    e.preventDefault();
    let newUsername = inputUsername.value;

    if( newUsername.trim().length == 0 ){
        divUpdatedUsername.innerHTML= `<span class="alert alert-warning">Unesite korisničko ime!</span>`;
        disapearAfter(divUpdatedUsername);
    }else{
        qi.updateUsername(newUsername);
        divUpdatedUsername.innerHTML = `<span class='alert alert-success'>Vaše korisničko ime je promenjeno u <b>${newUsername}</b></span>`;
        usernameContainer.innerHTML = `${localStorage.username}`;
        inputUsername.setAttribute('value', `${localStorage.username}`);
        profilesTab.innerHTML = ` ( ${localStorage.username} )`;
        formUpdateUsername.reset();
        disapearAfter(divUpdatedUsername);
    }
});

//suggest term validation
formSuggestTerm.addEventListener( 'submit', e =>{
    e.preventDefault();
    
    let sugestedTrim = suggestedTerm.value.replace(/ /g,'');
    let category = selecteSuggestCategory.value;

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

// console.log(qi.username);
// logOut.addEventListener("click", callback ,true) 
//         function callback () {
//             localStorage.clear();
//             return false;
//         }

// LOG OUT USER AND CLEAR LOCAL STORAGE ON CLICK
logOut.addEventListener("click", () => {
  localStorage.clear();
});

// QUIZ TIME

let startGame = document.querySelector("#startGame");
let startGameDiv = document.querySelector("#startGameDiv");
let timer = document.querySelector("#timer");
let submitGame = document.querySelector("#submitGame");
let firstLetter = document.querySelector("#firstLetter");
let tableResultDiv = document.querySelector("#tableResultDiv");
let gameInputsDiv = document.querySelector('#gameInputsDiv');
let gameContent = document.querySelector('#gameContent');
let tableResetButton = document.querySelector('#tableResetButton');
let counter = 30;
let clock;
let testKvizaLista = document.querySelector('#testKviza');
let clockIsSet = false;
// let arrayLetters = ["A", "B", "C", "Č", "Ć", "D", "Dž", "Đ", "E", "F", "G", "H", "I", "J", "K", "L", "Lj", "M", "N", "Nj", "O", "P", "R", "S", "Š", "T", "U", "V", "Z", "Ž"];
let arrayLetters = ["A"];

// New game button

tableResetButton.addEventListener('click', e => {
  location.reload();
});

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
  let game = new Game(arrayAnswers);
  //let arr = game.getCompAnswers('Država', 0);
  //console.log(arr[0]);
  game.filterAnswers(arrayAnswers);
  
  console.log('Posle pozivaaaaaaaaaaaaaa');
  //console.log(game.compAnswers);

  // let makeTableData = ( row, category, usersTerm, usersPoints, compPoints, compAnswer ) => {
  //   let cell0 = row.insertCell(0);
  //   let cell1 = row.insertCell(1);
  //   let cell2 = row.insertCell(2);
  //   let cell3 = row.insertCell(3);
  //   let cell4 = row.insertCell(4);
  //   cell0.innerHTML = `${category}`;
  //   cell1.innerHTML = `${usersTerm}`;
  //   cell2.innerHTML = `${usersPoints}`;
  //   cell3.innerHTML = `${compPoints}`;
  //   cell4.innerHTML = `${compAnswer}`;
  // }
  
  // setTimeout(() => {
  //   startGameDiv.classList.add('d-none');
  //   tableResultDiv.classList.remove('d-none');
  //   gameInputsDiv.classList.add('d-none');
  //   let usersFinal = [localStorage.userAnswer0, localStorage.userAnswer1, localStorage.userAnswer2, localStorage.userAnswer3, localStorage.userAnswer4, localStorage.userAnswer5, localStorage.userAnswer6];
  //   let compAnswers = [localStorage.compAnswer0, localStorage.compAnswer1, localStorage.compAnswer2, localStorage.compAnswer3, localStorage.compAnswer4, localStorage.compAnswer5, localStorage.compAnswer6];
  //   let categories = game.categories;
  //   let userPoints = 0;
  //   let compPoints = 0;
  //   let usernameResultTable = document.querySelector('#usernameResultTable');
  //   let tableResult = document.querySelector('#tableResult');
  //   usernameResultTable.innerHTML = `${localStorage.username}`;
  //   // compare values
  //   usersFinal.forEach( (elem, index) => {
  //     let row = tableResult.insertRow(index);
  //     if ( elem != 'Empty' && compAnswers[index] != 'Empty' ){
  //       if( elem !=  compAnswers[index]){
  //         userPoints += 10;
  //         compPoints += 10;
  //         makeTableData(row, categories[index], usersFinal[index], 10, 10, compAnswers[index]);
  //       }else{
  //         userPoints += 5;
  //         compPoints += 5;
  //         makeTableData(row, categories[index], usersFinal[index], 5, 5, compAnswers[index]);
  //       }
  //     } else if( elem == 'Empty' && compAnswers[index] == 'Empty' ){
  //         userPoints += 0;
  //         compPoints += 0;
  //         makeTableData(row, categories[index], usersFinal[index], 0, 0, compAnswers[index]);
  //     } else {
  //       if( elem == 'Empty' &&  compAnswers[index] != 'Empty' ){
  //         compPoints += 15;
  //         makeTableData(row, categories[index], usersFinal[index], 0, 15, compAnswers[index]);
  //       } else {
  //         userPoints += 15;
  //         makeTableData(row, categories[index], usersFinal[index], 15, 0, compAnswers[index]);
  //       }
  //     }
  //   });

  //   let row = tableResult.insertRow(7);
  //   makeTableData(row, 'Ukupno:', '', userPoints, compPoints, '');

  //   if( userPoints < compPoints ){
  //     let row = tableResult.insertRow(8);
  //     let cell0 = row.insertCell(0);
  //     cell0.innerHTML = 'Izgubili ste!!!';
  //   } else if( userPoints > compPoints ){
  //     let row = tableResult.insertRow(8);
  //     let cell0 = row.insertCell(0);
  //     cell0.innerHTML = `Cestitamo ${localStorage.username}!!! Pobedili ste!!`;
  //   } else{
  //     let row = tableResult.insertRow(8);
  //     let cell0 = row.insertCell(0);
  //     cell0.innerHTML = `Nereseno!!!`;
  //   }

  //   console.log('korisnik FILTRIRANI1',usersFinal);
  //   console.log('komp FILTRIRANI1',compAnswers);
  // }, 3000);  

}


//submit game / clear interval
submitGame.addEventListener('submit' , e => {
  e.preventDefault();
  clearInterval(clock);
  clockIsSet = false;
  timer.classList.remove('timer');
  timer.innerHTML = '';
  checkData();
});
  
//start game / set timer / define first letter
startGame.addEventListener('click', () => {
  startGameDiv.classList.add('d-none');
  tableResultDiv.classList.add('d-none');
  gameInputsDiv.classList.remove('d-none');
  gameContent.classList.remove('d-none');
  const randomElement = arrayLetters[Math.floor(Math.random() * arrayLetters.length)];
  localStorage.setItem('givenLetter',randomElement);
  firstLetter.innerHTML = `${randomElement}`;


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
});

// let quizTest = new Quiz(`${localStorage.username}`);

// async function getData(){
//   let proba = quizTest.terms.get()
//               .then( snapshot => {
//                 snapshot.docs.forEach( doc =>{
//                   console.log(doc.data());
//                 });
//               })
//               .catch( error => {
//                 console.log(error);
//               });
  
//   let result = 
// }
//firstFunction(10);

async function firstFunction(a){
  console.log('prvi cvor',a);
  let b = await doSomethingElse(a);
  console.log(b);
  return;
} 

async function doSomethingElse(a){
  console.log('Poslednji cvor',a);
  let b = a*2;
  console.log(b);
  return b;
}

firstFunction(5);