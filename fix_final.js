const fs = require('fs');

// Fix Quiz Page
const quizPath = 'src/app/quiz/page.tsx';
let quizCode = fs.readFileSync(quizPath, 'utf8');
quizCode = quizCode.replace(/router\.push\(\/result\?score=&attempted=&subject=&section=\);/, 'router.push(`/result?score=${score}&attempted=${attempted+1}&subject=${subject||""}&section=${section||""}`);');
fs.writeFileSync(quizPath, quizCode, 'utf8');

// Fix Globals CSS
const cssPath = 'src/app/globals.css';
let cssCode = fs.readFileSync(cssPath, 'utf8');
// I will just reset the CSS to what it should be
const correctCss = `@import "tailwindcss";

@layer base {
  :root {
    --background: #0a0a0a;
    --foreground: #ededed;
    --card: #141414;
    --card-hover: #1a1a1a;
    --border: #262626;
    --primary: #06b6d4;
    --primary-hover: #0891b2;
    --success: #22c55e;
    --danger: #ef4444;
    --warning: #f59e0b;
    --gold: #fbbf24;
  }

  * {
    -webkit-tap-highlight-color: transparent;
  }

  html, body {
    overflow-x: hidden;
    width: 100%;
    scroll-behavior: smooth;
    background: var(--background);
    color: var(--foreground);
    font-family: 'Cairo', sans-serif;
    -webkit-font-smoothing: antialiased;
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 6px;
  }
  ::-webkit-scrollbar-track {
    background: var(--background);
  }
  ::-webkit-scrollbar-thumb {
    background: var(--border);
    border-radius: 3px;
  }
}

@layer utilities {
  .glass {
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.08);
  }

  .glass-hover:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  .text-gradient {
    background: linear-gradient(135deg, #06b6d4, #3b82f6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .glow {
    box-shadow: 0 0 20px rgba(6, 182, 212, 0.3);
  }

  .glow-gold {
    box-shadow: 0 0 20px rgba(251, 191, 36, 0.3);
  }
}`;
fs.writeFileSync(cssPath, correctCss, 'utf8');

console.log("Fixes applied safely.");
