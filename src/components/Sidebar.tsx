import React from "react";
import { 
  Compass, 
  User, 
  Grid,
  Shield,
  Activity,
  Droplet
} from "lucide-react";

interface SidebarProps {
  inventory: string[];
  currentQuest: string;
  ambientTone: string;
  onUseItem?: (itemName: string) => void;
  turnsCount: number;
  attributes: {
    vitality: number;
    maxVitality: number;
    insight: number;
    corruption: number;
  };
  characterDesc: string;
}

// Function to map common item names to beautiful hand-selected emojis
const getItemEmoji = (itemName: string): string => {
  const name = itemName.toLowerCase();
  if (name.includes("sword") || name.includes("blade") || name.includes("dagger") || name.includes("weapon") || name.includes("axe") || name.includes("rapier") || name.includes("claymore")) return "🗡️";
  if (name.includes("shield") || name.includes("buckler") || name.includes("guard")) return "🛡️";
  if (name.includes("potion") || name.includes("elixir") || name.includes("vial") || name.includes("flask") || name.includes("brew") || name.includes("phial")) return "🧪";
  if (name.includes("scroll") || name.includes("map") || name.includes("document") || name.includes("letter") || name.includes("journal") || name.includes("book")) return "📜";
  if (name.includes("key") || name.includes("pass") || name.includes("locket")) return "🗝️";
  if (name.includes("ring") || name.includes("charm") || name.includes("amulet") || name.includes("jewel") || name.includes("talisman")) return "💍";
  if (name.includes("crystal") || name.includes("gem") || name.includes("shard") || name.includes("stone")) return "💎";
  if (name.includes("coin") || name.includes("gold") || name.includes("silver") || name.includes("credits") || name.includes("token")) return "🪙";
  if (name.includes("goggles") || name.includes("visor") || name.includes("spectacles")) return "🥽";
  if (name.includes("chest") || name.includes("box") || name.includes("cube") || name.includes("cylinder")) return "📦";
  if (name.includes("herb") || name.includes("plant") || name.includes("flower") || name.includes("root") || name.includes("fungus") || name.includes("mushroom")) return "🌿";
  if (name.includes("torch") || name.includes("lantern") || name.includes("candle") || name.includes("flare")) return "🔦";
  if (name.includes("glove") || name.includes("gauntlet") || name.includes("bracer")) return "🧤";
  if (name.includes("card") || name.includes("chip") || name.includes("deck") || name.includes("wire")) return "💾";
  if (name.includes("meat") || name.includes("bread") || name.includes("apple") || name.includes("ration") || name.includes("water") || name.includes("food")) return "🍞";
  
  return "🎒"; // default adventure pack emoji
};

export const Sidebar: React.FC<SidebarProps> = ({
  inventory,
  currentQuest,
  ambientTone,
  onUseItem,
  turnsCount,
  attributes,
  characterDesc,
}) => {
  // Pad the inventory list to exactly 9 slots to match the classic equipment grid
  const GRID_SIZE = 9;
  const gridItems = [...inventory];
  while (gridItems.length < GRID_SIZE) {
    gridItems.push("");
  }

  // Estimate a clean background/accent tint depending on ambient environment tone
  const getToneBadge = () => {
    const tone = (ambientTone || "").toLowerCase();
    if (tone.includes("eerie") || tone.includes("creep") || tone.includes("dark") || tone.includes("gothic")) {
      return "text-purple-400 bg-purple-500/10 border-purple-500/30";
    }
    if (tone.includes("tense") || tone.includes("danger") || tone.includes("hostile") || tone.includes("epic")) {
      return "text-rose-400 bg-rose-500/10 border-rose-500/30";
    }
    if (tone.includes("peace") || tone.includes("serene") || tone.includes("calm") || tone.includes("lush")) {
      return "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";
    }
    if (tone.includes("mysterious") || tone.includes("magic") || tone.includes("cyan") || tone.includes("cyber")) {
      return "text-cyan-400 bg-cyan-500/10 border-cyan-500/30";
    }
    return "text-amber-400 bg-amber-500/10 border-amber-500/30";
  };

  // Extract a suitable name from the character description or assign default
  let name = "Dusk-Walker";
  let title = "Level " + Math.max(1, Math.floor(turnsCount / 2) + 1);
  
  if (characterDesc) {
    if (characterDesc.toLowerCase().includes("deckrunner") || characterDesc.toLowerCase().includes("hacker")) {
      name = "Aero-Deckrunner";
    } else if (characterDesc.toLowerCase().includes("alchemist") || characterDesc.toLowerCase().includes("sorcerer")) {
      name = "Airship Alchemist";
    } else if (characterDesc.toLowerCase().includes("sellsword") || characterDesc.toLowerCase().includes("knight") || characterDesc.toLowerCase().includes("scavenger")) {
      const match = characterDesc.match(/(?:A\s+)?([A-Za-z\-]+(?:\s+[A-Za-z\-]+)?)/i);
      if (match && match[1]) {
        name = match[1];
      } else {
        name = "Iron Sellsword";
      }
    } else if (characterDesc.toLowerCase().includes("surveyor") || characterDesc.toLowerCase().includes("astronaut")) {
      name = "Void Surveyor";
    } else {
      const parsed = characterDesc.split(" ")[0] + " " + (characterDesc.split(" ")[1] || "Chronicle");
      name = parsed.replace(/[^A-Za-z ]/g, "");
    }
  }

  return (
    <aside className="w-full lg:w-72 border-r border-zinc-800 flex flex-col h-full bg-zinc-950/80 animate-fadein">
      
      {/* 1. CURRENT QUEST STATUS (Geometric Balance Top Block) */}
      <div className="p-6 border-b border-zinc-800 bg-zinc-900/40 relative">
        <h2 className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold mb-1.5 flex items-center justify-between">
          <span>Current Quest</span>
          <span className="text-zinc-600 font-mono text-[9px] lowercase">chronicle mode</span>
        </h2>
        <p className="text-sm text-amber-200 font-medium leading-relaxed font-display" id="current_quest_text">
          {currentQuest || "Begin your custom chronicle..."}
        </p>
        
        {/* Progress gauge */}
        <div className="mt-4 flex items-center gap-2">
          <div className="flex-1 bg-zinc-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-amber-500 h-full transition-all duration-700" 
              style={{ width: `${Math.min(100, Math.max(15, (turnsCount * 12) % 100))}%` }}
            />
          </div>
          <span className="text-[9px] font-mono text-zinc-500 shrink-0">Pt.{turnsCount}</span>
        </div>
      </div>
      
      {/* 2. EQUIPMENT GRID & ATTRS PANEL */}
      <div className="flex-1 p-6 overflow-y-auto space-y-7 scrollbar-thin">
        
        {/* Inventory section */}
        <div>
          <h2 className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold mb-4 flex items-center justify-between">
            <span>Inventory</span>
            <span className="text-zinc-600 font-mono text-[9px] lowercase">{inventory.length} active</span>
          </h2>
          
          <div className="grid grid-cols-3 gap-2">
            {gridItems.map((itemName, index) => {
              if (itemName) {
                const emoji = getItemEmoji(itemName);
                return (
                  <div
                    key={`${itemName}-${index}`}
                    id={`inventory_item_${index}`}
                    onClick={() => onUseItem && onUseItem(itemName)}
                    title={`Click to use / wield: ${itemName}`}
                    className="aspect-square bg-zinc-900 border border-zinc-800 flex flex-col items-center justify-center p-1.5 text-center relative group cursor-pointer hover:border-zinc-500 hover:bg-zinc-800/40 transition-all"
                  >
                    <span className="text-xl group-hover:scale-110 transition-transform">{emoji}</span>
                    <span className="absolute bottom-1 left-1 right-1 text-[8px] text-zinc-400 truncate opacity-70 group-hover:opacity-100 transition-opacity">
                      {itemName.split(" ")[0]}
                    </span>
                    {/* Corner accent for occupied slot */}
                    <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-zinc-700 group-hover:border-amber-500" />
                  </div>
                );
              }
              
              // Render vacant RPG layout slot
              return (
                <div
                  key={`vacant-${index}`}
                  className="aspect-square bg-zinc-800/10 border border-zinc-800/40 opacity-40 flex items-center justify-center select-none"
                >
                  <span className="text-[9px] font-mono text-zinc-700">slot</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Attributes Section */}
        <div>
          <h2 className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold mb-4">Attributes</h2>
          <div className="space-y-3.5">
            {/* Vitality attribute */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-zinc-400 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                  <span>Vitality</span>
                </span>
                <span className="text-zinc-100 font-mono font-medium">
                  {attributes.vitality} / {attributes.maxVitality}
                </span>
              </div>
              <div className="w-full bg-zinc-900 h-1 border border-zinc-800 overflow-hidden">
                <div 
                  className="bg-zinc-300 h-full transition-all duration-500"
                  style={{ width: `${(attributes.vitality / attributes.maxVitality) * 100}%` }}
                />
              </div>
            </div>

            {/* Insight attribute */}
            <div className="flex justify-between items-center text-xs pb-1 border-b border-zinc-900">
              <span className="text-zinc-400 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                <span>Insight</span>
              </span>
              <span className="text-zinc-100 font-mono">{attributes.insight}</span>
            </div>

            {/* Corruption attribute */}
            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-400 flex items-center gap-1.5">
                <Droplet className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                <span>Corruption</span>
              </span>
              <span className="text-red-500 font-mono">{attributes.corruption}%</span>
            </div>
          </div>
        </div>

        {/* Ambient indicator */}
        <div className="pt-2 border-t border-zinc-900/60 flex items-center justify-between">
          <span className="text-[10px] text-zinc-600 font-mono">Ambient State</span>
          <span className={`text-[10px] font-mono font-semibold uppercase px-2 py-0.5 border rounded-sm tracking-wider ${getToneBadge()}`}>
            {ambientTone || "unsettled"}
          </span>
        </div>

      </div>

      {/* 3. PROFILE IDENT (Geometric Balance Bottom Block) */}
      <div className="p-5 bg-zinc-900/35 border-t border-zinc-800">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 bg-zinc-900 border border-zinc-800 flex items-center justify-center relative rounded-sm text-zinc-400">
            <User className="w-5 h-5 text-zinc-500" />
            <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-zinc-600" />
            <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-zinc-600" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-zinc-100 truncate" title={name}>
              {name}
            </p>
            <p className="text-[10px] text-zinc-500 font-mono truncate" title={characterDesc}>
              {title} • {characterDesc?.split(",")[0] || "Sojourner"}
            </p>
          </div>
        </div>
      </div>

    </aside>
  );
};
