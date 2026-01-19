import React from 'react';
import clsx from 'clsx';

interface AtomEffectProps {
  className?: string;
  variant?: 'default' | 'multicolor';
}

export default function AtomEffect({ className, variant = 'default' }: AtomEffectProps) {
  return (
      <div className={clsx("relative atom-container", className)}>
        {/* Glow Background */}
        <div className={clsx(
            "absolute inset-0 blur-2xl rounded-full scale-150 transition-colors duration-500",
            variant === 'multicolor' ? "bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-teal-500/20" : "bg-blue-500/10"
        )}></div>
        
        {/* Spinning Atom */}
        <div className="w-full h-full animate-spin-process">
          <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible drop-shadow-md">
            <defs>
              <linearGradient id={variant === 'multicolor' ? "multiGrad" : "processGrad"} x1="0%" y1="0%" x2="100%" y2="100%">
                {variant === 'multicolor' ? (
                    <>
                        <stop offset="0%" stopColor="#10B981" /> {/* Emerald-500 */}
                        <stop offset="50%" stopColor="#3B82F6" /> {/* Blue-500 */}
                        <stop offset="100%" stopColor="#FFFFFF" /> {/* White */}
                    </>
                ) : (
                    <>
                        <stop offset="0%" stopColor="#3B82F6" />
                        <stop offset="100%" stopColor="#60A5FA" />
                    </>
                )}
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="42" className="morph-orbit" stroke={`url(#${variant === 'multicolor' ? 'multiGrad' : 'processGrad'})`} strokeWidth="2" fill="none" />
            <circle cx="50" cy="50" r="42" className="morph-orbit" stroke={`url(#${variant === 'multicolor' ? 'multiGrad' : 'processGrad'})`} strokeWidth="2" fill="none" style={{ transform: 'rotate(60deg) scaleY(0.45)' }} />
            <circle cx="50" cy="50" r="42" className="morph-orbit" stroke={`url(#${variant === 'multicolor' ? 'multiGrad' : 'processGrad'})`} strokeWidth="2" fill="none" style={{ transform: 'rotate(120deg) scaleY(0.45)' }} />
            <circle cx="50" cy="50" r={variant === 'multicolor' ? 10 : 8} fill={variant === 'multicolor' ? "url(#multiGrad)" : "#3B82F6"} />
          </svg>
        </div>
      </div>
  );
}
