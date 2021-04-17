var tabNote= []//variable stockage note
var titre=''
var note=''
var liste=''
var elem=document.getElementsByTagName('img')//variable stockage des fonds aléatoires
window.addEventListener('load',selectImg(1))//quand la page est chargé, choisit des images de picsum pour remplacer les placeholders
window.addEventListener('load',selectImg(2))
window.addEventListener('load',selectImg(3))
window.addEventListener('load',selectImg(4))
window.addEventListener('load',selectImg(5))
window.addEventListener('load', checkLocalStorage())//regarder dans le localstorage si des notes existent déja quand la page est chargé

//Générer un fond d'écran aléatoire a l'ouverture de la page
let xhr = new XMLHttpRequest()
xhr.open('get', 'https://picsum.photos/200/300', true)//image aléatoire de picsum
xhr.send()
xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
        console.log(xhr.responseURL)
        let img = document.createElement('img')
        img.src = xhr.responseURL
        document.body.style.backgroundImage="url('"+img.src+"')"//set une image en fond d'écran a l'ouverture
        document.body.style.backgroundSize="50%"//met l'image a des dimensions de moitié d'écran afin que l'image ne soit pas trop flou
    }
}
//choix d'un fond aléatoire utilisable
function selectImg(x){
    console.log(elem)
    let xhr = new XMLHttpRequest()
    xhr.open('get', 'https://picsum.photos/200/300', true)//image aléatoire de picsum
    xhr.send()
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            console.log(xhr.responseURL)
            let img = document.createElement('img')
            img.src = xhr.responseURL
            elem[(x-1)].src=xhr.responseURL//mémorise l'adresse de l'image dans un tableau pour etre appelé au changement de fond
        }
    }
}
//change le fond d'écran en cas de click sur une image
function changeBG(imgnumber){
    var lien = elem[imgnumber].src
    console.log(lien)
    document.body.style.backgroundImage="url('"+lien+"')"
    document.body.style.backgroundSize="50%"
}
//changer les fonds d'écran proposés
function changeIMG(){
    selectImg(1)
    selectImg(2)
    selectImg(3)
    selectImg(4)
    selectImg(5)
}
//obtenir les notes et les ajouter a la fiche
function getNote(){
    if (document.getElementById('titre').value==""||document.getElementById('titre').value==undefined){//verification qu'un titre as été donné
        alert("donner un titre a la note est obligatoire.")
    }
    else{
        //lire les valeurs des deux input text qui font la note
        titre=document.getElementById('titre').value
        note=document.getElementById('note').value
        if(checkUnique()==true){//vérification que le titre n'existe pas par un if fonction==true
            for (i=0;i<tabNote.length;i++){
                if (tabNote[i]==undefined){//regarder si une note n'as pas été précedement supprimé, et y inserer la note si oui
                    tabNote[i]=[titre, note]
                    prepareList()
                    return
                }
            }
            tabNote.push([titre,note])
            prepareList()
        }else{
            alert('ce titre est déjà utilisé.')//message d'erreur pour si le titre existe déjà
        }
    }   
    console.log(tabNote)  
}
function checkUnique(){//verification que le titre est unique pour fonction getNote()
    for(i=0;i<tabNote.length;i++){
        if (tabNote[i]!=undefined){//saute les cases ou le titre n'existe pas
            if(tabNote[i][0]==titre){
                return false//renvoie false quand le titre existe
            }
        }
    }
    return true
}
function checkLocalStorage(){
    if (localStorage.getItem('notes')!=undefined){//si le local storage contient une variable notes
        loadNote()
    }
    prepareList()
}
function dropNote(name){
    console.log(name)
    del=''+name
    for(i=0;i<tabNote.length;i++){
        if (tabNote[i]!=undefined){
            if (del==tabNote[i][0]){
                delete tabNote[i]//efface les infos de cette case du tableau. la ligne devient undefined et peut etre réutilisé
            }
        }
    }
    saveNote()//sauvegarde automatique dans le local aprés modification
    prepareList()
}
function saveNote(){
    localStorage.setItem('notes',JSON.stringify(tabNote))//sauvegarde dans la variable notes aprés avoir changé tableau en json
}
function loadNote(){
    tabNote=JSON.parse(localStorage.getItem('notes'))//recrée le tableau a partir du json stocké dans localstorage
}
function prepareList(){
    liste=''
    if(verifNotes()==false){
        for(i=0;i<tabNote.length;i++){
            if(tabNote[i]!=undefined){//crée une note sur la page pour chaque note exitante, skip des undefined
                //generer une couleur aléatoire
                var couleur=Math.ceil(Math.random()*16777215).toString(16)
                liste=liste+"<div style='background-color:#"+couleur+"'><h2>"+tabNote[i][0]+"</h2><p>"+tabNote[i][1]+'</p></br><input class="btn btn-delete" type="button" value="delete" onclick="dropNote(\''+tabNote[i][0]+'\')"></div>'
            }
            document.getElementById('liste').innerHTML=liste
        }
    }
    if (verifNotes()==true){
        document.getElementById('liste').innerHTML='<p>Pas de message enregistré</p>'//retour si pas de note existante
    }
    saveNote()//sauvegarde auto dans le local storage
}
//Fonction verifiant l'éxistance d'une note (valeur dans tabNote)
function verifNotes(){
    for(i=0;i<tabNote.length;i++){
        if(tabNote[i]!=undefined){
            return false
        }
    }
    return true
}
