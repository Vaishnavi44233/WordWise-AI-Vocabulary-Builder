const wordInput = document.querySelector("#wordInput");
const searchBtn = document.querySelector("#searchBtn");
const resultBox = document.querySelector("#resultBox");
const wordTitle = document.querySelector("#wordTitle");
const wordMeaning = document.querySelector("#wordMeaning");
const wordExample = document.querySelector("#wordExample");

const wordSynonyms = document.querySelector("#wordSynonyms");
const wordAntonyms = document.querySelector("#wordAntonyms");

const saveBtn = document.querySelector("#saveBtn");
// const savedWords = document.querySelector("#savedWords");
const wordList = document.querySelector("#wordList");

const loading = document.querySelector("#loading");

const quizBox = document.querySelector("#quizBox");
const quizQuestion = document.querySelector("#quizQuestion");
const quizAnswer = document.querySelector("#quizAnswer");
const checkQuiz = document.querySelector("#checkQuiz");
const quizResult = document.querySelector("#quizResult");

// Gemini Key
const ApiKey = "AIzaSyA0er_L0Rk05txLVjF26go904AqlQDJxL4";
const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${ApiKey}`;

async function getWordDetails(word) {
  loading.classList.remove("hidden");
  resultBox.classList.remove("hidden");
  quizBox.classList.remove("hidden");

  const prompt = `
Explain the English word "${word}" with:
1. Meaning
2. Example sentence
3. 3 synonyms
4. 3 antonyms
5. A simple fill-in-the-blank quiz

Return ONLY JSON with keys: meaning, example, synonyms, antonyms, quiz
`;

  try {
    let res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });
    console.log(res);

    if (!res.ok) throw new Error(Error`${res.status}`);

    const data = await res.json();
    console.log(data);

    const aiResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    console.log(aiResponse);

    if (!aiResponse) throw new Error("No Response From Gemini API");

    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("AI did not return JSON");

    const parsedData = JSON.parse(jsonMatch);
    console.log(parsedData);

    loading.classList.add("hidden");
    return parsedData;
  } catch (error) {
    alert("Error in Fetching Words...");
  }
}

searchBtn.addEventListener("click", async () => {
  const word = wordInput.value.trim();
  if (word === "") {
    alert("Please Enter a word");
    return;
  }

  const details = await getWordDetails(word);

  wordTitle.textContent = word.charAt(0).toUpperCase() + word.slice(1);
  wordMeaning.textContent = `Meaning: ${details.meaning}`;
  wordExample.textContent = `Example: ${details.example}`;
  wordSynonyms.textContent = `Synonyms: ${details.synonyms.join(", ")}`;
  wordAntonyms.textContent = `Antonyms: ${details.antonyms.join(", ")}`;

  resultBox.classList.remove("hidden");
});

let savedWords = JSON.parse(localStorage.getItem("wordBank")) || [];
displaySavedWords();

saveBtn.addEventListener("click", () => {
  const word = wordTitle.textContent;
  if (!savedWords.includes(word)) {
    savedWords.push(word);
    localStorage.setItem("wordBank", JSON.stringify(savedWords));
    displaySavedWords();
    alert("Word Saved Successfully");
  } else {
    alert("This Word is already Saved");
  }
});

function displaySavedWords() {
  wordList.innerHTML = "";
  savedWords.forEach((word) => {
    const li = document.createElement("li");
    li.textContent = word;
    wordList.appendChild(li);
  });
}

// JSON.parse() --> converts JSON String into objects
// JSON.stringify() --> conerts object to JSON String
