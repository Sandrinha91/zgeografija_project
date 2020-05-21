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
let profilesTab = document.querySelector('#profiles-tab');

let username = () => {
    if( localStorage.username ){
        return localStorage.username;
    }else{
        return false;
    }
}

profilesTab.innerHTML += ` ( ${localStorage.username} )`;

let disapearAfter = (div) => {
  setTimeout( () => {
    // div.classList.add('d-none');
    div.innerText="";
  },3000);
}

let qi = new Quiz(username());

usernameContainer.innerHTML = `${localStorage.username}`;
usernamePosition.innerText += ` ${localStorage.listPosition}`;
inputUsername.setAttribute('value', `${localStorage.username}`);


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
}

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
        formUpdateUsername.reset();
        // setTimeout(() => divUpdatedUsername.innerText="", 3000);
        disapearAfter(divUpdatedUsername);
    }
});

//suggest term validation
formSuggestTerm.addEventListener( 'submit', e =>{
    e.preventDefault();
    
    const regexp = /^[a-zA-Z\wšđčćžŠĐĆČŽ]*$/;
    let sugestedTrim = suggestedTerm.value.replace(/ /g,'');

    if( sugestedTrim.length == 0 ){
        divTermError.innerHTML = "<span class='alert alert-warning  mt-2'>Morate uneti pojam!</span>";
        formSuggestTerm.reset();
        disapearAfter(divTermError);
    } else if( !(regexp.test(sugestedTrim) ) ){
        divTermError.innerHTML = "<span class='alert alert-warning  mt-2'>Pojam ne sme sadržati specijalne karaktere!</span>";
        formSuggestTerm.reset();
        disapearAfter(divTermError);
    }else{
        let toLowerCase = sugestedTrim.toLowerCase();
        // let firstLetter = toLowerCase.charAt(0).toUpperCase();
        console.log(toLowerCase.slice(0,2));
        
        if( toLowerCase.slice(0,2) == "Nj" || toLowerCase.slice(0,2) == "Lj" || toLowerCase.slice(0,2) == "Dž" || toLowerCase.slice(0,2) == "nj" || toLowerCase.slice(0,2) == "lj" || toLowerCase.slice(0,2) == "dž" ){
          var firstLetter = toLowerCase.slice(0,2);
          firstLetter = firstLetter[0].toUpperCase() + firstLetter[1];
          var nameCapitalized = firstLetter + toLowerCase.slice(2);
          console.log(firstLetter);
          console.log(nameCapitalized);
        }else {
          var firstLetter = toLowerCase.slice(0,2);
          console.log(firstLetter);
          firstLetter = firstLetter.toUpperCase();
          var nameCapitalized = firstLetter + toLowerCase.slice(1);
        }

        qi.isUnique(nameCapitalized,selecteSuggestCategory.value,  data => {
            if ( data ) {
                if( localStorage.username !== false ){
                qi.insertTerm(selecteSuggestCategory.value,nameCapitalized,firstLetter);
                divTermError.innerHTML = `<span class='alert alert-success mt-2'>Pojam: ${sugestedTrim} je uspešno dodat!</span>`;
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
  rangListTemplate.templateRangLI(finalSort);

  
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