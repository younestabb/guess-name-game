// let title = "Guess Word Game";
// document.title = title;
// document.querySelector("h1").innerHTML = title;


// const names = [
//     "Younes", "Youcef", "Mounir", "Issam", "Anes", "Omar", "Adel", "Samir", "Hicham", "Khaled",
//     "Nabil", "Walid", "Riad", "Samy", "Hassan", "Karim", "Tarek", "Hakim", "Fares", "Ziad",
//     "Bilal", "Fouad", "Mahdi", "Rami", "Saif", "Amine", "Djamal", "Merouane", "Nasim",
//     "Sofiane", "Hamza", "Mehdi", "Hatem", "Nassim", "Zaki", "Mustafa", "Salim",
//     "Ilyes", "Raouf", "Fadi", "Tawfiq", "Rashid", "Idris", "Wael", "Mounir", "Abed", "Shadi",
//     "Imad", "Laith", "Zohir", "Chaker", "Lotfi", "Taher", "Aymen", "Rafik"
// ];

// // const currName = names[Math.floor(Math.random() * names.length)].toLocaleLowerCase();
// const currName = "tawfiq";

// let lastInputs = [];
// if (sessionStorage.getItem("last_inputs_added"))
//     lastInputs = [...sessionStorage.getItem("last_inputs_added")].filter(e => e!==",");

// let correctLetters = new Set();
// if (sessionStorage.getItem("correct_letters_added"))
//     correctLetters = new Set([...sessionStorage.getItem("correct_letters_added")].filter(e => e!==","));


// let hintsNums = Math.floor(currName.length / 3);
// // sessionStorage.setItem("number_of_hints_left", hintsNums);
// if (sessionStorage.getItem("number_of_hints_left")) 
//         hintsNums = sessionStorage.getItem("number_of_hints_left");

// let span = document.querySelector(".hint span");
// span.innerHTML = hintsNums;

// const tryTimes = 5;
// const lettersNums = currName.length;
// let currTry = 1;


// // generate inputs
// function inputGen () {

//     let inputsContainer = document.querySelector(".inputs");
//     for (let i = 1; i <= tryTimes; i++) {
//         let tryDiv = document.createElement("div");
//         tryDiv.classList.add(`try-${i}`);
//         tryDiv.innerHTML = `<span>Try ${i}</span>`;

//         for (let j = 1; j <= lettersNums; j++) {
//             const input = document.createElement("input");
//             input.type = "text";
//             input.setAttribute("id", `guess-${i}-letter-${j}`);
//             input.setAttribute("maxlength", "1");
//             input.required = true;
//             tryDiv.append(input);
            
//         }

//         const divCont = document.createElement("div");
//         divCont.append(tryDiv);
//         inputsContainer.append(divCont);

//     }
//     // inputsContainer.children[0].children[0].children[currTry].focus();
//     // const disabledInputs = document.querySelectorAll(`:not(.try-${currTry}) > input`);
//     // disabledInputs.forEach((input) => (input.disabled = true));

//     inputTraverssing();
// }

// // filling inputs with data stored in session storage
// function filling_Inputs_with_sessionStorage() {
//     if (sessionStorage.length > 2) {
//         const inputs = Array.from(document.querySelectorAll(".inputs input"));
//         let number_of_filled_inputs = 0;
//         inputs.forEach((input) => {
//             if (sessionStorage.getItem(input.id)) {
//                 input.value = JSON.parse(sessionStorage.getItem(input.id)).value;
//                 input.classList.value = JSON.parse(sessionStorage.getItem(input.id)).class;
//                 number_of_filled_inputs++;
//             }
//         })
//         currTry += number_of_filled_inputs / currName.length;
//         inputTraverssing();
//     }
// }

// // inputs properties
// function inputTraverssing () {
//     const inputs = document.querySelectorAll(`.try-${currTry} input`);
//     inputs.forEach((input, index) => {
//         let availableInputs = document.querySelectorAll(`.try-${currTry} > input`);
//         // input to uppercase
//         input.addEventListener("input", function (event) {
//             this.value = this.value.toUpperCase();
//             const nextInput = availableInputs[index + 1];
//             if (nextInput && event.inputType !== "deleteContentBackward") {
//                 nextInput.focus();
//                 if (/[a-z]/ig.test(input.value)) nextInput.select();
//             } 
//         });

//         input.addEventListener("keydown", (event) => {
//             // arrow right
//             if (event.key === "ArrowRight" && index < availableInputs.length-1) {
//                 availableInputs[index+1].focus();
//                 if (availableInputs[index+1].value) {
//                     availableInputs[index+1].select();
//                     event.preventDefault();
//                 }
                
//             }
//             // arrow left
//             if (event.key === "ArrowLeft" && index > 0) {
//                 availableInputs[index-1].focus();
//                 if (availableInputs[index-1].value) {
//                     availableInputs[index-1].select();
//                     event.preventDefault();
//                 }
//             }
//             // only character input
//             if (!(/[a-z]/ig.test(event.key))) event.preventDefault();
//         });
        
//         // delete input
//         input.addEventListener("keydown", (event) => {
//             if (event.key === "Backspace" || event.key === "Delete") {
                
//                 let bool = true;
//                 for (let i = lettersNums-1; i > index; i--)
//                     if (availableInputs[i].value !== "") {
//                         bool = false;
//                         break;
//                     }
                
//                 availableInputs[index].value = "";
//                 if (bool && index > 0 && index < lettersNums) {
//                     availableInputs[index-1].focus();
//                     if (/[a-z]/ig.test(availableInputs[index-1].value)) availableInputs[index-1].select();
//                 } 
                
//                 event.preventDefault();

//             }
//         })
        

//     })
// }


// // checking the inputs 
// const check = document.querySelector(".check");
// check.addEventListener("click" , handeleGuess);

// // displaying a hint window
// const hint = document.querySelector(".hint");
// hint.addEventListener("click" , handeleHints);




// function handeleGuess () {
//     if (document.querySelector(".alert")) document.querySelector(".alert").remove();
//     let succesGuess = true;
//     let allFilled = true;
//     let inputs = document.querySelectorAll(`.try-${currTry} input`);
//     // assuring that the user will fill all the inputs
//     // inputs.forEach((input) => allFilled = input.value === "" ? false : true);
//     for (let input of inputs) {
//         if (input.value === "") {
//             allFilled = false;
//             break;
//         }
//     }
//     if (!allFilled) {
//         const alert = document.createElement("p");
//         alert.innerHTML = "Please, Fill All The Areas";
//         alert.classList.add("alert");
//         document.querySelector(".inputs").children[currTry-1].append(alert);
//     } else {
//         lastInputs.length = 0;
//         inputs.forEach((input , index) => {
//             let currLetter = input.value.toLocaleLowerCase();
//             lastInputs.push(input.value.toLocaleLowerCase());
//             if (currLetter === currName[index]) {
//                 input.classList.add("correct-right-place");
//                 correctLetters.add(currLetter);
//                 sessionStorage.setItem(input.id, JSON.stringify({"value": input.value, "class": input.classList.value}));
//             } else if (currName.includes(currLetter)) {
//                 input.classList.add("correct-wrong-place");
//                 correctLetters.add(currLetter);
//                 sessionStorage.setItem(input.id, JSON.stringify({"value": input.value, "class": input.classList.value}));
//                 succesGuess = false;
//             } else {
//                 input.classList.add("wrong");
//                 sessionStorage.setItem(input.id, JSON.stringify({"value": input.value, "class": input.classList.value}));
//                 succesGuess = false;
//             }
//         });
//         sessionStorage.setItem("last_inputs_added", lastInputs.toString());
//         sessionStorage.setItem("correct_letters_added", [...correctLetters].toString());
//     }
//     if (succesGuess && allFilled) {
//         inputs.forEach((input) => input.disabled = true);
//         const succesWindow = document.createElement("div");
//         succesWindow.classList.add("window");
//         succesWindow.classList.add("succesWindow");
//         succesWindow.innerHTML = `
//         <div class="successMessage">
//                 <p>Congrats, You Guessed The Name Right</p>
//                 <i class="congrats fa-solid fa-cake-candles"></i>
//                 </div>
//                 <button class="nextGuess">Next Guess <i class="fa-solid fa-circle-chevron-right"></i></button>
//                 `;
//         document.body.prepend(succesWindow);
//         setTimeout(() => succesWindow.style.top = "9%", 10);
//         // start the next guess
//         document.querySelector(".nextGuess").addEventListener("click", () => location.reload());
        
        
//     } else if (currTry <= tryTimes && allFilled) {
//         inputs.forEach((input) => input.disabled = true);
//         if (currTry < tryTimes) {
//             currTry++;
//             inputs = document.querySelectorAll(`.try-${currTry} input`);
//             inputs.forEach((input) => input.disabled = false);
//             document.querySelector(`.try-${currTry}`).classList.remove("disabled");
//             Array.from(inputs)[0].focus();
//             inputTraverssing();
//         }
        
//     }
// }

// function handeleHints () {
//     // hide the previous hint if there is 
//     const prevhint = document.querySelector(".hintWindow");
//     if (prevhint) {
//         prevhint.style.top = "-100%";
//         setTimeout( () => prevhint.remove(), 100);
//     }

//     let hintWindow = document.createElement("div");
//     hintWindow.classList.add("window");
//     hintWindow.classList.add("hintWindow");
//     if (hintsNums > 0) {

//         const hint_letter = get_random_hint_letter(currName);
//         hintWindow.innerHTML = `
//             <p class="description">The Name Contains the Letter ${hint_letter}</p>
//             <i class="close fa-solid fa-circle-xmark"></i>
//         `;
//         hintsNums--;
//         sessionStorage.setItem("number_of_hints_left", hintsNums);
//         span.innerHTML = hintsNums;
//     } else {
//         hintWindow.innerHTML = `
//             <p class="description">Congrats, You Have Wasted All Of Your Hints ^.^</p>
//             <i class="close fa-solid fa-circle-xmark"></i>
//         `;
//     }
//     document.body.prepend(hintWindow);
//     setTimeout(() => hintWindow.style.top = "9%", 100);

//     // closing the "hint" window
//     document.addEventListener("click", function (event) {
//         if (![...event.target.classList].includes("hint") && ![...event.target.classList].includes("hintWindow") && ![...event.target.classList].includes("description")) {
//             hintWindow.style.top = "-10%";
//             setTimeout( () => hintWindow.remove(), 100);
//         }
//     });
// }
// // getting a random hint letter
// function get_random_hint_letter (name) {
//     let randomIndex = Math.floor(Math.random() * name.length);
//     let correct_letters_added = [...correctLetters];
//     // showing the letter with its position if user guessed all letters but wrongly placed
//     if (name.length === correct_letters_added.length) {
//         if (correct_letters_added.toString() != [...name].toString()) {
//             correct_letters_added = [...name];
//             correctLetters = new Set(correct_letters_added);
//             sessionStorage.setItem("correct_letters_added", correct_letters_added.toString());
//         }
//         let hintLetter = "";
//         [...name].forEach(function loop(element, index) {
//             if (loop.stop) return;
//             if (element !== correct_letters_added[index] || element !== lastInputs[index]) {
//                 // stopping the iteration whenever the first wrongly placed letter in
//                 loop.stop = true;
//                 hintLetter = `"${name[index].toUpperCase()}" in position ${index+1}`;
//             }
//         })
//         return hintLetter;
//     }
//     // Prevent a previously guessed hint from appearing by
//     if (correct_letters_added.includes(name[randomIndex])) {
//         return get_random_hint_letter(name);
//     }
//     else {
//         correctLetters.clear();
//         [...name].forEach((element, index) => {
//             if (correct_letters_added.includes(element)) correctLetters.add(element);
//             else if (element === name[randomIndex]) correctLetters.add(name[randomIndex]);
//         })
//         correct_letters_added = [...correctLetters];
//         sessionStorage.setItem("correct_letters_added", correct_letters_added.toString());
//         return `"${name[randomIndex].toUpperCase()}"`;
//     } 
// }

// window.onload = function () {
//     inputGen();
//     filling_Inputs_with_sessionStorage();
//     document.querySelector(".inputs").children[0].children[0].children[currTry].focus();
//     const disabledInputs = document.querySelectorAll(`:not(.try-${currTry}) > input`);
//     disabledInputs.forEach((input) => (input.disabled = true));
    

// }


// sessionStorage.clear();

