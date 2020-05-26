export class Quiz{

  //constructor
  constructor(u){
      this.username = u;
      this.terms = db.collection('pojmovi');
      this.users = [];
  }

  set username(u){
      this._username = u;
  }

  set users(ua){
    this._users = ua;
  }

  //geteri
  get username(){
      return this._username;
  }

  get users(){
    return this._users;
  }

  //promena korisnickog imena
  updateUsername(newUsername){
    this.username = newUsername;
    localStorage.setItem('username',newUsername);
  }

  //STRING CONVERSION to lower case - returns sanitized first letter
  stringConvert(string){
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

   //capitalizeFirstLetter return full final word with first capital
   capitalizeLetterTerm(string){
    let firstLetter = string.slice(0,1).toUpperCase();
    let restWord = string.slice(1).toLowerCase();
    let finalWord = firstLetter + restWord;
    return finalWord;
  }

  //input validation
  inputValidation(string,div,form){
    const regexp = /^[0-9]*[A-Za-z\šđčžćŠĐŽČĆ]+$/;
    
    if( string.length == 0 ){
      div.innerHTML = "<span class='alert alert-warning  mt-2'>Morate uneti pojam!</span>";
      form.reset();
      return false;
    }else if( !regexp.test(string) ){
      div.innerHTML = "<span class='alert alert-warning  mt-2'>Pojam ne sme sadržati specijalne karaktere!</span>";
      form.reset();
      return false;
    } else{
      return true;
    }
  }

  //insert new term in db
  async insertTerm(category, termSuggested) {
    let dateTmp = new Date(); 
    let term = this.capitalizeLetterTerm(termSuggested);
    let firstLetter = this.stringConvert(termSuggested);

    let data = {
        kategorija: category,
        korisnik: this._username,
        pocetnoSlovo: firstLetter,
        pojam:term,
        vreme: firebase.firestore.Timestamp.fromDate(dateTmp)
    };
  
    let response = await this.terms.add(data);
    return response;
    // let setDoc = this.terms.doc().set(data);
    // return setDoc.then(res => {
    //   console.log('Set: ', res);
    // });
  }

  //check if term is confirmed
  isUnique(termSuggested,category,callback) {
    let x = true;
    let term = this.capitalizeLetterTerm(termSuggested);
    this.terms.where("pojam", "==", term)
              .where("kategorija", "==", category)
              .get()
              .then( snapshot => {
                snapshot.docs.forEach( doc =>{
                  console.log(doc.data());
                    if(doc.data()){
                      x = false;
                    }       
                });
                callback(x);
              })
              .catch( error => {
                console.log(error);
              });
  }

  //check if term is confirmed
  getAllUsers( callback ) {
    
    this.terms.orderBy('korisnik')
              .get()
              .then( snapshot => {
                snapshot.docs.forEach( change =>{  
                    //dodaj novu poruku jer je doslo do izmene
                    this.users.push(change.data().korisnik);
                    
                });
                callback(this.users);
              })
              .catch( error => {
                console.log(error);
              });

    // this.terms.orderBy('korisnik').onSnapshot
    //           (querySnapshot => {
    //             querySnapshot.docChanges().forEach(change => {
    //                 console.log('New city: ', change.doc.data().korisnik);
    //                 this.users.push(change.doc.data().korisnik);
    //                 // console.log(typeof(this.users));
    //                 callback(this.users);
    //               });
    //             }); 
    }


  //return if term is confirmed
  async ifAnswerExist(termSuggested, category, callback) {
    
    var y = true;
    let term = this.capitalizeLetterTerm(termSuggested);
    let firstLetter = this.stringConvert(termSuggested);

    //console.log(term);
    //console.log(firstLetter);
    this.terms.where('pojam', "==", term)
              .where('pocetnoSlovo', '==', firstLetter)
              .where("kategorija", "==", category)
              .get()
              .then( snapshot => {
                snapshot.docs.forEach( doc =>{
                    if(doc.data()){
                      y = false;
                      // return y;
                    }
                    console.log(doc.data()); 
                });
                callback(y);
              })
              .catch( error => {
                console.log(error);
              });
  }
  
}

