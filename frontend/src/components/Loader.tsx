/**
 * Loader Component
 * Reusable loading spinner with optional text
 */

interface LoaderProps {
    text?: string;
    size?: "small" | "medium" | "large";
    className?: string;
}

export const Loader = ({
    text,
    size = "medium",
    className = "",
}: LoaderProps) => {
    const sizeClass = size === "small" ? "spinner-small" : size === "large" ? "spinner-large" : "";

    return (
        <div className={`loader-container ${className}`}>
            <div className={`spinner ${sizeClass}`}></div>
            {text && <p className="loader-text">{text}</p>}
        </div>
    );
};

export default Loader;
