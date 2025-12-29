/**
 * CodeBlock Component
 * Displays formatted code with copy functionality
 */

import { useState } from "react";

interface CodeBlockProps {
    code: string;
    language?: string;
    showCopy?: boolean;
    className?: string;
}

export const CodeBlock = ({
    code,
    language = "text",
    showCopy = true,
    className = "",
}: CodeBlockProps) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    return (
        <div className={`code-block ${className}`}>
            <div className="code-block-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="code-block-language">{language}</span>
                </div>
                {showCopy && (
                    <button className="btn btn-small copy-btn" onClick={handleCopy} aria-label="Copy code">
                        {copied ? "Copied!" : "Copy"}
                    </button>
                )}
            </div>

            <pre className="code-output">
                <code>{code}</code>
            </pre>
        </div>
    );
};

export default CodeBlock;
