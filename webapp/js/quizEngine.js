let questions = [];
let currentQuestionIndex = 0;
let selectedAnswer = null;

async function loadQuestions() {
  const response = await fetch("data/questions.json");
  const data = await response.json();

  questions = data.questions;

  showQuestion();
}

function showQuestion() {

  selectedAnswer = null;

  const question = questions[currentQuestionIndex];

  document.getElementById("question").innerText = question.question;

  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";

  question.options.forEach(option => {

    const button = document.createElement("button");

    button.innerText = option;

    button.onclick = () => selectAnswer(option);

    optionsDiv.appendChild(button);

  });

}

function selectAnswer(option) {
  selectedAnswer = option;
}

document.getElementById("next").onclick = () => {

  const question = questions[currentQuestionIndex];

  if(selectedAnswer === question.correctAnswer){
    alert("Correct!");
  } else {
    alert("Incorrect.");
  }

  currentQuestionIndex++;

  if(currentQuestionIndex < questions.length){
    showQuestion();
  } else {
    alert("Quiz complete!");
  }

}

loadQuestions();
