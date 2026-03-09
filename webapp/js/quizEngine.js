let questions = [];
let currentQuestionIndex = 0;
let selectedAnswer = null;
let score = 0;

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

  if(selectedAnswer === null){
    alert("Please select an answer before continuing.");
    return;
  }

  const question = questions[currentQuestionIndex];

  // Update question counter
document.getElementById("question-counter").innerText =
  `Question ${currentQuestionIndex + 1} of ${questions.length}`;

// Update progress bar
const progressPercent =
  ((currentQuestionIndex) / questions.length) * 100;

document.getElementById("progress").style.width =
  progressPercent + "%";

  if(selectedAnswer === question.correctAnswer){
  score++;
  alert("Correct!\n\n" + question.explanation);
} else {
  alert("Incorrect.\n\n" + question.explanation);
}

  currentQuestionIndex++;

  if(currentQuestionIndex < questions.length){
  showQuestion();
} else {
  showResults();
}

}

loadQuestions();

function showResults() {

  const container = document.getElementById("quiz-container");

  const percentage = Math.round((score / questions.length) * 100);

  container.innerHTML = `
    <h2>Quiz Complete</h2>

    <p>You scored ${score} out of ${questions.length}</p>

    <h3>${percentage}%</h3>

    <button onclick="location.reload()">Retake Quiz</button>
  `;
}
