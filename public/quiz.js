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

  //check if term is confirmed
  isUnique(term,category,callback) {
    let x = true;
    this.terms.where("pojam", "==", term)
              .where("kategorija", "==", category)
              .get()
              .then( snapshot => {
                snapshot.docs.forEach( doc =>{
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

  //insert new term in db
  insertTerm(category, term, firstLetter) {
      let dateTmp = new Date(); 
      let data = {
          kategorija: category,
          korisnik: this.username,
          pocetnoSlovo: firstLetter,
          pojam:term,
          vreme: firebase.firestore.Timestamp.fromDate(dateTmp)
      };
    
      let setDoc = this.terms.doc().set(data);
      return setDoc.then(res => {
        console.log('Set: ', res);
      });
  }

  //get all username
  //check if term is confirmed
  getAllUsers( callback ) {
    
    this.terms.orderBy('korisnik')
              .get()
              .then( snapshot => {
                snapshot.docs.forEach( change =>{  

                  this.users.push(change.data().korisnik);
                  
                });
                callback(this.users);
              })
              .catch( error => {
                console.log(error);
              });
  }

  
}

