let questions = [];
let currentQuestionIndex = 0;
let selectedAnswer = null;
let score = 0;

// Shuffle question order
function shuffleArray(array){
  for(let i = array.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

async function loadQuestions(){

  const params = new URLSearchParams(window.location.search);
  const file = params.get("file") || "questions.json";

  const response = await fetch(`data/${file}`);
  const data = await response.json();

  if(Array.isArray(data) && data[0]?.questions){
    questions = data[0].questions;
  }
  else if(Array.isArray(data)){
    questions = data;
  }
  else if(data.questions){
    questions = data.questions;
  }
  else if(data.data?.questions){
    questions = data.data.questions;
  }
  else if(data.emigs_questions){
    questions = data.emigs_questions;
  }
  else{
    console.error("Unsupported question format", data);
    return;
  }

  shuffleArray(questions);

  currentQuestionIndex = 0;

  showQuestion();
}

function showQuestion(){

  if(!questions || questions.length === 0){
    console.error("No questions loaded");
    return;
  }

  selectedAnswer = null;

  const question = questions[currentQuestionIndex];

  document.getElementById("question-counter").innerText =
    `Question ${currentQuestionIndex + 1} of ${questions.length}`;

  const questionText = question.question || question.text;

  document.getElementById("question").innerText = questionText;

  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";

  const options = question.options || question.answerOptions;

  options.forEach(option => {

    const button = document.createElement("button");

    const optionText = option.text || option;

    button.innerText = optionText;

    button.classList.add("answer-button");

    button.onclick = () => {

      selectedAnswer = option;

      document.querySelectorAll(".answer-button").forEach(btn => {
        btn.classList.remove("selected");
      });

      button.classList.add("selected");
    };

    optionsDiv.appendChild(button);
  });
}

document.addEventListener("DOMContentLoaded", () => {

  document.getElementById("submit").onclick = submitAnswer;

  loadQuestions();
});

function submitAnswer(){

  if(selectedAnswer === null){
    alert("Please select an answer before submitting.");
    return;
  }

  const question = questions[currentQuestionIndex];

  const isCorrect =
    selectedAnswer.isCorrect ||
    selectedAnswer === question.correctAnswer;

  if(isCorrect){
    score++;
  }

  showFeedback(question, isCorrect);
}

function showFeedback(question, isCorrect){

  const quizCard = document.getElementById("quiz-card");
  const feedbackCard = document.getElementById("feedback-card");

  quizCard.style.display = "none";
  feedbackCard.style.display = "block";

  const options = question.options || question.answerOptions;

  const correctOption =
    options.find(o => o.isCorrect) || question.correctAnswer;

  const iconClass = isCorrect ? "correct" : "incorrect";

  feedbackCard.innerHTML = `

    <div class="correct-icon ${iconClass}"></div>

    <div id="question-counter">
      Question ${currentQuestionIndex+1} of ${questions.length}
    </div>

    <p><strong>Your Answer</strong></p>
    <p>${selectedAnswer.text || selectedAnswer}</p>

    ${!isCorrect ? `
      <p><strong>Correct Answer</strong></p>
      <p>${correctOption.text || correctOption}</p>
    ` : ``}

    <p><strong>Explanation</strong></p>
    <p>${question.explanation || "Explanation coming soon."}</p>

    <button id="next-question">Next Question</button>
  `;

  document.getElementById("next-question").onclick = () => {

    currentQuestionIndex++;

    if(currentQuestionIndex < questions.length){

      quizCard.style.display = "block";
      feedbackCard.style.display = "none";

      showQuestion();

    } else {

      showResults();
    }
  };
}

function showResults(){

  const feedbackCard = document.getElementById("feedback-card");

  const percentage = Math.round((score / questions.length) * 100);

  feedbackCard.innerHTML = `
    <h2>Quiz Complete</h2>
    <p>You scored ${score} out of ${questions.length}</p>
    <h3>${percentage}%</h3>
    <button onclick="location.reload()">Retake Quiz</button>
  `;
}
