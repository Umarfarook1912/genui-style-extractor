/**
 * StylesGrid - Display extracted styles in a grid layout
 */

type Styles = Record<string, string>;

interface StylesGridProps {
  styles: Styles;
}

export function StylesGrid({ styles }: StylesGridProps) {
  return (
    <div className="styles-grid">
      <div>
        <strong>Size:</strong> {styles.width} × {styles.height}
      </div>
      <div>
        <strong>Color:</strong>{" "}
        <span style={{ color: styles.color }}>{styles.color}</span>
      </div>
      <div>
        <strong>Background:</strong>{" "}
        <span
          style={{
            backgroundColor: styles.backgroundColor,
            padding: "2px 8px",
            borderRadius: 4,
          }}
        >
          {styles.backgroundColor}
        </span>
      </div>
      <div>
        <strong>Font:</strong> {styles.fontSize} / {styles.fontWeight}
      </div>
    </div>
  );
}
