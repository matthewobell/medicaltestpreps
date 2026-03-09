let questions = [];
let currentQuestionIndex = 0;

let selectedAnswers = [];      // answers for current question
let userAnswers = [];          // answers for entire quiz

let score = 0;

// Remove A), B), C) style prefixes
function cleanAnswerText(text){
  return (text || "").replace(/^[A-E]\)\s*/, "");
}

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

  selectedAnswers = [];

  const question = questions[currentQuestionIndex];

  document.getElementById("question-counter").innerText =
    `Question ${currentQuestionIndex + 1} of ${questions.length}`;

  const questionText = question.question || question.text;
  document.getElementById("question").innerText = questionText;

  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";

  const options = question.options || question.answerOptions;

  const correctCount = options.filter(o => o.isCorrect).length;

if(correctCount > 1){
  document.getElementById("question").innerText =
    questionText + ` (Select ${correctCount})`;
}

  options.forEach(option => {

    const button = document.createElement("button");

    const optionText = cleanAnswerText(option.text || option);

    button.innerText = optionText;
    button.classList.add("answer-button");

    button.onclick = () => {

  const optionIndex = selectedAnswers.indexOf(option);

  if(optionIndex > -1){

    // remove selection
    selectedAnswers.splice(optionIndex,1);
    button.classList.remove("selected");

  } else {

    selectedAnswers.push(option);
    button.classList.add("selected");

  }

};

    optionsDiv.appendChild(button);
  });
}

document.addEventListener("DOMContentLoaded", () => {

  document.getElementById("submit").onclick = submitAnswer;

  loadQuestions();
});

function submitAnswer(){

  if(selectedAnswers.length === 0){
    alert("Please select an answer before submitting.");
    return;
  }

  const question = questions[currentQuestionIndex];

  const correctOptions =
  (question.options || question.answerOptions)
    .filter(o => o.isCorrect);

userAnswers[currentQuestionIndex] = [...selectedAnswers];
  
const isCorrect =
  selectedAnswers.length === correctOptions.length &&
  selectedAnswers.every(sel =>
    correctOptions.includes(sel)
  );

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

  const correctOptions =
  options.filter(o => o.isCorrect);

  const iconClass = isCorrect ? "correct" : "incorrect";

  feedbackCard.innerHTML = `

    <div class="correct-icon ${iconClass}"></div>

    <div id="question-counter">
      Question ${currentQuestionIndex+1} of ${questions.length}
    </div>

    <div class="answer-header">Your Answer</div>
    <div class="answer-body">${selectedAnswers.map(a =>
  cleanAnswerText(a.text || a)
).join("<br>")}</div>

    ${!isCorrect ? `
      <div class="answer-header">Correct Answer</div>
      <div class="answer-body">
${correctOptions.map(o =>
  cleanAnswerText(o.text || o)
).join("<br>")}
</div>
    ` : ``}

    <div class="answer-header">Explanation</div>
    <div class="answer-body">${question.explanation || "Explanation coming soon."}</div>

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
    <h2 class="quiz-complete-title">Quiz Complete!</h2>

    <div class="score-ring">

<svg width="160" height="160" viewBox="0 0 160 160">

<circle
  class="ring-progress"
  cx="80"
  cy="80"
  r="70"
/>

</svg>

<div class="score-ring-inner">
<span id="score-number">0</span>%
</div>

</div>

<div class="score-text">
Your score: ${score}/${questions.length}
</div>

<button id="next-quiz" class="primary-button">
Next Quiz
</button>

<button id="review-answers" class="primary-button">
Review Answers
</button>

<div class="return-home">
<a href="index.html">Return home</a>
</div>
`;

document.getElementById("next-quiz").onclick = () => {
location.reload();
};

document.getElementById("review-answers").onclick = () => {
showReviewPage();
};


// ---- Animate ring ----

setTimeout(()=>{

const circle = document.querySelector(".ring-progress");

if(circle){

const circumference = 440;
const offset = circumference - (percentage / 100) * circumference;

circle.style.strokeDashoffset = offset;

}

},100);


// ---- Animate number ----

animateScore(percentage);

}

function showReviewPage(){

  const feedbackCard = document.getElementById("feedback-card");

  let reviewHTML = `<div class="review-container">`;

  questions.forEach((q, index) => {

    const answers = userAnswers[index] || [];

    reviewHTML += `
      <div class="review-card">

<div class="review-top">

<div>
<div class="review-counter">
Question ${index + 1} of ${questions.length}
</div>

<div class="review-question">
${q.question || q.text}
</div>
</div>

<div class="review-icon ${answersCorrect(q, answers) ? 'correct' : 'incorrect'}"></div>

</div>

<div class="review-arrow" onclick="toggleReview(this)">⌄</div>

<div class="review-details">

          <div class="review-label">Your Answer</div>
          <div class="review-answer">
          ${answers.map(a => cleanAnswerText(a.text || a)).join("<br>") || "No answer"}
          </div>

          <div class="review-label">Explanation</div>
          <div class="review-explanation">
            ${q.explanation || "Explanation coming soon."}
          </div>

        </div>

      </div>
    `;

  });

  reviewHTML += `</div>`;

  feedbackCard.innerHTML = reviewHTML;

}

function toggleReview(arrow){

const card = arrow.closest(".review-card");
const details = card.querySelector(".review-details");

if(details.style.display === "block"){
details.style.display = "none";
arrow.innerHTML = "⌄";
}
else{
details.style.display = "block";
arrow.innerHTML = "⌃";
}

}

function answersCorrect(question, answers){

  const options = question.options || question.answerOptions;

  const correctOptions = options.filter(o => o.isCorrect);

  return (
    answers.length === correctOptions.length &&
    answers.every(a => correctOptions.includes(a))
  );

}

function animateScore(target){

const element = document.getElementById("score-number");

if(!element) return;

let current = 0;

const duration = 1200;
const steps = 40;

const increment = target / steps;
const interval = duration / steps;

const counter = setInterval(()=>{

current += increment;

if(current >= target){
current = target;
clearInterval(counter);
}

element.innerText = Math.round(current);

}, interval);

}
