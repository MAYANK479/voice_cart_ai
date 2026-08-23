import React, { useState, useMemo } from 'react';
import { History, Trash2, Download, FileSpreadsheet, ArrowLeft, Search, Filter, Mic, Type, Sparkles } from 'lucide-react';
import { useShopping } from '../../context/ShoppingContext';

export const HistoryView: React.FC = () => {
  const { commandLogs, clearCommandLogs, exportCommandLogs, setActiveView, processTextInputCommand } = useShopping();
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedIntent, setSelectedIntent] = useState<string>('all');

  const filteredLogs = useMemo(() => {
    return commandLogs.filter((log) => {
      if (selectedIntent !== 'all' && log.intent !== selectedIntent) {
        return false;
      }
      if (searchFilter.trim()) {
        const q = searchFilter.toLowerCase();
        return log.command.toLowerCase().includes(q) || log.resultMessage.toLowerCase().includes(q);
      }
      return true;
    });
  }, [commandLogs, searchFilter, selectedIntent]);

  const formatTimestamp = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch {
      return iso;
    }
  };

  return (
    <div className="history-container">
      {/* Header */}
      <div className="history-header">
        <div>
          <button
            className="btn-subtle"
            style={{ marginBottom: '0.5rem', padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}
            onClick={() => setActiveView('dashboard')}
          >
            <ArrowLeft size={14} />
            <span>Back to Dashboard</span>
          </button>
          <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <History size={24} color="var(--accent-primary)" />
            <span>Voice & Command Execution History</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            Chronological audit log of voice recognition events, parsed NLP intents, and list modifications.
          </p>
        </div>

        <div className="history-actions">
          {commandLogs.length > 0 && (
            <>
              <button
                className="btn-subtle"
                onClick={() => exportCommandLogs('csv')}
                title="Export history as CSV"
              >
                <FileSpreadsheet size={14} color="#06b6d4" />
                <span>Export CSV</span>
              </button>

              <button
                className="btn-subtle"
                onClick={() => exportCommandLogs('json')}
                title="Export history as JSON"
              >
                <Download size={14} />
                <span>Export JSON</span>
              </button>

              <button
                className="btn-subtle danger"
                onClick={clearCommandLogs}
                title="Clear all logged commands"
              >
                <Trash2 size={14} />
                <span>Clear History</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="history-filter-bar glass-panel">
        <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
          <Search size={15} className="search-icon-inside" />
          <input
            type="text"
            className="text-input-field"
            style={{ width: '100%', paddingLeft: '2.3rem' }}
            placeholder="Search command history..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={15} color="var(--text-muted)" />
          <select
            aria-label="Filter by intent"
            className="select-dropdown"
            value={selectedIntent}
            onChange={(e) => setSelectedIntent(e.target.value)}
          >
            <option value="all">All Intents ({commandLogs.length})</option>
            <option value="ADD_ITEM">Add Item</option>
            <option value="REMOVE_ITEM">Remove Item</option>
            <option value="MODIFY_QUANTITY">Modify Quantity</option>
            <option value="FILTER_PRICE">Price Search</option>
            <option value="SEARCH_CATALOG">Catalog Search</option>
            <option value="GET_SUGGESTIONS">Restock</option>
            <option value="GET_SUBSTITUTE">Substitute</option>
            <option value="GET_SEASONAL">Seasonal</option>
          </select>
        </div>
      </div>

      {/* History Log Table / Cards */}
      {filteredLogs.length === 0 ? (
        <div className="glass-panel empty-state" style={{ padding: '3rem' }}>
          <History size={36} color="var(--text-muted)" />
          <h3>No Command Logs Found</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
            Speak or execute commands from the dashboard to see history logged here.
          </p>
        </div>
      ) : (
        <div className="history-logs-list">
          {filteredLogs.map((log) => {
            const isSuccess = log.success;
            return (
              <div key={log.id} className="history-log-card glass-panel">
                <div className="log-header-row">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span className="log-time">{formatTimestamp(log.timestamp)}</span>
                    <span className={`log-intent-badge ${log.intent.toLowerCase()}`}>
                      {log.actionName || log.intent}
                    </span>
                    <span className="log-source-pill">
                      {log.source === 'voice' ? (
                        <><Mic size={11} color="var(--accent-primary)" /> Voice</>
                      ) : log.source === 'demo' ? (
                        <><Sparkles size={11} color="#fbbf24" /> Demo</>
                      ) : (
                        <><Type size={11} color="var(--text-muted)" /> Text</>
                      )}
                    </span>
                  </div>

                  <div className="log-confidence-tag">
                    Confidence: <strong>{Math.round(log.confidence * 100)}%</strong>
                  </div>
                </div>

                <div className="log-command-text">
                  "{log.command}"
                </div>

                <div className="log-footer-row">
                  <div className={`log-result-text ${isSuccess ? 'success' : 'warn'}`}>
                    {log.resultMessage}
                  </div>

                  <button
                    className="btn-subtle"
                    style={{ padding: '0.2rem 0.5rem', fontSize: '0.72rem' }}
                    onClick={() => {
                      processTextInputCommand(log.command, 'demo');
                      setActiveView('dashboard');
                    }}
                    title="Re-run this command"
                  >
                    Re-run
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
