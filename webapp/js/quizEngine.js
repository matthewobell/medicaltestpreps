let questions = [];
let currentQuestionIndex = 0;
let selectedAnswers = [];
let userAnswers = [];
let score = 0;
let saveKey = "";

function cleanAnswerText(text){
  return (text || "").replace(/^[A-E]\)\s*/, "");
}

function shuffleArray(array){
  for(let i = array.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function getModuleTitle(){
  const params = new URLSearchParams(window.location.search);
  const file = params.get("file") || "";
  const filename = file.split("/").pop();
  const base = filename.replace(/\.json$/i, "");
  if(!base) return "Quiz";
  return base
    .replace(/[-_]/g, " ")
    .replace(/([a-z])(\d)/g, "$1 $2")
    .replace(/\b\w/g, c => c.toUpperCase());
}

// --- Save current progress to localStorage ---
function saveProgress(){
  const state = {
    questions: questions,
    currentQuestionIndex: currentQuestionIndex,
    userAnswers: userAnswers,
    score: score
  };
  localStorage.setItem(saveKey, JSON.stringify(state));
}

// --- Clear saved progress for this module ---
function clearProgress(){
  localStorage.removeItem(saveKey);
}

// --- Load saved progress from localStorage ---
function loadProgress(){
  const saved = localStorage.getItem(saveKey);
  if(!saved) return null;
  try {
    return JSON.parse(saved);
  } catch(e) {
    return null;
  }
}

// --- Show resume/start fresh prompt ---
function showResumePrompt(savedState, onResume, onFresh){
  const quizCard = document.getElementById("quiz-card");
  quizCard.style.display = "none";

  const feedbackCard = document.getElementById("feedback-card");
  feedbackCard.style.display = "block";

  const resumeOn = savedState.currentQuestionIndex + 1;
  const total = savedState.questions.length;

  feedbackCard.innerHTML =
    '<div style="text-align:center; padding: 20px 0;">' +
      '<div style="font-size:18px; font-weight:600; margin-bottom:8px;">Quiz in Progress</div>' +
      '<div style="font-size:16px; font-weight:600; margin-bottom:32px; color:#555;">Resume on question ' + resumeOn + ' of ' + total + '.</div>' +
      '<button id="resume-btn" class="primary-button">Resume</button>' +
      '<button id="fresh-btn" class="primary-button" style="margin-top:8px;">Start Fresh</button>' +
    '</div>';

  document.getElementById("resume-btn").onclick = onResume;
  document.getElementById("fresh-btn").onclick = onFresh;
}

async function loadQuestions(){
  const params = new URLSearchParams(window.location.search);
  const file = params.get("file") || "questions.json";

  // Build a unique save key per module
  const filename = file.split("/").pop().replace(/\.json$/i, "");
  saveKey = "quiz_progress_" + filename;

  const titleEl = document.getElementById("page-title");
  if(titleEl) titleEl.innerText = getModuleTitle();

  const response = await fetch(`data/${file}`);
  const data = await response.json();

  let loadedQuestions = [];

  if(Array.isArray(data) && data[0]?.questions){
    loadedQuestions = data[0].questions;
  }
  else if(Array.isArray(data)){
    loadedQuestions = data;
  }
  else if(data.questions){
    loadedQuestions = data.questions;
  }
  else if(data.data?.questions){
    loadedQuestions = data.data.questions;
  }
  else if(data.emigs_questions){
    loadedQuestions = data.emigs_questions;
  }
  else{
    console.error("Unsupported question format", data);
    return;
  }

  // Check for saved progress
  const savedState = loadProgress();

  if(savedState && savedState.currentQuestionIndex > 0 && savedState.currentQuestionIndex < savedState.questions.length){
    showResumePrompt(
      savedState,
      // Resume
      () => {
        questions = savedState.questions;
        currentQuestionIndex = savedState.currentQuestionIndex;
        userAnswers = savedState.userAnswers;
        score = savedState.score;

        const feedbackCard = document.getElementById("feedback-card");
        const quizCard = document.getElementById("quiz-card");
        feedbackCard.style.display = "none";
        quizCard.style.display = "block";

        showQuestion();
      },
      // Start fresh
      () => {
        clearProgress();
        questions = loadedQuestions;
        shuffleArray(questions);
        currentQuestionIndex = 0;
        userAnswers = [];
        score = 0;

        const feedbackCard = document.getElementById("feedback-card");
        const quizCard = document.getElementById("quiz-card");
        feedbackCard.style.display = "none";
        quizCard.style.display = "block";

        showQuestion();
      }
    );
  } else {
    // No saved state — start fresh
    clearProgress();
    questions = loadedQuestions;
    shuffleArray(questions);
    currentQuestionIndex = 0;
    userAnswers = [];
    score = 0;
    showQuestion();
  }
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

  const shuffledOptions = [...options];
  shuffleArray(shuffledOptions);

  shuffledOptions.forEach(option => {
    const button = document.createElement("button");
    const optionText = cleanAnswerText(option.text || option);
    button.innerText = optionText;
    button.classList.add("answer-button");

    button.onclick = () => {
      const optionIndex = selectedAnswers.indexOf(option);
      if(optionIndex > -1){
        selectedAnswers.splice(optionIndex, 1);
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
  const correctOptions = (question.options || question.answerOptions).filter(o => o.isCorrect);

  userAnswers[currentQuestionIndex] = [...selectedAnswers];

  const isCorrect =
    selectedAnswers.length === correctOptions.length &&
    selectedAnswers.every(sel => correctOptions.includes(sel));

if(isCorrect) score++;

  showFeedback(question, isCorrect);
}

function correctIconSVG(){
  return '<div class="feedback-icon-circle correct"><svg width="22" height="22" viewBox="0 0 20 20" fill="none"><path d="M4 10l4 4 8-8" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg></div>';
}

function incorrectIconSVG(){
  return '<div class="feedback-icon-circle incorrect"><svg width="22" height="22" viewBox="0 0 20 20" fill="none"><path d="M5 5l10 10M15 5L5 15" stroke="white" stroke-width="2.5" stroke-linecap="round"/></svg></div>';
}

function chevronDown(){
  return '<svg class="chevron-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 9l6 6 6-6" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
}

function chevronUp(){
  return '<svg class="chevron-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 15l-6-6-6 6" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
}

function showFeedback(question, isCorrect){
  const quizCard = document.getElementById("quiz-card");
  const feedbackCard = document.getElementById("feedback-card");

  quizCard.style.display = "none";
  feedbackCard.style.display = "block";

  const options = question.options || question.answerOptions;
  const correctOptions = options.filter(o => o.isCorrect);

  const correctAnswerBlock = !isCorrect
    ? '<div class="answer-header">Correct Answer</div><div class="answer-body">' + correctOptions.map(o => cleanAnswerText(o.text || o)).join("<br>") + '</div>'
    : '';

  feedbackCard.innerHTML =
    (isCorrect ? correctIconSVG() : incorrectIconSVG()) +
    '<div id="question-counter">Question ' + (currentQuestionIndex + 1) + ' of ' + questions.length + '</div>' +
    '<div class="answer-header">Your Answer</div>' +
    '<div class="answer-body">' + selectedAnswers.map(a => cleanAnswerText(a.text || a)).join("<br>") + '</div>' +
    correctAnswerBlock +
    '<div class="answer-header">Explanation</div>' +
    '<div class="answer-explanation">' + (question.explanation || "Explanation coming soon.") + '</div>' +
    '<button id="next-question">Next Question</button>';

document.getElementById("next-question").onclick = () => {
    currentQuestionIndex++;
    saveProgress();
    if(currentQuestionIndex < questions.length){
      quizCard.style.display = "block";
      feedbackCard.style.display = "none";
      showQuestion();
    } else {
      clearProgress();
      showResults();
    }
  };
}

function showResults(){
  const feedbackCard = document.getElementById("feedback-card");
  const percentage = Math.round((score / questions.length) * 100);

  feedbackCard.innerHTML =
    '<h2 class="quiz-complete-title">Quiz Complete!</h2>' +
    '<div class="score-ring"><svg width="160" height="160" viewBox="0 0 160 160"><circle class="ring-track" cx="80" cy="80" r="70"/><circle class="ring-progress" cx="80" cy="80" r="70"/></svg><div class="score-ring-inner"><span id="score-number">0</span>%</div></div>' +
    '<div class="score-text">Your score: ' + score + '/' + questions.length + '</div>' +
    '<button id="next-quiz" class="primary-button">Next Quiz</button>' +
    '<button id="review-answers" class="primary-button">Review Answers</button>' +
    '<div class="return-home"><a href="index.html">Return home</a></div>';

  document.getElementById("next-quiz").onclick = () => location.reload();
  document.getElementById("review-answers").onclick = () => showReviewPage();

  setTimeout(() => {
    const circle = document.querySelector(".ring-progress");
    if(circle){
      const circumference = 440;
      const offset = circumference - (percentage / 100) * circumference;
      circle.style.strokeDashoffset = offset;
    }
  }, 100);

  animateScore(percentage);
}

function showReviewPage(){
  const feedbackCard = document.getElementById("feedback-card");
  feedbackCard.classList.add("review-mode");

  const titleEl = document.getElementById("page-title");
  if(titleEl) titleEl.innerText = getModuleTitle();

  let reviewHTML = '<div class="review-container">';

  questions.forEach(function(q, index){
    const answers = userAnswers[index] || [];
    const correct = answersCorrect(q, answers);

    const iconSVG = correct
      ? '<div class="review-icon-circle correct"><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 10l4 4 8-8" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg></div>'
      : '<div class="review-icon-circle incorrect"><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 5l10 10M15 5L5 15" stroke="white" stroke-width="2.5" stroke-linecap="round"/></svg></div>';

    const answerText = answers.map(function(a){ return cleanAnswerText(a.text || a); }).join("<br>") || "No answer";

    reviewHTML +=
      '<div class="review-card">' +
        '<div class="review-top">' +
          '<div class="review-top-text">' +
            '<div class="review-counter">Question ' + (index + 1) + ' of ' + questions.length + '</div>' +
            '<div class="review-question">' + (q.question || q.text) + '</div>' +
          '</div>' +
          iconSVG +
        '</div>' +
        '<div class="review-details">' +
          '<div class="review-label">Your Answer</div>' +
          '<div class="review-answer">' + answerText + '</div>' +
          '<div class="review-label">Explanation</div>' +
          '<div class="review-explanation">' + (q.explanation || "Explanation coming soon.") + '</div>' +
        '</div>' +
        '<div class="review-arrow" onclick="toggleReview(this)">' + chevronDown() + '</div>' +
      '</div>';
  });

  reviewHTML += '</div>';
  feedbackCard.innerHTML = reviewHTML;
}

function toggleReview(arrow){
  const card = arrow.closest(".review-card");
  const details = card.querySelector(".review-details");

  if(details.style.display === "block"){
    details.style.display = "none";
    arrow.innerHTML = chevronDown();
  } else {
    details.style.display = "block";
    arrow.innerHTML = chevronUp();
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

  const counter = setInterval(() => {
    current += increment;
    if(current >= target){
      current = target;
      clearInterval(counter);
    }
    element.innerText = Math.round(current);
  }, interval);
}
