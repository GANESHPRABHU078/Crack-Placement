import React, { useState, useEffect } from 'react';
import { aptitudeService } from '../api/aptitudeService';
import { Timer, CheckCircle, XCircle, ChevronRight, RefreshCcw } from 'lucide-react';

const Aptitude = () => {
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState({ correct: 0, wrong: 0 });
  const [loading, setLoading] = useState(true);
  const [quizStarted, setQuizStarted] = useState(false);

  useEffect(() => {
    if (quizStarted) {
      fetchQuestions();
    }
  }, [quizStarted]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const data = await aptitudeService.getQuiz();
      if (!data || data.length === 0) throw new Error('Empty quiz data');
      setQuestions(data);
    } catch (err) {
      console.warn('Backend unavailable, using mock aptitude questions.', err);
      // Fallback to offline mock data
      setQuestions([
        {
          category: 'Quantitative',
          question: 'A train 125 m long passes a man, running at 5 km/hr in the same direction in which the train is going, in 10 seconds. The speed of the train is:',
          options: ['45 km/hr', '50 km/hr', '54 km/hr', '55 km/hr'],
          correctAnswer: 1,
          explanation: 'Relative speed = 125/10 m/sec = 12.5 m/sec = (12.5 x 18/5) km/hr = 45 km/hr. Therefore, train speed = (45 + 5) km/hr = 50 km/hr.'
        },
        {
          category: 'Logical Reasoning',
          question: 'Look at this series: 2, 1, (1/2), (1/4), ... What number should come next?',
          options: ['(1/3)', '(1/8)', '(2/8)', '(1/16)'],
          correctAnswer: 1,
          explanation: 'This is a simple alternating division sequence: each number is one-half of the previous number.'
        },
        {
          category: 'Computer Science',
          question: 'Which of the following sorting algorithms has the best worst-case time complexity?',
          options: ['Quick Sort', 'Merge Sort', 'Bubble Sort', 'Insertion Sort'],
          correctAnswer: 1,
          explanation: 'Merge Sort has a worst-case time complexity of O(N log N), while Quick Sort can degrade to O(N^2).'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (idx) => {
    if (selectedOpt !== null) return;
    setSelectedOpt(idx);
    if (idx === questions[currentIdx].correctAnswer) {
      setScore({ ...score, correct: score.correct + 1 });
    } else {
      setScore({ ...score, wrong: score.wrong + 1 });
    }
  };

  const nextQuestion = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setSelectedOpt(null);
    } else {
      setShowResult(true);
    }
  };

  const topics = [
    { id: 'quant', title: 'Quantitative Aptitude', desc: 'Number systems, Algebra, Geometry, Arithmetic', icon: '➗', color: 'var(--orange-d)' },
    { id: 'logical', title: 'Logical Reasoning', desc: 'Puzzles, Blood relations, Syllogisms, Sequences', icon: '🧠', color: 'var(--p-d)' },
    { id: 'verbal', title: 'Verbal Ability', desc: 'Reading comprehension, Grammar, Vocabulary', icon: '📝', color: 'var(--easy-d)' },
    { id: 'data', title: 'Data Interpretation', desc: 'Bar graphs, Pie charts, Tabular data analysis', icon: '📊', color: 'var(--blue-d)' },
    { id: 'core', title: 'Core CS Subjects', desc: 'Operating Systems, DBMS, Computer Networks', icon: '💻', color: 'var(--bg4)' },
    { id: 'company', title: 'Company Specific', desc: 'TCS NQT, Infosys, Wipro, Cognizant mock tests', icon: '🏢', color: 'var(--b2)' }
  ];

  if (!quizStarted) {
    return (
      <div className="app-page on" style={{ padding: '0', display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: '1100px', padding: '32px 24px' }}>

          <div className="section-hdr mb32">
            <div>
              <h1 className="section-title">Aptitude & Logic Mastery</h1>
              <p className="section-sub text-lg mt-2">Targeted timed quizzes for FAANG and top startup placement rounds.</p>
            </div>
          </div>

          <h2 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--t1)', marginBottom: '16px' }}>Select a Topic to Begin</h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
            {topics.map(topic => (
              <div
                key={topic.id}
                className="card glass-panel"
                style={{ padding: '24px', cursor: 'pointer', transition: 'transform 0.2s, border-color 0.2s', border: '1px solid var(--b1)' }}
                onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'var(--t2)'; }}
                onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--b1)'; }}
                onClick={() => setQuizStarted(true)}
              >
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: topic.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' }}>
                    {topic.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--t1)', marginBottom: '4px' }}>{topic.title}</h3>
                    <p style={{ fontSize: '13px', color: 'var(--t3)', lineHeight: '1.4' }}>{topic.desc}</p>
                  </div>
                  <ChevronRight size={20} color="var(--t3)" />
                </div>
              </div>
            ))}
          </div>

          <div className="card glass-panel mt32" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--t1)', marginBottom: '4px' }}>Full Length Mock Test</h3>
              <p style={{ fontSize: '13px', color: 'var(--t3)' }}>A mix of 60 questions across all categories. Time limit: 60 mins.</p>
            </div>
            <button className="btn btn-primary" onClick={() => setQuizStarted(true)}>Start Mock Test</button>
          </div>

        </div>
      </div>
    );
  }

  if (loading) return <div className="app-page on">Loading quiz...</div>;

  if (showResult) {
    return (
      <div className="app-page on">
        <div className="card ta-c" style={{ padding: '40px' }}>
          <div className="success-ico" style={{ margin: '0 auto 20px' }}>🎉</div>
          <h1 className="success-title">Quiz Completed!</h1>
          <p className="success-sub">You scored {score.correct} out of {questions.length}.</p>

          <div className="g4 mb24">
            <div className="stat-card g">
              <div className="stat-num">{score.correct}</div>
              <div className="stat-lbl">Correct</div>
            </div>
            <div className="stat-card r">
              <div className="stat-num">{score.wrong}</div>
              <div className="stat-lbl">Wrong</div>
            </div>
            <div className="stat-card c">
              <div className="stat-num">{Math.round((score.correct / questions.length) * 100)}%</div>
              <div className="stat-lbl">Accuracy</div>
            </div>
          </div>

          <button className="btn btn-primary" onClick={() => window.location.reload()}>Try Another Category</button>
        </div>
      </div>
    );
  }

  const q = questions[currentIdx];

  return (
    <div className="app-page on">
      <div className="section-hdr">
        <div>
          <h1 className="section-title">Aptitude Training</h1>
          <p className="section-sub">Question {currentIdx + 1} of {questions.length}</p>
        </div>
        <div className="streak-chip">
          <Timer size={14} />
          <span>14:52</span>
        </div>
      </div>

      <div className="ptrack h4 mb24">
        <div className="pfill po" style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}></div>
      </div>

      <div className="card mb16">
        <div className="badge bc mb12">{q.category}</div>
        <div className="f14 fw5" style={{ lineHeight: '1.6' }}>{q.question}</div>
      </div>

      <div className="mb24">
        {q.options.map((opt, i) => {
          let cls = "quiz-opt";
          if (selectedOpt === i) {
            cls += i === q.correctAnswer ? " ok" : " err";
          } else if (selectedOpt !== null && i === q.correctAnswer) {
            cls += " ok";
          }

          return (
            <div key={i} className={cls} onClick={() => handleSelect(i)}>
              <div className="opt-l">{['A', 'B', 'C', 'D'][i]}</div>
              <span>{opt}</span>
            </div>
          );
        })}
      </div>

      {selectedOpt !== null && (
        <div className="card mb16" style={{ background: 'var(--bg4)', borderLeft: '3px solid var(--easy)' }}>
          <div className="f11 fw7 mb4" style={{ color: 'var(--easy)' }}>EXPLANATION</div>
          <div className="f12 tc" dangerouslySetInnerHTML={{ __html: q.explanation }}></div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          className="btn btn-primary"
          disabled={selectedOpt === null}
          onClick={nextQuestion}
        >
          {currentIdx === questions.length - 1 ? 'Finish Quiz' : 'Next Question →'}
        </button>
      </div>
    </div>
  );
};

export default Aptitude;
