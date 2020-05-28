export class Game{
  
  //constructor
  constructor(ua){
    this.terms = db.collection('pojmovi');
    this.userAnswers = ua;
    //this.userFilteredAnswers = [];
    // this.compAnswers = [];
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

      let userFilteredAnswers = [];
      array.forEach( (elem, index) => {
        if ( elem == '' || elem == undefined){
            userFilteredAnswers.push('Empty');
        } else if ( this.firstLetter(elem) !== localStorage.givenLetter) {
            userFilteredAnswers.push( 'Empty' );
        }
        else {
          userFilteredAnswers.push(elem);
        }
      });
      console.log('niz pre sve iozvrseno',userFilteredAnswers);

      let categories = ['Država', 'Grad', 'Reka', 'Planina', 'Životinja', 'Biljka', 'Predmet'];
      let usersCheckedAnswers = userFilteredAnswers.forEach( (elem, index) => {
        if ( elem != 'Empty' ){
          this.ifAnswerExist( elem, categories[index], data => {
            let x = data;
            // testArray.push(x);
            userFilteredAnswers[index] = x;
            // console.log('testArray',userFilteredAnswers);
          } );
          //console.log(usersCheckedAnswers);
        }
      });

      let compAnswers = [];
      let niniz = [];
      let generateComp = categories.forEach( (elem, index) => {
        
        this.getCompAnswers( elem, data => {
          let x = data;
          console.log('jdisjdi',x);
          compAnswers.push(x);
          if(x !== 'Empty'){
            let promiseX = Promise.resolve(x).then((value) => {
              compAnswers[index]= value;
              // return value;
              console.log('PRIMISIISISISI', compAnswers);
            });
          }
            //   let promiseX = 'Empty';
          //   console.log('COMPOV X',x);
          //   console.log('COMPOV PROMISE X',Promise.resolve(x));
          //   if (x !== 'Empty') {
          //   promiseX = x.then((value) => {
          //     niniz.push(value);
          //     console.log(niniz);
          //     return value;
          //   });
          // }
          // else {
          //   niniz.push('Empty');
          //     console.log(niniz);
          //   // return promiseX;
          // }
            // testArray.push(x);
            // console.log('testArray',userFilteredAnswers);
          });
        
        });
        console.log('niz komp pre sve iozvrseno',compAnswers);

      //console.log('sve izvrsenooooooooooooooooooo!!');

      console.log('kraaaaaaaaaaaaaajjjjjjjjj');

      return;

    }

    stampaj(elem){
      console.log(elem);
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
    async getCompAnswers(category, callback){
      let rand = this.generateRandomNumber();
      let result;
      let x = 'Empty';
      if ( rand <= 0.8 ){
      result = this.terms.where('pocetnoSlovo', '==', localStorage.givenLetter)
                .where("kategorija", "==", category)
                .limit(1)
                .get()
                .then( snaphot => {
                   snaphot.forEach( doc => {
                    x = doc.data().pojam;
                    // promiseX = x.then((value) => {
                    //   return value;})
                    // console.log('IPSILON', x);
                  });
                  return x;
              }).catch( error => {
                 console.log(error);
            });
      } 
      else{
        result = x;
        // return callback(final);  
        // return x;
      }
      let final = result;
      return callback(final);
      

      // async getCompAnswers(param, counter) {
      //   //param = 'Drzava'
      //   let rand = this.generateRandomNumber();
      //   if (this.checkRandomNumb(rand)) {
      //     let result = await this.terms.where('pocetnoSlovo', '==', localStorage.givenLetter).where("kategorija", "==", param).limit(1).get();
      //     //debugger
      //     console.log(result);
      //     result.forEach(doc => {
      //       this.compAnswers.push(doc.data().pojam);
      //     });
            
      //     switch (counter) {
      //       case 0:
      //         counter++;
      //         this.getCompAnswers('Grad', counter);
      //         break;
      //       case 1:
      //         counter++;
      //         this.getCompAnswers('Planina', counter);
      //     }
      //   }
    }

    //return if term is confirmed
    async ifAnswerExist(term, category, callback) {
      let y = 'Empty';
      let result = this.terms.where('pojam', "==", term)
                  .where('pocetnoSlovo', '==', localStorage.givenLetter)
                  .where("kategorija", "==", category)
                  .get()
                  .then( snapshot => {
                    snapshot.docs.forEach( doc =>{
                        // if(doc.data().pojam == term){
                        //   y = false;
                        // }
                        y = doc.data().pojam;
                        //console.log('if answer exist!!',doc.data()); 
                      });
                      return y;
                  })
                  .catch( error => {
                    console.log(error);
                  });
      console.log('pojam ne postojiiiiiiiiiiii',y);
      let final = await result;
      return callback(final);
    }
    
  }
  
  