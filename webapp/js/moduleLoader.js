async function loadModules() {

  const response = await fetch("data/quiz-index.json");
  const data = await response.json();

  const container = document.getElementById("module-list");

  data.files.forEach(file => {

    const card = document.createElement("a");

    card.href = `quiz.html?file=${file}`;
    card.className = "portal-card";

    const title = file
      .replace(".json", "")
      .replace(/-/g, " ");

    card.innerHTML = `
      <h3>${title}</h3>
      <p>Start quiz</p>
    `;

    container.appendChild(card);

  });

}

loadModules();
