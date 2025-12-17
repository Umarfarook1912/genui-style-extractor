/**
 * Card Component
 * Reusable card container for content sections
 */

interface CardProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
    style?: React.CSSProperties;
}

export const Card = ({ children, className = "", title, style }: CardProps) => {
    return (
        <div className={`card ${className}`} style={style}>
            {title && <h3 className="card-title">{title}</h3>}
            <div className="card-content">{children}</div>
        </div>
    );
};

export default Card;
