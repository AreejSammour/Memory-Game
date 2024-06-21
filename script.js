// function för att Lägga till bilder från mapp eller länk
function beginbild(){
    let arr = [0,1,2,3,4,5,0,1,2,3,4,5] // Bildindex eller Url
    shuffle(arr)
    for ( i=0; i<12 ;i++){
        CreatLi(arr[i])
    }

    function shuffle(array) {
        array.sort(() => Math.random() - 0.5);
    }
    
    function CreatLi(i){
        let liElement = document.createElement('li') // lägg till Li
        liElement.classList.add("memory-card"); // add class = "memory-card"

        let imgElement = document.createElement('img') // lägg till bild till Li
        imgElement.classList.add("front-face"); // add class = "front-face"

        if (i<6){ //Bara här för att lägga till bildnummer. Vi behöver det inte om vi har Url
            var a = "img"+ (i+1)
        } else
        if (i => 6) {
            var x = i-5
            var a = "img"+ x
        }
        imgElement.src = 'img/' + a + '.jpg'
        imgElement.alt = 'imag' + (i+1)

        let imgstar = document.createElement('img') // lägg till star till Li
        imgstar.classList.add("back-face"); // add class = "back-face"
        imgstar.src = 'img/star.jpg'
        imgstar.alt = 'star'
        liElement.setAttribute("data-framework",a)

        //Länka li med ul
        liElement.appendChild(imgElement)
        liElement.appendChild(imgstar)
        document.getElementById("card").appendChild(liElement)
    }
}

// fuction för att Skapa tidsalternativ
function TimeOption(){
    const timeCategory = document.getElementById("timeCategory")
    let timeinterval = ['Tid','15s','30s','60s']
    
    for (var i = 0; i < timeinterval.length; ++i) {
       var oEle = document.createElement('option');
     
       if (i == 0) {
         oEle.setAttribute('disabled', 'disabled');
         oEle.setAttribute('selected', 'selected');
       } // end of if loop
     
       var oTxt = document.createTextNode(timeinterval[i]);
       oEle.appendChild(oTxt);
     
       document.getElementsByTagName('select')[0].appendChild(oEle);
     } // end of for loop
}

let antal = 0 // antal försök till matchning
let account = 0 //6 kort matchande för att vinna

beginbild() // Börja skapa bilder

let timeinterval = 0
TimeOption() // Börja lägga till tidsalternativ
function getOption() {
    selectTime = document.getElementById('timeCategory').value
    timeinterval = parseInt(selectTime.slice(0, -1)) 
  }

const btnknapp = document.getElementById('reset')

btnknapp.addEventListener("click",function(){
    // Tryck för att starta/sluta
    if (btnknapp.innerHTML == 'Sluta'){
        location.reload() // Till att börja om
    }else {
        btnKnappStyle() //Ändra knappens form för att visa att spelet har startat
    }
    
    // Börja nedräkningen för speltid
    var timeleft = timeinterval ;
    var downloadTimer = setInterval(function(){
        if(timeleft <= 0){  // Om speltiden går ut, ge en varning och uppdatera sidan
            clearInterval(downloadTimer);
            document.getElementById("timeid").innerHTML = "Tiden är slut";
            setTimeout(function(){
                    alert("Tyvärr... tiden har gått ut \n Försök igen")
                    location.reload()
            },1500)  
        } else {
            document.getElementById("timeid").innerHTML = timeleft + " sekunder kvar";
        }
        timeleft -= 1;
    }, 800);

    let cards = document.querySelectorAll('.memory-card') // li's container

    let hasFlippedCard = false
    let lockBoard = false
    let firstCard, secondCard // Utvalda kort

    // här är huvudkommandot för att utföra spelfunktionerna nedan
    cards.forEach(card => card.addEventListener('click', flipCard)) 

    shuffle() //När spelet är slut, arrangera om korten randomly
    
    function flipCard() {
        if(lockBoard) return // Alla kort är matchade
        if(this === firstCard) return  // Samma kort har valts
    
        this.classList.toggle('flip') //Kortet har öppnats
    
        if (!hasFlippedCard){  //Bestäm om det är det första eller andra kortet
            //first click
            hasFlippedCard = true
            firstCard = this
        return
        } 
        // second click
        hasFlippedCard = false
        secondCard = this

        antal ++ //Lägg till ett försök att matcha
        document.getElementById('antalCount').innerHTML =  `Antal: ${antal}`

        checkForMatch() // Kontrollera om korten liknar varandra
    }
    
    function checkForMatch(){
        if (firstCard.dataset.framework === secondCard.dataset.framework ){
            disableCards() // Korten är identiska. Håll dem öppna
        } else {
            unflipCards() // Korten är inte identiska. Stäng korten
        }   
    }
    
    function disableCards(){
        // Stoppa möjligheten att click på dem igen
        firstCard.removeEventListener('click',flipCard)
        secondCard.removeEventListener('click',flipCard)

        account ++ // Nytt lyckat försök
        //Om lyckade försök når 6 >> Avsluta spelet och börja om
        if (account == 6){
            setTimeout(function(){
                alert(`Hurra...du vann efter ${antal} försök
                        \n Och på ${timeinterval-timeleft-1 } sekunder`)
                location.reload()
            },1500)  
        }
        resetBoard() // återställ kort för en ny check
    }
    
    function unflipCards(){
        lockBoard = true
        // stäng korten efter en stund
        setTimeout(() => {
        firstCard.classList.remove('flip')
        secondCard.classList.remove('flip')
        resetBoard() //återställ kort för en ny check
        }, 1300) 
    }
    
    function resetBoard() {
        [hasFlippedCard,lockBoard] = [false, false]
        [firstCard,secondCard] = [null, null] 
    }
    
    function shuffle() {
        cards.forEach(card => {
        let randomPos = Math.floor(Math.random()) * 12
        card.computedStyleMap.order = randomPos
        })
    }

    function btnKnappStyle (){
        btnknapp.style.backgroundColor = '#fa7b1b'
        btnknapp.style.width = '200px'
        btnknapp.style.color = 'white'
        btnknapp.style.border = 'none'
        btnknapp.innerHTML = 'Sluta'
    } 
})



