if (Array.isArray(data)) {
  questions = data;
}
else if (data.questions) {
  questions = data.questions;
}
else if (data.data?.questions) {
  questions = data.data.questions;
}
else if (data.emigs_questions) {
  questions = data.emigs_questions;
}
else {
  console.error("Unsupported question format", data);
}
  else {
    console.error("Unsupported question format");
    return;
  }

  // RANDOMIZE QUESTION ORDER
  shuffleArray(questions);

  showQuestion();
}

function showQuestion() {

  selectedAnswer = null;

  const question = questions[currentQuestionIndex];

  // Update question counter
  document.getElementById("question-counter").innerText =
    `Question ${currentQuestionIndex + 1} of ${questions.length}`;

  // Update progress bar
  const progressPercent =
    (currentQuestionIndex / questions.length) * 100;

  document.getElementById("progress").style.width =
    progressPercent + "%";

  // Support both "question" and "text"
  const questionText = question.question || question.text;

  document.getElementById("question").innerText = questionText;

  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";

  // Support both formats
  const options = question.options || question.answerOptions;

  options.forEach(option => {

    const button = document.createElement("button");

    const optionText = option.text || option;

    button.innerText = optionText;

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

  let resultMessage = "";

  // Support both answer formats
  const isCorrect =
    selectedAnswer.isCorrect ||
    selectedAnswer === question.correctAnswer;

  if(isCorrect){
    score++;
    resultMessage = "Correct!";
  } else {
    resultMessage = "Incorrect.";
  }

  showExplanation(question, resultMessage);
}

loadQuestions();

function showExplanation(question, resultMessage) {

  const container = document.getElementById("quiz-container");

  container.innerHTML = `
    <h2>${resultMessage}</h2>

    <p><strong>Explanation:</strong></p>

    <p>${question.explanation || "Explanation coming soon."}</p>

    <button id="continue">Continue</button>
  `;

  document.getElementById("continue").onclick = () => {

    currentQuestionIndex++;

    if(currentQuestionIndex < questions.length){
      showQuestion();
    } else {
      showResults();
    }

  };
}

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
