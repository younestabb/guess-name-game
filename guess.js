let title = "Guess The Name Game";
document.title = title;
document.querySelector("h1").innerHTML = title;


const names = [
    "Younes", "Youcef", "Mounir", "Issam", "Anes", "Omar", "Adel", "Samir", "Hicham", "Khaled",
    "Nabil", "Walid", "Riad", "Samy", "Karim", "Tarek", "Hakim", "Fares", 
    "Bilal", "Fouad", "Mahdi", "Ramy", "Amine", "Djamal", "Merouane", "Nassim",
    "Sofiane", "Hamza", "Mehdi", "Nassim", "Zaki", "Mustapha", "Salim",
    "Ilyes", "Raouf","Toufik", "Rachid", "Idris", "Wail",
   "Imad", "Zohir", "Lotfi", "Taher", "Aymen", "Rafik", "Wassim", "Anfel", "Maria", "Sabrina",
    "Bouchra", "Hadjer", "Asma", "Khadidja"
];


let succesTimes = document.querySelector(".succes .number");
let failTimes = document.querySelector(".fail .number");

let [succes_times, fail_times] = [0,0];

if (sessionStorage.getItem("succes_times")) {
    succesTimes.innerHTML = sessionStorage.getItem("succes_times");
    succes_times = sessionStorage.getItem("succes_times");
}
if (sessionStorage.getItem("fail_times")) {
    failTimes.innerHTML = sessionStorage.getItem("fail_times");
    fail_times = sessionStorage.getItem("fail_times");
}

let [currName,lettersNums] = chosing_name ();
function chosing_name () {
    let currName;
    if(sessionStorage.getItem("current_name")) 
        currName = sessionStorage.getItem("current_name");
    else 
        currName = names[Math.floor(Math.random() * names.length)].toLocaleLowerCase();
    sessionStorage.setItem("current_name", currName);
    let lettersNums = currName.length;
    return [currName, lettersNums];
}

let lastInputs = [];
if (sessionStorage.getItem("last_inputs_added"))
    lastInputs = [...sessionStorage.getItem("last_inputs_added")].filter(e => e!==",");

let correctLetters = new Set();
if (sessionStorage.getItem("correct_letters_added"))
    correctLetters = new Set([...sessionStorage.getItem("correct_letters_added")].filter(e => e!==","));


let hintsNums = Math.floor(currName.length / 3);
if (sessionStorage.getItem("number_of_hints_left")) 
        hintsNums = sessionStorage.getItem("number_of_hints_left");

let span = document.querySelector(".hint span");
span.innerHTML = hintsNums;

const tryTimes = 5;
let currTry = 1;


// generate inputs
function inputGen () {
    [currName, lettersNums] = chosing_name ();

    let inputsContainer = document.querySelector(".inputs");
    for (let i = 1; i <= tryTimes; i++) {
        let tryDiv = document.createElement("div");
        tryDiv.classList.add(`try-${i}`);
        tryDiv.innerHTML = `<span>Try ${i}</span>`;

        for (let j = 1; j <= lettersNums; j++) {
            const input = document.createElement("input");
            input.type = "text";
            input.setAttribute("id", `guess-${i}-letter-${j}`);
            input.setAttribute("maxlength", "1");
            input.required = true;
            tryDiv.append(input);
            
        }

        const divCont = document.createElement("div");
        divCont.append(tryDiv);
        inputsContainer.append(divCont);

    }
    filling_Inputs_with_sessionStorage()
    inputTraverssing();
}

// deleting all inputs in case victory or fail
function emptyig_inputs () {
    const inputs = document.querySelectorAll(".inputs > div");
    inputs.forEach((input) => input.remove());
    sessionStorage.clear();
}

// filling inputs with data stored in session storage
function filling_Inputs_with_sessionStorage() {
    if (sessionStorage.getItem("guess-1-letter-1")) {
        const inputs = Array.from(document.querySelectorAll(".inputs input"));
        let number_of_filled_inputs = 0;
        inputs.forEach((input) => {
            if (sessionStorage.getItem(input.id)) {
                input.value = JSON.parse(sessionStorage.getItem(input.id)).value;
                input.classList.value = JSON.parse(sessionStorage.getItem(input.id)).class;
                number_of_filled_inputs++;
            }
        })
        currTry += number_of_filled_inputs / currName.length;
        inputTraverssing();
    }
}

// inputs properties
function inputTraverssing () {
    const inputs = document.querySelectorAll(`.try-${currTry} input`);
    inputs.forEach((input, index) => {
        let availableInputs = document.querySelectorAll(`.try-${currTry} > input`);
        // input to uppercase
        input.addEventListener("input", function (event) {
            this.value = this.value.toUpperCase();
            const nextInput = availableInputs[index + 1];
            if (nextInput && event.inputType !== "deleteContentBackward") {
                nextInput.focus();
                if (/[a-z]/ig.test(input.value)) nextInput.select();
            } 
        });

        input.addEventListener("keydown", (event) => {
            // arrow right
            if (event.key === "ArrowRight" && index < availableInputs.length-1) {
                availableInputs[index+1].focus();
                if (availableInputs[index+1].value) {
                    availableInputs[index+1].select();
                    event.preventDefault();
                }
                
            }
            // arrow left
            if (event.key === "ArrowLeft" && index > 0) {
                availableInputs[index-1].focus();
                if (availableInputs[index-1].value) {
                    availableInputs[index-1].select();
                    event.preventDefault();
                }
            }
            // only character input
            if (!(/[a-z]/ig.test(event.key))) event.preventDefault();
        });
        
        // delete input
        input.addEventListener("keydown", (event) => {
            if (event.key === "Backspace" || event.key === "Delete") {
                
                let bool = true;
                for (let i = lettersNums-1; i > index; i--)
                    if (availableInputs[i].value !== "") {
                        bool = false;
                        break;
                    }
                
                availableInputs[index].value = "";
                if (bool && index > 0 && index < lettersNums) {
                    availableInputs[index-1].focus();
                    if (/[a-z]/ig.test(availableInputs[index-1].value)) availableInputs[index-1].select();
                } 
                
                event.preventDefault();

            }
        })
        

    })
}


// checking the inputs 
const check = document.querySelector(".check");
check.addEventListener("click" , handeleGuess);

// displaying a hint window
const hint = document.querySelector(".hint");
hint.addEventListener("click" , handeleHints);




function handeleGuess () {
    if (document.querySelector(".alert")) document.querySelector(".alert").remove();
    let succesGuess = true;
    let allFilled = true;
    let inputs = document.querySelectorAll(`.try-${currTry} input`);
    // assuring that the user will fill all the inputs
    // inputs.forEach((input) => allFilled = input.value === "" ? false : true);
    for (let input of inputs) {
        if (input.value === "") {
            allFilled = false;
            break;
        }
    }
    if (!allFilled) {
        const alert = document.createElement("p");
        alert.innerHTML = "Please, Fill All The Areas";
        alert.classList.add("alert");
        document.querySelector(".inputs").children[currTry-1].append(alert);
    } else {
        lastInputs.length = 0;
        inputs.forEach((input , index) => {
            let currLetter = input.value.toLocaleLowerCase();
            lastInputs.push(input.value.toLocaleLowerCase());
            if (currLetter === currName[index]) {
                input.classList.add("correct-right-place");
                correctLetters.add(currLetter);
                sessionStorage.setItem(input.id, JSON.stringify({"value": input.value, "class": input.classList.value}));
            } else if (currName.includes(currLetter)) {
                input.classList.add("correct-wrong-place");
                correctLetters.add(currLetter);
                sessionStorage.setItem(input.id, JSON.stringify({"value": input.value, "class": input.classList.value}));
                succesGuess = false;
            } else {
                input.classList.add("wrong");
                sessionStorage.setItem(input.id, JSON.stringify({"value": input.value, "class": input.classList.value}));
                succesGuess = false;
            }
        });
        sessionStorage.setItem("last_inputs_added", lastInputs.toString());
        sessionStorage.setItem("correct_letters_added", [...correctLetters].toString());
    }
    if (succesGuess && allFilled) {
        inputs.forEach((input) => input.disabled = true);
        const succesWindow = document.createElement("div");
        succesWindow.classList.add("window");
        succesWindow.classList.add("succesWindow");
        succesWindow.innerHTML = `
        <div class="successMessage">
                <p>Congrats, You Guessed The Name Right</p>
                <i class="congrats fa-solid fa-cake-candles"></i>
                </div>
                <button class="nextGuess">Next Guess <i class="fa-solid fa-circle-chevron-right"></i></button>
                `;
        document.body.prepend(succesWindow);
        setTimeout(() => succesWindow.style.top = "9%", 10);
        succes_times++;
        succesTimes.innerHTML = succes_times;
        // start the next guess
        document.querySelector(".nextGuess").addEventListener("click", () => {
            succesWindow.style.top = "-50%";
            setTimeout(() => succesWindow.remove() , 1000);
            emptyig_inputs ();
            sessionStorage.clear();
            correctLetters.clear();
            sessionStorage.setItem("succes_times", succes_times);
            sessionStorage.setItem("fail_times", fail_times);
            inputGen();
            hintsNums = Math.floor(currName.length / 3);
            span.innerHTML = hintsNums;
            currTry = 1;
            inputTraverssing();
            document.querySelector(".inputs").children[0].children[0].children[currTry].focus();
            const disabledInputs = document.querySelectorAll(`:not(.try-${currTry}) > input`);
            disabledInputs.forEach((input) => (input.disabled = true));
        });
        
        
    } else if (currTry <= tryTimes && allFilled) {
        inputs.forEach((input) => input.disabled = true);
        if (currTry < tryTimes) {
            currTry++;
            inputs = document.querySelectorAll(`.try-${currTry} input`);
            inputs.forEach((input) => input.disabled = false);
            document.querySelector(`.try-${currTry}`).classList.remove("disabled");
            Array.from(inputs)[0].focus();
            inputTraverssing();
        }
        else if (currTry === tryTimes && allFilled) {
            const failWindow = document.createElement("div");
            failWindow.classList.add("window");
            failWindow.classList.add("failWindow");
            failWindow.innerHTML = `
            <div class="successMessage">
                    <p>Your Guesses Are All Wrong, The Name is "${currName}" Good Luck Next Time</p>
            </div>
            <button class="nextGuess">Retry <i class="fa-solid fa-rotate-right"></i></button>
            `;
            document.body.prepend(failWindow);
            setTimeout(() => failWindow.style.top = "9%", 10);
            fail_times++;
            failTimes.innerHTML = fail_times;
            

            // start the next guess
            document.querySelector(".nextGuess").addEventListener("click", () => {
                failWindow.style.top = "-50%";
                setTimeout(() => failWindow.remove() , 1000);
                emptyig_inputs ();
                sessionStorage.clear();
                correctLetters.clear();
                sessionStorage.setItem("succes_times", succes_times);
                sessionStorage.setItem("fail_times", fail_times);
                inputGen();
                console.log(currName);
                hintsNums = Math.floor(currName.length / 3);
                span.innerHTML = hintsNums;
                currTry = 1;
                inputTraverssing();
                document.querySelector(".inputs").children[0].children[0].children[currTry].focus();
                const disabledInputs = document.querySelectorAll(`:not(.try-${currTry}) > input`);
                disabledInputs.forEach((input) => (input.disabled = true));
            });
        }
        
        
    }
}

function handeleHints () {
    // hide the previous hint if there is 
    const prevhint = document.querySelector(".hintWindow");
    if (prevhint) {
        prevhint.style.top = "-100%";
        setTimeout( () => prevhint.remove(), 100);
    }

    let hintWindow = document.createElement("div");
    hintWindow.classList.add("window");
    hintWindow.classList.add("hintWindow");
    if (hintsNums > 0) {

        const hint_letter = get_random_hint_letter(currName);
        hintWindow.innerHTML = `
            <p class="description">The Name Contains the Letter ${hint_letter}</p>
            <i class="close fa-solid fa-circle-xmark"></i>
        `;
        hintsNums--;
        sessionStorage.setItem("number_of_hints_left", hintsNums);
        span.innerHTML = hintsNums;
    } else {
        hintWindow.innerHTML = `
            <p class="description">Congrats, You Have Wasted All Of Your Hints ^.^</p>
            <i class="close fa-solid fa-circle-xmark"></i>
        `;
    }
    document.body.prepend(hintWindow);
    setTimeout(() => hintWindow.style.top = "9%", 100);

    // closing the "hint" window
    document.addEventListener("click", function (event) {
        if (![...event.target.classList].includes("hint") && ![...event.target.classList].includes("hintWindow") && ![...event.target.classList].includes("description")) {
            hintWindow.style.top = "-10%";
            setTimeout( () => hintWindow.remove(), 100);
        }
    });
}
// getting a random hint letter
function get_random_hint_letter (name) {
    let randomIndex = Math.floor(Math.random() * name.length);
    let correct_letters_added = [...correctLetters];
    // showing the letter with its position if user guessed all letters but wrongly placed
    if ([...new Set(name)].length === correct_letters_added.length) {
        if (correct_letters_added.toString() != [...name].toString()) {
            correct_letters_added = [...name];
            correctLetters = new Set(correct_letters_added);
            sessionStorage.setItem("correct_letters_added", correct_letters_added.toString());
        }
        let hintLetter = "";
        [...name].forEach(function loop(element, index) {
            if (loop.stop) return;
            if (element !== correct_letters_added[index] || element !== lastInputs[index]) {
                // stopping the iteration whenever the first wrongly placed letter in
                loop.stop = true;
                hintLetter = `"${name[index].toUpperCase()}" in position ${index+1}`;
            }
        })
        return hintLetter;
    }
    // Prevent a previously guessed hint from appearing by
    if (correct_letters_added.includes(name[randomIndex])) {
        return get_random_hint_letter(name);
    }
    else {
        correctLetters.clear();
        [...name].forEach((element, index) => {
            if (correct_letters_added.includes(element)) correctLetters.add(element);
            else if (element === name[randomIndex]) correctLetters.add(name[randomIndex]);
        })
        correct_letters_added = [...correctLetters];
        sessionStorage.setItem("correct_letters_added", correct_letters_added.toString());
        return `"${name[randomIndex].toUpperCase()}"`;
    } 
}

window.onload = function () {
    inputGen();
    document.querySelector(".inputs").children[0].children[0].children[currTry].focus();
    const disabledInputs = document.querySelectorAll(`:not(.try-${currTry}) > input`);
    disabledInputs.forEach((input) => (input.disabled = true));
    

}
