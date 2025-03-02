let ekleyenform = document.getElementById('todoform');
let todolist=[];
let siralama = 'artan';
function addtodo(e){
    try{
        e.preventDefault();
        let baslikinput = document.getElementById('baslik').value;
        let aciklamatext = document.getElementById('aciklama').value;
        let oncelik = document.querySelector('input[name="oncelikler"]:checked');
        if(baslikinput === ''){
            alert('Başlık değerini giriniz.');
            return;
        }

        if(oncelik === null){
            alert('Lütfen bir öncelik seviyesi seçiniz.');
            return;
        }
        
        let gorev ={
            id:todolist.length +1,
            baslik: baslikinput,
            aciklama: aciklamatext,
            oncelik: oncelik.value,
            tamamlanma: false
        };
        todolist.push(gorev);
        ekleyenform.reset();
        goster();
        kaydet();
    
        console.log(todolist);
    }
    catch(error){
        alert('Görev Eklenirken Hata Oluştu:' + error.message);
    }
}


function goster(){
    let gorevdiv = document.querySelector('.list');
    try{
        gorevdiv.innerHTML = ``;
        for(let i=0; todolist.length>i ; i++){
            const aktiflik = todolist[i].tamamlanma ? 'active': '';
            gorevdiv.innerHTML +=` 
            <div class="todo-item  ${aktiflik}">
                <div class="baslik">
                    <h3>${todolist[i].baslik}</h3>
                    <span class="oncelik-belirteci ${todolist[i].oncelik}">${todolist[i].oncelik}</span>
                </div>
                <p>${todolist[i].aciklama}</p>
                <div class="islem">
                    <button onclick="tamamla(${todolist[i].id}, event)" class="tamamla">
                        <i class="fa fa-check" aria-hidden="true"></i>Tamamla
                    </button>
                    <button onclick="sil(${todolist[i].id})" class="sil"><i class="fa fa-trash" aria-hidden="true"></i>Sil</button>
                </div>
            </div>`
        }


    }
    catch(error){
        alert('Mesağları gösterirken Hata oluştu:'+ error.message);
    }
}

function tamamla(id, event) {
    event.stopPropagation();
    const todoItem = event.target.closest('.todo-item');
    todoItem.classList.toggle('active');
    todolist[id-1].tamamlanma = !todolist[id-1].tamamlanma;
    kaydet();
}

function sil(silinecekid){
    const index = todolist.findIndex(gorev => gorev.id === silinecekid);
        if (index !== -1) {
        todolist.splice(index, 1);
        kaydet();
        goster();
    }
}

function kaydet(){
    try{
        localStorage.setItem('todolist', JSON.stringify(todolist))
    }
    catch(error){
        alert('Görev kayıt edilmedi.' + error.message )
    }
}

function kayitgoster(){
    try{
        const kayitli = localStorage.getItem('todolist');
        if (kayitli) {
            todolist = JSON.parse(kayitli);
            goster();
        }
    }
    catch(error){
        alert('Kayıtlı verilerin gelmesinde bir hata var'+ error.message);
    }
}

function filtrelemeYap(filtreturu, event){
    const butonlar = document.querySelectorAll('.filitreleme button');
    butonlar.forEach(btn => btn.classList.remove('active')); 
    event.target.classList.add('active');

    const gorevler =  document.querySelectorAll('.todo-item');
    gorevler.forEach(gorev =>{
        if(filtreturu=='tumu'){
            gorev.style.display ='block';
        }
        else if(filtreturu=='aktif'){
            gorev.style.display = gorev.classList.contains('active') ? 'none' : 'block';

        }
        else if(filtreturu=='tamamlanan'){
            gorev.style.display = gorev.classList.contains('active') ? 'block' : 'none';

        }
    })
}

function siralamaYap() {
    const oncelikAgirligi = {
        'dusuk': 1,
        'orta': 2,
        'yuksek': 3
    };
    siralama = siralama === 'artan' ? 'azalan' : 'artan';
    todolist.sort((a, b) => {
        if (siralama === 'artan') {
            return oncelikAgirligi[a.oncelik] - oncelikAgirligi[b.oncelik];
        } else {
            return oncelikAgirligi[b.oncelik] - oncelikAgirligi[a.oncelik];
        }
    });
    goster();
    kaydet();
}

window.onload = function(){
ekleyenform.addEventListener('submit',addtodo);
kayitgoster();
}
