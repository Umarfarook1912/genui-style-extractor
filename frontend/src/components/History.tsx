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

export function History() {
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
        setHistory(result.data || []);
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
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <Loader text="Loading your conversion history..." />
      </div>
    );
  }

  if (error) {
    return (
      <Card style={{ margin: '20px' }}>
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <p style={{ color: '#ef4444', marginBottom: '16px' }}>
            Error: {error}
          </p>
          <Button onClick={fetchHistory} variant="primary">
            Retry
          </Button>
        </div>
      </Card>
    );
  }

  if (history.length === 0) {
    return (
      <Card style={{ margin: '20px', textAlign: 'center', padding: '40px' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }} />
        <h3 style={{ marginBottom: '8px' }}>No conversion history yet</h3>
        <p style={{ color: '#666', fontSize: '14px' }}>
          Start by extracting and converting some styles!
        </p>
      </Card>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
      }}>
        <h2 style={{ margin: 0, fontSize: '20px' }}>
          Your Conversions ({history.length})
        </h2>
        <Button onClick={fetchHistory} variant="secondary" style={{
          padding: '6px 12px',
          fontSize: '13px',
        }}>
          Refresh
        </Button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {history.map((record) => (
          <Card key={record.id} style={{ padding: '16px' }}>
            {/* Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '12px',
                cursor: 'pointer',
              }}
              onClick={() => toggleExpand(record.id)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    backgroundColor: getFormatBadgeColor(record.format),
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                  }}
                >
                  {record.format}
                </span>
                <span style={{ fontSize: '13px', color: '#666' }}>
                  {formatDate(record.created_time)}
                </span>
              </div>
              <span style={{ fontSize: '18px' }}>
                {expandedId === record.id ? '▼' : '▶'}
              </span>
            </div>

            {/* Code Preview (Collapsed) */}
            {expandedId !== record.id && (
              <div
                style={{
                  backgroundColor: '#f7fafc',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontFamily: 'monospace',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  color: '#4a5568',
                }}
              >
                {record.output_code.split('\n')[0]}...
              </div>
            )}

            {/* Expanded Content */}
            {expandedId === record.id && (
              <div style={{ marginTop: '12px' }}>
                <h4 style={{ fontSize: '14px', marginBottom: '8px' }}>
                  Generated Code:
                </h4>
                <CodeBlock code={record.output_code} language={record.format} />

                {record.input_styles && (
                  <>
                    <h4 style={{ fontSize: '14px', marginTop: '16px', marginBottom: '8px' }}>
                      Input Styles:
                    </h4>
                    <div
                      style={{
                        backgroundColor: '#f7fafc',
                        padding: '12px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontFamily: 'monospace',
                        maxHeight: '200px',
                        overflow: 'auto',
                        color: '#4a5568',
                      }}
                    >
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
