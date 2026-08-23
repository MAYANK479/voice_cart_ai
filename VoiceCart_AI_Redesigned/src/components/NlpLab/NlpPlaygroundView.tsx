import React, { useState } from 'react';
import { Terminal, ArrowLeft, Check, Copy, Sparkles, Send } from 'lucide-react';
import { useShopping } from '../../context/ShoppingContext';
import { parseVoiceCommand } from '../../services/nlpParser';
import { CATEGORIES } from '../../data/categories';
import { SupportedLanguage } from '../../types/speech';


export const NlpPlaygroundView: React.FC = () => {
  const { currentLanguage, setActiveView, processTextInputCommand, addToast } = useShopping();

  const [inputQuery, setInputQuery] = useState('Add 2 boxes of cereal and 1 gallon of organic milk');
  const [selectedLang, setSelectedLang] = useState<SupportedLanguage>(currentLanguage);
  const [copied, setCopied] = useState(false);

  // Compute parsed result using real parser
  const parsedResult = parseVoiceCommand(inputQuery, selectedLang);

  const sampleQueries = [
    'Add 2 boxes of cereal and 1 gallon of organic milk',
    'I need half a dozen pasture raised eggs and 2 lbs apples',
    'Find Colgate toothpaste under $5',
    'Find gluten-free snacks between $2 and $6',
    'Change apples quantity to 5',
    'Remove whole wheat bread from my list',
    'Suggest a substitute for butter',
    'What is in season today?',
    'Añadir 2 botellas de leche orgánica',
    'दो पैकेट दूध जोड़ें',
  ];

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(parsedResult, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExecuteInCart = () => {
    processTextInputCommand(inputQuery, 'demo');
    addToast({
      type: 'success',
      title: 'Dispatched to Cart',
      message: `Executed: "${inputQuery}"`,
    });
    setActiveView('dashboard');
  };

  return (
    <div className="nlp-playground-container">
      {/* Header */}
      <div className="nlp-header">
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
            <Terminal size={24} color="var(--accent-primary)" />
            <span>NLP Playground & Engineering Inspector</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            "See how VoiceCart AI understands natural language." Test deterministic intent classification and multi-entity extraction.
          </p>
        </div>
      </div>

      {/* Input Box & Controls */}
      <div className="glass-panel nlp-input-panel">
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', width: '100%' }}>
          <div style={{ flex: 1, minWidth: '280px', position: 'relative' }}>
            <input
              type="text"
              className="text-input-field"
              style={{ width: '100%', fontSize: '1rem', padding: '0.85rem 1.25rem' }}
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Type any natural language command..."
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <select
              aria-label="Language parser"
              className="select-dropdown"
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value as SupportedLanguage)}
            >
              <option value="en-US">🇺🇸 English (US)</option>
              <option value="es-ES">🇪🇸 Spanish (ES)</option>
              <option value="fr-FR">🇫🇷 French (FR)</option>
              <option value="de-DE">🇩🇪 German (DE)</option>
              <option value="hi-IN">🇮🇳 Hindi (IN)</option>
            </select>

            <button
              className="btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0 1.25rem' }}
              onClick={handleExecuteInCart}
              title="Send to live cart"
            >
              <Send size={15} />
              <span>Execute in Cart</span>
            </button>
          </div>
        </div>

        {/* Quick Sample Queries */}
        <div className="nlp-samples-strip">
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Sparkles size={12} color="#fbbf24" /> Try Samples:
          </span>
          {sampleQueries.map((sample, idx) => (
            <button
              key={idx}
              className="btn-sample-chip"
              onClick={() => setInputQuery(sample)}
              title={`Load: "${sample}"`}
            >
              "{sample}"
            </button>
          ))}
        </div>
      </div>

      {/* Parser Analysis Output Grid */}
      <div className="nlp-output-grid">
        {/* Left Column: Parsed Tokens & Entities Table */}
        <div className="glass-panel nlp-breakdown-panel">
          <div className="panel-sub-header">
            <h3>Extracted Entities & Metadata</h3>
            <div className="confidence-pill">
              {Math.round(parsedResult.confidence * 100)}% Confidence Score
            </div>
          </div>

          {/* Core Intent & Normalized Transcript */}
          <div className="nlp-meta-row">
            <div className="meta-block">
              <span className="meta-label">Classified Intent:</span>
              <span className={`log-intent-badge ${parsedResult.intent.toLowerCase()}`}>
                {parsedResult.intent}
              </span>
            </div>

            <div className="meta-block">
              <span className="meta-label">Suggested Action:</span>
              <span className="meta-value-highlight">
                {parsedResult.suggestedAction || 'NONE'}
              </span>
            </div>

            <div className="meta-block">
              <span className="meta-label">Language:</span>
              <span className="meta-value">{parsedResult.language}</span>
            </div>
          </div>

          <div className="nlp-feedback-box">
            <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Parser Feedback:</span>
            <div style={{ color: 'var(--text-primary)', marginTop: '2px' }}>{parsedResult.feedbackMessage}</div>
          </div>

          {/* Multi-Item Entities Table */}
          {parsedResult.items.length > 0 && (
            <div className="entities-table-wrapper">
              <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                Extracted Items ({parsedResult.items.length})
              </h4>
              <table className="entities-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Unit</th>
                    <th>Category</th>
                    <th>Attributes</th>
                  </tr>
                </thead>
                <tbody>
                  {parsedResult.items.map((item, idx) => {
                    const catInfo = CATEGORIES[item.category];
                    return (
                      <tr key={idx}>
                        <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.name}</td>
                        <td><span className="tag-qty">{item.quantity}</span></td>
                        <td>{item.unit}</td>
                        <td>
                          <span className="category-pill-sm">
                            {catInfo?.emoji} {catInfo?.name || item.category}
                          </span>
                        </td>
                        <td>
                          {item.attributes && item.attributes.length > 0 ? (
                            <span className="tag-attr">{item.attributes.join(', ')}</span>
                          ) : (
                            <span style={{ color: 'var(--text-muted)' }}>—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Search Criteria Table if Search Intent */}
          {parsedResult.filterCriteria && (
            <div className="search-criteria-card">
              <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                Parsed Search Parameters
              </h4>
              <div className="criteria-grid">
                <div>
                  <span className="criteria-label">Query:</span>
                  <strong>{parsedResult.filterCriteria.query || 'Any'}</strong>
                </div>
                <div>
                  <span className="criteria-label">Brand:</span>
                  <strong>{parsedResult.filterCriteria.brand || 'Any'}</strong>
                </div>
                <div>
                  <span className="criteria-label">Size:</span>
                  <strong>{parsedResult.filterCriteria.size || 'Any'}</strong>
                </div>
                <div>
                  <span className="criteria-label">Max Price:</span>
                  <strong>
                    {parsedResult.filterCriteria.maxPrice !== undefined
                      ? `$${parsedResult.filterCriteria.maxPrice.toFixed(2)}`
                      : 'None'}
                  </strong>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Raw JSON AST Output */}
        <div className="glass-panel nlp-json-panel">
          <div className="panel-sub-header">
            <h3>Raw JSON AST Output</h3>
            <button
              className="btn-subtle"
              onClick={handleCopyJson}
              title="Copy JSON representation"
            >
              {copied ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
              <span>{copied ? 'Copied' : 'Copy JSON'}</span>
            </button>
          </div>

          <pre className="json-ast-display">
            <code>{JSON.stringify(parsedResult, null, 2)}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
