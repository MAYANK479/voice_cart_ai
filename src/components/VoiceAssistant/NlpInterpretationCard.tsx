import React from 'react';
import { Sparkles, X, CheckCircle, Tag, Layers, Hash, Scale, DollarSign, ArrowRight } from 'lucide-react';
import { useShopping } from '../../context/ShoppingContext';
import { CATEGORIES } from '../../data/categories';

export const NlpInterpretationCard: React.FC = () => {
  const { lastParsedCommand, showNlpCard, setShowNlpCard, setActiveView } = useShopping();

  if (!showNlpCard || !lastParsedCommand) return null;

  const confidencePercent = Math.round(lastParsedCommand.confidence * 100);

  return (
    <div className="nlp-insight-card" role="region" aria-label="NLP Command Interpretation">
      {/* Header */}
      <div className="nlp-card-header">
        <div className="nlp-card-title-group">
          <div className="nlp-badge-pulse">
            <Sparkles size={14} />
          </div>
          <div>
            <div className="nlp-title-text">NLP Interpretation</div>
            <div className="nlp-subtitle-text">Deterministic Entity & Intent Parser</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div className="confidence-pill" title="Calculated entity confidence score">
            <CheckCircle size={12} />
            <span>{confidencePercent}% Confidence</span>
          </div>

          <button
            className="btn-icon"
            style={{ width: '26px', height: '26px' }}
            onClick={() => setShowNlpCard(false)}
            title="Dismiss insight card"
            aria-label="Dismiss NLP interpretation"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Raw Command Display */}
      <div className="nlp-command-display">
        <span className="nlp-label">Command Understood</span>
        <div className="nlp-command-quote">"{lastParsedCommand.rawTranscript}"</div>
      </div>

      {/* Extracted Entities Grid */}
      <div className="nlp-entities-grid">
        {/* Action / Intent */}
        <div className="nlp-entity-pill">
          <div className="entity-label">
            <Tag size={11} />
            <span>ACTION</span>
          </div>
          <div className="entity-value highlight-action">
            {lastParsedCommand.suggestedAction || lastParsedCommand.intent}
          </div>
        </div>

        {/* Items extracted */}
        {lastParsedCommand.items.length > 0 ? (
          lastParsedCommand.items.map((item, idx) => {
            const catInfo = CATEGORIES[item.category];
            return (
              <React.Fragment key={idx}>
                <div className="nlp-entity-pill">
                  <div className="entity-label">
                    <Layers size={11} />
                    <span>PRODUCT {lastParsedCommand.items.length > 1 ? `#${idx + 1}` : ''}</span>
                  </div>
                  <div className="entity-value">{item.name}</div>
                </div>

                <div className="nlp-entity-pill">
                  <div className="entity-label">
                    <Hash size={11} />
                    <span>QUANTITY</span>
                  </div>
                  <div className="entity-value">{item.quantity}</div>
                </div>

                <div className="nlp-entity-pill">
                  <div className="entity-label">
                    <Scale size={11} />
                    <span>UNIT</span>
                  </div>
                  <div className="entity-value">{item.unit}</div>
                </div>

                {item.attributes && item.attributes.length > 0 && (
                  <div className="nlp-entity-pill">
                    <div className="entity-label">
                      <Tag size={11} />
                      <span>ATTRIBUTE</span>
                    </div>
                    <div className="entity-value highlight-attr">
                      {item.attributes.join(', ')}
                    </div>
                  </div>
                )}

                <div className="nlp-entity-pill">
                  <div className="entity-label">
                    <Layers size={11} />
                    <span>CATEGORY</span>
                  </div>
                  <div className="entity-value">
                    {catInfo?.emoji || '📦'} {catInfo?.name || item.category}
                  </div>
                </div>
              </React.Fragment>
            );
          })
        ) : (
          <>
            {lastParsedCommand.targetItemName && (
              <div className="nlp-entity-pill">
                <div className="entity-label">
                  <Layers size={11} />
                  <span>TARGET ITEM</span>
                </div>
                <div className="entity-value">{lastParsedCommand.targetItemName}</div>
              </div>
            )}

            {lastParsedCommand.filterCriteria && (
              <>
                {lastParsedCommand.filterCriteria.query && (
                  <div className="nlp-entity-pill">
                    <div className="entity-label">
                      <Layers size={11} />
                      <span>SEARCH QUERY</span>
                    </div>
                    <div className="entity-value">{lastParsedCommand.filterCriteria.query}</div>
                  </div>
                )}
                {lastParsedCommand.filterCriteria.brand && (
                  <div className="nlp-entity-pill">
                    <div className="entity-label">
                      <Tag size={11} />
                      <span>BRAND</span>
                    </div>
                    <div className="entity-value">{lastParsedCommand.filterCriteria.brand}</div>
                  </div>
                )}
                {lastParsedCommand.filterCriteria.size && (
                  <div className="nlp-entity-pill">
                    <div className="entity-label">
                      <Scale size={11} />
                      <span>SIZE</span>
                    </div>
                    <div className="entity-value">{lastParsedCommand.filterCriteria.size}</div>
                  </div>
                )}
                {lastParsedCommand.filterCriteria.maxPrice !== undefined && (
                  <div className="nlp-entity-pill">
                    <div className="entity-label">
                      <DollarSign size={11} />
                      <span>MAX PRICE</span>
                    </div>
                    <div className="entity-value highlight-price">
                      ${lastParsedCommand.filterCriteria.maxPrice.toFixed(2)}
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>

      {/* Footer message and link to playground */}
      <div className="nlp-card-footer">
        <div className="nlp-feedback-msg">{lastParsedCommand.feedbackMessage}</div>
        <button
          className="btn-link-lab"
          onClick={() => setActiveView('nlp-lab')}
          title="Open NLP Engineering Playground"
        >
          <span>Open in NLP Lab</span>
          <ArrowRight size={12} />
        </button>
      </div>
    </div>
  );
};
