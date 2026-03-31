import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, User, Bot, Code2, RotateCcw, Copy, Check } from 'lucide-react';

const suggestions = [
    '🧩 Explain Dynamic Programming with an example',
    '🔍 Review my Two Sum solution',
    '🗺️ What topics should I study for product companies?',
    '⏱️ How to optimize time complexity of my code?',
    '📝 Generate 5 medium-level graph problems',
    '🎯 How do I crack FAANG interviews?',
];

const initialMessages = [
    {
        role: 'assistant',
        content: `Hey there! I'm your **AI Placement Mentor** 🚀\n\nI can help you with:\n- **DSA concepts** and problem walkthroughs\n- **Code reviews** and optimizations\n- **Interview prep** tips and mock Q&A\n- **Company-specific** preparation strategies\n\nWhat would you like to work on today?`,
    }
];

const AIAssistant = () => {
    const [messages, setMessages] = useState(initialMessages);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(null);
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = async (text) => {
        const msg = text || input.trim();
        if (!msg) return;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: msg }]);
        setLoading(true);

        // Simulated AI response
        await new Promise(r => setTimeout(r, 1200));
        const replies = [
            `Great question! Let me break this down step by step.\n\nFor **${msg.slice(0, 30)}...**, here's how I'd approach it:\n\n1. Start by understanding the problem constraints\n2. Think about the data structures involved\n3. Consider the time and space tradeoffs\n\nWould you like me to walk through a specific example? 💡`,
            `Absolutely! This is a common interview topic. Here's a concise explanation:\n\n**Core Idea:** Focus on the fundamental pattern first.\n\nA typical approach would be:\n\`\`\`python\ndef solve(arr):\n    # Think about the base case\n    if not arr:\n        return 0\n    # Then build up\n    result = arr[0]\n    for x in arr[1:]:\n        result = max(result, x)\n    return result\n\`\`\`\n\nWant me to optimize this further?`,
        ];
        const reply = replies[Math.floor(Math.random() * replies.length)];
        setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
        setLoading(false);
    };

    const copy = (text, idx) => {
        navigator.clipboard.writeText(text);
        setCopied(idx);
        setTimeout(() => setCopied(null), 2000);
    };

    const renderContent = (text) => {
        // Simple markdown-like rendering
        return text.split('\n').map((line, i) => {
            if (line.startsWith('```')) return null;
            const bold = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            const code = bold.replace(/`(.*?)`/g, '<code style="background:rgba(249,115,22,0.12);color:var(--orange);padding:1px 5px;border-radius:4px;font-family:var(--mono);font-size:12px">$1</code>');
            return <div key={i} style={{ marginBottom: 4 }} dangerouslySetInnerHTML={{ __html: code }} />;
        });
    };

    return (
        <div style={{ display: 'flex', height: '100%', maxHeight: 'calc(100vh - 54px)' }}>

            {/* sidebar */}
            <div style={{ width: 260, borderRight: '1px solid var(--b1)', display: 'flex', flexDirection: 'column', background: 'var(--bg1)', padding: 16, flexShrink: 0 }}>
                <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginBottom: 20 }} onClick={() => setMessages(initialMessages)}>
                    <RotateCcw size={13} /> New Chat
                </button>

                <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--t4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>Suggestions</div>
                {suggestions.map((s, i) => (
                    <div key={i} onClick={() => sendMessage(s)} style={{ padding: '9px 10px', borderRadius: 9, fontSize: 12, color: 'var(--t2)', cursor: 'pointer', marginBottom: 4, transition: 'all 0.15s', lineHeight: 1.4, border: '1px solid transparent' }}
                        onMouseOver={e => { e.currentTarget.style.background = 'var(--bg3)'; e.currentTarget.style.borderColor = 'var(--b2)'; e.currentTarget.style.color = 'var(--t1)'; }}
                        onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.color = 'var(--t2)'; }}>
                        {s}
                    </div>
                ))}
            </div>

            {/* main chat */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>

                {/* header */}
                <div style={{ padding: '14px 24px', borderBottom: '1px solid var(--b1)', display: 'flex', alignItems: 'center', gap: 12, background: 'var(--bg1)' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--p-d)', border: '1px solid rgba(168,85,247,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Sparkles size={18} style={{ color: 'var(--purple)' }} />
                    </div>
                    <div>
                        <div style={{ fontSize: 14, fontWeight: 700 }}>AI Placement Mentor</div>
                        <div style={{ fontSize: 11, color: 'var(--easy)', display: 'flex', alignItems: 'center', gap: 5 }}>
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--easy)', boxShadow: '0 0 6px var(--easy)', display: 'inline-block' }} />
                            Online · Powered by advanced AI
                        </div>
                    </div>
                </div>

                {/* messages */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
                    {messages.map((msg, i) => (
                        <div key={i} style={{ display: 'flex', gap: 12, flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
                            <div style={{ width: 32, height: 32, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: msg.role === 'user' ? 'var(--grad-o)' : 'var(--p-d)', border: `1px solid ${msg.role === 'user' ? 'rgba(249,115,22,0.3)' : 'rgba(168,85,247,0.25)'}`, boxShadow: msg.role === 'user' ? 'var(--orange-glow-sm)' : '0 0 10px rgba(168,85,247,0.2)' }}>
                                {msg.role === 'user' ? <User size={15} style={{ color: '#fff' }} /> : <Bot size={15} style={{ color: 'var(--purple)' }} />}
                            </div>
                            <div style={{ maxWidth: '72%', padding: '12px 16px', borderRadius: msg.role === 'user' ? '16px 4px 16px 16px' : '4px 16px 16px 16px', background: msg.role === 'user' ? 'var(--grad-o)' : 'var(--bg3)', border: msg.role === 'user' ? 'none' : '1px solid var(--b1)', fontSize: 13, lineHeight: 1.65, color: msg.role === 'user' ? '#fff' : 'var(--t1)', position: 'relative' }}>
                                {renderContent(msg.content)}
                                {msg.role === 'assistant' && (
                                    <button onClick={() => copy(msg.content, i)} style={{ position: 'absolute', top: 8, right: 8, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--t3)', opacity: 0.5 }}
                                        onMouseOver={e => e.currentTarget.style.opacity = 1} onMouseOut={e => e.currentTarget.style.opacity = 0.5}>
                                        {copied === i ? <Check size={12} style={{ color: 'var(--easy)' }} /> : <Copy size={12} />}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}

                    {loading && (
                        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--p-d)', border: '1px solid rgba(168,85,247,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Bot size={15} style={{ color: 'var(--purple)' }} />
                            </div>
                            <div style={{ padding: '12px 16px', background: 'var(--bg3)', border: '1px solid var(--b1)', borderRadius: '4px 16px 16px 16px', display: 'flex', gap: 6, alignItems: 'center' }}>
                                {[0, 1, 2].map(i => (
                                    <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--purple)', animation: `bounce 1s ${i * 0.15}s infinite` }} />
                                ))}
                            </div>
                        </div>
                    )}
                    <div ref={bottomRef} />
                </div>

                {/* input */}
                <div style={{ padding: '16px 24px', borderTop: '1px solid var(--b1)', background: 'var(--bg1)' }}>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', background: 'var(--bg3)', border: '1px solid var(--b2)', borderRadius: 14, padding: '10px 14px', transition: 'border-color 0.15s' }}
                        onFocusCapture={e => e.currentTarget.style.borderColor = 'rgba(168,85,247,0.4)'}
                        onBlurCapture={e => e.currentTarget.style.borderColor = 'var(--b2)'}>
                        <Code2 size={16} style={{ color: 'var(--t3)', flexShrink: 0, marginTop: 2 }} />
                        <textarea
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                            placeholder="Ask about DSA, get code reviewed, or request study tips... (Enter to send)"
                            rows={1}
                            style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: 'var(--t1)', fontFamily: 'var(--sans)', fontSize: 13, resize: 'none', lineHeight: 1.5, maxHeight: 120, overflowY: 'auto' }}
                        />
                        <button onClick={() => sendMessage()} disabled={!input.trim() || loading} style={{ width: 32, height: 32, borderRadius: 9, border: 'none', background: input.trim() ? 'var(--grad-p)' : 'var(--bg5)', cursor: input.trim() ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s', boxShadow: input.trim() ? '0 0 12px rgba(168,85,247,0.3)' : 'none' }}>
                            <Send size={14} style={{ color: '#fff' }} />
                        </button>
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--t4)', textAlign: 'center', marginTop: 8 }}>AI can make mistakes. Double-check important solutions.</div>
                </div>
            </div>

            <style>{`@keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }`}</style>
        </div>
    );
};

export default AIAssistant;
