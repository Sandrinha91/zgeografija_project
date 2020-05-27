export class Game{
  
  //constructor
  constructor(ua){
    this.terms = db.collection('pojmovi');
    this.userAnswers = ua;
    //this.userFilteredAnswers = [];
    //this.compAnswers = [];
    this.categories = ['Država', 'Grad', 'Reka', 'Planina', 'Životinja', 'Biljka', 'Predmet'];
    let arrayLetters = ["A", "B", "C", "Č", "Ć", "D", "Dž", "Đ", "E", "F", "G", "H", "I", "J", "K", "L", "Lj", "M", "N", "Nj", "O", "P", "R", "S", "Š", "T", "U", "V", "Z", "Ž"];
  }
  
    set usersAnswers(ua){
      this._userAnswers = ua;
    }
  
    get usersAnswers(){
      return this._userAnswers;
    }

    //filterArray answers
    async filterAnswers(array){

      //let userFilteredAnswers = [];
    
      array.forEach( (elem, index) => {
        if ( elem == '' || elem == undefined){
            //userFilteredAnswers.push('Empty');
            localStorage.setItem(`userAnswer${index}`,`Empty`);
            //console.log('dodato empty zbog praznog unosa');
        } else if ( this.firstLetter(elem) !== localStorage.givenLetter) {
            //console.log('dodato empty zbog pogresnog slova');
            //userFilteredAnswers.push( 'Empty' );
            localStorage.setItem(`userAnswer${index}`,`Empty`);
        } else{
          this.ifAnswerExist( this.capitalizeLetterTerm(elem), this.categories[index], data => {
            if( data ){
              console.log('dodato empty zato sto pojam ne postoji', data);
              //userFilteredAnswers.push('Empty');
              localStorage.setItem(`userAnswer${index}`,`Empty`);
            } else {
              //userFilteredAnswers.push(this.capitalizeLetterTerm( elem )) ;
              let value = this.capitalizeLetterTerm(elem);
              localStorage.setItem(`userAnswer${index}`,`${value}`);
            }
          });
        }
      });
    }
  
    //DEFINES FIRST LETTER OF GIVEN STRING
    firstLetter(string){
      let toLowerCase = string.toLowerCase();
  
      if( toLowerCase.slice(0,2) == "Nj" || toLowerCase.slice(0,2) == "Lj" || toLowerCase.slice(0,2) == "Dž" || toLowerCase.slice(0,2) == "nj" || toLowerCase.slice(0,2) == "lj" || toLowerCase.slice(0,2) == "dž" ){
        let slicedLetters = toLowerCase.slice(0,2).toLowerCase();
        let final = slicedLetters[0].toUpperCase() + slicedLetters[1];
        return final;
      }else {
        let final = toLowerCase[0].toUpperCase();
        return final;
      }
    }
  
    //CAPITALIZE FIRST LETTER - RETURN FINISHED TERM FOR CHECK
    capitalizeLetterTerm(string){
      let firstLetter = string.slice(0,1).toUpperCase();
      let restWord = string.slice(1).toLowerCase();
      let finalWord = firstLetter + restWord;
      return finalWord;
    }
  
    //generate RANDOM NUMBER
    generateRandomNumber(){
      let num = Math.random();
      num = num.toFixed(2);
      return num;
    }

    // RETURN TRUE IF < 0.8 OR FALSE IF > 0.8
    checkRandomNumb(numb){
      if(numb < 0.8){
        return true;
      }else{
        return false;
      }
    }

    //GET COMPUTER ANSWERS
    async getCompAnswers(){

      this.categories.forEach( (category, index) => {

        let rand = this.generateRandomNumber();
        if ( this.checkRandomNumb(rand) ){
          this.terms.where('pocetnoSlovo', '==', localStorage.givenLetter)
                .where("kategorija", "==", category)
                .get()
                .then( snaphot => {
                   snaphot.forEach( doc => {
                    //this.compAnswers.push(doc.data().pojam);
                        localStorage.setItem(`compAnswer${index}`,`${doc.data().pojam}`);
                        // localStorage.setItem(`compAnswer${index}`,`Ne postoji pojam u bazi`);
                  });
              }).catch( error => {
                 console.log(error);
            });
        }else {
          localStorage.setItem(`compAnswer${index}`,`Empty`);
        }  
      });
    }

    //return if term is confirmed
    ifAnswerExist(term, category, callback) {
      var y = true;
      this.terms.where('pojam', "==", term)
                .where('pocetnoSlovo', '==', localStorage.givenLetter)
                .where("kategorija", "==", category)
                .get()
                .then( snapshot => {
                  snapshot.docs.forEach( doc =>{
                      if(doc.data().pojam == term){
                        y = false;
                      }
                      //console.log(doc.data()); 
                  });
                  return callback(y);
                })
                .catch( error => {
                  console.log(error);
                });
    }
    
  }
  
  