import React from 'react';
import clsx from 'clsx';

interface BrandAtomProps {
  className?: string;
  variant?: 'white' | 'colored' | 'multicolor';
}

export default function BrandAtom({ className, variant = 'white' }: BrandAtomProps) {
    const isValues = {
        white: variant === 'white',
        colored: variant === 'colored',
        multicolor: variant === 'multicolor'
    };
    
    // Colored or Multicolor share similar "active" traits (shadows, classes)
    const isActive = isValues.colored || isValues.multicolor;

    const gradientId = isValues.multicolor ? "brandAtomMultiGrad" : (isValues.colored ? "brandAtomColorGrad" : "brandAtomWhiteGrad");
    const orbitClass = isActive ? "landing-orbit" : "sidebar-orbit";

  return (
      <div className={clsx("relative atom-container", className)}>
         <div className="w-full h-full atom-breathe">
            <svg viewBox="0 0 100 100" className={clsx("w-full h-full overflow-visible", isActive ? "drop-shadow-md" : "")}>
               <defs>
                   {isValues.multicolor ? (
                        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#10B981" /> {/* Emerald */}
                            <stop offset="50%" stopColor="#0EA5E9" /> {/* Sky Blue */}
                            <stop offset="100%" stopColor="#34D399" /> {/* Teal/Green for smooth loop */}
                        </linearGradient>
                   ) : isValues.colored ? (
                        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#0284C7" /> {/* Ocean Deep Blue */}
                            <stop offset="100%" stopColor="#38BDF8" /> {/* Ocean Surface Blue */}
                        </linearGradient>
                   ) : (
                        <linearGradient id={gradientId} x1="0" y1="0" x2="100" y2="100">
                            <stop offset="0" stopColor="#60A5FA"/>
                            <stop offset="1" stopColor="#FFFFFF"/>
                        </linearGradient>
                   )}
               </defs>
               
               {/* Fast Smooth Spinning Group with Sharper Edges */}
               <g className={clsx("origin-center will-change-transform", isValues.multicolor ? "animate-[spin_0.8s_linear_infinite]" : "animate-[spin_4s_linear_infinite]")} style={{ transformBox: 'fill-box' }}>
                   <circle cx="50" cy="50" r="38" className={clsx("morph-orbit opacity-90", orbitClass)} stroke={`url(#${gradientId})`} style={{ transform: 'rotate(0deg) scaleY(0.45)' }} />
                   <circle cx="50" cy="50" r="38" className={clsx("morph-orbit opacity-90", orbitClass)} stroke={`url(#${gradientId})`} style={{ transform: 'rotate(60deg) scaleY(0.45)' }} />
                   <circle cx="50" cy="50" r="38" className={clsx("morph-orbit opacity-90", orbitClass)} stroke={`url(#${gradientId})`} style={{ transform: 'rotate(120deg) scaleY(0.45)' }} />
               </g>
               
                {isActive ? (
                   <>
                       <circle cx="50" cy="50" r="10" fill={isValues.multicolor ? `url(#${gradientId})` : "#0284C7"} className="filter drop-shadow-md" />
                       <circle cx="50" cy="50" r="4" fill="white" />
                   </>
               ) : (
                   <circle cx="50" cy="50" r="10" fill="#FFFFFF"/>
               )}
            </svg>
         </div>
      </div>
  );
}
