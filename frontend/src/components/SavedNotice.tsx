import React from 'react';

interface SavedNoticeProps {
    children?: React.ReactNode;
    text?: string;
    variant?: 'success' | 'info' | 'error';
    className?: string;
}

export function SavedNotice({ children, text, variant = 'success', className = '' }: SavedNoticeProps) {
    const content = children ?? text ?? 'Saved successfully!';
    return (
        <span className={["saved-notice", variant, className].filter(Boolean).join(' ')}>
            {content}
        </span>
    );
}

export default SavedNotice;
