const userData = JSON.parse(localStorage.getItem("userData")) || [
    {
        email: "John@gmail.com",
        password: "123456",
        result: false,
    },
];


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
        question: "Who wrote 'Kidnapped'?",
        options: ["A. Charles Dickens", "B. William Shakespeare", "C. Mark Twain", "D. Jane Austen"],
        correct: "B"
    },
    {
        question: "What is the smallest prime number?",
        options: ["A. 0", "B. 1", "C. 2", "D. 3"],
        correct: "C"
    }
];


let currentLoggedIndex = JSON.parse(localStorage.getItem("currentLoggedIndex")) || false;

function ShowToastMsg(ToastText) {
    Toastify({
        text: ToastText,
        duration: 1400,
        destination: "https://github.com/apvarun/toastify-js",
        newWindow: true,
        close: true,
        gravity: "top",
        position: "left",
        stopOnFocus: true,
        style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
        onClick: function () { }
    }).showToast();

}

if (window.location.pathname === "/login.html") {
    document.querySelector('.loginForm').addEventListener('submit', function (event) {
        event.preventDefault();
        const email = document.querySelector('.loginEmail').value;
        const password = document.querySelector('.loginPassword').value;
        let userFound = false;

        if (email === "admin@gmail.com" && password === "123456") {
            ShowToastMsg('Admin login successful!');
            setTimeout(() => {
                window.location.pathname = '/admin.html';
            }, 1100)
            return;
        }
        for (var i = 0; i < userData.length; i++) {
            if (userData[i].email === email && userData[i].password === password) {
                userFound = true;
                currentLoggedIndex = i;
                localStorage.setItem("currentLoggedIndex", JSON.stringify(currentLoggedIndex));
            }
        }

        if (userFound) {
            ShowToastMsg('Login successful!');
            setTimeout(() => {
                window.location.pathname = '/';
            }, 1100)
        }

        else {
            ShowToastMsg('Invalid email or password!');
        }
    });
    document.querySelector(".signupSwitchLink").addEventListener("click",()=>{
        window.location.pathname = '/signup.html';
    })
    

}

if (window.location.pathname === "/signup.html") {
    document.querySelector('.SignupSubmit').addEventListener('click', function (event) {
        event.preventDefault();
        const email = document.querySelector('.signupEmail').value;
        const password = document.querySelector('.signupPassword').value;
        const confirmPassword = document.querySelector('.signupConfirmPassword').value;

        for (var j = 0; j < userData.length; j++) {
            if (userData[j].email === email && userData[j].password === password) {
                ShowToastMsg('User already exists!');
                return;
            }
        }

        if (password.length < 6) {
            ShowToastMsg('Password must be at least 6 characters long.');
            return;
        }
        else if (password !== confirmPassword) {
            ShowToastMsg('Passwords do not match.');
            return;
        } else if (!email.includes("@gmail.com")) {
            ShowToastMsg("Email is incorrect")
        } else {
            userData.push({
                email: email,
                password: password,
                result: false,
            });
            ShowToastMsg("SignUp Successfully")
            currentLoggedIndex = userData.length - 1;
            localStorage.setItem("userData", JSON.stringify(userData));
            localStorage.setItem("currentLoggedIndex", JSON.stringify(currentLoggedIndex));
            setTimeout(() => {
                window.location.pathname = '/';
            }, 1100)
        }
    });
    document.querySelector(".loginSwitchLink").addEventListener("click",()=>{
        window.location.pathname = '/login.html';
    })
}

if (window.location.pathname === "/") {
    if (!currentLoggedIndex) {
        window.location.pathname = "/signup.html";
    } else {
        const quizBody = document.querySelector(".quizBody");
        const quizContainer = document.querySelector(".quizContainer");

        if (userData[currentLoggedIndex].result) {
            quizBody.style.display = "none";
            quizContainer.innerHTML += `<div class="resultContainer">${userData[currentLoggedIndex].result}%</div>`;
            if (userData[currentLoggedIndex].result < 70) {
                document.querySelector(".resultContainer").style.borderColor = "red";
            }
        }


        const usedQuestions = [];
        const question = document.querySelector(".question");
        const optiontext = document.querySelectorAll(".optionText");
        const submitButton = document.querySelector(".submitButton");
        const progressBar = document.querySelector(".progressBar");
        const openIcon = document.querySelector(".openIcon");
        const sideBarContainer = document.querySelector(".sideBarContainer");
        const closebtn = document.querySelector(".closebtn");
        const logOutBtn = document.querySelector(".logOutBtn");
        const deleteAccBtn = document.querySelector(".deleteAcc");
        let wrongImg = document.querySelector(".wrongImg");
        let rightImg = document.querySelector(".rightImg");
        let progressBarwidth = 0;
        let score = 0;

        document.querySelector(".username").innerHTML = userData[currentLoggedIndex].email.slice(0, userData[currentLoggedIndex].email.indexOf("@"));
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
                    let result = Math.floor((score / questionsData.length) * 100)
                    quizContainer.innerHTML += `<div class="resultContainer">${result}%</div>`
                    userData[currentLoggedIndex].result = result
                    localStorage.setItem("userData", JSON.stringify(userData));
                    if (result < 70) {
                        document.querySelector(".resultContainer").style.borderColor = "red";
                    }
                }
            } else {
                return false;
            }

        }

        openIcon.addEventListener("click", () => {
            sideBarContainer.style.width = 100 + "%"
        })
        closebtn.addEventListener("click", () => {
            sideBarContainer.style.width = 0 + "%";
        })
        logOutBtn.addEventListener("click", () => {
            currentLoggedIndex = false;
            localStorage.setItem("currentLoggedIndex", JSON.stringify(currentLoggedIndex));
            window.location.pathname = "/login.html";
        })
        deleteAccBtn.addEventListener("click", () => {
            userData.splice(currentLoggedIndex, 1);
            currentLoggedIndex = false;
            localStorage.setItem("userData", JSON.stringify(userData));
            localStorage.setItem("currentLoggedIndex", JSON.stringify(currentLoggedIndex));
            window.location.pathname = "/signup.html";
        })
    }
}

if (window.location.pathname === "/admin.html") {
    function redirectTo(location) {
        window.location.pathname = location;
    }
}

if (window.location.pathname === "/addquiz.html") {
    const AddQuizBtn = document.querySelector(".addQuiz");

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
            ShowToastMsg('Quiz Added')
            questionsData.push(newQuestion);
            localStorage.setItem("questionsDataStorage", JSON.stringify(questionsData));

            document.querySelector('.addquesField').value = '';
            document.querySelector('.addOptionA').value = '';
            document.querySelector('.addOptionB').value = '';
            document.querySelector('.addOptionC').value = '';
            document.querySelector('.addOptionD').value = '';
            document.querySelector('.addCorrectOption').value = '';
        } else {
            ShowToastMsg('Please fill correctly all fields.');
        }

    })
}

if (window.location.pathname === "/editquiz.html") {
    let currentIndex = -1;

    document.addEventListener("DOMContentLoaded", () => {
        const questionsContainer = document.getElementById("questionsContainer");
        questionsData.forEach((question, index) => {
            const questionItem = document.createElement("li");
            questionItem.innerText = question.question;
            questionItem.onclick = () => editQuestion(index);
            questionsContainer.appendChild(questionItem);
        });
    });

    function editQuestion(index) {
        currentIndex = index;
        const question = questionsData[index];

        document.getElementById("questionInput").value = question.question;
        document.getElementById("optionA").value = question.options[0].slice(3);
        document.getElementById("optionB").value = question.options[1].slice(3);
        document.getElementById("optionC").value = question.options[2].slice(3);
        document.getElementById("optionD").value = question.options[3].slice(3);
        document.getElementById("correctOption").value = question.correct;

        document.getElementById("editSection").style.display = "block";
        document.querySelector(".questionsList").style.display = "none";
    }

    document.querySelector(".editQuiz").addEventListener("click", (event) => {
        event.preventDefault();
        const question = document.getElementById("questionInput").value;
        const optionA = document.getElementById("optionA").value;
        const optionB = document.getElementById("optionB").value;
        const optionC = document.getElementById("optionC").value;
        const optionD = document.getElementById("optionD").value;
        const correct = document.getElementById("correctOption").value;

        if (!question || !optionA || !optionB || !optionC || !optionD || (correct !== "A" && correct !== "B" && correct !== "C" && correct !== "D")) {
            ShowToastMsg("Please fill correctly all fields.");
            console.log("he")
            return;
        }

        questionsData[currentIndex] = {
            question: question,
            options: [`A. ${optionA}`, `B. ${optionB}`, `C. ${optionC}`, `D. ${optionD}`],
            correct: correct
        };

        localStorage.setItem("questionsDataStorage", JSON.stringify(questionsData));
        ShowToastMsg("Question Edited successfully!");
        document.getElementById("questionsContainer").children[currentIndex].innerText = question;
        document.getElementById("editSection").style.display = "none";
        document.querySelector(".questionsList").style.display = "block";
    })
}

if (window.location.pathname === "/previewquiz.html") {
    document.addEventListener("DOMContentLoaded", () => {
        const questionsContainer = document.getElementById("questionsContainer");
        questionsData.forEach((question) => {
            const questionItem = document.createElement("li");
            questionItem.innerText = question.question;
            questionsContainer.appendChild(questionItem);
        });
    });
}

if (window.location.pathname === "/removequiz.html") {

    setDeleteItem()
    function setDeleteItem() {
        const questionsContainer = document.getElementById("questionsContainer");
        questionsContainer.innerHTML = "";
        questionsData.forEach((question, index) => {
            const questionItem = document.createElement("li");
            questionItem.innerText = question.question;
            questionItem.onclick = () => removeQuestion(index);
            questionsContainer.appendChild(questionItem);
        });
    };

    function removeQuestion(index) {
        let confirmDelete = confirm("Are You Wanted To Delete This");
        if (confirmDelete) {
            questionsData.splice(index, 1);
            localStorage.setItem("questionsDataStorage", JSON.stringify(questionsData));
            setDeleteItem()
            ShowToastMsg("Question removed successfully!");
        }
    }
}