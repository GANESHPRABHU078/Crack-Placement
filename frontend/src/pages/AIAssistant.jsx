import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Send, User, Bot, Code2, RotateCcw, Copy, Check } from 'lucide-react';
import { aiService } from '../api/aiService';

const suggestions = [
  'Explain Dynamic Programming with an example',
  'Review my Two Sum solution',
  'What topics should I study for product companies?',
  'How to optimize time complexity of my code?',
  'Generate 5 medium-level graph problems',
  'How do I crack FAANG interviews?'
];

const initialMessages = [
  {
    role: 'assistant',
    content: `Hey there! I am your **AI Placement Mentor**.\n\nI can help with:\n- **DSA concepts** and problem solving\n- **Code review** and optimization ideas\n- **Interview preparation** and mock answers\n- **Company-specific prep** and study planning\n\nAsk me anything and I will respond using the real AI backend.`
  }
];

const AIAssistant = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(null);
  const [error, setError] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const content = (text || input).trim();
    if (!content || loading) return;

    const nextMessages = [...messages, { role: 'user', content }];
    setMessages(nextMessages);
    setInput('');
    setError('');
    setLoading(true);

    try {
      const response = await aiService.chat(
        nextMessages.map((message) => ({
          role: message.role,
          content: message.content
        }))
      );

      setMessages((prev) => [...prev, { role: 'assistant', content: response.reply }]);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'AI assistant is unavailable right now. Please try again later.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const copy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopied(idx);
    setTimeout(() => setCopied(null), 2000);
  };

  const resetChat = () => {
    setMessages(initialMessages);
    setInput('');
    setError('');
  };

  const renderContent = (text) =>
    text.split('\n').map((line, index) => {
      if (line.startsWith('```')) return null;
      const bold = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      const code = bold.replace(
        /`(.*?)`/g,
        '<code style="background:rgba(249,115,22,0.12);color:var(--orange);padding:1px 5px;border-radius:4px;font-family:var(--mono);font-size:12px">$1</code>'
      );
      return <div key={index} style={{ marginBottom: 4 }} dangerouslySetInnerHTML={{ __html: code }} />;
    });

  return (
    <div style={{ display: 'flex', height: '100%', maxHeight: 'calc(100vh - 54px)' }}>
      <div style={{ width: 260, borderRight: '1px solid var(--b1)', display: 'flex', flexDirection: 'column', background: 'var(--bg1)', padding: 16, flexShrink: 0 }}>
        <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginBottom: 20 }} onClick={resetChat}>
          <RotateCcw size={13} /> New Chat
        </button>

        <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--t4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>Suggestions</div>
        {suggestions.map((suggestion) => (
          <div
            key={suggestion}
            onClick={() => sendMessage(suggestion)}
            style={{ padding: '9px 10px', borderRadius: 9, fontSize: 12, color: 'var(--t2)', cursor: 'pointer', marginBottom: 4, transition: 'all 0.15s', lineHeight: 1.4, border: '1px solid transparent' }}
            onMouseOver={(event) => {
              event.currentTarget.style.background = 'var(--bg3)';
              event.currentTarget.style.borderColor = 'var(--b2)';
              event.currentTarget.style.color = 'var(--t1)';
            }}
            onMouseOut={(event) => {
              event.currentTarget.style.background = 'transparent';
              event.currentTarget.style.borderColor = 'transparent';
              event.currentTarget.style.color = 'var(--t2)';
            }}
          >
            {suggestion}
          </div>
        ))}
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '14px 24px', borderBottom: '1px solid var(--b1)', display: 'flex', alignItems: 'center', gap: 12, background: 'var(--bg1)' }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--p-d)', border: '1px solid rgba(168,85,247,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={18} style={{ color: 'var(--purple)' }} />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700 }}>AI Placement Mentor</div>
            <div style={{ fontSize: 11, color: 'var(--easy)', display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--easy)', boxShadow: '0 0 6px var(--easy)', display: 'inline-block' }} />
              Live backend AI connection
            </div>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {messages.map((message, index) => (
            <div key={`${message.role}-${index}`} style={{ display: 'flex', gap: 12, flexDirection: message.role === 'user' ? 'row-reverse' : 'row' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: message.role === 'user' ? 'var(--grad-o)' : 'var(--p-d)', border: `1px solid ${message.role === 'user' ? 'rgba(249,115,22,0.3)' : 'rgba(168,85,247,0.25)'}`, boxShadow: message.role === 'user' ? 'var(--orange-glow-sm)' : '0 0 10px rgba(168,85,247,0.2)' }}>
                {message.role === 'user' ? <User size={15} style={{ color: '#fff' }} /> : <Bot size={15} style={{ color: 'var(--purple)' }} />}
              </div>
              <div style={{ maxWidth: '72%', padding: '12px 16px', borderRadius: message.role === 'user' ? '16px 4px 16px 16px' : '4px 16px 16px 16px', background: message.role === 'user' ? 'var(--grad-o)' : 'var(--bg3)', border: message.role === 'user' ? 'none' : '1px solid var(--b1)', fontSize: 13, lineHeight: 1.65, color: message.role === 'user' ? '#fff' : 'var(--t1)', position: 'relative' }}>
                {renderContent(message.content)}
                {message.role === 'assistant' && (
                  <button
                    onClick={() => copy(message.content, index)}
                    style={{ position: 'absolute', top: 8, right: 8, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--t3)', opacity: 0.5 }}
                    onMouseOver={(event) => {
                      event.currentTarget.style.opacity = 1;
                    }}
                    onMouseOut={(event) => {
                      event.currentTarget.style.opacity = 0.5;
                    }}
                  >
                    {copied === index ? <Check size={12} style={{ color: 'var(--easy)' }} /> : <Copy size={12} />}
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
                {[0, 1, 2].map((dot) => (
                  <div key={dot} style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--purple)', animation: `bounce 1s ${dot * 0.15}s infinite` }} />
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="card" style={{ borderColor: 'rgba(239,68,68,0.35)', background: 'rgba(127,29,29,0.16)', color: 'var(--t1)' }}>
              {error}
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--b1)', background: 'var(--bg1)' }}>
          <div
            style={{ display: 'flex', gap: 10, alignItems: 'flex-end', background: 'var(--bg3)', border: '1px solid var(--b2)', borderRadius: 14, padding: '10px 14px', transition: 'border-color 0.15s' }}
            onFocusCapture={(event) => {
              event.currentTarget.style.borderColor = 'rgba(168,85,247,0.4)';
            }}
            onBlurCapture={(event) => {
              event.currentTarget.style.borderColor = 'var(--b2)';
            }}
          >
            <Code2 size={16} style={{ color: 'var(--t3)', flexShrink: 0, marginTop: 2 }} />
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Ask about DSA, code review, aptitude, company prep, or interviews..."
              rows={1}
              style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: 'var(--t1)', fontFamily: 'var(--sans)', fontSize: 13, resize: 'none', lineHeight: 1.5, maxHeight: 120, overflowY: 'auto' }}
            />
            <button onClick={() => sendMessage()} disabled={!input.trim() || loading} style={{ width: 32, height: 32, borderRadius: 9, border: 'none', background: input.trim() ? 'var(--grad-p)' : 'var(--bg5)', cursor: input.trim() ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s', boxShadow: input.trim() ? '0 0 12px rgba(168,85,247,0.3)' : 'none' }}>
              <Send size={14} style={{ color: '#fff' }} />
            </button>
          </div>
          <div style={{ fontSize: 10, color: 'var(--t4)', textAlign: 'center', marginTop: 8 }}>
            AI can make mistakes. Double-check important solutions and interview advice.
          </div>
        </div>
      </div>

      <style>{'@keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }'}</style>
    </div>
  );
};

export default AIAssistant;
