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
let timer = document.querySelector("#timer");
let gameContent = document.querySelector("#gameContent");
let submitGame = document.querySelector("#submitGame");
let country = document.querySelector("#country");
let city = document.querySelector("#city");
let river = document.querySelector("#river");
let mountain = document.querySelector("#mountain");
let animal = document.querySelector("#animal");
let plant = document.querySelector("#plant");
let objectInput = document.querySelector("#objectInput");
let firstLetter = document.querySelector("#firstLetter");
let counter = 30;
let clock;
let testKvizaLista = document.querySelector('#testKviza');
let clockIsSet = false;
let alpha = "ABCČĆDDžĐEFGHIJKLLjMNNjOPRSŠTUVZŽ".split('');
// let arrayLetters = ["A", "B", "C", "Č", "Ć", "D", "Dž", "Đ", "E", "F", "G", "H", "I", "J", "K", "L", "Lj", "M", "N", "Nj", "O", "P", "R", "S", "Š", "T", "U", "V", "Z", "Ž"];
let arrayLetters = ["A"];

//console.log(alpha);
//check data after submit
function checkData(){

  let countryFinal = country.value.replace(/ /g,'');
  let cityFinal = city.value.replace(/ /g,'');
  let riverFinal = river.value.replace(/ /g,'');
  let mountainFinal = mountain.value.replace(/ /g,'');
  let animalFinal = animal.value.replace(/ /g,'');
  let plantFinal = plant.value.replace(/ /g,'');
  let objectInputFinal = objectInput.value.replace(/ /g,'');

  //console.log(givenLetter);
  //, [cityFinal, 'grad']
  let arrayAnswers = [ [countryFinal, 'Država'], [cityFinal, 'Grad'], [riverFinal, 'Reka'], [mountainFinal, 'Planina'], [animalFinal, 'Životinja'], [plantFinal, 'Biljka'], [objectInputFinal, 'Predmet'] ];
  console.log(typeof(arrayAnswers));
  let arraySanitizedAnswers = [];
  let niz2 = [];
  //console.log(typeof(arraySanitizedAnswers));
  
  arrayAnswers.forEach( e => {
    if ( e[0].charAt(0).toUpperCase() !==  localStorage.givenLetter || e[0] == '' || e[0] == undefined){
      arraySanitizedAnswers.push('Netacno1');
      // console.log(typeof(arraySanitizedAnswers));
      // console.log('netacna drzava',arraySanitizedAnswers[0]);
    } else {
      //console.log(e[0]);
        
        qi.ifAnswerExist( e[0], e[1] , data => { 
              if(data){
                //let value = 'Netacno';
                //return this.value;
                
                niz2.push('Netacno');
                //console.log(data);
                // console.log(typeof(arraySanitizedAnswers));
                //console.log('netacno',arraySanitizedAnswers[0]); 
              } else {
                let value = e[0];
                //return this.value;
                
                niz2.push( `${value}` );
                
                //console.log(data);
                // console.log(e[0]);
                //console.log(arraySanitizedAnswers[0]);
                // console.log(typeof(arraySanitizedAnswers));
              }
              // return niz2;
            });
        //arraySanitizedAnswers.push(value);
       //arraySanitizedAnswers[0];
       //arraySanitizedAnswers[1];
    }
    //console.log(arraySanitizedAnswers.slice());
  });
  var children = arraySanitizedAnswers.concat(niz2);

  console.log(Array.isArray(arraySanitizedAnswers));
  //console.log(arraySanitizedAnswers.slice());
  console.log(children.length);
  console.log('NIZZZZZZZ', children);
  //console.log(typeof(arraySanitizedAnswers));

  children.forEach( e => {
    console.log(e, 'PRRRRRRR');
    let liNew = document.createElement('LI');
    testKvizaLista.appendChild(liNew);
    liNew.innerHTML = `${e}`;
  });

  
  
  let arrayCompANswers = [];
  //generateAnswers();

  // arrayAnswers.forEach( e => {
  //   //console.log(localStorage.givenLetter);
  //     qi.ifAnswerExist( e[0], e[1] , data => { 
  //       if(data){
  //         console.log(data);
  //       }
  //      });
    
  //  });

  // input check if empty
  //qi1.ifExi
}

//generate random number


//
// generateAnswers(){
   
// }

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
  gameContent.classList.remove('d-none');
  const randomElement = arrayLetters[Math.floor(Math.random() * arrayLetters.length)];
  localStorage.setItem('givenLetter',randomElement);
  firstLetter.innerHTML = `${randomElement}`;
  //let givenLetter = randomElement;

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
            //ovde da se pozove naredna funkcija koja ce da ispituje polja i odradi validaciju
          }
          timer.innerHTML = counter;
      }, 1000);
  }
});


// qi.getDataTest( e => {
//   letters.forEach( e => {
//       qi1.ifAnswerExist( e[0], e[1] , givenLetter , data => { 
//         if(data){
//           console.log(data);
//         }
//        });
    
//   });
// });

