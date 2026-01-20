'use client';

import { useEffect, useRef, useState } from 'react';

interface AnimatedCounterProps {
    end: number;
    duration?: number;
    suffix?: string;
    className?: string;
}

export default function AnimatedCounter({ end, duration = 2000, suffix = '', className = '' }: AnimatedCounterProps) {
    const [count, setCount] = useState(0);
    const countRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (countRef.current) {
            observer.observe(countRef.current);
        }

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isVisible) return;

        let startTime: number | null = null;
        let animationFrameId: number;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / duration, 1);
            
            // Easing function for smoother animation
            const easeOutQuart = (x: number): number => 1 - Math.pow(1 - x, 4);
            
            const currentCount = Math.floor(easeOutQuart(percentage) * end);
            setCount(currentCount);

            if (progress < duration) {
                animationFrameId = requestAnimationFrame(animate);
            }
        };

        animationFrameId = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrameId);
    }, [isVisible, end, duration]);

    return (
        <div ref={countRef} className={className}>
            {count}{suffix}
        </div>
    );
}
