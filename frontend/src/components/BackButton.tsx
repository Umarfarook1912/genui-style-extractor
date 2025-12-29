/**
 * BackButton - Reusable back navigation button
 */

import { theme } from "../theme";

interface BackButtonProps {
    onClick: () => void;
    label?: string;
}

export function BackButton({ onClick, label = "Back to Start" }: BackButtonProps) {
    return (
        <button
            onClick={onClick}
            style={{
                background: 'none',
                border: 'none',
                color: theme.colors.primary.main,
                cursor: 'pointer',
                fontSize: '14px',
                padding: '8px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
            }}
        >
            ← {label}
        </button>
    );
}
