/**
 * ExtractionModal - Modal for selecting extraction source
 */

import { theme } from "../theme";

interface ExtractionModalProps {
  onClose: () => void;
  onSelectExtract: () => void;
  onSelectUpload: () => void;
  onSelectFigma: () => void;
}

export function ExtractionModal({
  onClose,
  onSelectExtract,
  onSelectUpload,
  onSelectFigma,
}: ExtractionModalProps) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: theme.zIndex.modal,
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          maxWidth: '400px',
          width: '100%',
          position: 'relative',
          background: theme.colors.background.primary,
          padding: '24px',
          borderRadius: theme.borderRadius.xl,
          boxShadow: theme.shadows.xl,
        }}
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'transparent',
            border: 'none',
            fontSize: '20px',
            color: theme.colors.text.tertiary,
            cursor: 'pointer',
            padding: '4px',
            lineHeight: '1',
          }}
        >
          ×
        </button>

        <h3
          style={{
            margin: '0 0 20px 0',
            fontSize: '18px',
            color: theme.colors.text.primary,
            fontWeight: '600',
          }}
        >
          Choose an extraction source
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Extract from Web */}
          <button
            onClick={onSelectExtract}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px',
              background: theme.colors.primary.gradient,
              color: theme.colors.text.inverse,
              border: 'none',
              borderRadius: theme.borderRadius.lg,
              cursor: 'pointer',
              fontSize: '15px',
              fontWeight: '500',
              textAlign: 'left',
              transition: theme.transitions.normal,
              width: '100%',
            }}
          >
            <span style={{ width: 20 }} />
            <span>Extract from Web</span>
          </button>

          {/* Upload Image */}
          <button
            onClick={onSelectUpload}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px',
              background: theme.colors.background.secondary,
              color: theme.colors.text.primary,
              border: `1px solid ${theme.colors.border.main}`,
              borderRadius: theme.borderRadius.lg,
              cursor: 'pointer',
              fontSize: '15px',
              fontWeight: '500',
              textAlign: 'left',
              transition: theme.transitions.normal,
              width: '100%',
            }}
          >
            <span style={{ width: 20 }} />
            <span>Upload Image</span>
          </button>

          {/* Figma */}
          <button
            onClick={onSelectFigma}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px',
              background: theme.colors.background.secondary,
              color: theme.colors.text.primary,
              border: `1px solid ${theme.colors.border.main}`,
              borderRadius: theme.borderRadius.lg,
              cursor: 'pointer',
              fontSize: '15px',
              fontWeight: '500',
              textAlign: 'left',
              transition: theme.transitions.normal,
              width: '100%',
            }}
          >
            <span style={{ width: 20 }} />
            <span>Figma Plugin</span>
          </button>
        </div>
      </div>
    </div>
  );
}
