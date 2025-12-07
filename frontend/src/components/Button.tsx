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
}

export const Button = ({
    children,
    onClick,
    variant = "primary",
    disabled = false,
    className = "",
    type = "button",
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
        >
            {children}
        </button>
    );
};

export default Button;
