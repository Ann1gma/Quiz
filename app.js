// References DOM
const startSectionEl = document.querySelector("#startsection");
const quizSectionEl = document.querySelector("#quizsection");
const optionsDiv = document.querySelector("#optionsdiv");
const resultBtn = document.querySelector("#result-button");
const pointsDiv = document.querySelector("#pointsdiv");

// Making a copy of the original array so that whatever I do in my code won't effect the original array
const personsCopy = [...persons];

// Global variabels
let numOfQuestions;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
let currentPoints = 0;
let lastResult = null;
let lastResultTotal;
let lastNumofQuestions;


// Function shuffling persons copy-array
const shuffleArray = (array) => {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		const temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}
}





//Function for rendering the quiz
const renderingQuiz = () => {
    // Hide "start screen"
    startSectionEl.classList.add("hide");

    // Show "quiz screen" and options-div
    quizSectionEl.classList.remove("hide");
    optionsDiv.classList.remove("hide");
    document.querySelector("#points").textContent = `Points: ${currentPoints}`;

    shuffleArray(personsCopy);

    const quizArr = personsCopy.slice(0, numOfQuestions);

    quizSectionEl.innerHTML = quizArr.map((question) => {
        // randomize options for every question with only one of each option per question.
        shuffleArray(personsCopy);

        // Shuffle alternatives and remove right anwser before picking out 3 alternatives
        const alternative = personsCopy.filter(option => {
            return option.name !== question.name
        }).slice(0, 3);

        // Making sure the right anwser is among the alternatives
        alternative.push(question);

        // Shuffling all 4 alternatives so the placement of the right answer is randomized every time
        shuffleArray(alternative);

        // Asigning alternatives to variabels for use when rendering HTML
        const altOne = alternative[0];
        const altTwo = alternative[1];
        const altThree = alternative[2];
        const altFour = alternative[3];
    
        // Rendering HTML for every question/picture
        return `<div class="card">
                    <img src="${question.image}" class="card-img-top" alt="Picture of the person you're gonna guess the name of.">
                    <div class="card-body" id="${question.id}" data-id="${question.id}">
                        <h5 class="card-title">Who is this?</h5>
                        <button type="button" class="btn btn-outline-success" data-id="${altOne.id}">${altOne.name}</button>
                        <button type="button" class="btn btn-outline-danger" data-id="${altTwo.id}">${altTwo.name}</button>
                        <button type="button" class="btn btn-outline-warning" data-id="${altThree.id}">${altThree.name}</button>
                        <button type="button" class="btn btn-outline-info" data-id="${altFour.id}">${altFour.name}</button>
                    </div>
                </div>`;
    }).join(''); //Need .join('') to get rid of random "," between every question

};



// Function rendering scoreboard
const renderingScoreboard = () => {
    // Hiding quiz & start screen
    quizSectionEl.classList.add("hide");
    startSectionEl.classList.add("hide");

    // Show scoreboard
    pointsDiv.classList.remove("hide");

    // Calculating success in %
    const scoreTotal = Math.round((currentPoints / numOfQuestions) * 100);

    // Printing results on scoreboard
    document.querySelector("#points").textContent = `YOU GOT ${currentPoints}/${numOfQuestions} (${scoreTotal}%)`;

    // If there is an earlier result; print that too
    if(lastResult !== null) {
        document.querySelector("#lastresult").textContent = `Last time you got ${lastResult}/${lastNumofQuestions} (${lastResultTotal}%)`
    }

    // Saving current result for ev. next game
    lastResult = currentPoints;
    lastResultTotal = scoreTotal;
    lastNumofQuestions = numOfQuestions;

    // Reset for new game
    currentPoints = 0;
    numOfQuestions = 0;

};



// When someone clicks a button on startscreen
startSectionEl.addEventListener("click", (e) => {
    e.preventDefault();

    // I only want something to happen if target is a button
    if(e.target.tagName === "BUTTON"){

        //Checking the value of the button --> for customization of the quiz
        if(Number(e.target.innerHTML) === 10){
            numOfQuestions = Number(e.target.innerHTML);

            renderingQuiz();

        } else if (Number(e.target.innerHTML) === 20) {
            numOfQuestions = Number(e.target.innerHTML);

            renderingQuiz();

        } else if (Number(e.target.innerHTML) === 30){
            numOfQuestions = Number(e.target.innerHTML);

            renderingQuiz();

        } else {
            numOfQuestions = personsCopy.length;

            renderingQuiz();
        }
    }

});


// When clicking a button in the game
quizSectionEl.addEventListener("click", (e) => {
    e.preventDefault();

    // Making references for all buttons at current question
    const siblingElements = e.target.parentElement.querySelectorAll("button");

    // I only want something to happen if target is a button
    if(e.target.tagName === "BUTTON"){
        // Checking if guess was right or wrong
        if(e.target.dataset.id === e.target.parentElement.dataset.id) {
            // Raising value of current points
            currentPoints++

            // Adding green background color so user can se their guess was correct
            e.target.parentElement.classList.add("correct");
            

        } else {
            // Adding red background color and changeing button-style so user can se their guess was wrong
            e.target.parentElement.classList.add("wrong");
            e.target.className = "btn btn-danger";

        }

        // Disabeling the buttons after a guess been made so there's no cheating
        siblingElements.forEach((btn) =>{
            btn.setAttribute("disabled", "disabled");

            //changeing button-style so user can which one is correct
            if(btn.dataset.id === e.target.parentElement.dataset.id){
                btn.className ="btn btn-success";
            }

        });


        
    }

});



// When someone clicks result button
resultBtn.addEventListener("click", () => {
    // Calling for function rendering scoreboard
    renderingScoreboard();

    // Disabel result button to prevent user messing upp scoreboard
    resultBtn.setAttribute("disabled", "disabled");
});





// When someone clicks new game button
document.querySelector("#newgamebtn").addEventListener("click", () => {
    // Disabel result button to prevent user messing upp scoreboard
    resultBtn.removeAttribute("disabled", "disabled");

    // Making startscreen visible for user to choose number of questions (and then rendering new quiz)
    startSectionEl.classList.remove("hide");

    // Hiding the quiz pending users choice
    quizSectionEl.classList.add("hide");

    // Hiding the options div pending users choice
    optionsDiv.classList.add("hide");

    // Hiding the points pending users choice
    pointsDiv.classList.add("hide");

});




// When clicking quit button
document.querySelector("#quitbtn").addEventListener("click", () => {
    document.querySelector("main").innerHTML = `<h1>Thank you for playing!</h1>
                        <div class="d-flex justify-content-center">
                            <img src="assets/images/cat.jpg" class="img-fluid" alt="Picture of a waving cat">
                        </div>`
});





