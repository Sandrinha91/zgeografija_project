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
let reloadForList = document.querySelector('#profile-tab');


let username = () => {
    if( localStorage.username ){
        return localStorage.username;
    }else{
        return false;
    }
}

// let string = 'njeMacKa';
// let firstLetter = string.slice(0,1).toUpperCase();
//     let restWord = string.slice(1).toLowerCase();
//     let finalWord =firstLetter + restWord;
//    console.log(finalWord);


// let toLowerCase = 'njemacka';
// let slicedLetters = toLowerCase.slice(0,2).toLowerCase();
// let finalLetter = slicedLetters[0].toUpperCase() + slicedLetters[1]; 

// console.log(slicedLetters);
// console.log(finalLetter);
// console.log(slicedLetters[0].toUpperCase());
//       firstLetters[0].toUpperCase();
//   let firstLetter = ;
// console.log(string.slice(0,2).toUpperCase(1));

let disapearAfter = (div) => {
  setTimeout( () => {
    // div.classList.add('d-none');
    div.innerText="";
  },3000);
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
            setTimeout( () => {
                location.reload();
            },1500);
            
        }else{
            localStorage.setItem('username',result.value);
            profilesTab.innerHTML = ` ( ${localStorage.username} )`;
            inputUsername.setAttribute('value', `${localStorage.username}`);
            usernameContainer.innerHTML = `${localStorage.username}`;
            
            Swal.fire({
                title: `Dobrodošli ${result.value}!`,
                }).then( () => {
                    Toast.fire({
                        icon: 'success',
                        title: 'Uspešno logovanje!'
                      });
                });
        }
      })
} else {
  profilesTab.innerHTML = ` ( ${localStorage.username} )`;
  inputUsername.setAttribute('value', `${localStorage.username}`);
  usernameContainer.innerHTML = `${localStorage.username}`;
}

// reloadForList.addEventListener('click', e =>{
//   location.reload();
// });

let qi = new Quiz(username());

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
        // setTimeout(() => divUpdatedUsername.innerText="", 3000);
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
                  rangList.refresh();
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

let rangListTemplate = new QuizUI(rangList);

// take all users , sort them and display first 5


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
  
    // finalSort.forEach(e => {
    //   console.log(e);
    // });
    
    // make html list template
    rangListTemplate.templateRangLI(finalSort, usernamePosition);
  
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