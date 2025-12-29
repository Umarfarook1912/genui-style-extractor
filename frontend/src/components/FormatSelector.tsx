/**
 * FormatSelector - Component for selecting output format
 */

type OutputFormat = "css" | "tailwind" | "jsx";

interface FormatSelectorProps {
  format: OutputFormat;
  useRem: boolean;
  onFormatChange: (format: OutputFormat) => void;
  onUseRemChange: (useRem: boolean) => void;
}

export function FormatSelector({ format, useRem, onFormatChange, onUseRemChange }: FormatSelectorProps) {
  return (
    <>
      <div className="format-selector">
        <label>
          <input
            type="radio"
            value="tailwind"
            checked={format === "tailwind"}
            onChange={(e) => onFormatChange(e.target.value as OutputFormat)}
          />
          Tailwind CSS
        </label>
        <label>
          <input
            type="radio"
            value="css"
            checked={format === "css"}
            onChange={(e) => onFormatChange(e.target.value as OutputFormat)}
          />
          CSS
        </label>
        <label>
          <input
            type="radio"
            value="jsx"
            checked={format === "jsx"}
            onChange={(e) => onFormatChange(e.target.value as OutputFormat)}
          />
          JSX Style
        </label>
      </div>

      {format === "css" && (
        <label className="checkbox">
          <input
            type="checkbox"
            checked={useRem}
            onChange={(e) => onUseRemChange(e.target.checked)}
          />
          Convert px to rem
        </label>
      )}
    </>
  );
}
