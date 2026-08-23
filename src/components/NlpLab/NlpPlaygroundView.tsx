import React, { useState, useEffect } from 'react';
import { Terminal, ArrowLeft, Check, Copy, Sparkles, Send, Cpu, Key, Zap } from 'lucide-react';
import { useShopping } from '../../context/ShoppingContext';
import { parseVoiceCommand } from '../../services/nlpParser';
import { LLMFallbackService } from '../../services/llmFallback';
import { CATEGORIES } from '../../data/categories';
import { SupportedLanguage, ParsedCommand } from '../../types/speech';

export const NlpPlaygroundView: React.FC = () => {
  const { currentLanguage, setActiveView, processTextInputCommand, addToast } = useShopping();

  const [inputQuery, setInputQuery] = useState('Add 2 boxes of cereal and 1 gallon of organic milk');
  const [selectedLang, setSelectedLang] = useState<SupportedLanguage>(currentLanguage);
  const [copied, setCopied] = useState(false);
  const [parserMode, setParserMode] = useState<'rule' | 'llm'>('rule');
  const [llmApiKey, setLlmApiKey] = useState<string>(() => LLMFallbackService.getApiKey());
  const [llmResult, setLlmResult] = useState<ParsedCommand | null>(null);
  const [isLoadingLlm, setIsLoadingLlm] = useState<boolean>(false);
  const [parseLatencyMs, setParseLatencyMs] = useState<number>(0);

  // Compute deterministic rule-based result synchronously
  const ruleResult = React.useMemo(() => {
    const start = performance.now();
    const res = parseVoiceCommand(inputQuery, selectedLang);
    const end = performance.now();
    if (parserMode === 'rule') {
      setParseLatencyMs(Math.round((end - start) * 100) / 100);
    }
    return res;
  }, [inputQuery, selectedLang, parserMode]);

  // Run LLM parsing when in LLM mode or on request
  useEffect(() => {
    if (parserMode === 'llm') {
      let isMounted = true;
      setIsLoadingLlm(true);
      const start = performance.now();
      LLMFallbackService.parseWithLLM(inputQuery, selectedLang).then((res) => {
        if (isMounted) {
          const end = performance.now();
          setLlmResult(res);
          setParseLatencyMs(Math.round(end - start));
          setIsLoadingLlm(false);
        }
      });
      return () => {
        isMounted = false;
      };
    }
  }, [inputQuery, selectedLang, parserMode]);

  const activeResult: ParsedCommand = parserMode === 'llm' && llmResult ? llmResult : ruleResult;

  const sampleQueries = [
    'Add 2 boxes of cereal and 1 gallon of organic milk',
    'I need half a dozen pasture raised eggs and 2 lbs apples',
    'Find Colgate toothpaste under $5',
    'Find gluten-free snacks between $2 and $6',
    'Change apples quantity to 5',
    'Remove whole wheat bread from my list',
    'Suggest a substitute for butter',
    'What is in season today?',
    'I want to bake a strawberry cake',
    'Proceed to checkout',
  ];

  const handleSaveApiKey = (key: string) => {
    setLlmApiKey(key);
    LLMFallbackService.setApiKey(key);
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(activeResult, null, 2));
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
            <Terminal size={24} color="#059669" />
            <span>Natural Language Inspector & Dual-Engine Lab</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            Inspect deterministic rule-based pattern matching (fast-path, 0ms) and AI/LLM semantic extraction.
          </p>
        </div>
      </div>

      {/* Engine Architecture Callout */}
      <div className="glass-panel" style={{ padding: '0.85rem 1.25rem', borderLeft: '4px solid #059669', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Cpu size={20} color="#059669" />
          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            <strong>Dual-Engine Architecture:</strong> Fast deterministic pattern matcher for instant client-side execution (&lt;1ms), backed by optional LLM semantic fallback.

          </div>
        </div>

        {/* Engine Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            className={`btn-subtle ${parserMode === 'rule' ? 'active' : ''}`}
            onClick={() => setParserMode('rule')}
            style={{
              fontWeight: 700,
              fontSize: '0.78rem',
              background: parserMode === 'rule' ? '#059669' : undefined,
              color: parserMode === 'rule' ? '#FFFFFF' : undefined,
            }}
          >
            <Zap size={13} />
            <span>Rule Parser (0ms)</span>
          </button>
          <button
            className={`btn-subtle ${parserMode === 'llm' ? 'active' : ''}`}
            onClick={() => setParserMode('llm')}
            style={{
              fontWeight: 700,
              fontSize: '0.78rem',
              background: parserMode === 'llm' ? '#059669' : undefined,
              color: parserMode === 'llm' ? '#FFFFFF' : undefined,
            }}
          >
            <Sparkles size={13} />
            <span>AI / LLM Mode</span>
          </button>
        </div>
      </div>

      {/* Optional Gemini API Key input for LLM mode */}
      {parserMode === 'llm' && (
        <div className="glass-panel" style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(5, 150, 105, 0.05)' }}>
          <Key size={16} color="#059669" />
          <input
            type="password"
            placeholder="Optional: Enter Gemini API key (e.g. AIza...) or leave empty for smart semantic engine"
            value={llmApiKey}
            onChange={(e) => handleSaveApiKey(e.target.value)}
            style={{ flex: 1, padding: '0.4rem 0.6rem', fontSize: '0.8rem', borderRadius: '6px', border: '1px solid var(--border-glass)', background: 'var(--bg-elevated)', color: 'var(--text-primary)' }}
          />
        </div>
      )}

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
              className="btn-primary-action"
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                ⏱️ Latency: {parseLatencyMs}ms {isLoadingLlm && '(running...)'}
              </span>
              <div className="confidence-pill">
                {Math.round(activeResult.confidence * 100)}% Confidence Score
              </div>
            </div>
          </div>

          {/* Core Intent & Normalized Transcript */}
          <div className="intent-display-card">
            <div className="intent-badge-row">
              <span className="intent-label">PARSED INTENT:</span>
              <span className="intent-pill">{activeResult.intent}</span>
            </div>
            <div className="nlp-normalized-text">
              <strong>Normalized:</strong> "{activeResult.normalizedTranscript}"
            </div>
            <div className="nlp-feedback-preview">
              <strong>Assistant Output:</strong> "{activeResult.feedbackMessage}"
            </div>
          </div>

          {/* Extracted Item Entities Table */}
          {activeResult.items && activeResult.items.length > 0 ? (
            <div className="entities-table-container">
              <h4 style={{ fontSize: '0.88rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                Extracted Grocery Entities ({activeResult.items.length})
              </h4>
              <table className="entities-table">
                <thead>
                  <tr>
                    <th>Item Name</th>
                    <th>Qty</th>
                    <th>Unit</th>
                    <th>Category</th>
                    <th>Attributes</th>
                  </tr>
                </thead>
                <tbody>
                  {activeResult.items.map((item, index) => {
                    const categoryInfo = CATEGORIES[item.category];
                    return (
                      <tr key={index}>
                        <td style={{ fontWeight: 600 }}>{item.name}</td>
                        <td>
                          <span className="qty-tag">{item.quantity}</span>
                        </td>
                        <td>{item.unit}</td>
                        <td>
                          <span
                            className="category-pill-mini"
                            style={{
                              backgroundColor: categoryInfo?.bgColor || 'rgba(255,255,255,0.05)',
                              color: categoryInfo?.color || '#fff',
                            }}
                          >
                            {categoryInfo?.emoji} {categoryInfo?.name || item.category}
                          </span>
                        </td>
                        <td>
                          {item.attributes && item.attributes.length > 0 ? (
                            <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                              {item.attributes.map((attr, aIdx) => (
                                <span key={aIdx} className="attr-tag">
                                  {attr}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="nlp-no-entities">
              {activeResult.targetItemName ? (
                <div>Target Item: <strong>{activeResult.targetItemName}</strong></div>
              ) : activeResult.filterCriteria ? (
                <div>
                  Search Query: <strong>{activeResult.filterCriteria.query}</strong>
                  {activeResult.filterCriteria.maxPrice && ` (Max Price: $${activeResult.filterCriteria.maxPrice})`}
                </div>
              ) : (
                <div>No grocery item entities required for this intent.</div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Raw JSON AST Output */}
        <div className="glass-panel nlp-json-panel">
          <div className="panel-sub-header">
            <h3>Structured AST Payload (JSON)</h3>
            <button
              className="btn-subtle"
              onClick={handleCopyJson}
              style={{ fontSize: '0.78rem', padding: '0.2rem 0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
              title="Copy raw JSON"
            >
              {copied ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
              <span>{copied ? 'Copied' : 'Copy JSON'}</span>
            </button>
          </div>

          <pre className="json-code-block">
            <code>{JSON.stringify(activeResult, null, 2)}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
