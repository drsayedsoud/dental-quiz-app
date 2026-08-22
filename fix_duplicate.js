const fs = require('fs');

const quizPath = 'src/app/quiz/page.tsx';
let quizCode = fs.readFileSync(quizPath, 'utf8');

// The file has two handleNext declarations.
// The FIRST one is the one I injected (around line 80).
// The SECOND one is the original one (around line 134).
// I will remove the second one.

const lines = quizCode.split('\n');
let firstIndex = -1;
let secondIndex = -1;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('const handleNext = useCallback(() => {')) {
    if (firstIndex === -1) {
      firstIndex = i;
    } else {
      secondIndex = i;
      break;
    }
  }
}

if (secondIndex !== -1) {
  // Find the end of the second handleNext
  let endIndex = -1;
  let bracketCount = 0;
  for (let i = secondIndex; i < lines.length; i++) {
    if (lines[i].includes('{')) bracketCount += (lines[i].match(/{/g) || []).length;
    if (lines[i].includes('}')) bracketCount -= (lines[i].match(/}/g) || []).length;
    
    if (bracketCount === 0 && lines[i].includes('}, [') && lines[i].includes(']);')) {
        endIndex = i;
        break;
    }
  }
  
  if (endIndex !== -1) {
    lines.splice(secondIndex, endIndex - secondIndex + 1);
    fs.writeFileSync(quizPath, lines.join('\n'), 'utf8');
    console.log("Removed duplicate handleNext.");
  } else {
    console.log("Could not find end of second handleNext.");
  }
} else {
  console.log("Second handleNext not found.");
}
