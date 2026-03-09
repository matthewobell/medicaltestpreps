async function loadModules(type) {

  const response = await fetch("data/quiz-index.json");
  const data = await response.json();

  const container = document.getElementById("module-list");

  container.innerHTML = "";

  data.files
    .filter(file => file.startsWith(type))
    .filter(file => file.endsWith(".json"))
    .forEach(file => {

      const card = document.createElement("a");

      card.href = `quiz.html?file=${file}`;
      card.className = "portal-card";

      const title = formatModuleTitle(file);

      card.innerHTML = `
        <h3>${title}</h3>
        <p>Start quiz</p>
      `;

      container.appendChild(card);

    });

}

function formatModuleTitle(file) {

  let name = file.replace(".json", "");

  const isEMIGS = name.startsWith("emigs");
  const isFLS = name.startsWith("fls");

  name = name.replace("emigs-", "").replace("fls-", "");

  const words = name.split("-");

  const formatted = words.map(word => {

    if(word === "module") return "Module";

    if(word === "part") return "– Part";

    if(word === "final") return "Final";

    if(word === "assessment") return "Assessment";

    return word.charAt(0).toUpperCase() + word.slice(1);

  }).join(" ");

  if(isEMIGS) return "EMIGS " + formatted;
  if(isFLS) return "FLS " + formatted;

  return formatted;

}
