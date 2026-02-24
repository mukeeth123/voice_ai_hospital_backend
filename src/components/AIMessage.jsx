import React from 'react';

const AIMessage = ({ message, timestamp, isTyping }) => {
    return (
        <div className="flex items-start gap-3 mb-4 animate-fade-in">
            <div className="w-10 h-10 rounded-full bg-[#2D6CDF]/10 flex items-center justify-center flex-shrink-0">
                <span className="text-[#2D6CDF] text-sm font-bold">AI</span>
            </div>
            <div className="max-w-[70%] bg-white border border-[#E2E8F0] rounded-2xl rounded-tl-none p-4 shadow-sm">
                {isTyping ? (
                    <div className="flex gap-1">
                        <span className="typing-dot w-2 h-2 bg-slate-400 rounded-full" style={{ animationDelay: '0s' }}></span>
                        <span className="typing-dot w-2 h-2 bg-slate-400 rounded-full" style={{ animationDelay: '0.2s' }}></span>
                        <span className="typing-dot w-2 h-2 bg-slate-400 rounded-full" style={{ animationDelay: '0.4s' }}></span>
                    </div>
                ) : (
                    <p className="text-slate-800 leading-relaxed">{message}</p>
                )}
                {timestamp && !isTyping && (
                    <span className="text-xs text-slate-400 mt-2 block">{timestamp}</span>
                )}
            </div>
        </div>
    );
};

export default AIMessage;
