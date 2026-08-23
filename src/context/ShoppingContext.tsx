import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  ShoppingItem,
  CategoryId,
  RestockPrediction,
  SeasonalProduct,
  SubstituteOption,
  PairingSuggestion,
  ShoppingHistoryRecord,
  ActiveView,
} from '../types/shopping';
import {
  SpeechStatus,
  SupportedLanguage,
  ParsedCommand,
  ParsedItemEntity,
  CommandLogEntry,
} from '../types/speech';
import { CatalogProduct } from '../types/catalog';
import { speechService } from '../services/speechService';
import { ttsService } from '../services/ttsService';
import { parseVoiceCommand } from '../services/nlpParser';
import {
  getRestockPredictions,
  getSeasonalRecommendations,
  getSubstitutesFor,
  findCompanionPairing,
} from '../services/recommendationEngine';
import { storageService, INITIAL_DEMO_ITEMS, INITIAL_DEMO_COMMANDS } from '../services/storageService';
import { CATALOG_PRODUCTS } from '../data/catalogData';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  duration?: number;
}

interface ShoppingContextType {
  // Navigation
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;

  // Shopping list state
  items: ShoppingItem[];
  addItem: (item: Partial<ShoppingItem>, announce?: boolean) => void;
  removeItem: (idOrName: string) => void;
  updateQuantity: (idOrName: string, quantity: number, unit?: string) => void;
  toggleCompleted: (id: string) => void;
  clearCompleted: () => void;
  clearAll: () => void;
  resetToDemo: () => void;
  undoDelete: () => void;
  lastDeletedItem: ShoppingItem | null;

  // Speech & Voice State
  speechStatus: SpeechStatus;
  isListening: boolean;
  interimTranscript: string;
  lastTranscript: string;
  lastParsedCommand: ParsedCommand | null;
  showNlpCard: boolean;
  setShowNlpCard: (show: boolean) => void;
  currentLanguage: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  ttsEnabled: boolean;
  setTtsEnabled: (enabled: boolean) => void;
  startVoiceListening: () => void;
  stopVoiceListening: () => void;
  processTextInputCommand: (text: string, source?: 'voice' | 'text' | 'demo') => void;

  // Command History
  commandLogs: CommandLogEntry[];
  clearCommandLogs: () => void;

  // Intelligence & Suggestions
  restockPredictions: RestockPrediction[];
  seasonalPicks: SeasonalProduct[];
  substitutes: SubstituteOption[];
  searchSubstitutes: (query: string) => SubstituteOption[];
  activePairing: PairingSuggestion | null;
  dismissPairing: () => void;
  acceptPairing: (pairing: PairingSuggestion) => void;

  // Catalog & Search State
  catalog: CatalogProduct[];
  catalogModalOpen: boolean;
  setCatalogModalOpen: (open: boolean) => void;
  catalogSearchQuery: string;
  setCatalogSearchQuery: (query: string) => void;
  catalogMaxPrice: number | null;
  setCatalogMaxPrice: (price: number | null) => void;

  // Modals
  suggestionsModalOpen: boolean;
  setSuggestionsModalOpen: (open: boolean) => void;
  suggestionsInitialTab: 'restock' | 'seasonal' | 'substitutes';
  setSuggestionsInitialTab: (tab: 'restock' | 'seasonal' | 'substitutes') => void;
  helpModalOpen: boolean;
  setHelpModalOpen: (open: boolean) => void;

  // Budget & Totals
  budget: number;
  setBudget: (budget: number) => void;
  totalEstimatedCost: number;
  completedEstimatedCost: number;
  pendingCount: number;
  completedCount: number;

  // Toasts
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;

  // Export
  exportList: (format: 'csv' | 'json') => void;
  exportCommandLogs: (format: 'csv' | 'json') => void;
}


const ShoppingContext = createContext<ShoppingContextType | undefined>(undefined);

export const ShoppingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [items, setItems] = useState<ShoppingItem[]>(() => storageService.getItems());
  const [history] = useState<ShoppingHistoryRecord[]>(() => storageService.getHistory());
  const [commandLogs, setCommandLogs] = useState<CommandLogEntry[]>(() => storageService.getCommands());
  const [budget, setBudgetState] = useState<number>(() => storageService.getBudget());
  const [lastDeletedItem, setLastDeletedItem] = useState<ShoppingItem | null>(null);

  const [currentLanguage, setCurrentLanguageState] = useState<SupportedLanguage>(() => storageService.getLanguage());
  const [ttsEnabled, setTtsEnabledState] = useState<boolean>(() => storageService.getTTSEnabled());

  // Voice recognition states
  const [speechStatus, setSpeechStatus] = useState<SpeechStatus>('idle');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [lastTranscript, setLastTranscript] = useState<string>('');
  const [lastParsedCommand, setLastParsedCommand] = useState<ParsedCommand | null>(null);
  const [showNlpCard, setShowNlpCard] = useState<boolean>(false);

  // Modals & Navigation state
  const [catalogModalOpen, setCatalogModalOpen] = useState(false);
  const [catalogSearchQuery, setCatalogSearchQuery] = useState('');
  const [catalogMaxPrice, setCatalogMaxPrice] = useState<number | null>(null);

  const [suggestionsModalOpen, setSuggestionsModalOpen] = useState(false);
  const [suggestionsInitialTab, setSuggestionsInitialTab] = useState<'restock' | 'seasonal' | 'substitutes'>('restock');
  const [helpModalOpen, setHelpModalOpen] = useState(false);

  // Companion Pairing Alert
  const [activePairing, setActivePairing] = useState<PairingSuggestion | null>(null);

  // Toast Notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newToast: ToastMessage = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);

    const duration = toast.duration || 4500;
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Save changes to storage
  useEffect(() => {
    storageService.saveItems(items);
  }, [items]);

  useEffect(() => {
    storageService.saveHistory(history);
  }, [history]);

  useEffect(() => {
    storageService.saveCommands(commandLogs);
  }, [commandLogs]);

  const setBudget = (newBudget: number) => {
    setBudgetState(newBudget);
    storageService.saveBudget(newBudget);
  };

  const setLanguage = (lang: SupportedLanguage) => {
    setCurrentLanguageState(lang);
    storageService.saveLanguage(lang);
    speechService.setLanguage(lang);
    ttsService.setLanguage(lang);
    addToast({
      type: 'info',
      title: 'Language Updated',
      message: `Voice recognition engine set to ${lang}.`,
    });
  };

  const setTtsEnabled = (enabled: boolean) => {
    setTtsEnabledState(enabled);
    storageService.saveTTSEnabled(enabled);
    ttsService.setEnabled(enabled);
    addToast({
      type: 'info',
      title: enabled ? 'Voice Feedback Enabled' : 'Voice Feedback Muted',
      message: enabled ? 'Assistant will speak confirmations.' : 'Assistant voice output is muted.',
    });
  };

  // Helper to find existing product price from catalog
  const lookupEstimatedPrice = (name: string, category: CategoryId): number => {
    const match = CATALOG_PRODUCTS.find((p) => p.name.toLowerCase().includes(name.toLowerCase()) || name.toLowerCase().includes(p.name.toLowerCase()));
    if (match) return match.onSale && match.salePrice ? match.salePrice : match.price;

    const defaults: Record<CategoryId, number> = {
      produce: 2.99,
      dairy: 3.99,
      bakery: 3.49,
      meat: 8.99,
      pantry: 3.29,
      beverages: 3.49,
      snacks: 3.99,
      household: 4.49,
      other: 3.0,
    };
    return defaults[category] || 3.5;
  };

  // Undo delete functionality
  const undoDelete = useCallback(() => {
    if (lastDeletedItem) {
      setItems((prev) => [lastDeletedItem, ...prev]);
      addToast({
        type: 'success',
        title: 'Item Restored',
        message: `Restored "${lastDeletedItem.name}" to your shopping list.`,
      });
      ttsService.speak(`Restored ${lastDeletedItem.name}`);
      setLastDeletedItem(null);
    }
  }, [lastDeletedItem, addToast]);

  // Shopping List Operations
  const addItem = useCallback(
    (item: Partial<ShoppingItem>, announce = true) => {
      if (!item.name || !item.name.trim()) return;

      const cleanName = item.name.trim();
      const existingIndex = items.findIndex((i) => i.name.toLowerCase() === cleanName.toLowerCase());

      let updatedList = [...items];
      const category = item.category || 'produce';
      const quantity = item.quantity || 1;
      const unit = item.unit || 'item';
      const price = item.estimatedPrice || lookupEstimatedPrice(cleanName, category);

      if (existingIndex >= 0) {
        // Increase quantity of existing item
        updatedList[existingIndex] = {
          ...updatedList[existingIndex],
          quantity: updatedList[existingIndex].quantity + quantity,
          completed: false,
          updatedAt: new Date().toISOString(),
        };
      } else {
        // Create new item
        const newItem: ShoppingItem = {
          id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          name: cleanName,
          quantity,
          unit,
          category,
          estimatedPrice: price,
          completed: false,
          dietaryTags: item.dietaryTags,
          brand: item.brand,
          addedAt: new Date().toISOString(),
          source: item.source || 'manual',
        };
        updatedList = [newItem, ...updatedList];
      }

      setItems(updatedList);

      if (announce) {
        const msg = `Added ${quantity} ${unit !== 'item' ? unit + ' of ' : ''}${cleanName}`;
        addToast({
          type: 'success',
          title: 'Item Added',
          message: msg,
        });
        ttsService.speak(msg);
      }

      // Check companion pairing suggestion
      const companion = findCompanionPairing(cleanName, updatedList);
      if (companion) {
        setActivePairing(companion);
      }
    },
    [items, addToast]
  );

  const removeItem = useCallback(
    (idOrName: string) => {
      const clean = idOrName.toLowerCase().trim();
      const target = items.find((i) => i.id === idOrName || i.name.toLowerCase().includes(clean) || clean.includes(i.name.toLowerCase()));

      if (target) {
        setLastDeletedItem(target);
        setItems((prev) => prev.filter((i) => i.id !== target.id));
        const msg = `Removed "${target.name}" from shopping list.`;
        addToast({
          type: 'info',
          title: 'Item Removed',
          message: msg,
          actionLabel: 'Undo',
          onAction: () => {
            setItems((prev) => [target, ...prev]);
            setLastDeletedItem(null);
            ttsService.speak(`Restored ${target.name}`);
          },
          duration: 6000,
        });
        ttsService.speak(msg);
      } else {
        addToast({
          type: 'warning',
          title: 'Item Not Found',
          message: `Could not find "${idOrName}" in your list.`,
        });
        ttsService.speak(`Could not find ${idOrName} in your list.`);
      }
    },
    [items, addToast]
  );

  const updateQuantity = useCallback(
    (idOrName: string, quantity: number, unit?: string) => {
      const clean = idOrName.toLowerCase().trim();
      const target = items.find((i) => i.id === idOrName || i.name.toLowerCase().includes(clean) || clean.includes(i.name.toLowerCase()));

      if (target) {
        setItems((prev) =>
          prev.map((i) =>
            i.id === target.id
              ? {
                  ...i,
                  quantity: Math.max(1, quantity),
                  unit: unit || i.unit,
                  updatedAt: new Date().toISOString(),
                }
              : i
          )
        );
        const msg = `Updated ${target.name} to ${quantity} ${unit || target.unit}`;
        addToast({
          type: 'success',
          title: 'Quantity Updated',
          message: msg,
        });
        ttsService.speak(msg);
      }
    },
    [items, addToast]
  );

  const toggleCompleted = useCallback(
    (id: string) => {
      setItems((prev) => {
        const next = prev.map((i) => (i.id === id ? { ...i, completed: !i.completed } : i));
        const allCompleted = next.length > 0 && next.every((i) => i.completed);
        if (allCompleted) {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
          ttsService.speak('Awesome! You have completed all items on your shopping list!');
          addToast({
            type: 'success',
            title: '🎉 Shopping Complete!',
            message: 'All items marked as checked. Great job!',
          });
        }
        return next;
      });
    },
    [addToast]
  );

  const clearCompleted = useCallback(() => {
    const completedItems = items.filter((i) => i.completed);
    if (completedItems.length === 0) {
      addToast({
        type: 'info',
        title: 'No Completed Items',
        message: 'There are no completed items to clear.',
      });
      return;
    }
    setItems((prev) => prev.filter((i) => !i.completed));
    const msg = `Cleared ${completedItems.length} completed items.`;
    addToast({
      type: 'info',
      title: 'List Cleaned',
      message: msg,
    });
    ttsService.speak(msg);
  }, [items, addToast]);

  const clearAll = useCallback(() => {
    if (items.length === 0) return;
    setItems([]);
    const msg = 'Cleared all items from your shopping list.';
    addToast({
      type: 'warning',
      title: 'List Cleared',
      message: msg,
    });
    ttsService.speak(msg);
  }, [items, addToast]);

  const resetToDemo = useCallback(() => {
    setItems(INITIAL_DEMO_ITEMS);
    setCommandLogs(INITIAL_DEMO_COMMANDS);
    addToast({
      type: 'info',
      title: 'Reset Sample Data',
      message: 'Restored pre-seeded demo items and history.',
    });
  }, [addToast]);

  const clearCommandLogs = useCallback(() => {
    setCommandLogs([]);
    storageService.saveCommands([]);
    addToast({
      type: 'info',
      title: 'History Cleared',
      message: 'Command execution history has been cleared.',
    });
  }, [addToast]);

  // Dispatch Parsed NLP Command into Actions
  const handleExecuteParsedCommand = useCallback(
    (cmd: ParsedCommand, source: 'voice' | 'text' | 'demo' = 'voice') => {
      setLastParsedCommand(cmd);
      setShowNlpCard(true);

      // Record in Command Log History
      const logEntry: CommandLogEntry = {
        id: `cmd-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        timestamp: new Date().toISOString(),
        command: cmd.rawTranscript,
        intent: cmd.intent,
        actionName: cmd.suggestedAction || cmd.intent,
        resultMessage: cmd.feedbackMessage,
        confidence: cmd.confidence,
        source,
        success: cmd.intent !== 'UNKNOWN',
        itemCount: cmd.items.length,
      };
      setCommandLogs((prev) => [logEntry, ...prev]);

      switch (cmd.intent) {
        case 'ADD_ITEM': {
          cmd.items.forEach((itemEntity: ParsedItemEntity) => {
            addItem(
              {
                name: itemEntity.name,
                quantity: itemEntity.quantity,
                unit: itemEntity.unit,
                category: itemEntity.category,
                dietaryTags: itemEntity.attributes,
                brand: itemEntity.brand,
                source: 'voice',
              },
              false
            );
          });
          addToast({
            type: 'success',
            title: 'Voice Command: Add',
            message: cmd.feedbackMessage,
          });
          ttsService.speak(cmd.feedbackMessage);
          break;
        }

        case 'REMOVE_ITEM': {
          if (cmd.targetItemName) {
            removeItem(cmd.targetItemName);
          }
          break;
        }

        case 'MODIFY_QUANTITY': {
          if (cmd.targetItemName && cmd.items.length > 0) {
            updateQuantity(cmd.targetItemName, cmd.items[0].quantity, cmd.items[0].unit);
          }
          break;
        }

        case 'CLEAR_COMPLETED': {
          clearCompleted();
          break;
        }

        case 'CLEAR_ALL': {
          clearAll();
          break;
        }

        case 'SEARCH_CATALOG':
        case 'FILTER_PRICE': {
          setCatalogSearchQuery(cmd.filterCriteria?.query || '');
          setCatalogMaxPrice(cmd.filterCriteria?.maxPrice || null);
          setCatalogModalOpen(true);
          addToast({
            type: 'info',
            title: 'Catalog Search',
            message: cmd.feedbackMessage,
          });
          ttsService.speak(cmd.feedbackMessage);
          break;
        }

        case 'GET_SEASONAL': {
          setSuggestionsInitialTab('seasonal');
          setSuggestionsModalOpen(true);
          addToast({
            type: 'info',
            title: 'Seasonal Recommendations',
            message: cmd.feedbackMessage,
          });
          ttsService.speak(cmd.feedbackMessage);
          break;
        }

        case 'GET_SUGGESTIONS': {
          setSuggestionsInitialTab('restock');
          setSuggestionsModalOpen(true);
          addToast({
            type: 'info',
            title: 'Smart Restock Suggestions',
            message: cmd.feedbackMessage,
          });
          ttsService.speak(cmd.feedbackMessage);
          break;
        }

        case 'GET_SUBSTITUTE': {
          setSuggestionsInitialTab('substitutes');
          setSuggestionsModalOpen(true);
          addToast({
            type: 'info',
            title: 'Substitutes Finder',
            message: cmd.feedbackMessage,
          });
          ttsService.speak(cmd.feedbackMessage);
          break;
        }

        case 'HELP': {
          setHelpModalOpen(true);
          addToast({
            type: 'info',
            title: 'Voice Command Help',
            message: cmd.feedbackMessage,
          });
          ttsService.speak(cmd.feedbackMessage);
          break;
        }

        case 'UNKNOWN':
        default: {
          addToast({
            type: 'warning',
            title: 'Command Not Recognized',
            message: cmd.feedbackMessage,
          });
          ttsService.speak(cmd.feedbackMessage);
          break;
        }
      }
    },
    [addItem, removeItem, updateQuantity, clearCompleted, clearAll, addToast]
  );

  // Initialize Speech Listeners
  useEffect(() => {
    speechService.onStatusChangeCallback = (status) => {
      setSpeechStatus(status);
      setIsListening(status === 'listening');
    };

    speechService.onTranscriptCallback = (transcript, isFinal, _confidence) => {
      if (isFinal) {
        setInterimTranscript('');
        setLastTranscript(transcript);
        const parsed = parseVoiceCommand(transcript, currentLanguage);
        handleExecuteParsedCommand(parsed, 'voice');
      } else {
        setInterimTranscript(transcript);
      }
    };

    speechService.onErrorCallback = (errorMsg) => {
      addToast({
        type: 'error',
        title: 'Microphone Notice',
        message: errorMsg,
        duration: 5500,
      });
      setSpeechStatus('idle');
      setIsListening(false);
    };
  }, [currentLanguage, handleExecuteParsedCommand, addToast]);

  const startVoiceListening = useCallback(() => {
    setSpeechStatus('listening');
    speechService.startListening();
  }, []);

  const stopVoiceListening = useCallback(() => {
    speechService.stopListening();
    setSpeechStatus('idle');
  }, []);

  const processTextInputCommand = useCallback(
    (text: string, source: 'voice' | 'text' | 'demo' = 'text') => {
      if (!text.trim()) return;
      setLastTranscript(text);
      const parsed = parseVoiceCommand(text, currentLanguage);
      handleExecuteParsedCommand(parsed, source);
    },
    [currentLanguage, handleExecuteParsedCommand]
  );

  // Intelligence calculations
  const restockPredictions = getRestockPredictions(history, items);
  const seasonalPicks = getSeasonalRecommendations();
  const substitutes = getSubstitutesFor('');

  const searchSubstitutes = useCallback((query: string) => {
    return getSubstitutesFor(query);
  }, []);

  const dismissPairing = useCallback(() => {
    setActivePairing(null);
  }, []);

  const acceptPairing = useCallback(
    (pairing: PairingSuggestion) => {
      addItem({
        name: pairing.suggestedItem,
        quantity: 1,
        unit: pairing.unit,
        category: pairing.category,
        estimatedPrice: pairing.price,
        source: 'suggestion',
      });
      setActivePairing(null);
    },
    [addItem]
  );

  // Financial and completion statistics
  const totalEstimatedCost = items.reduce((sum, item) => sum + item.estimatedPrice * item.quantity, 0);
  const completedEstimatedCost = items
    .filter((i) => i.completed)
    .reduce((sum, item) => sum + item.estimatedPrice * item.quantity, 0);
  const pendingCount = items.filter((i) => !i.completed).length;
  const completedCount = items.filter((i) => i.completed).length;

  const exportList = (format: 'csv' | 'json') => {
    if (format === 'csv') {
      storageService.exportToCSV(items);
    } else {
      storageService.exportToJSON(items);
    }
    addToast({
      type: 'success',
      title: 'Export Successful',
      message: `Shopping list exported as ${format.toUpperCase()}.`,
    });
  };

  const exportCommandLogs = (format: 'csv' | 'json') => {
    if (format === 'csv') {
      const headers = ['Timestamp', 'Command', 'Intent', 'Action', 'Confidence', 'Result', 'Source'];
      const rows = commandLogs.map((log) => [
        `"${log.timestamp}"`,
        `"${log.command.replace(/"/g, '""')}"`,
        `"${log.intent}"`,
        `"${log.actionName}"`,
        (log.confidence * 100).toFixed(0) + '%',
        `"${log.resultMessage.replace(/"/g, '""')}"`,
        `"${log.source}"`,
      ]);
      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `command_history_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(commandLogs, null, 2));
      const link = document.createElement('a');
      link.setAttribute('href', dataStr);
      link.setAttribute('download', `command_history_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    addToast({
      type: 'success',
      title: 'History Exported',
      message: `Command history log exported as ${format.toUpperCase()}.`,
    });
  };

  return (
    <ShoppingContext.Provider
      value={{
        activeView,
        setActiveView,
        items,
        addItem,
        removeItem,
        updateQuantity,
        toggleCompleted,
        clearCompleted,
        clearAll,
        resetToDemo,
        undoDelete,
        lastDeletedItem,
        speechStatus,
        isListening,
        interimTranscript,
        lastTranscript,
        lastParsedCommand,
        showNlpCard,
        setShowNlpCard,
        currentLanguage,
        setLanguage,
        ttsEnabled,
        setTtsEnabled,
        startVoiceListening,
        stopVoiceListening,
        processTextInputCommand,
        commandLogs,
        clearCommandLogs,
        restockPredictions,
        seasonalPicks,
        substitutes,
        searchSubstitutes,
        activePairing,
        dismissPairing,
        acceptPairing,
        catalog: CATALOG_PRODUCTS,
        catalogModalOpen,
        setCatalogModalOpen,
        catalogSearchQuery,
        setCatalogSearchQuery,
        catalogMaxPrice,
        setCatalogMaxPrice,
        suggestionsModalOpen,
        setSuggestionsModalOpen,
        suggestionsInitialTab,
        setSuggestionsInitialTab,
        helpModalOpen,
        setHelpModalOpen,
        budget,
        setBudget,
        totalEstimatedCost,
        completedEstimatedCost,
        pendingCount,
        completedCount,
        toasts,
        addToast,
        removeToast,
        exportList,
        exportCommandLogs,
      }}
    >
      {children}
    </ShoppingContext.Provider>
  );
};


export const useShopping = (): ShoppingContextType => {
  const context = useContext(ShoppingContext);
  if (!context) {
    throw new Error('useShopping must be used within a ShoppingProvider');
  }
  return context;
};
