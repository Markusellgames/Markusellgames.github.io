const year = document.getElementById("year");
if (year) {
  year.textContent = new Date().getFullYear();
}

const wordField = document.getElementById("word-field-inner");
const backgroundWord = "mrksll";
const backgroundFontSize = 70;
const wordGap = 72;
const rowGap = 64;
let resizeTimer;

function renderWordField() {
  if (!wordField) return;

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (context) context.font = `700 ${backgroundFontSize}px system-ui`;
  const wordWidth = context ? context.measureText(backgroundWord).width : 200;
  const wordPitch = Math.ceil(wordWidth + wordGap);
  const coverage = Math.ceil(Math.hypot(window.innerWidth, window.innerHeight) * 1.8);
  const wordsPerRow = Math.ceil(coverage / wordPitch) + 3;
  const rowCount = Math.ceil(coverage / (backgroundFontSize + rowGap)) + 3;

  wordField.style.setProperty("--word-pitch", `${wordPitch}px`);
  wordField.replaceChildren();

  const fragment = document.createDocumentFragment();
  for (let rowIndex = 0; rowIndex < rowCount; rowIndex += 1) {
    const row = document.createElement("div");
    row.className = "word-field-row";
    for (let wordIndex = 0; wordIndex < wordsPerRow; wordIndex += 1) {
      const word = document.createElement("span");
      word.className = "word-field-label";
      word.textContent = backgroundWord;
      row.append(word);
    }
    fragment.append(row);
  }
  wordField.append(fragment);
}

renderWordField();
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(renderWordField, 180);
});

