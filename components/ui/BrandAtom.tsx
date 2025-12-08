import React from 'react';
import clsx from 'clsx';

interface BrandAtomProps {
  className?: string;
}

export default function BrandAtom({ className }: BrandAtomProps) {
  return (
      <div className={clsx("relative atom-container", className)}>
         <div className="w-full h-full atom-breathe">
            <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
               <defs>
                   <linearGradient id="brandAtomGrad" x1="0" y1="0" x2="100" y2="100">
                       <stop offset="0" stopColor="#60A5FA"/>
                       <stop offset="1" stopColor="#FFFFFF"/>
                   </linearGradient>
               </defs>
               <circle cx="50" cy="50" r="42" className="morph-orbit orbit-1 sidebar-orbit" stroke="url(#brandAtomGrad)" />
               <circle cx="50" cy="50" r="42" className="morph-orbit orbit-2 sidebar-orbit" stroke="url(#brandAtomGrad)" style={{transform: 'rotate(60deg) scaleY(0.45)'}} />
               <circle cx="50" cy="50" r="42" className="morph-orbit orbit-3 sidebar-orbit" stroke="url(#brandAtomGrad)" style={{transform: 'rotate(120deg) scaleY(0.45)'}} />
               <circle cx="50" cy="50" r="10" fill="#FFFFFF"/>
            </svg>
         </div>
      </div>
  );
}
