//za prikaz podataka na korisnickoj strani

export class QuizUI{

    constructor(l){
        this.list = l;
    }

    set list(l){
        this._list = l;
    }

    get list(){
        return this._list;
    }
    

    //make li rang list template
    templateRangLI(doc, usernamePosition){
        
        let counter = 1;

        doc.forEach(e => {
            if( counter < 6 ){
                let rangLI = document.createElement('li');
                if( e[0] == localStorage.username ){
                    rangLI.classList.add('me', "list-group-item", "d-flex", "justify-content-between", "align-items-center");
                    localStorage.setItem('listPosition',counter);
                    usernamePosition.innerText += ` ${localStorage.listPosition}`;
                }

                rangLI.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
    
                if( counter <= 3 ){
                    rangLI.innerHTML = `<span><img src='img/${counter}.png' style="width:40px;height:40px;"></span><b> ${e[0]} </b> <span class="badge badge-info badge-pill">${e[1]}</span>`;
                }else if (counter <=5){
                    rangLI.innerHTML = `<span class='fame-icon'>${counter}</span><b> ${e[0]} </b> <span class="badge badge-info badge-pill">${e[1]}</span>`;
                }
                this.list.appendChild(rangLI);
                counter++;
            }else{
                if(e[0] == localStorage.username){
                    localStorage.setItem('listPosition',counter);
                    usernamePosition.innerHTML += `${counter}`;
                    //usernamePosition.innerText += ` ${localStorage.listPosition}`;
                }
                counter++;
            }
        });
        
    }

    //make li rang list template
    templateTopThree(data){
        let counter = 1;
        data.forEach(e => {
            
            let rangLI = document.createElement('li');
            if( e.username == localStorage.username ){
                rangLI.classList.add('me', "list-group-item", "d-flex", "justify-content-between", "align-items-center");
            }else{
                rangLI.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
            }
            
            rangLI.innerHTML = `<span><img src='img/${counter}.png' style="width:40px;height:40px;"></span><b> ${e.username} </b> <span class="badge badge-info badge-pill">${e.broj_poena}</span>`;
            
            this.list.appendChild(rangLI);
            counter++;
        });
        
    }

    clear(){
        //ul listu iz  konstruktora stavljamo na prazan sring
        this.list.innerHTML = '';
    }
    
}

