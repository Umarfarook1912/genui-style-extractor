/**
 * Button Component
 * Reusable button with different variants
 */

interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: "primary" | "secondary" | "small";
    disabled?: boolean;
    className?: string;
    type?: "button" | "submit" | "reset";
    style?: React.CSSProperties;
}

export const Button = ({
    children,
    onClick,
    variant = "primary",
    disabled = false,
    className = "",
    type = "button",
    style,
}: ButtonProps) => {
    const baseClass = "btn";
    const variantClass = `btn-${variant}`;
    const combinedClass = `${baseClass} ${variantClass} ${className}`.trim();

    return (
        <button
            type={type}
            className={combinedClass}
            onClick={onClick}
            disabled={disabled}
            style={style}
        >
            {children}
        </button>
    );
};

export default Button;
