import React from 'react';

const UserMessage = ({ message, timestamp }) => {
    return (
        <div className="flex items-start gap-3 mb-4 justify-end animate-fade-in">
            <div className="max-w-[70%] bg-[#EAF4FF] border border-[#2D6CDF]/20 rounded-2xl rounded-tr-none p-4">
                <p className="text-slate-800 leading-relaxed">{message}</p>
                {timestamp && (
                    <span className="text-xs text-slate-500 mt-2 block">{timestamp}</span>
                )}
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 text-sm font-bold">U</span>
            </div>
        </div>
    );
};

export default UserMessage;
