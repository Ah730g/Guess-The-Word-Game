//Set The Word Game Name
let gameName = "Guess The Word";
document.title = gameName;
document.querySelector("h1").innerHTML = gameName;
document.querySelector("footer").innerHTML = `${gameName} Game Created By Ahmed Senan Inspired By Elzero`;

// Guess The Word Game Var
let numOfTries = 5;
let numOfLetters = 6;
let currentTry = 1;
let words = ["create","update","delete","school"];
let wordToGuess = words[Math.floor(Math.random() * words.length)].toLowerCase();
let message = document.querySelector(".message");
let numOfHints = 2;
document.querySelector(".hint span").innerHTML = numOfHints; 

//Generate the inputs
function generateInputs() {
    let inputsContainer = document.querySelector(".inputs");
    for(let i = 1; i<= numOfTries; i++) {
        let guessDiv = document.createElement("div");
        guessDiv.classList.add(`try-${i}`);
        guessDiv.innerHTML = `<span>Try ${i}</span>`;
        
        if(i !== 1)
            guessDiv.classList.add("disabled-inputs");

        for(let j = 1; j<=numOfLetters; j++) {
            let input = document.createElement("input");
            input.type = "text";
            input.maxLength = "1";
            input.id = (`try-${i}-guess-${j}`);
            guessDiv.appendChild(input);
        }
        inputsContainer.appendChild(guessDiv);
    }

    inputsContainer.children[0].children[1].focus();

    document.querySelectorAll(".disabled-inputs input").forEach(input => input.disabled = true);
    let inputs = document.querySelectorAll(".inputs input");
    inputs.forEach(input => {

        input.addEventListener("input",e=> {
            input.value = input.value.toUpperCase();
            let nextInput = inputs[Array.from(inputs).indexOf(input) + 1];
            if(nextInput)
                nextInput.focus();
        });

        input.addEventListener("keydown",event => {
            if(event.key === "ArrowRight") {
                let nextInput = inputs[Array.from(inputs).indexOf(input) + 1];
                if(nextInput)
                    nextInput.focus();
            }else if(event.key === "ArrowLeft") {
                let preInput = inputs[Array.from(inputs).indexOf(input) - 1];
                if(preInput)
                    preInput.focus();
            } else if(event.key === "Backspace") {
                let currentIndex = Array.from(inputs).indexOf(event.target);
                if(currentIndex > 0) {
                    event.target.value = "";
                    preInput = inputs[ currentIndex - 1];
                    preInput.value = "";
                    preInput.focus();
                }
                
            }
        });
    });
}

window.onload = function() {
    generateInputs();
}

//Manage Hints
let hintButton = document.querySelector(".hint");
hintButton.addEventListener("click",getHint);
function getHint() {
    if(numOfHints > 0){
        numOfHints--;
        document.querySelector(".hint span").innerHTML = numOfHints; 
    }
    if(numOfHints === 0) {
        hintButton.disabled = true;
    }

    let enabledInputs = document.querySelectorAll("input:not([disabled])");
    let emptyInputs = Array.from(enabledInputs).filter(input => input.value === "");
    if(emptyInputs.length > 0) {
        let randomInput = emptyInputs[Math.floor(Math.random() * emptyInputs.length)];
        let randomIndex = Array.from(enabledInputs).indexOf(randomInput);
        randomInput.value = wordToGuess[randomIndex].toUpperCase();
    }
}

//Manage Check
console.log(wordToGuess);
let checkButton = document.querySelector(".check");
checkButton.addEventListener("click",getCheck);
function getCheck() {
    let success = true;
    for(let i = 1; i<= numOfLetters; i++) {
        let input = document.querySelector(`#try-${currentTry}-guess-${i}`);
        if(input.value === wordToGuess[i-1].toUpperCase()){
            input.classList.add("in-place");
        } else if(wordToGuess.includes(input.value.toLowerCase()) && input.value !== "") {
            input.classList.add("not-in-place");
            success = false;
        } else {
            input.classList.add("not");
            success = false;
        }
    }
    if(success) {
        document.querySelector(`.try-${currentTry}`).classList.add("disabled-inputs");
        document.querySelectorAll(`.try-${currentTry} input`).forEach(input=> input.disabled = true);
        message.innerHTML = `You Win The Word Is <span>${wordToGuess}</span>`;
        checkButton.disabled = true;
        hintButton.disabled = true;
    } else {
        document.querySelector(`.try-${currentTry}`).classList.add("disabled-inputs");
        document.querySelectorAll(`.try-${currentTry} input`).forEach(input=> input.disabled = true);

        currentTry++;
        if(currentTry <= numOfTries){
            document.querySelector(`.try-${currentTry}`).classList.remove("disabled-inputs");
            document.querySelectorAll(`.try-${currentTry} input`).forEach(input=> input.disabled = false);
            document.querySelector(`.try-${currentTry}`).children[1].focus();
        } else {
            message.innerHTML = `You Lose The Word Is <span>${wordToGuess}</span>`;
            checkButton.disabled = true;
            hintButton.disabled = true;
        }
    }
}

//Handle Restart
document.querySelector(".restart").onclick = function() {
    window.location.reload();
}
