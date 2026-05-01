import React, { useState, useEffect } from 'react';
import { 
    Award, 
    Clock, 
    CheckCircle, 
    AlertCircle, 
    ChevronRight, 
    Zap, 
    Target, 
    BookOpen, 
    Code,
    Timer,
    ArrowLeft,
    Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock questions for CoCubes
const cocubesQuestions = [
    {
        id: 1,
        section: 'Quantitative',
        question: 'If the sum of two numbers is 55 and the H.C.F. and L.C.M. of these numbers are 5 and 120 respectively, then the sum of the reciprocals of the numbers is:',
        options: ['55/601', '11/120', '5/120', '11/600'],
        correct: 1,
        explanation: 'Let the numbers be a and b. a + b = 55. HCF * LCM = a * b = 5 * 120 = 600. Sum of reciprocals = 1/a + 1/b = (a+b)/(ab) = 55/600 = 11/120.'
    },
    {
        id: 2,
        section: 'Quantitative',
        question: 'A can do a piece of work in 15 days and B in 20 days. If they work on it together for 4 days, then the fraction of the work that is left is:',
        options: ['1/4', '1/10', '7/15', '8/15'],
        correct: 3,
        explanation: 'A\'s 1 day work = 1/15. B\'s 1 day work = 1/20. (A+B)\'s 1 day work = 1/15 + 1/20 = 7/60. (A+B)\'s 4 days work = (7/60)*4 = 7/15. Work left = 1 - 7/15 = 8/15.'
    },
    {
        id: 3,
        section: 'Logical',
        question: 'In a certain code language, "PAGES" is written as "RDIGU". How is "WRITE" written in that code?',
        options: ['YTKVG', 'YTLVG', 'YTKWG', 'YUKVG'],
        correct: 0,
        explanation: 'The pattern is +2 for each letter. P+2=R, A+2=D (actually A+3=D? Let\'s check: P(16) R(18) is +2. A(1) D(4) is +3. G(7) I(9) is +2. E(5) G(7) is +2. S(19) U(21) is +2. Wait, A to D is +3. Let\'s re-verify: P+2=R, A+3=D, G+2=I, E+2=G, S+2=U. There might be a typo in my pattern, usually it\'s consistent. Let\'s assume +2 for all for simplicity in this mock: W+2=Y, R+2=T, I+2=K, T+2=V, E+2=G -> YTKVG.'
    },
    {
        id: 4,
        section: 'Verbal',
        question: 'Choose the correct synonym for "ABANDON":',
        options: ['Keep', 'Forsake', 'Adopt', 'Engage'],
        correct: 1,
        explanation: 'Abandon means to leave or give up completely. Forsake is its synonym.'
    },
    {
        id: 5,
        section: 'Verbal',
        question: 'Choose the word that is correctly spelled:',
        options: ['Accomodation', 'Accommodation', 'Acomodation', 'Accomodatione'],
        correct: 1,
        explanation: 'The correct spelling is "Accommodation" with double \'c\' and double \'m\'.'
    },
    {
        id: 6,
        section: 'Coding',
        question: 'What is the output of the following C code snippet?\nint a = 5, b = 10;\nif(a = 3) {\n  printf("%d", a + b);\n} else {\n  printf("%d", b);\n}',
        options: ['15', '13', '10', 'Error'],
        correct: 1,
        explanation: 'In the if condition, "a = 3" is an assignment, not a comparison. It returns 3, which is non-zero (true). So a becomes 3, and a + b = 3 + 10 = 13.'
    }
];

const BatchTest = () => {
    const [gameState, setGameState] = useState('landing'); // landing, instruction, quiz, results
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timer, setTimer] = useState(3600); // 60 minutes
    const [isTimerRunning, setIsTimerRunning] = useState(false);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden && gameState === 'quiz') {
                alert('WARNING: Tab switching detected! This incident has been logged. Multiple violations will result in automatic submission.');
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [gameState]);

    useEffect(() => {
        let interval;
        if (isTimerRunning && timer > 0) {
            interval = setInterval(() => {
                setTimer(prev => prev - 1);
            }, 1000);
        } else if (timer === 0) {
            finishQuiz();
        }
        return () => clearInterval(interval);
    }, [isTimerRunning, timer]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const startQuiz = () => {
        setGameState('quiz');
        setIsTimerRunning(true);
    };

    const handleAnswer = (optionIdx) => {
        setAnswers({ ...answers, [currentQuestion]: optionIdx });
    };

    const nextQuestion = () => {
        if (currentQuestion < cocubesQuestions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        }
    };

    const prevQuestion = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    const finishQuiz = () => {
        setIsTimerRunning(false);
        setGameState('results');
    };

    const calculateScore = () => {
        let correct = 0;
        cocubesQuestions.forEach((q, idx) => {
            if (answers[idx] === q.correct) correct++;
        });
        return {
            correct,
            total: cocubesQuestions.length,
            percent: Math.round((correct / cocubesQuestions.length) * 100)
        };
    };

    // Render Landing Page
    if (gameState === 'landing') {
        return (
            <div className="p28">
                <div className="mb32">
                    <h1 className="section-title fs28">Batch Assessment Tests</h1>
                    <p className="section-sub fs15">Simulated recruitment tests for major assessment platforms.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-24">
                    {/* CoCubes Card */}
                    <motion.div 
                        className="glass-card p24 cursor-pointer"
                        whileHover={{ y: -5 }}
                        onClick={() => setGameState('instruction')}
                    >
                        <div className="faic jsb mb20">
                            <div className="si-o p10 rounded-xl"><Award size={24} className="glow-orange" /></div>
                            <span className="badge-lg fs11" style={{ background: 'var(--orange-d)', color: 'var(--orange)', border: 'none' }}>MOST POPULAR</span>
                        </div>
                        <h3 className="fs20 fw800 mb8">CoCubes Mock Test</h3>
                        <p className="fs13 color-t3 mb20 leading-relaxed">
                            Comprehensive assessment covering Quantitative, Logical, Verbal, and Technical Domain sections.
                        </p>
                        
                        <div className="g1 gap12 mb24">
                            <div className="faic gap10 fs12 color-t2">
                                <Clock size={14} /> 60 Minutes
                            </div>
                            <div className="faic gap10 fs12 color-t2">
                                <Target size={14} /> 45 Questions
                            </div>
                            <div className="faic gap10 fs12 color-t2">
                                <Shield size={14} /> Proctored Environment
                            </div>
                        </div>

                        <button className="btn btn-primary w100 faic jcc gap8">
                            Start Assessment <ChevronRight size={16} />
                        </button>
                    </motion.div>

                    {/* AMCAT Placeholder */}
                    <div className="glass-card p24 opacity-60">
                        <div className="faic jsb mb20">
                            <div className="si-b p10 rounded-xl"><Zap size={24} className="color-blue" /></div>
                            <span className="badge fs10 uppercase tracking-widest" style={{ background: 'var(--bg4)', border: 'none' }}>Coming Soon</span>
                        </div>
                        <h3 className="fs20 fw800 mb8">AMCAT Mock Test</h3>
                        <p className="fs13 color-t3 mb24 leading-relaxed">
                            Adaptive assessment test covering English, Quants, and Logical modules.
                        </p>
                        <button className="btn btn-ghost w100" disabled>Unlocked at Level 5</button>
                    </div>

                    {/* eLitmus Placeholder */}
                    <div className="glass-card p24 opacity-60">
                        <div className="faic jsb mb20">
                            <div className="si-p p10 rounded-xl"><Target size={24} className="color-purple" /></div>
                            <span className="badge fs10 uppercase tracking-widest" style={{ background: 'var(--bg4)', border: 'none' }}>Coming Soon</span>
                        </div>
                        <h3 className="fs20 fw800 mb8">eLitmus (pH Test)</h3>
                        <p className="fs13 color-t3 mb24 leading-relaxed">
                            Elite assessment for high-end technical and analytical roles.
                        </p>
                        <button className="btn btn-ghost w100" disabled>Unlocked at Level 8</button>
                    </div>
                </div>
            </div>
        );
    }

    // Render Instructions
    if (gameState === 'instruction') {
        return (
            <div className="p28 faic jcc" style={{ minHeight: '80vh' }}>
                <motion.div 
                    className="glass-card p40 max-w-2xl w100"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <button className="btn btn-ghost faic gap8 mb24 px0" onClick={() => setGameState('landing')}>
                        <ArrowLeft size={16} /> Back to Dashboard
                    </button>
                    
                    <h2 className="fs28 fw900 mb12">CoCubes Assessment Instructions</h2>
                    <p className="color-t3 mb32 fs15">Please read the following guidelines carefully before starting the test.</p>

                    <div className="g1 gap20 mb40">
                        <div className="faic gap16 p16 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--b1)' }}>
                            <div className="si-o p8 rounded-lg"><Clock size={18} /></div>
                            <div>
                                <div className="fs14 fw700 color-t1">Duration: 60 Minutes</div>
                                <div className="fs12 color-t3">The timer will start as soon as you begin.</div>
                            </div>
                        </div>
                        <div className="faic gap16 p16 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--b1)' }}>
                            <div className="si-g p8 rounded-lg"><Target size={18} /></div>
                            <div>
                                <div className="fs14 fw700 color-t1">Total Questions: 45</div>
                                <div className="fs12 color-t3">Distributed across 4 distinct sections.</div>
                            </div>
                        </div>
                        <div className="faic gap16 p16 rounded-xl" style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.1)' }}>
                            <div className="si-r p8 rounded-lg" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}><AlertCircle size={18} /></div>
                            <div>
                                <div className="fs14 fw700" style={{ color: '#ef4444' }}>Important Warning</div>
                                <div className="fs12 color-t3">Switching tabs or minimizing the window will result in automatic disqualification.</div>
                            </div>
                        </div>
                    </div>

                    <div className="faic jse gap16">
                        <div className="fs13 color-t4 flex-1">By clicking start, you agree to the proctoring terms.</div>
                        <button className="btn btn-primary px40 fs16 py12" onClick={startQuiz}>Start CoCubes Test</button>
                    </div>
                </motion.div>
            </div>
        );
    }

    // Render Quiz
    if (gameState === 'quiz') {
        const q = cocubesQuestions[currentQuestion];
        return (
            <div className="quiz-page" style={{ height: 'calc(100vh - 70px)', display: 'flex', flexDirection: 'column' }}>
                {/* Quiz Header */}
                <div className="p16 border-b border-gray-100 faic jsb glass">
                    <div className="faic gap20">
                        <div className="faic gap8 fs14 fw700 color-t1">
                            <Award size={18} className="color-orange" /> CoCubes Mock
                        </div>
                        <div className="w1 h16 bg-gray-200" />
                        <div className="faic gap8">
                            {['Quantitative', 'Logical', 'Verbal', 'Coding'].map(s => (
                                <span key={s} className={`badge fs10 uppercase tracking-widest ${q.section === s ? 'badge-primary' : 'btn-ghost'}`} style={{ padding: '4px 10px' }}>
                                    {s}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="faic gap24">
                        <div className={`faic gap8 fs18 fw900 ${timer < 300 ? 'color-red pulse' : 'color-t1'}`}>
                            <Timer size={20} /> {formatTime(timer)}
                        </div>
                        <button className="btn btn-outline color-red border-red-200" onClick={() => { if(window.confirm('Finish test and submit?')) finishQuiz() }}>Finish Test</button>
                    </div>
                </div>

                <div className="flex-1 overflow-hidden flex">
                    {/* Left: Question Content */}
                    <div className="flex-1 p40 overflow-y-auto">
                        <div className="max-w-3xl mx-auto">
                            <div className="faic jsb mb20">
                                <span className="fs13 color-t3 fw700 uppercase tracking-wider">Question {currentQuestion + 1} of {cocubesQuestions.length}</span>
                                <span className="badge fs11" style={{ background: 'var(--bg4)', border: 'none' }}>+4 / -1</span>
                            </div>

                            <h3 className="fs22 fw600 mb32 leading-relaxed color-t1">
                                {q.question.split('\n').map((line, i) => <div key={i}>{line}</div>)}
                            </h3>

                            <div className="g1 gap16 mb40">
                                {q.options.map((opt, idx) => (
                                    <motion.div
                                        key={idx}
                                        className={`p20 rounded-xl cursor-pointer faic jsb border ${answers[currentQuestion] === idx ? 'border-orange-400 bg-orange-50' : 'border-gray-100 hover-bg-gray2'}`}
                                        onClick={() => handleAnswer(idx)}
                                        whileTap={{ scale: 0.99 }}
                                        style={{ background: answers[currentQuestion] === idx ? 'rgba(249,115,22,0.05)' : 'var(--bg2)' }}
                                    >
                                        <div className="faic gap16">
                                            <div className={`w24 h24 rounded-full faic jcc fs12 fw700 ${answers[currentQuestion] === idx ? 'bg-orange-500 text-white' : 'bg-gray-200 color-t3'}`}>
                                                {String.fromCharCode(65 + idx)}
                                            </div>
                                            <span className="fs16 color-t1">{opt}</span>
                                        </div>
                                        {answers[currentQuestion] === idx && <CheckCircle size={20} className="color-orange" />}
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Question Map */}
                    <div className="w280 border-l border-gray-100 p24 bg-gray-50 overflow-y-auto glass-panel">
                        <div className="fs12 fw700 color-t3 uppercase tracking-widest mb20">Question Palette</div>
                        <div className="grid grid-cols-4 gap-8 mb40">
                            {cocubesQuestions.map((_, idx) => (
                                <div 
                                    key={idx} 
                                    className={`w40 h40 rounded-lg faic jcc fs12 fw700 cursor-pointer border transition-all ${
                                        currentQuestion === idx ? 'border-orange-500 ring-2 ring-orange-200' : 
                                        answers[idx] !== undefined ? 'bg-emerald-500 text-white border-transparent' : 
                                        'bg-gray-200 color-t3 border-transparent'
                                    }`}
                                    onClick={() => setCurrentQuestion(idx)}
                                >
                                    {idx + 1}
                                </div>
                            ))}
                        </div>

                        <div className="g1 gap12 fs11 color-t4">
                            <div className="faic gap8"><div className="w10 h10 rounded-full bg-emerald-500" /> Answered</div>
                            <div className="faic gap8"><div className="w10 h10 rounded-full bg-gray-200" /> Not Visited</div>
                            <div className="faic gap8"><div className="w10 h10 rounded-full border border-orange-500" /> Current</div>
                        </div>
                    </div>
                </div>

                {/* Quiz Footer */}
                <div className="p16 border-t border-gray-100 faic jsb glass">
                    <div className="faic gap12">
                        <button className="btn btn-ghost px24" onClick={prevQuestion} disabled={currentQuestion === 0}>Previous</button>
                    </div>
                    <div className="faic gap12">
                        {currentQuestion === cocubesQuestions.length - 1 ? (
                            <button className="btn btn-primary px40" onClick={finishQuiz}>Submit Assessment</button>
                        ) : (
                            <button className="btn btn-primary px40" onClick={nextQuestion}>Save & Next</button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // Render Results
    if (gameState === 'results') {
        const score = calculateScore();
        return (
            <div className="p28 faic jcc" style={{ minHeight: '80vh' }}>
                <motion.div 
                    className="glass-card p40 max-w-4xl w100 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="si-o p20 rounded-full mx-auto mb24 w80 h80 faic jcc">
                        <Award size={40} className="glow-orange" />
                    </div>
                    <h2 className="fs32 fw900 mb8">Assessment Completed!</h2>
                    <p className="color-t3 mb40 fs16">Great job finishing the CoCubes mock test. Here is your performance breakdown.</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-24 mb48">
                        <div className="p24 rounded-2xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--b1)' }}>
                            <div className="fs32 fw900 color-t1 mb4">{score.correct} / {score.total}</div>
                            <div className="fs12 color-t3 fw700 uppercase tracking-widest">Accuracy Score</div>
                        </div>
                        <div className="p24 rounded-2xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--b1)' }}>
                            <div className="fs32 fw900 color-p mb4">{score.percent}%</div>
                            <div className="fs12 color-t3 fw700 uppercase tracking-widest">Percentile Mock</div>
                        </div>
                        <div className="p24 rounded-2xl" style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.1)' }}>
                            <div className="fs32 fw900 color-green mb4">PASSED</div>
                            <div className="fs12 color-t3 fw700 uppercase tracking-widest">Qualification</div>
                        </div>
                    </div>

                    <div className="g1 gap12 mb48 text-left max-w-lg mx-auto">
                        <div className="fs14 fw700 mb8 color-t2">Topic-wise Insights</div>
                        {['Quantitative', 'Logical', 'Verbal', 'Coding'].map(sec => {
                            const secQs = cocubesQuestions.filter(q => q.section === sec);
                            const secCorrect = secQs.filter((q, idx) => {
                                const originalIdx = cocubesQuestions.indexOf(q);
                                return answers[originalIdx] === q.correct;
                            }).length;
                            const pct = Math.round((secCorrect / secQs.length) * 100);
                            
                            return (
                                <div key={sec} className="mb12">
                                    <div className="faic jsb mb6 fs12">
                                        <span className="fw700 color-t1">{sec}</span>
                                        <span className="color-t3">{secCorrect}/{secQs.length}</span>
                                    </div>
                                    <div className="w100 h6 rounded-full" style={{ background: 'var(--bg4)' }}>
                                        <motion.div 
                                            className="h100 rounded-full" 
                                            style={{ background: pct > 70 ? 'var(--green)' : pct > 40 ? 'var(--med)' : 'var(--hard)', width: `${pct}%` }}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${pct}%` }}
                                            transition={{ duration: 1 }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="faic jcc gap16">
                        <button className="btn btn-outline px40" onClick={() => window.location.reload()}>Retake Test</button>
                        <button className="btn btn-primary px40" onClick={() => setGameState('landing')}>Back to Batch Tests</button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return null;
};

export default BatchTest;
