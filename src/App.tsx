import React, { useState } from "react";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { GameSetup } from "./components/GameSetup";
import { SceneData, HistoryItem } from "./types";
import { 
  Sparkles, 
  Terminal, 
  HelpCircle, 
  Send, 
  Loader2, 
  Play, 
  AlertCircle,
  Clock
} from "lucide-react";

export default function App() {
  // Setup and configurations
  const [gameStarted, setGameStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState<{
    setting: string;
    artStyle: string;
    characterDetails: string;
    settingName: string;
    artStyleName: string;
  } | null>(null);

  // Active game-loop variables
  const [currentScene, setCurrentScene] = useState<SceneData | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [customAction, setCustomAction] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Simulated live character attributes aligned with theme
  const [attributes, setAttributes] = useState({
    vitality: 20,
    maxVitality: 20,
    insight: 10,
    corruption: 0,
  });
  const [isGameOver, setIsGameOver] = useState(false);
  const gameOverTitle = attributes.vitality <= 0 ? "Vitality Depleted" : "Corruption Overwhelms";
  const gameOverMessage =
    attributes.vitality <= 0
      ? "Your strength fades and the chronicle fractures. Recover your footing in a new journey."
      : "The shadow overtakes you and the chronicle dissolves. Cleanse your path in a new journey.";

  // Automatically parse and update stats depending on current text outcome
  const scanNarrativeImpact = (storyText: string, actionText: string, isBeginning: boolean) => {
    if (isBeginning) {
      const baseline = {
        vitality: 20,
        maxVitality: 20,
        insight: 10,
        corruption: 0,
      };
      setAttributes(baseline);
      setIsGameOver(false);
      return;
    }

    setAttributes((prev) => {
      let { vitality, maxVitality, insight, corruption } = prev;
      const combined = (storyText + " " + actionText).toLowerCase();

      // Scan indicators for health modifications
      if (
        combined.includes("wound") ||
        combined.includes("damage") ||
        combined.includes("hurt") ||
        combined.includes("bleed") ||
        combined.includes("trap") ||
        combined.includes("strike") ||
        combined.includes("hit") ||
        combined.includes("pain") ||
        combined.includes("slash") ||
        combined.includes("punished") ||
        combined.includes("shatters")
      ) {
        // physical hazard
        const damage = Math.floor(Math.random() * 3) + 1; // 1-3 damage
        vitality = Math.max(0, vitality - damage);
      } else if (
        combined.includes("potion") ||
        combined.includes("heal") ||
        combined.includes("herbs") ||
        combined.includes("rejuvenate") ||
        combined.includes("cure") ||
        combined.includes("rest") ||
        combined.includes("recovery")
      ) {
        // healing mechanics
        const restore = Math.floor(Math.random() * 4) + 3; // 3-6 heal
        vitality = Math.min(maxVitality, vitality + restore);
      }

      // Scan indicators for scroll readings / secret discovery
      if (
        combined.includes("examine") ||
        combined.includes("study") ||
        combined.includes("read") ||
        combined.includes("scroll") ||
        combined.includes("ancient") ||
        combined.includes("decipher") ||
        combined.includes("secret") ||
        combined.includes("insight") ||
        combined.includes("learn") ||
        combined.includes("analyze")
      ) {
        insight += Math.floor(Math.random() * 2) + 1;
      }

      // Scan indicators for curses / temporal anomalies / void whispers
      if (
        combined.includes("curse") ||
        combined.includes("corrupt") ||
        combined.includes("anomal") ||
        combined.includes("whisper") ||
        combined.includes("darkness") ||
        combined.includes("forbidden") ||
        combined.includes("shadow") ||
        combined.includes("eldritch") ||
        combined.includes("void")
      ) {
        corruption = Math.min(100, corruption + Math.floor(Math.random() * 7) + 3);
      } else if (
        combined.includes("cleanse") ||
        combined.includes("purify") ||
        combined.includes("sanctuary") ||
        combined.includes("consecrated")
      ) {
        corruption = Math.max(0, corruption - Math.floor(Math.random() * 8) - 4);
      }

      const nextAttributes = { vitality, maxVitality, insight, corruption };
      setIsGameOver(nextAttributes.vitality <= 0 || nextAttributes.corruption >= 100);
      return nextAttributes;
    });
  };

  // Asynchronous image summoner running in the background to provide optimal reading flow
  const fetchScenicVisual = async (visualPrompt: string, styleSignature: string) => {
    if (!visualPrompt) return;

    setCurrentScene((prev) => (prev ? { ...prev, imageLoading: true, imageError: "" } : null));

    try {
      const response = await fetch("/api/adventure/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          detailedVisualPrompt: visualPrompt,
          artStyle: styleSignature,
        }),
      });

      if (!response.ok) {
        throw new Error("Visual synthesizer did not respond.");
      }

      const outcome = await response.json();
      setCurrentScene((prev) =>
        prev
          ? {
              ...prev,
              imageUrl: outcome.imageUrl,
              isImageFallback: outcome.isFallback,
              imageLoading: false,
            }
          : null
      );
    } catch (err: any) {
      console.error("Scenic rendering issue:", err);
      setCurrentScene((prev) =>
        prev
          ? {
              ...prev,
              imageLoading: false,
              imageError: "Visual field disconnected. Taping backup frequency...",
              imageUrl: `https://picsum.photos/seed/${encodeURIComponent(visualPrompt.slice(0, 20))}/800/450?blur=1`,
              isImageFallback: true,
            }
          : null
      );
    }
  };

  // Launch a new bespoke campaign
  const handleStartChronicle = async (setupData: {
    setting: string;
    artStyle: string;
    characterDetails: string;
    settingName: string;
    artStyleName: string;
  }) => {
    setLoading(true);
    setErrorMsg("");
    setConfig(setupData);

    try {
      const response = await fetch("/api/adventure/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          setting: setupData.setting,
          artStyle: setupData.artStyle,
          characterDetails: setupData.characterDetails,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to establish starting scene.");
      }

      const initialScene: SceneData = await response.json();
      setCurrentScene(initialScene);
      setHistory([]);
      scanNarrativeImpact(initialScene.storyText, "", true);
      setGameStarted(true);

      // Seamlessly fetch illustration in the background
      fetchScenicVisual(initialScene.detailedVisualPrompt, setupData.artStyle);
    } catch (err: any) {
      console.error("Starting error:", err);
      setErrorMsg(err.message || "An expected anomaly occurred. Check API Key credentials.");
    } finally {
      setLoading(false);
    }
  };

  // Progress narrative step-by-step
  const handleProgressChronicle = async (chosenOptionText: string) => {
    if (loading || !config || !currentScene || isGameOver) return;

    setLoading(true);
    setErrorMsg("");

    // Package current scene state to history array log
    const updatedHistoryItem: HistoryItem = {
      sceneTitle: currentScene.sceneTitle,
      storyText: currentScene.storyText,
      choiceMade: chosenOptionText,
      inventoryState: currentScene.inventory,
      questState: currentScene.currentQuest,
      imageUrl: currentScene.imageUrl,
    };

    const newHistory = [...history, updatedHistoryItem];
    setHistory(newHistory);

    try {
      const response = await fetch("/api/adventure/next", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          setting: config.setting,
          artStyle: config.artStyle,
          characterDetails: config.characterDetails,
          history: newHistory,
          chosenOption: chosenOptionText,
          inventory: currentScene.inventory,
          currentQuest: currentScene.currentQuest,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to progress timeline.");
      }

      const nextScene: SceneData = await response.json();
      setCurrentScene(nextScene);
      
      // Update interactive RPG stats
      scanNarrativeImpact(nextScene.storyText, chosenOptionText, false);

      // Trigger background scenic image rendering
      fetchScenicVisual(nextScene.detailedVisualPrompt, config.artStyle);
    } catch (err: any) {
      console.error("Progression error:", err);
      setErrorMsg(err.message || "Narrative stream ruptured. Please retry choice.");
      // Rollback history if failed
      setHistory(history);
    } finally {
      setLoading(false);
      setCustomAction("");
    }
  };

  // Submit completely customized text action
  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customAction.trim() || loading || isGameOver) return;
    handleProgressChronicle(customAction.trim());
  };

  // Trigger using inventory item
  const handleUseItem = (itemName: string) => {
    if (loading || isGameOver) return;
    // Formulates beautiful action query
    const formulatedAction = `I carefully use my [${itemName}] to attempt to bypass or overcome this situation.`;
    handleProgressChronicle(formulatedAction);
  };

  const handleResetGame = () => {
    setGameStarted(false);
    setCurrentScene(null);
    setHistory([]);
    setConfig(null);
    setErrorMsg("");
    setCustomAction("");
    setIsGameOver(false);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 flex flex-col font-sans selection:bg-amber-500/30 selection:text-white">
      
      {/* 4px Geometric balance border accent around the top level page screen */}
      <div className="fixed inset-0 border-4 border-zinc-900 pointer-events-none z-50" />

      {/* Main Header Bar */}
      <Header
        sceneCount={history.length + 1}
        onReset={handleResetGame}
        settingName={config?.settingName || ""}
        artStyleName={config?.artStyleName || ""}
        characterDesc={config?.characterDetails || ""}
        isGameStarted={gameStarted}
      />

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        
        {/* Play Space Grid Container */}
        {!gameStarted ? (
          // SETUP SCRIBE PANEL
          <div className="flex-1 overflow-y-auto px-4 py-8 md:p-12 mb-8">
            {errorMsg && (
              <div className="max-w-4xl mx-auto mb-6 p-4 bg-red-950/30 border border-red-900/50 rounded-sm flex items-start gap-3 text-red-400">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-red-200">Simulation Disruption</h4>
                  <p className="text-xs mt-1 leading-relaxed">{errorMsg}</p>
                </div>
              </div>
            )}
            <GameSetup onStart={handleStartChronicle} isLoading={loading} />
          </div>
        ) : (
          // ACTIVE SIMULATION CONSOLE (Geometric Balance Board)
          <>
            {/* LEFT COMPONENT: RPG SIDEBAR PANEL */}
            <Sidebar
              inventory={currentScene?.inventory || []}
              currentQuest={currentScene?.currentQuest || ""}
              ambientTone={currentScene?.ambientTone || ""}
              turnsCount={history.length + 1}
              attributes={attributes}
              characterDesc={config?.characterDetails || ""}
              onUseItem={handleUseItem}
            />

            {/* RIGHT COMPONENT: STORY ENGINE NARRATOR */}
            <main className="flex-1 flex flex-col relative pb-8 h-full overflow-y-auto scrollbar-thin">
              
              {/* Dynamic Visual Window (80 h-dimension as requested by Geometric spec) */}
              <div className="h-80 bg-zinc-900 border-b border-zinc-800 relative overflow-hidden flex items-center justify-center select-none">
                
                {/* Visual shade mask */}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent opacity-85 z-10" />

                {/* Main Render Image Area */}
                {currentScene?.imageUrl ? (
                  <div className="absolute inset-0 w-full h-full animate-fadein">
                    <img
                      src={currentScene.imageUrl}
                      alt={currentScene.sceneTitle || "Current Scene Visual"}
                      referrerPolicy="no-referrer"
                      className={`w-full h-full object-cover transition-all duration-700 ${currentScene.imageLoading ? "blur-md scale-102 saturate-50" : "blur-0 scale-100 saturate-100"}`}
                    />
                    
                    {/* Fallback watermark to reassure client */}
                    {currentScene.isImageFallback && (
                      <div className="absolute top-4 right-4 z-20 px-2 py-0.5 bg-zinc-950/80 border border-zinc-800 text-[9px] font-mono text-zinc-500 uppercase tracking-widest flex items-center gap-1.5 rounded-sm">
                        <Clock className="w-3 h-3 text-amber-500" />
                        <span>Scenic Preview</span>
                      </div>
                    )}
                  </div>
                ) : (
                  // Neutral placeholder
                  <div className="w-full h-full bg-zinc-950 flex flex-col items-center justify-center space-y-4 font-mono">
                    <div className="w-48 h-[1px] bg-zinc-850" />
                    <p className="italic text-zinc-650 text-[10px] tracking-[0.34em] uppercase text-center animate-pulse">
                      Summoning Scenic Atmosphere...
                    </p>
                    <div className="w-48 h-[1px] bg-zinc-850" />
                  </div>
                )}

                {/* Overlay Loader Spinner if currently synthesizing image */}
                {currentScene?.imageLoading && (
                  <div className="absolute inset-0 bg-zinc-950/60 flex flex-col items-center justify-center gap-3 z-30 font-mono animate-fadein">
                    <Loader2 className="w-6 h-6 text-amber-500 animate-spin" />
                    <span className="text-[10px] text-zinc-400 uppercase tracking-widest">
                      Real-time generative render
                    </span>
                  </div>
                )}

                {/* Elegant geometric line decorations around the visual border */}
                <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-zinc-700 pointer-events-none z-20" />
                <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-zinc-700 pointer-events-none z-20" />
                <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-zinc-700 pointer-events-none z-20" />
                <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-zinc-700 pointer-events-none z-20" />
              </div>

              {/* NARRATIVE TEXT DESCRIPTION PANEL */}
              <div className="flex-1 p-6 md:p-8 flex flex-col justify-center items-center text-center max-w-2xl mx-auto w-full animate-fadein relative">
                
                {errorMsg && (
                  <div className="w-full mb-6 p-4 bg-red-950/30 border border-red-900/50 rounded-sm flex items-center justify-between text-red-400 text-left">
                    <div className="flex items-center gap-2.5">
                      <AlertCircle className="w-4.5 h-4.5 shrink-0" />
                      <span className="text-xs">{errorMsg}</span>
                    </div>
                    <button 
                      onClick={() => setErrorMsg("")} 
                      className="text-xs font-mono font-bold underline cursor-pointer hover:text-white ml-3 shrink-0"
                    >
                      Dismiss
                    </button>
                  </div>
                )}

                {/* Chapter scene title */}
                <h1 className="text-[10px] text-amber-500 font-bold tracking-[0.35em] uppercase mb-4 font-mono">
                  {currentScene?.sceneTitle || "The Unknown Horizon"}
                </h1>

                {/* Prose narration description */}
                <p className="text-base md:text-lg font-serif text-zinc-200 leading-relaxed font-normal">
                  {currentScene?.storyText || "The narrative begins to wind its web. Awaiting choice initialization..."}
                </p>

                {/* Prompt guiding sentence */}
                <p className="mt-5 text-zinc-500 italic text-[11px] font-sans">
                  What action do you deploy, {config?.characterDetails?.split(",")[0]?.split(" ")[1] || "Hero"}?
                </p>
                {isGameOver && (
                  <div className="mt-6 w-full border border-amber-500/30 bg-amber-500/10 rounded-sm px-4 py-3 text-left animate-fadein">
                    <h3 className="text-xs font-bold text-amber-300 uppercase tracking-widest font-mono">
                      {gameOverTitle}
                    </h3>
                    <p className="text-xs text-amber-100/80 mt-1 leading-relaxed">{gameOverMessage}</p>
                    <button
                      onClick={handleResetGame}
                      className="mt-3 px-3 py-1.5 bg-zinc-950 border border-amber-500/40 text-amber-200 text-[10px] uppercase tracking-widest font-mono hover:bg-amber-500/10 transition-colors rounded-sm"
                    >
                      Begin New Journey
                    </button>
                  </div>
                )}
              </div>

              {/* HIGH-DENSITY CHOICE SELECTION INTERFACE */}
              <div className="p-6 md:p-8 bg-zinc-950/60 border-t border-zinc-900/80 flex flex-col items-center justify-center gap-5 w-full">
                
                {/* Loader Overlay when narrative is processing */}
                {loading && (
                  <div className="w-full max-w-4xl p-5 bg-zinc-900/80 border border-zinc-800 flex items-center justify-center gap-3 animate-pulse rounded-sm">
                    <Loader2 className="w-4 h-4 text-amber-500 animate-spin" />
                    <span className="text-xs text-zinc-400 font-mono uppercase tracking-widest">
                      Consolidating temporal threads...
                    </span>
                  </div>
                )}

                {/* Choices buttons grid */}
                {!loading && currentScene && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 w-full max-w-4xl">
                    {currentScene.options.map((option, idx) => (
                      <button
                        key={option.id || idx}
                        id={`option_choice_${idx + 1}`}
                        onClick={() => handleProgressChronicle(option.text)}
                        disabled={isGameOver}
                        className="h-16 px-5 border border-zinc-850 hover:border-zinc-550 bg-zinc-950/70 hover:bg-zinc-900 text-left flex items-center group cursor-pointer transition-all rounded-sm relative disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-zinc-950/70 disabled:hover:border-zinc-850"
                      >
                        <span className="w-7 text-zinc-600 text-xs font-mono group-hover:text-amber-500 transition-colors">
                          0{idx + 1}
                        </span>
                        <span className="text-xs text-zinc-350 tracking-wide font-sans group-hover:text-zinc-100 transition-colors leading-relaxed line-clamp-2 pr-2">
                          {option.text}
                        </span>
                        {/* Interactive small chevron sign */}
                        <div className="absolute top-1 right-1 w-1 h-1 bg-zinc-800 group-hover:bg-amber-400 transition-colors" />
                      </button>
                    ))}
                  </div>
                )}

                {/* GENUINELY CUSTOM USER INPUT CONTROLLER */}
                {currentScene && !loading && (
                  <div className="w-full max-w-4xl border-t border-zinc-900 pt-4 mt-1">
                    <form onSubmit={handleCustomSubmit} className="flex gap-2.5 items-center">
                      <div className="p-2bg-zinc-950 border border-zinc-900 text-zinc-500 rounded-sm">
                        <Terminal className="w-3.5 h-3.5 text-zinc-500" />
                      </div>
                      <input
                        type="text"
                        value={customAction}
                        onChange={(e) => setCustomAction(e.target.value)}
                        placeholder={isGameOver ? "Begin a new journey to issue commands." : "Forge your own path... Type any custom action (e.g. 'I cast a light spell on Elara's hand')"}
                        id="custom_action_input"
                        className="flex-1 bg-zinc-950 border border-zinc-850 rounded-sm px-4 py-2.5 text-xs text-zinc-300 focus:outline-none focus:border-zinc-650 font-mono tracking-wide placeholder:text-zinc-600"
                        maxLength={180}
                        disabled={isGameOver}
                      />
                      <button
                        type="submit"
                        disabled={!customAction.trim() || isGameOver}
                        id="custom_action_submit"
                        className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40 text-zinc-300 hover:text-white border border-zinc-850 hover:border-zinc-700 rounded-sm text-xs font-mono transition-colors cursor-pointer shrink-0 flex items-center gap-1.5"
                      >
                        <span>Command</span>
                        <Send className="w-3 h-3" />
                      </button>
                    </form>
                    <p className="text-[10px] text-zinc-600 font-mono mt-1.5 text-left pl-1">
                      Type arbitrary narrative prompts. Your custom decisions will dynamically redefine the adventure setting.
                    </p>
                  </div>
                )}

              </div>
            </main>
          </>
        )}

      </div>

      {/* BOTTOM CONSOLE FOOTER STATUS BAR (Exact Geometric specification) */}
      <footer className="h-8 bg-zinc-950 border-t border-zinc-900/60 px-5 flex items-center justify-between text-[10px] text-zinc-600 select-none font-mono">
        <div className="flex items-center space-x-4">
          <span>ENGINE: CHRONICLE-CYOA-V1</span>
          <span>PLATFORM SEED: GEMINI-PROTEC</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500/80 animate-pulse"></div>
          <span className="uppercase tracking-widest text-[9px]">AI Narrative Synchronized</span>
        </div>
      </footer>

    </div>
  );
}
