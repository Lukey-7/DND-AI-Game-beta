import React, { useState } from "react";
import { ADVENTURE_SETTINGS, ART_STYLES } from "../data";
import { AdventureSetting, ArtStyle } from "../types";
import { 
  Sparkles, 
  User, 
  Fingerprint, 
  BookOpen, 
  ArrowRight,
  Wand2,
  Cpu,
  ShieldAlert,
  Compass,
  Orbit,
  Globe
} from "lucide-react";

interface GameSetupProps {
  onStart: (config: {
    setting: string;
    artStyle: string;
    characterDetails: string;
    settingName: string;
    artStyleName: string;
  }) => void;
  isLoading: boolean;
}

// Map settings icons dynamically
const IconMap: { [key: string]: any } = {
  Cpu: Cpu,
  ShieldAlert: ShieldAlert,
  Compass: Compass,
  Orbit: Orbit,
};

export const GameSetup: React.FC<GameSetupProps> = ({ onStart, isLoading }) => {
  const [selectedSetting, setSelectedSetting] = useState<AdventureSetting>(ADVENTURE_SETTINGS[0]);
  const [isCustomSetting, setIsCustomSetting] = useState(false);
  const [customSettingText, setCustomSettingText] = useState("");
  const [selectedStyle, setSelectedStyle] = useState<ArtStyle>(ART_STYLES[0]);
  const [characterDetails, setCharacterDetails] = useState(ADVENTURE_SETTINGS[0].suggestedCharacter);

  // Update character suggestion when setting changes
  const handleSettingSelect = (setting: AdventureSetting) => {
    setSelectedSetting(setting);
    setIsCustomSetting(false);
    setCharacterDetails(setting.suggestedCharacter);
  };

  const handleCustomSettingSelect = () => {
    setIsCustomSetting(true);
    setCharacterDetails("A mysterious traveler carrying a secretive leather journal and a copper signet ring.");
  };

  const handleRollCharacter = () => {
    const roles = [
      "A rogue sky-captain with a mechanical brass eye and a coat stained by grease and black-powder.",
      "An exile high-sorcerer wearing glowing sapphire obsidian robes, carrying a broken staff of dark stardust.",
      "A seasoned tech-scavenger with dusty brass safety goggles and a magnetic grappling gauntlet.",
      "A silent shadow-dancer wearing fluid ash-cloth bindings, concealing twin poisoned obsidian lockpicks.",
      "An eccentric void-botanist with glowing teal eyes, carrying a containment jar containing an ancient neon spore.",
      "A weary knight-errant clad in scratched solar-indigo armor, bearing a shield engraved with a weeping sun."
    ];
    const randomIndex = Math.floor(Math.random() * roles.length);
    setCharacterDetails(roles[randomIndex]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalSettingText = isCustomSetting ? customSettingText.trim() : selectedSetting.description;
    const finalSettingName = isCustomSetting ? "Custom Realm" : selectedSetting.name;
    
    onStart({
      setting: `Realm: ${finalSettingName}. Background/Setting: ${finalSettingText}`,
      artStyle: selectedStyle.promptSignature,
      characterDetails: characterDetails.trim(),
      settingName: finalSettingName,
      artStyleName: selectedStyle.name,
    });
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 md:px-0 animate-fadein">
      {/* Intro hero banner */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3.5 py-1 rounded-sm text-xs text-amber-500 font-mono mb-4">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span className="uppercase tracking-widest text-[9px] font-bold">Chronicle Creator Engaged</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-extrabold font-fantasy tracking-tight text-zinc-100 mb-3 uppercase">
          Odyssey Engine
        </h2>
        <p className="text-sm text-zinc-400 max-w-2xl mx-auto leading-relaxed font-sans">
          Welcome to an infinite generative RPG playground. Choose your environment settings, 
          define your protagonist, select an artistic direction, and forge your unique path.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* SECTION 1: SET SETTING */}
        <div className="bg-zinc-950 border border-zinc-800 p-6 md:p-8 rounded-sm relative">
          {/* Decorative corners */}
          <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-zinc-650" />
          <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-zinc-650" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-zinc-650" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-zinc-650" />
          
          <div className="mb-6 border-b border-zinc-900 pb-3">
            <span className="text-[10px] font-mono text-zinc-500 font-bold tracking-widest uppercase">01 / select universe setting</span>
            <h3 className="text-lg font-bold text-zinc-100 font-fantasy mt-0.5 uppercase">Construct Realm Topology</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ADVENTURE_SETTINGS.map((setting) => {
              const IconComp = IconMap[setting.icon] || Globe;
              const isSelected = !isCustomSetting && selectedSetting.id === setting.id;
              
              return (
                <button
                  type="button"
                  key={setting.id}
                  id={`setting_${setting.id}`}
                  onClick={() => handleSettingSelect(setting)}
                  className={`text-left p-5 border transition-all duration-300 relative flex gap-4 cursor-pointer rounded-sm ${
                    isSelected
                      ? "bg-zinc-900 border-zinc-550 shadow-[0_0_15px_rgba(255,255,255,0.02)]"
                      : "bg-zinc-950/40 border-zinc-900 hover:border-zinc-800 hover:bg-zinc-900/10"
                  }`}
                >
                  <div className={`w-10 h-10 border flex items-center justify-center shrink-0 rounded-sm ${
                    isSelected ? "bg-zinc-800 border-zinc-600 text-amber-500" : "bg-zinc-950 border-zinc-900 text-zinc-600"
                  }`}>
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-zinc-100 font-fantasy uppercase">{setting.name}</h4>
                    <p className="text-xs text-zinc-400 leading-relaxed mt-1">{setting.description}</p>
                  </div>
                </button>
              );
            })}

            {/* Custom Setting Button */}
            <button
              type="button"
              id="setting_custom"
              onClick={handleCustomSettingSelect}
              className={`text-left p-5 border transition-all duration-300 flex gap-4 cursor-pointer col-span-1 md:col-span-2 rounded-sm ${
                isCustomSetting
                  ? "bg-zinc-900 border-zinc-550 shadow-[0_0_15px_rgba(255,255,255,0.02)]"
                  : "bg-zinc-950/40 border-zinc-900 hover:border-zinc-800 hover:bg-zinc-900/10"
              }`}
            >
              <div className={`w-10 h-10 border flex items-center justify-center shrink-0 rounded-sm ${
                isCustomSetting ? "bg-zinc-800 border-zinc-600 text-amber-500" : "bg-zinc-955 border-zinc-900 text-zinc-600"
              }`}>
                <Globe className="w-5 h-5" />
              </div>
              <div className="w-full">
                <h4 className="font-bold text-sm text-zinc-100 font-fantasy uppercase">Bespoke Custom Universe</h4>
                <p className="text-xs text-zinc-400 leading-relaxed mt-1">Design any fantasy world, dimensional rift, or modern sci-fi planet from scratch.</p>
                {isCustomSetting && (
                  <div className="mt-3" onClick={(e) => e.stopPropagation()}>
                    <textarea
                      value={customSettingText}
                      onChange={(e) => setCustomSettingText(e.target.value)}
                      placeholder="Describe your sandbox setting in detail (e.g. A forgotten clockwork tower floating near a violet nebula where ancient wizards study alchemy...)"
                      required={isCustomSetting}
                      id="custom_setting_input"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-sm p-3 text-xs text-zinc-300 focus:outline-none focus:border-zinc-600 text-left min-h-[80px] resize-y font-sans leading-relaxed"
                    />
                  </div>
                )}
              </div>
            </button>
          </div>
        </div>

        {/* SECTION 2: CHOOSE ART STYLE */}
        <div className="bg-zinc-950 border border-zinc-800 p-6 md:p-8 rounded-sm relative">
          {/* Decorative corners */}
          <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-zinc-650" />
          <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-zinc-650" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-zinc-650" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-zinc-650" />

          <div className="mb-6 border-b border-zinc-900 pb-3">
            <span className="text-[10px] font-mono text-zinc-500 font-bold tracking-widest uppercase">02 / art synthesis parameters</span>
            <h3 className="text-lg font-bold text-zinc-100 font-fantasy mt-0.5 uppercase">Establish Unified Art Style</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3.5">
            {ART_STYLES.map((style) => {
              const isSelected = selectedStyle.id === style.id;
              
              return (
                <button
                  type="button"
                  key={style.id}
                  id={`style_${style.id}`}
                  onClick={() => setSelectedStyle(style)}
                  className={`text-left rounded-sm border overflow-hidden flex flex-col transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? "bg-zinc-900 border-zinc-500"
                      : "bg-zinc-950/40 border-zinc-900 hover:border-zinc-800"
                  }`}
                >
                  <div className="h-16 w-full overflow-hidden relative">
                    <img
                      src={style.exampleImage}
                      alt={style.name}
                      referrerPolicy="no-referrer"
                      className={`w-full h-full object-cover transition-transform duration-550 ${isSelected ? "scale-105 filter saturate-100 opacity-90" : "grayscale opacity-40 hover:opacity-60"}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent" />
                  </div>
                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-[10px] text-zinc-100 uppercase tracking-widest leading-normal">{style.name}</h4>
                      <p className="text-[9px] text-zinc-500 mt-1 leading-relaxed">{style.description}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* SECTION 3: INTRODUCE CHARACTER */}
        <div className="bg-zinc-950 border border-zinc-800 p-6 md:p-8 rounded-sm relative">
          {/* Decorative corners */}
          <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-zinc-650" />
          <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-zinc-650" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-zinc-650" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-zinc-650" />

          <div className="mb-6 flex items-center justify-between gap-4 border-b border-zinc-900 pb-3">
            <div>
              <span className="text-[10px] font-mono text-zinc-500 font-bold tracking-widest uppercase">03 / avatar identity blueprint</span>
              <h3 className="text-lg font-bold text-zinc-100 font-fantasy mt-0.5 uppercase">Draft Protagonist Profile</h3>
            </div>
            
            <button
              type="button"
              id="random_character_btn"
              onClick={handleRollCharacter}
              className="px-3 py-1.5 bg-zinc-905 hover:bg-zinc-900 text-zinc-300 hover:text-white border border-zinc-800 hover:border-zinc-700 rounded-sm text-[10px] font-mono flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <Wand2 className="w-3 h-3 text-amber-500" />
              <span className="uppercase tracking-wider">Draft Profile</span>
            </button>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <div className="absolute top-3.5 left-3.5 text-zinc-600">
                <User className="w-4 h-4" />
              </div>
              <textarea
                value={characterDetails}
                onChange={(e) => setCharacterDetails(e.target.value)}
                id="character_details_input"
                placeholder="Give details about your protagonist's appearance and gear (e.g. Valerius, a cybernetic mercenary carrying an emerald lock-cutter and a leather vest...)"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-sm py-3 pl-11 pr-4 text-xs text-zinc-350 focus:outline-none focus:border-zinc-600 min-h-[90px] resize-y leading-relaxed font-sans"
                required
              />
            </div>
            
            <div className="p-3 bg-zinc-900/20 border border-zinc-900/60 rounded-sm flex items-start gap-2.5">
              <Fingerprint className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider">Continuous Physical Continuity</span>
                <p className="text-[10px] text-zinc-500 leading-relaxed mt-0.5">
                  The image synthesis engine parses physical descriptors (e.g., "goggles", "fur cape", "scar") to reinforce character resemblance throughout consecutive scenic frames.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="text-center pt-2">
          <button
            type="submit"
            disabled={isLoading}
            id="start_adventure_btn"
            className="inline-flex items-center gap-3 bg-zinc-100 hover:bg-white disabled:bg-zinc-800 text-zinc-950 font-bold px-8 py-3.5 rounded-sm shadow-md transition-all active:scale-98 disabled:opacity-50 cursor-pointer text-xs uppercase tracking-widest font-mono"
          >
            {isLoading ? (
              <>
                <BookOpen className="w-4 h-4 animate-spin" />
                <span>Synchronizing Chronicles...</span>
              </>
            ) : (
              <>
                <span>Engage Simulation</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
};
