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
    filterAnswers(array , callback){
      let userFilteredAnswers = [];
    
      array.forEach( (elem, index) => {
        if ( elem == '' || elem == undefined){
            userFilteredAnswers.push('Empty');
        } else if ( this.firstLetter(elem) !== localStorage.givenLetter) {
            userFilteredAnswers.push( 'Empty' );
        } else{
          userFilteredAnswers.push( elem );
        }
      });
      callback(userFilteredAnswers);
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
    getCompAnswers(category, callback){
      let term = false;
        let rand = this.generateRandomNumber();
          this.terms.where('pocetnoSlovo', '==', localStorage.givenLetter)
                .where("kategorija", "==", category)
                // .limit(1)
                .get()
                .then( snapshot => {
                  let random = this.generateRandomNumber();
                  if( random > 0.2 ){
                    //let data = snapshot.docs[randomIndex];
                    const randomIndex = Math.floor(Math.random() * snapshot.docs.length);
                    let data = snapshot.docs[randomIndex];
                    term = data && data !== undefined ? data.data().pojam : 'Empty';
                    //console.log( '110  kkkeeeeeeeeeee' ,term);
                  }else {
                    term = 'Empty';
                    //console.log( '110  kkkeeeeeeeeeee' , term);
                  }
                  callback(term);
              }).catch( error => {
                 //console.log(term);
            });
    }

    //return if term is confirmed
    ifAnswerExist(term, category, callback) {
      var y = 'Empty';
         this.terms.where('pojam', "==", term)
                .where('pocetnoSlovo', '==', localStorage.givenLetter)
                .where("kategorija", "==", category)
                .get()
                .then( snapshot => {
                  //console.log('POJAM JEEEEE',term);
                  snapshot.docs.forEach( doc =>{
                      if(doc.data().pojam == term){
                        y = doc.data().pojam;
                      }
                      //console.log(doc.data()); 
                  });
                  callback(y);
                })
                .catch( error => {
                  console.log(error);
                });
    }

    calculateScore( term, category, myData, compData ){

      let data = {
        player:{
            'answer': term,
            'category': category,
            'score': 0,
        },
        computer:{
            'answer': compData,
            'category': category,
            'score': 0,
        },
      };

      if ( myData != 'Empty' && compData != 'Empty' ){
        if( myData !=  compData){
          data.player.score = 10;
          data.computer.score = 10;
        }else{
          data.player.score = 5;
          data.computer.score = 5;
        }
      } else if( myData == 'Empty' && compData == 'Empty' ){
        data.player.score = 0;
        data.computer.score = 0;
        data.player.answer = 'Ne znam';
        data.computer.answer = 'Ne znam';
      } else {
        if( myData == 'Empty' &&  compData != 'Empty' ){
          data.player.score = 0;
          data.player.answer = 'Ne znam';
          data.computer.score = 15;
        } else {
          data.player.score = 15;
          data.computer.score = 0;
          data.computer.answer = 'Ne znam';
        }
      }

      return data;
    }

  }
  
  