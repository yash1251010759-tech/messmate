import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  Move, 
  UtensilsCrossed, 
  Search, 
  HelpCircle, 
  Circle, 
  ChevronRight,
  Maximize2,
  Minimize2,
  RefreshCw,
  Tag,
  QrCode
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  options?: { label: string; action: string; link?: string }[];
}

export const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  
  // Position state (default: top-right corner)
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: typeof window !== 'undefined' ? Math.max(20, window.innerWidth - 100) : 1000,
    y: 80,
  });
  
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const elementStartPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const hasMovedRef = useRef(false);

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      sender: 'bot',
      text: 'Hello! I am MessBot, your campus dining assistant. 🤖\n\nHow can I help you today? You can ask me to help select a mess, search mess menus & timings, or assist with QR passes and complaints!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      options: [
        { label: '🍲 Help Me Select a Mess', action: 'help select mess' },
        { label: '🔍 Search Messes & Menus', action: 'search messes' },
        { label: '🎟️ QR Pass & Opt-Out Guide', action: 'qr pass help' },
        { label: '🏷️ Discount Coupon Codes', action: 'coupon codes' },
      ],
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isTyping]);

  // Adjust default position on window resize
  useEffect(() => {
    const handleResize = () => {
      setPosition(prev => ({
        x: Math.min(prev.x, window.innerWidth - 80),
        y: Math.min(prev.y, window.innerHeight - 80),
      }));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Position floating button at top right
  useEffect(() => {
    const initialX = Math.max(20, window.innerWidth - 100);
    const initialY = 80;
    setPosition({ x: initialX, y: initialY });
  }, []);

  // Mouse Drag Handlers (Click + Drag OR Shift + Click & Drag)
  const handleMouseDown = (e: React.MouseEvent) => {
    // Start dragging tracking
    setIsDragging(true);
    hasMovedRef.current = false;
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    elementStartPos.current = { ...position };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - dragStartPos.current.x;
      const deltaY = moveEvent.clientY - dragStartPos.current.y;

      if (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4) {
        hasMovedRef.current = true;
      }

      const widgetWidth = isOpen ? 360 : 70;
      const widgetHeight = isOpen ? 480 : 70;

      const newX = Math.max(10, Math.min(window.innerWidth - widgetWidth, elementStartPos.current.x + deltaX));
      const newY = Math.max(10, Math.min(window.innerHeight - widgetHeight, elementStartPos.current.y + deltaY));

      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleToggleOpen = (e: React.MouseEvent) => {
    // Only toggle if user didn't drag it around
    if (!hasMovedRef.current) {
      setIsOpen(prev => !prev);
      setIsMinimized(false);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const prompt = textToSend || input;
    if (!prompt.trim()) return;

    const userMsg: Message = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    try {
      // Call backend API endpoint `/api/chat`
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: prompt,
          history: messages.map(m => ({ role: m.sender, text: m.text }))
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const botMsg: Message = {
          id: `bot_${Date.now()}`,
          sender: 'bot',
          text: data.reply || 'I am here to help you select and search messes across campus!',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          options: data.options || [
            { label: 'Browse All Messes', action: 'search messes', link: '/select-mess' },
            { label: 'View Daily Menu', action: 'today menu', link: '/student-dashboard' }
          ]
        };
        setMessages(prev => [...prev, botMsg]);
      } else {
        throw new Error('API server returned error status');
      }
    } catch (err) {
      // Intelligent client-side fallback if backend API is temporarily unavailable
      setTimeout(() => {
        const fallbackReply = generateFallbackBotResponse(prompt);
        setMessages(prev => [...prev, {
          id: `bot_${Date.now()}`,
          sender: 'bot',
          text: fallbackReply.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          options: fallbackReply.options
        }]);
      }, 600);
    } finally {
      setIsTyping(false);
    }
  };

  // Helper response generator for common campus mess queries
  const generateFallbackBotResponse = (query: string): { text: string; options?: any[] } => {
    const q = query.toLowerCase();

    if (q.includes('select') || q.includes('choose') || q.includes('recommend') || q.includes('help select')) {
      return {
        text: `Here are the top campus messes to choose from based on your preferences:\n\n` +
          `1. 👑 **Royal North Central Mess** (₹3,200/mo)\n   • Best for Paneer, Tandoori Butter Roti & North Indian Thalis.\n\n` +
          `2. 🌴 **Dakshin South Indian Dining** (₹2,900/mo)\n   • Best for Crispy Dosa, Filter Coffee, Fluffy Idlis & Sambar.\n\n` +
          `3. 🌿 **Green Leaf Pure Veg Mess** (₹3,000/mo)\n   • 100% Pure Veg & organic produce.\n\n` +
          `4. 🍗 **Flavors Multi-Cuisine Mess** (₹3,500/mo)\n   • Chicken Biryani Wednesdays/Saturdays, Salad Bar & Chinese delicacies.\n\n` +
          `You can select any mess and pay online with coupon **WELCOME10** for 10% off!`,
        options: [
          { label: 'Select Mess Now', action: 'go to select mess', link: '/select-mess' },
          { label: 'Apply WELCOME10 Discount', action: 'coupon codes' },
        ]
      };
    }

    if (q.includes('search') || q.includes('menu') || q.includes('today') || q.includes('timing') || q.includes('price')) {
      return {
        text: `🔍 **Campus Mess Search Results**:\n\n` +
          `• **Breakfast**: 07:30 AM - 09:30 AM (Aloo Paratha / Idli Vada / Dosa / Tea)\n` +
          `• **Lunch**: 12:30 PM - 02:30 PM (Paneer Butter Masala / Dal Tadka / Rice / Gulab Jamun)\n` +
          `• **Snacks**: 05:00 PM - 06:15 PM (Samosa & Green Chutney / Tea & Coffee)\n` +
          `• **Dinner**: 07:30 PM - 09:30 PM (Kadai Veg / Biryani Specials / Desserts)\n\n` +
          `Contact Numbers:\n` +
          `• Royal Mess Manager: +91 98765 11223\n` +
          `• Dakshin Mess Manager: +91 98123 99887`,
        options: [
          { label: 'View Student Dashboard', action: 'dashboard', link: '/student-dashboard' },
          { label: 'Check Mess Timings', action: 'timings' }
        ]
      };
    }

    if (q.includes('coupon') || q.includes('discount') || q.includes('code') || q.includes('offer')) {
      return {
        text: `🎉 **Active Campus Discount Coupons**:\n\n` +
          `1. **WELCOME10** — Get 10% Flat Discount on all 1-month subscriptions!\n` +
          `2. **STUDENT20** — Get 20% Flat Discount on Quarterly & Semester subscriptions!\n\n` +
          `Enter these coupon codes during mess payment on the Select Mess page!`,
        options: [
          { label: 'Apply Coupon on Payment', action: 'pay mess', link: '/select-mess' }
        ]
      };
    }

    if (q.includes('qr') || q.includes('token') || q.includes('pass') || q.includes('opt out') || q.includes('cancel')) {
      return {
        text: `🎟️ **QR Dining Pass & Meal Opt-Out Guidelines**:\n\n` +
          `• Your digital QR pass is available on your **Student Dashboard** under the "Digital Dining Pass" tab.\n` +
          `• Show this QR pass at the mess entry scanner for fast <2 second entry.\n` +
          `• To opt out of a meal (e.g. going out for lunch), click **Opt-Out** at least 3 hours prior to prevent food waste!`,
        options: [
          { label: 'Open Student Dashboard', action: 'go dashboard', link: '/student-dashboard' }
        ]
      };
    }

    return {
      text: `I'm happy to assist you with any mess-related questions! You can ask me:\n` +
        `• "Help me select a mess for my dietary preference"\n` +
        `• "Search menu for today"\n` +
        `• "What is the monthly fee for Pure Veg Mess?"\n` +
        `• "How do I register a complaint or feedback?"`,
      options: [
        { label: 'Select a Mess', action: 'help select mess', link: '/select-mess' },
        { label: 'Search Menus', action: 'search messes' },
        { label: 'Discounts', action: 'coupon codes' }
      ]
    };
  };

  return (
    <div
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 9999,
        touchAction: 'none',
      }}
      className="select-none font-sans"
    >
      {/* 1. COLLAPSED FLOATING BOT BUTTON WITH VISUAL ELEMENTS */}
      {!isOpen && (
        <div className="relative group">
          {/* Shift + Drag Tooltip */}
          <div className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1 bg-zinc-900 border border-emerald-500/40 text-emerald-400 text-[10px] font-bold rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
            <span>Hold Shift + Click/Drag to move</span>
          </div>

          <button
            onMouseDown={handleMouseDown}
            onClick={handleToggleOpen}
            className={`relative flex items-center justify-center cursor-grab active:cursor-grabbing transition-transform duration-200 hover:scale-105 active:scale-95 ${
              isDragging ? 'scale-105 shadow-[0_0_35px_rgba(16,185,129,0.8)]' : ''
            }`}
            title="Click to chat or Shift + Drag to move position"
          >
            {/* CIRCLE ICON #1: Outer Glow & Animated Orbiting Ring */}
            <div className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 opacity-75 blur-sm animate-pulse" />

            {/* CIRCLE ICON #2: Main Circular Avatar Frame */}
            <div className="relative w-18 h-18 rounded-full bg-zinc-950 border-2 border-emerald-400 p-1 flex items-center justify-center shadow-2xl overflow-hidden">
              <div className="w-full h-full rounded-full bg-emerald-950/80 flex items-center justify-center border border-emerald-500/30">
                {/* ROBOT ICON */}
                <Bot className="w-14 h-14 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              </div>
            </div>

            {/* SMALL CIRCLE ICON #1: Live Green Status Indicator Dot */}
            <div className="absolute top-0 right-0 w-4 h-4 bg-emerald-500 rounded-full border-2 border-zinc-950 shadow-[0_0_8px_rgba(16,185,129,0.9)] animate-bounce flex items-center justify-center">
              {/* SMALL CIRCLE ICON #2: Inner Core Dot */}
              <div className="w-1.5 h-1.5 rounded-full bg-white" />
            </div>

            {/* Small Move Icon Indicator */}
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-zinc-900 border border-emerald-500/50 rounded-full flex items-center justify-center text-emerald-400 shadow-md">
              <Move className="w-2.5 h-2.5" />
            </div>
          </button>
        </div>
      )}

      {/* 2. EXPANDED CHATBOT WINDOW */}
      {isOpen && (
        <div
          className={`w-[340px] sm:w-[380px] bg-zinc-950 border border-emerald-500/40 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col transition-all duration-200 ${
            isMinimized ? 'h-[68px]' : 'h-[500px]'
          }`}
        >
          {/* HEADER BAR (DRAGGABLE HANDLE WITH MOUSE) */}
          <div
            onMouseDown={handleMouseDown}
            className="px-4 py-3 bg-zinc-900/90 border-b border-zinc-800 flex items-center justify-between cursor-grab active:cursor-grabbing hover:bg-zinc-900 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              {/* CIRCLE ICON + ROBOT ICON HEADER REPRESENTATION */}
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-emerald-950 border border-emerald-500/50 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-emerald-400 drop-shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                </div>
                {/* SMALL CIRCLE ICON */}
                <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-zinc-900 shadow-[0_0_6px_rgba(52,211,153,0.9)] animate-pulse" />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-black text-white tracking-wide">MessBot Assistant</h3>
                  <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-bold border border-emerald-500/30">AI</span>
                </div>
                <p className="text-[10px] text-zinc-400 font-mono flex items-center gap-1">
                  <Move className="w-2.5 h-2.5 text-emerald-400" />
                  <span>Shift + Drag to move</span>
                </p>
              </div>
            </div>

            {/* Window Controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMinimized(prev => !prev)}
                className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                title={isMinimized ? 'Expand Chat' : 'Minimize Chat'}
              >
                {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 rounded-lg transition-colors"
                title="Close Chatbot"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* CHAT BODY (HIDDEN WHEN MINIMIZED) */}
          {!isMinimized && (
            <>
              {/* MESSAGES LIST */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-zinc-950/80 scrollbar-thin scrollbar-thumb-zinc-800">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-emerald-500 text-black font-semibold rounded-br-xs shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                          : 'bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-bl-xs'
                      }`}
                    >
                      {msg.sender === 'bot' && (
                        <div className="flex items-center gap-1.5 mb-1.5 pb-1 border-b border-zinc-800/80 text-[10px] font-bold text-emerald-400">
                          <Bot className="w-3.5 h-3.5" />
                          <span>MessBot Assistant</span>
                        </div>
                      )}

                      <div className="whitespace-pre-line font-sans">{msg.text}</div>

                      {/* Quick Option Buttons */}
                      {msg.options && msg.options.length > 0 && (
                        <div className="mt-3 pt-2 border-t border-zinc-800/80 flex flex-col gap-1.5">
                          {msg.options.map((opt, idx) => (
                            opt.link ? (
                              <Link
                                key={idx}
                                to={opt.link}
                                onClick={() => setIsOpen(false)}
                                className="px-3 py-1.5 bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/30 text-emerald-300 rounded-xl text-[11px] font-bold transition-all flex items-center justify-between group"
                              >
                                <span>{opt.label}</span>
                                <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                              </Link>
                            ) : (
                              <button
                                key={idx}
                                onClick={() => handleSendMessage(opt.action)}
                                className="px-3 py-1.5 bg-zinc-800 hover:bg-emerald-500 hover:text-black text-zinc-200 rounded-xl text-[11px] font-bold text-left transition-all flex items-center justify-between group"
                              >
                                <span>{opt.label}</span>
                                <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                              </button>
                            )
                          ))}
                        </div>
                      )}
                    </div>

                    <span className="text-[9px] text-zinc-500 mt-1 font-mono px-1">
                      {msg.timestamp}
                    </span>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-center gap-2 p-2.5 bg-zinc-900 border border-zinc-800 rounded-2xl w-fit text-xs text-zinc-400">
                    <Bot className="w-4 h-4 text-emerald-400 animate-pulse" />
                    <span className="text-[11px]">MessBot is typing...</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* QUICK PROMPT SUGGESTION CHIPS */}
              <div className="px-3 py-2 bg-zinc-900/60 border-t border-zinc-800/80 flex gap-2 overflow-x-auto scrollbar-none text-[10px]">
                <button
                  onClick={() => handleSendMessage('Help me select a mess for Pure Veg')}
                  className="px-2.5 py-1 bg-zinc-800 hover:bg-emerald-500 hover:text-black border border-zinc-700 text-zinc-300 font-bold rounded-lg whitespace-nowrap transition-colors flex items-center gap-1"
                >
                  <UtensilsCrossed className="w-3 h-3 text-emerald-400 group-hover:text-black" />
                  <span>Select Mess</span>
                </button>
                <button
                  onClick={() => handleSendMessage('Search today menu and timings')}
                  className="px-2.5 py-1 bg-zinc-800 hover:bg-emerald-500 hover:text-black border border-zinc-700 text-zinc-300 font-bold rounded-lg whitespace-nowrap transition-colors flex items-center gap-1"
                >
                  <Search className="w-3 h-3 text-emerald-400 group-hover:text-black" />
                  <span>Search Menu</span>
                </button>
                <button
                  onClick={() => handleSendMessage('What are the discount coupon codes?')}
                  className="px-2.5 py-1 bg-zinc-800 hover:bg-emerald-500 hover:text-black border border-zinc-700 text-zinc-300 font-bold rounded-lg whitespace-nowrap transition-colors flex items-center gap-1"
                >
                  <Tag className="w-3 h-3 text-emerald-400 group-hover:text-black" />
                  <span>Coupons</span>
                </button>
              </div>

              {/* INPUT FORM */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="p-3 bg-zinc-900 border-t border-zinc-800 flex items-center gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask MessBot (e.g. Select mess, search dish)..."
                  className="flex-1 bg-zinc-950 border border-zinc-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none transition-colors"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="p-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-bold transition-all shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
};
