import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Mic, Volume2 } from 'lucide-react';

export default function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Welcome to Sans Mercantile. How can our autonomous systems assist you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input }),
      });
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'I am experiencing a connection issue. Please try again shortly.' }]);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="bg-nexus-dark border border-nexus-gold/30 rounded-2xl shadow-2xl w-full max-w-md mb-4 overflow-hidden flex flex-col h-[600px]"
          >
            <div className="p-4 bg-gradient-to-r from-nexus-gold/20 to-transparent border-b border-nexus-gold/20 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-white font-bold">Sans AI Support</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-nexus-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    msg.role === 'user' 
                      ? 'bg-nexus-gold text-black rounded-tr-none' 
                      : 'bg-nexus-gray-800 text-white border border-nexus-gold/20 rounded-tl-none'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-nexus-dark border-t border-nexus-gold/20 flex gap-2 items-center">
              <button 
                onClick={() => setIsListening(!isListening)}
                className={`p-2 rounded-full transition-colors ${isListening ? 'bg-red-500 text-white' : 'bg-nexus-gray-700 text-nexus-gold hover:bg-nexus-gray-600'}`}
              >
                {isListening ? <Volume2 size={20} /> : <Mic size={20} />}
              </button>
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about our systems..."
                className="flex-1 bg-nexus-gray-900 border border-nexus-gold/20 rounded-full px-4 py-2 text-white text-sm focus:outline-none focus:border-nexus-gold/50"
              />
              <button onClick={handleSend} className="p-2 rounded-full bg-nexus-gold text-black hover:bg-nexus-gold/80 transition-colors">
                <Send size={20} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="p-4 rounded-full bg-nexus-gold text-black shadow-lg hover:shadow-nexus-gold/20 transition-all"
      >
        <MessageSquare size={28} />
      </motion.button>
    </div>
  );
}