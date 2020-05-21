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
    templateRangLI(doc){
        
        let counter = 1;

        doc.forEach(e => {
            if( counter < 6 ){
                let rangLI = document.createElement('li');
                if( e[0] == localStorage.username ){
                    rangLI.classList.add('me', "list-group-item", "d-flex", "justify-content-between", "align-items-center");
                    localStorage.setItem('listPosition',counter);
                }

                rangLI.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
    
                // let spanUser = document.createElement("SPAN");
                if( counter <= 3 ){
                    rangLI.innerHTML = `<span><img src='${counter}.png' style="width:40px;height:40px;"></span><b> ${e[0]} </b> <span class="badge badge-info badge-pill">${e[1]}</span>`;
                }else if (counter <=5){
                    rangLI.innerHTML = `<span class='fame-icon'>${counter}</span><b> ${e[0]} </b> <span class="badge badge-info badge-pill">${e[1]}</span>`;
                }
            
                this.list.appendChild(rangLI);
                // rangLI.appendChild(spanUser);
                counter++;
            }
        });

    }
    

    // clear(){
    //     //ul listu iz  konstruktora stavljamo na prazan sring
    //     this.list.innerHTML = '';
    // }

}

