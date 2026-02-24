import React from 'react';

/**
 * AmruthaLogo – the official Amrutha AI logo mark.
 *
 * Props:
 *   size   – pixel size of the icon circle (default 32)
 *   showText – whether to show "Amrutha AI" text next to the icon (default true)
 *   textSize – Tailwind text-size class for the label (default "text-sm")
 *   textColor – Tailwind text-color class (default "text-gray-900")
 */
const AmruthaLogo = ({
    size = 32,
    showText = true,
    textSize = 'text-sm',
    textColor = 'text-gray-900',
}) => {
    return (
        <div className="flex items-center gap-2">
            {/* Icon circle */}
            <div
                style={{
                    width: size,
                    height: size,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #2D6CDF 0%, #4A90E2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: '0 2px 8px rgba(45,108,223,0.35)',
                }}
            >
                {/* Sparkle / plus icon – matches the reference logo */}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={size * 0.55}
                    height={size * 0.55}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    {/* Sparkle: 4-pointed star */}
                    <path d="M12 2 L13.5 10.5 L22 12 L13.5 13.5 L12 22 L10.5 13.5 L2 12 L10.5 10.5 Z" />
                </svg>
            </div>

            {/* Text */}
            {showText && (
                <span className={`font-bold ${textSize} ${textColor} tracking-tight`}>
                    Amrutha AI
                </span>
            )}
        </div>
    );
};

export default AmruthaLogo;
