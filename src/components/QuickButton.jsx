import React from 'react';

const QuickButton = ({ label, onClick, selected, variant = 'default', disabled = false }) => {

    const baseStyles = "h-12 px-6 rounded-xl font-medium text-sm transition-all duration-200 border flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]";

    const variants = {
        default: selected
            ? "bg-primary text-white border-primary shadow-md shadow-primary/20"
            : "bg-white text-text-primary border-slate-200 hover:bg-primary-light hover:border-primary-light hover:text-primary",

        // For specialized or destructive actions if needed later
        secondary: selected
            ? "bg-slate-700 text-white border-slate-700"
            : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100",
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            aria-pressed={selected}
            className={`${baseStyles} ${variants[variant] || variants.default}`}
        >
            {label}
        </button>
    );
};

export default QuickButton;
