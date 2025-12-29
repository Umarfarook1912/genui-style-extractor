/**
 * History Component - Display user's conversion history
 * Fetches data from Catalyst getHistory endpoint
 */

import { useState, useEffect } from 'react';
import { Card } from './Card';
import { CodeBlock } from './CodeBlock';
import { Loader } from './Loader';
import { Button } from './Button';
import { API_BASE_URL } from '../constants/api';

interface ConversionRecord {
  id: string;
  format: string;
  input_styles: string;
  output_code: string;
  user_agent?: string;
  created_time: string;
}

interface HistoryResponse {
  success: boolean;
  data: ConversionRecord[];
  message?: string;
  pagination?: {
    total: number;
    hasMore: boolean;
  };
}

interface HistoryProps {
  onBack?: () => void;
}

export function History({ onBack }: HistoryProps) {
  const [history, setHistory] = useState<ConversionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/server/getHistory/?limit=50`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result: HistoryResponse = await response.json();

      if (result.success) {
        // Ensure newest items appear first by sorting on created_time (descending)
        const items = result.data || [];
        items.sort((a, b) => {
          const ta = new Date(a.created_time).getTime();
          const tb = new Date(b.created_time).getTime();
          return tb - ta;
        });
        setHistory(items);
      } else {
        setError(result.message || 'Failed to fetch history');
      }
    } catch (err) {
      console.error('Failed to fetch history:', err);
      setError(err instanceof Error ? err.message : 'Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  const getFormatBadgeColor = (format: string) => {
    switch (format.toLowerCase()) {
      case 'tailwind':
        return '#06b6d4';
      case 'css':
        return '#3b82f6';
      case 'jsx':
        return '#8b5cf6';
      default:
        return '#6b7280';
    }
  };

  if (loading) {
    return (
      <div className="history-loading">
        <Loader text="Loading your conversion history..." />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="history-error">
        <div>
          <p className="history-error-text">Error: {error}</p>
          <div style={{ textAlign: 'center' }}>
            <Button onClick={fetchHistory} variant="primary">Retry</Button>
          </div>
        </div>
      </Card>
    );
  }

  if (history.length === 0) {
    return (
      <Card className="history-empty">
        <div className="history-empty-icon" />
        <h3>No conversion history yet</h3>
        <p>Start by extracting and converting some styles!</p>
      </Card>
    );
  }

  return (
    <div className="history-container">
      <div className="history-back-row">
        <div className="back-link" onClick={() => onBack && onBack()}>
          ← Back to Convert
        </div>
      </div>

      <div className="history-header-row">
        <h2 className="history-title">Conversion History <span className="history-count">({history.length})</span></h2>
        <button className="icon-btn" aria-label="Refresh history" onClick={fetchHistory}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 12a9 9 0 10-3.16 6.31" stroke="#06b6d4" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M21 3v6h-6" stroke="#06b6d4" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <div className="history-list">
        {history.map((record) => (
          <Card key={record.id} className="conversion-card">
            <div className="conversion-card-header" onClick={() => toggleExpand(record.id)}>
              <div className="conversion-card-left">
                <span
                  className="format-badge"
                  style={{ backgroundColor: getFormatBadgeColor(record.format) }}
                >
                  {record.format}
                </span>
                <span className="conversion-date">{formatDate(record.created_time)}</span>
              </div>
              <div className="conversion-expand">{expandedId === record.id ? '▼' : '▶'}</div>
            </div>

            {expandedId !== record.id && (
              <div className="chat-bubble preview">
                {record.output_code.split('\n')[0]}...
              </div>
            )}

            {expandedId === record.id && (
              <div className="conversion-expanded">
                <h4>Generated Code:</h4>
                <div className="chat-bubble large">
                  <CodeBlock code={record.output_code} language={record.format} />
                </div>

                {record.input_styles && (
                  <>
                    <h4 className="input-styles-title">Input Styles:</h4>
                    <div className="input-styles-block">
                      {record.input_styles}
                    </div>
                  </>
                )}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
