// Tooltip.jsx
import { useState } from 'react';

const Tooltip = ({ children, text, position = 'top' }) => {
    const [isVisible, setIsVisible] = useState(false);

    const positionClasses = {
        top: 'bottom-full mb-2',
        bottom: 'top-full mt-2',
        left: 'right-full mr-2',
        right: 'left-full ml-2'
    };

    const arrowClasses = {
        top: 'top-full border-t-surface',
        bottom: 'bottom-full border-b-surface', 
        left: 'left-full border-l-surface',
        right: 'right-full border-r-surface'
    };

    return (
        <div 
            className="relative inline-block"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            {children}
            {isVisible && (
                <div className={`absolute z-50 px-3 py-2 text-xs font-medium text-primary bg-surface rounded-lg shadow-lg whitespace-nowrap ${positionClasses[position]} left-1/2 transform -translate-x-1/2`}>
                    {text}
                    <div className={`absolute w-0 h-0 border-4 border-transparent ${arrowClasses[position]} left-1/2 transform -translate-x-1/2`}></div>
                </div>
            )}
        </div>
    );
};

export default Tooltip;
