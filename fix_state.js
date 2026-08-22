const fs = require('fs');
const quizPath = 'src/app/quiz/page.tsx';
let quizCode = fs.readFileSync(quizPath, 'utf8');

const correctHandleNext = `const handleNext = useCallback(() => {
    if (currentIndex >= questions.length - 1) {
      if (user) {
        import('@/lib/firestore').then(({ saveQuizSession }) => {
          saveQuizSession(user.uid, {
            subject,
            score,
            attempted: attempted + 1,
            lastQuestionIndex: currentIndex,
            section: (section as 'dental' | 'quran')
          }).catch(console.error);
        });
      }
      router.push(\`/result?score=\${score}&attempted=\${attempted+1}&subject=\${subject||""}&section=\${section||""}\`);
    } else {
      setCurrentIndex(prev => prev + 1);
      setAnswered(false);
      setSelectedAnswer(null);
      setTimeout(() => setTimeLeft(30), 0);
      setShowExplanation(false);
    }
  }, [currentIndex, questions.length, score, attempted, subject, section, router, user]);`;

// Replace the bad handleNext block
quizCode = quizCode.replace(/const handleNext = useCallback\(\(\) => \{[\s\S]*?\}, \[.*?\]\);/, correctHandleNext);

// Let's also remove the .next cache to ensure a completely clean local test
fs.writeFileSync(quizPath, quizCode, 'utf8');
