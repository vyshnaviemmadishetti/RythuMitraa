import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { MANDI_RATES, PRODUCTS } from '../data';
import { Product } from '../types';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductSelect: (p: Product) => void;
  onNavigate: (path: string) => void;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  onProductSelect,
  onNavigate
}) => {
  const { language, setLanguage, addToCart, showToast } = useApp();
  const [isListening, setIsListening] = useState(false);
  const [typedInput, setTypedInput] = useState('');
  const [spokenPrompt, setSpokenPrompt] = useState(
    'వరి పంటలో ఆకు ఎండు తెగులుకి ఏ మందు వాడాలి? మరియు ధర ఎంత?'
  );
  const [speechSupported, setSpeechSupported] = useState(true);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      setSpeechSupported(false);
    }
  }, []);

  if (!isOpen) return null;

  const handleStartListening = () => {
    const SpeechRecognition =
      (window as unknown as { SpeechRecognition?: any }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: any }).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      showToast('Speech recognition not supported on this browser. Typed mode enabled!', 'info');
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'te' ? 'te-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      setIsListening(true);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setSpokenPrompt(transcript);
          setIsListening(false);
          speakResponse("రైతు మిత్ర సమాధానం: వరిలో ఆకు ఎండు తెగులుకు Streptocycline 6g మరియు Copper Oxychloride కలిపి పిచికారీ చేయండి.");
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
        showToast('Microphone timed out. Click again or tap prompt below.', 'mic_off');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
      showToast('Could not access microphone. Using text input.', 'info');
    }
  };

  const speakResponse = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'te' ? 'te-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handlePromptClick = (text: string, spokenText: string) => {
    setSpokenPrompt(text);
    speakResponse(spokenText);
  };

  const handleTypedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (typedInput.trim()) {
      setSpokenPrompt(typedInput.trim());
      setTypedInput('');
      speakResponse("రైతు మిత్ర మీ ప్రశ్నకు సిఫార్సు చేసిన మందులను సిద్ధం చేసింది.");
    }
  };

  const streptoProduct = PRODUCTS.find((p) => p.id === 'streptocycline-pouch-6g')!;
  const copperProduct = PRODUCTS.find((p) => p.id === 'dhanuka-blue-copper-500g')!;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-inverse-surface/70 backdrop-blur-sm">
      <div className="bg-surface-container-lowest max-w-2xl w-full rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-outline-variant/30">
        {/* Header */}
        <div className="bg-primary text-on-primary p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-lg bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">mic</span>
            </div>
            <div>
              <h3 className="font-serif font-bold text-base md:text-lg leading-tight">
                Rythu Vaani (రైతు వాణి) • Voice Agronomist
              </h3>
              <span className="text-[11px] text-surface-variant">
                Speak naturally in Telugu, English or Hindi without typing
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container-lowest/20 hover:bg-surface-container-lowest/30 flex items-center justify-center text-on-primary transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Scrollable Container */}
        <div className="p-4 md:p-6 space-y-5 overflow-y-auto">
          {/* Dialect Selector */}
          <div className="flex items-center justify-between bg-surface-container-low p-2 rounded-xl text-xs">
            <span className="font-bold text-primary pl-2">Voice Dialect / భాష:</span>
            <div className="flex gap-1">
              <button
                onClick={() => setLanguage('te')}
                className={`px-3 py-1 rounded-full font-bold transition-all ${
                  language === 'te'
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'bg-surface-container text-on-surface'
                }`}
              >
                తెలుగు (Telugu)
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 rounded-full font-bold transition-all ${
                  language === 'en'
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'bg-surface-container text-on-surface'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`px-3 py-1 rounded-full font-bold transition-all ${
                  language === 'hi'
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'bg-surface-container text-on-surface'
                }`}
              >
                हिन्दी
              </button>
            </div>
          </div>

          {/* Central Pulsing Mic Stage */}
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-5 text-center flex flex-col items-center justify-center">
            <div className="relative flex items-center justify-center my-3">
              {isListening && (
                <>
                  <div className="absolute w-36 h-36 rounded-full bg-secondary-container/40 animate-ping"></div>
                  <div className="absolute w-28 h-28 rounded-full bg-primary-fixed/50 animate-pulse"></div>
                </>
              )}
              <button
                onClick={handleStartListening}
                className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center shadow-xl transition-transform active:scale-95 cursor-pointer ${
                  isListening
                    ? 'bg-secondary text-on-secondary ring-4 ring-secondary-container'
                    : 'bg-primary text-on-primary hover:bg-primary-container'
                }`}
                title="Tap to Speak"
              >
                <span className="material-symbols-outlined text-[36px]">
                  {isListening ? 'graphic_eq' : 'mic'}
                </span>
              </button>
            </div>

            <p className="font-bold text-sm text-primary mt-2">
              {isListening ? 'Listening... స్పష్టంగా మాట్లాడండి' : 'Tap Microphone to Speak / మాట్లాడటానికి నొక్కండి'}
            </p>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Natural conversational agronomy • Trained on ANGRAU & ICAR protocols
            </p>

            {/* Fallback Typed Input */}
            <form onSubmit={handleTypedSubmit} className="mt-3 w-full max-w-md flex items-center gap-1.5">
              <input
                type="text"
                value={typedInput}
                onChange={(e) => setTypedInput(e.target.value)}
                placeholder="Or type here: e.g. వరిలో తెగులు మందు, యూరియా ధర..."
                className="flex-1 px-3 py-2 bg-surface-container-low rounded-lg text-xs text-on-surface focus:outline-none focus:bg-surface-container-lowest border border-outline-variant/30"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-primary text-on-primary rounded-lg text-xs font-bold hover:bg-primary-container transition-colors"
              >
                Ask
              </button>
            </form>
          </div>

          {/* Recognized Input Transcript */}
          <div className="bg-surface-container-high rounded-xl p-3.5 space-y-1">
            <div className="flex items-center gap-1.5 text-on-surface-variant text-xs">
              <span className="material-symbols-outlined text-[16px] text-secondary">record_voice_over</span>
              <span className="font-bold uppercase tracking-wider text-[10px]">
                Recognized Query (మీరు అడిగిన ప్రశ్న):
              </span>
            </div>
            <p className="font-serif font-bold text-base text-primary">
              "{spokenPrompt}"
            </p>
          </div>

          {/* Synthesized Voice Answer */}
          <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-primary-container text-on-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[16px]">psychology</span>
                </span>
                <span className="font-bold text-xs text-primary">
                  Rythu Vaani Agronomist Advisory
                </span>
              </div>
              <button
                onClick={() =>
                  speakResponse(
                    "వరిలో బాక్టీరియల్ ఆకు ఎండు తెగులు నివారణకు Streptocycline 6g మరియు Copper Oxychloride 300g ఒక ఎకరానికి 150 లీటర్ల నీటిలో కలిపి పిచికారీ చేయండి. ధర సుమారు 445 రూపాయలు."
                  )
                }
                className="flex items-center gap-1 px-2.5 py-1 bg-secondary text-on-secondary rounded-full text-xs font-bold hover:bg-primary transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">volume_up</span>
                <span>Listen Audio</span>
              </button>
            </div>

            <p className="text-xs md:text-sm text-on-surface leading-relaxed">
              వరిలో <strong className="text-primary font-bold">బాక్టీరియల్ ఆకు ఎండు తెగులు (BLB)</strong> నివారణకు{' '}
              <span className="bg-secondary-container/50 px-1 py-0.5 rounded font-bold text-on-secondary-fixed">
                Streptocycline 6g
              </span>{' '}
              మరియు{' '}
              <span className="bg-secondary-container/50 px-1 py-0.5 rounded font-bold text-on-secondary-fixed">
                Copper Oxychloride 300g
              </span>{' '}
              ఒక ఎకరానికి 150 లీటర్ల నీటిలో కలిపి పిచికారీ చేయండి. ధర సుమారు{' '}
              <strong className="text-primary font-bold">₹445</strong> మాత్రమే.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-on-surface-variant font-medium">
              <span className="flex items-center gap-1 text-secondary font-bold">
                <span className="material-symbols-outlined text-[14px]">verified</span> 100% ICAR Certified
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">local_shipping</span> 24h Village Gate Delivery
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">payments</span> Cash on Delivery
              </span>
            </div>
          </div>

          {/* Suggested Matched Products */}
          <div className="space-y-2">
            <span className="font-bold text-xs uppercase tracking-wider text-primary block">
              సిఫార్సు చేసిన మందులు (Suggested Products):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="bg-surface-container-low p-2.5 rounded-lg flex items-center justify-between border border-outline-variant/30">
                <div
                  onClick={() => {
                    onProductSelect(streptoProduct);
                    onClose();
                  }}
                  className="flex items-center gap-2 cursor-pointer min-w-0"
                >
                  <img
                    src={streptoProduct.image}
                    alt={streptoProduct.name}
                    className="w-12 h-12 rounded object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="font-bold text-xs text-primary truncate">{streptoProduct.name}</p>
                    <p className="text-xs font-bold text-on-surface">₹{streptoProduct.price}</p>
                  </div>
                </div>
                <button
                  onClick={() => addToCart(streptoProduct, 1)}
                  className="p-1.5 bg-primary text-on-primary rounded hover:bg-primary-container shrink-0 cursor-pointer"
                  title="Add to Cart"
                >
                  <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
                </button>
              </div>

              <div className="bg-surface-container-low p-2.5 rounded-lg flex items-center justify-between border border-outline-variant/30">
                <div
                  onClick={() => {
                    onProductSelect(copperProduct);
                    onClose();
                  }}
                  className="flex items-center gap-2 cursor-pointer min-w-0"
                >
                  <img
                    src={copperProduct.image}
                    alt={copperProduct.name}
                    className="w-12 h-12 rounded object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="font-bold text-xs text-primary truncate">{copperProduct.name}</p>
                    <p className="text-xs font-bold text-on-surface">₹{copperProduct.price}</p>
                  </div>
                </div>
                <button
                  onClick={() => addToCart(copperProduct, 1)}
                  className="p-1.5 bg-primary text-on-primary rounded hover:bg-primary-container shrink-0 cursor-pointer"
                  title="Add to Cart"
                >
                  <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
                </button>
              </div>
            </div>
          </div>

          {/* Live Mandi Ticker Preview */}
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-3 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-primary flex items-center gap-1">
                <span className="material-symbols-outlined text-secondary text-[16px]">storefront</span>
                Live Mandi Rates (మార్కెట్ రేట్లు)
              </span>
              <span className="text-[10px] text-outline">Today 09:30 AM</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              {MANDI_RATES.slice(0, 3).map((rate) => (
                <div key={rate.crop} className="bg-surface-container-low p-2 rounded">
                  <p className="font-bold text-on-surface truncate">{rate.crop}</p>
                  <div className="flex items-baseline justify-between mt-0.5">
                    <span className="font-bold text-primary">₹{rate.pricePerQtl}/Qtl</span>
                    <span
                      className={`text-[10px] font-bold flex items-center ${
                        rate.trend === 'up' ? 'text-secondary' : 'text-error'
                      }`}
                    >
                      {rate.trend === 'up' ? '▲ +' : '▼ -'}₹{rate.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Voice Prompts */}
          <div className="space-y-2">
            <span className="font-bold text-xs text-primary block">
              రైతులు తరచుగా అడిగే ప్రశ్నలు (Quick Prompts):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <button
                onClick={() =>
                  handlePromptClick(
                    'యూరియా మరియు డీఏపీ ప్రస్తుత ధర ఎంత?',
                    'యూరియా 45 కిలోల బస్తా ధర 266 రూపాయలు, డీఏపీ 1350 రూపాయలు ప్రభుత్వ సబ్సిడీ రేటు.'
                  )
                }
                className="text-left p-2 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors flex items-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] text-secondary">mic</span>
                <span>"యూరియా మరియు డీఏపీ ప్రస్తుత ధర ఎంత?"</span>
              </button>
              <button
                onClick={() =>
                  handlePromptClick(
                    'పత్తిలో గులాబీ రంగు పురుగు నివారణ ఏమిటి?',
                    'పత్తిలో గులాబీ పురుగు నివారణకు Syngenta Ampligo ఎకరానికి 100 మిల్లీలీటర్లు మరియు 8 లింగాకర్షక బుట్టలు అమర్చండి.'
                  )
                }
                className="text-left p-2 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors flex items-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] text-secondary">mic</span>
                <span>"పత్తిలో గులాబీ రంగు పురుగు నివారణ"</span>
              </button>
              <button
                onClick={() =>
                  handlePromptClick(
                    'నేటి రాజమండ్రి మార్కెట్ లో వరి ధాన్యం ధర ఎంత?',
                    'నేడు రాజమండ్రి వ్యవసాయ మార్కెట్లో బిపిటి 5204 వరి క్వింటాలుకు 2320 రూపాయలు పలికింది.'
                  )
                }
                className="text-left p-2 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors flex items-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] text-secondary">mic</span>
                <span>"నేటి రాజమండ్రి మార్కెట్ లో వరి ధర ఎంత?"</span>
              </button>
              <button
                onClick={() => {
                  onClose();
                  onNavigate('tracking');
                }}
                className="text-left p-2 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors flex items-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] text-secondary">local_shipping</span>
                <span>"నా విత్తనాల డెలివరీ ఎక్కడివరకు వచ్చింది?"</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
