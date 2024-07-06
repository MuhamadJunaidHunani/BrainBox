const questionsData = JSON.parse(localStorage.getItem("questionsDataStorage")) || [
    {
        question: "What is the capital of France?",
        options: ["A. Berlin", "B. Madrid", "C. Paris", "D. Rome"],
        correct: "C"
    },
    {
        question: "Which planet is known as the Red Planet?",
        options: ["A. Earth", "B. Mars", "C. Jupiter", "D. Venus"],
        correct: "B"
    },
    {
        question: "What is the largest ocean on Earth?",
        options: ["A. Atlantic Ocean", "B. Indian Ocean", "C. Arctic Ocean", "D. Pacific Ocean"],
        correct: "D"
    },
    {
        question: "Who wrote 'Kidnaped'?",
        options: ["A. Charles Dickens", "B. William Shakespeare", "C. Mark Twain", "D. Jane Austen"],
        correct: "B"
    },
    {
        question: "What is the smallest prime number?",
        options: ["A. 0", "B. 1", "C. 2", "D. 3"],
        correct: "C"
    }
];
localStorage.setItem("questionsDataStorage", JSON.stringify(questionsData));


let usedQuestions = [];
const question = document.querySelector(".question");
const optiontext = document.querySelectorAll(".optionText");
const submitButton = document.querySelector(".submitButton");
const progressBar = document.querySelector(".progressBar");
const quizBody = document.querySelector(".quizBody");
const quizContainer = document.querySelector(".quizContainer");
let wrongImg = document.querySelector(".wrongImg");
let rightImg = document.querySelector(".rightImg");
const openIcon = document.querySelector(".openIcon");
const adminContainer = document.querySelector(".adminContainer");
const closebtn = document.querySelector(".closebtn");
const passwordSubmitBtn = document.querySelector(".passwordSubmitBtn");
const AddQuizBtn = document.querySelector(".AddQuiz");

let progressBarwidth = 0;
let score = 0;

window.onload = quesFunc();
submitButton.addEventListener("click", handleEventOnSubmit);

function handleEventOnSubmit() {
    if (usedQuestions.length <= questionsData.length + 1) {
        if (submitFunc() !== false) {
            quesFunc();
        }
    }
}

function getRandomQuestion() {
    if (usedQuestions.length === questionsData.length) {
        return null;
    }

    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * questionsData.length);
    } while (usedQuestions.includes(randomIndex));

    usedQuestions.push(randomIndex);
    return randomIndex;
}


function quesFunc() {
    let questionIndex = getRandomQuestion()
    if (questionIndex === null) {
        return;
    }
    question.innerHTML = `${usedQuestions.length}. ${questionsData[questionIndex]?.question}`
    optiontext.forEach((item, index) => {
        item.innerHTML = questionsData[questionIndex]?.options[index];
    });
};

function submitFunc() {
    const selectedOption = document.querySelector('.radioInput[name="option"]:checked');

    if (selectedOption) {
        if (selectedOption.value === questionsData[usedQuestions[usedQuestions.length - 1]].correct) {
            score++;
            rightImg.style.opacity = 1;
            setTimeout(() => {
                rightImg.style.opacity = 0;
            }, 1000);
        }
        else {
            wrongImg.style.opacity = 1;
            setTimeout(() => {
                wrongImg.style.opacity = 0;
            }, 1000);
        }
        progressBarwidth += 100 / questionsData.length
        progressBar.style.width = `${progressBarwidth}%`
        progressBar.innerHTML = `${Math.floor(progressBarwidth)}%`
        selectedOption.checked = false;
        if (usedQuestions.length === questionsData.length) {
            quizBody.style.display = "none";
            let result =Math.floor((score / questionsData.length) * 100)
            quizContainer.innerHTML += `<div class="resultContainer">${result}%</div>`
            rightImg.style.opacity = "1";
            wrongImg.style.opacity = "0";
            if (result < 70) {
                document.querySelector(".resultContainer").style.borderColor = "red";
                wrongImg.style.opacity = "1";
                rightImg.style.opacity = "0";
            }
        }
    } else {
        return false;
    }

}
openIcon.addEventListener("click", () => {
    adminContainer.style.width = 100 + "%"
})
closebtn.addEventListener("click", () => {
    adminContainer.style.width = 0 + "%";
})

passwordSubmitBtn.addEventListener("click", () => {
    let password = document.querySelector(".passwordInput").value;
    if (password === "123456") {
        document.querySelector(".passwordFieldConatiner").style.display = "none"
        document.querySelector(".quizchangeform").style.display = "block"
    }
    else {
        document.querySelector(".passwordInput").value = "";
        document.querySelector(".passwordInput").style.borderColor = "red"
    }
})


AddQuizBtn.addEventListener("click", () => {
    const question = document.querySelector('.addquesField').value;
    const optionA = document.querySelector('.addOptionA').value;
    const optionB = document.querySelector('.addOptionB').value;
    const optionC = document.querySelector('.addOptionC').value;
    const optionD = document.querySelector('.addOptionD').value;
    const correctOption = document.querySelector('.addCorrectOption').value.toUpperCase();

    if (question && optionA && optionB && optionC && optionD && (correctOption === "A" || correctOption === "B" || correctOption === "C" || correctOption === "D")) {
        const newQuestion = {
            question: question,
            options: [`A. ${optionA}`, `B. ${optionB}`, `C. ${optionC}`, `D. ${optionD}`],
            correct: correctOption
        };

        questionsData.push(newQuestion);
        localStorage.setItem("questionsDataStorage", JSON.stringify(questionsData));

        document.querySelector('.addquesField').value = '';
        document.querySelector('.addOptionA').value = '';
        document.querySelector('.addOptionB').value = '';
        document.querySelector('.addOptionC').value = '';
        document.querySelector('.addOptionD').value = '';
        document.querySelector('.addCorrectOption').value = '';
    } else {
        alert('Please fill in all fields.');
    }

})
