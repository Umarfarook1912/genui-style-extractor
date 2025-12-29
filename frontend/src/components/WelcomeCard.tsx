/**
 * WelcomeCard - Welcome screen component
 */

import { Card } from "./Card";
import { Button } from "./Button";
import { theme } from "../theme";

interface WelcomeCardProps {
    onStartExtraction: () => void;
    onViewHistory?: () => void;
}

export function WelcomeCard({ onStartExtraction, onViewHistory }: WelcomeCardProps) {
    return (
        <Card className="mode-selector">
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <h2 style={{ marginBottom: '16px', fontSize: '20px' }}>Welcome!</h2>
                <p style={{ marginBottom: '24px', color: '#666', lineHeight: '1.6' }}>
                    Start extracting styles from websites, images, or Figma designs
                </p>
                <Button
                    onClick={onStartExtraction}
                    variant="primary"
                    style={{ fontSize: '15px', padding: '12px 24px' }}
                >
                    Start Extraction
                </Button>
                {onViewHistory && (
                    <div style={{ marginTop: '20px' }}>
                        <button
                            onClick={onViewHistory}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: theme.colors.primary.main,
                                cursor: 'pointer',
                                textDecoration: 'underline',
                                fontSize: '14px'
                            }}
                        >
                            View History
                        </button>
                    </div>
                )}
            </div>
        </Card>
    );
}
