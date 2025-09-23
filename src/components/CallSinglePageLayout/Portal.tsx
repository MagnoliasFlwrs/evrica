import React, { useEffect, useState, ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
    children: ReactNode;
    isOpen: boolean;
}

const Portal: React.FC<PortalProps> = ({ children, isOpen }) => {
    const [container, setContainer] = useState<HTMLDivElement | null>(null);

    useEffect(() => {
        if (isOpen && !container) {
            const portalContainer = document.createElement('div');
            portalContainer.className = 'checklist-modal-portal';
            document.body.appendChild(portalContainer);
            setContainer(portalContainer);
        }
        return () => {
            if (container) {
                if (document.body.contains(container)) {
                    document.body.removeChild(container);
                }
                setContainer(null);
            }
        };
    }, [isOpen, container]);

    if (!isOpen || !container) return null;

    return createPortal(children, container);
};

export default Portal;