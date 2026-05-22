import { AdventureSetting, ArtStyle } from "./types";

export const ADVENTURE_SETTINGS: AdventureSetting[] = [
  {
    id: "cyberpunk",
    name: "Neo-Noir Metropolis",
    description: "A rain-slicked city of towering holographic advertisements, corrupt mega-corps, and underground hacker syndicates.",
    icon: "Cpu",
    suggestedCharacter: "A rogue deckrunner with a chrome jacket, glowing cybernetic emerald eyes, and a neural-lace interface behind their ear.",
    exampleCharacterDesc: "A rogue deckrunner with a reflective silver jacket, cybernetic glowing green eyes, and a mechanical hacker glove.",
    defaultPromptSeed: "Cyberpunk metropolis underground",
    themeColor: "cyan",
  },
  {
    id: "shattered_fantasy",
    name: "The Grim Hollow Kingdom",
    description: "A dark medieval realm plagued by ancient curses, where dead kings rise and wild beasts stalk the whispering ruins.",
    icon: "ShieldAlert",
    suggestedCharacter: "A scarred dark-elven sellsword in tattered wolfskin armor, armed with a runic bastard sword and a velvet crimson cloak.",
    exampleCharacterDesc: "A battle-scarred elf with long silver hair, weathered wolf-skin leather armor, holding a glowing runic sword.",
    defaultPromptSeed: "Eerie gothic dark fantasy forest ruins",
    themeColor: "amber",
  },
  {
    id: "steampunk_academy",
    name: "Academy of Clockwork Magic",
    description: "An elegant Victorian institute floating amongst the clouds, where brass automatons assist sorcerers in airship alchemy.",
    icon: "Compass",
    suggestedCharacter: "An eccentric airship alchemist clad in brass-rimmed goggles, an indigo velvet frock coat, carrying a bubbling vial of solar ether.",
    exampleCharacterDesc: "A young alchemist with copper goggles, an ornate indigo velvet coat, holding a glowing brass pocket watch.",
    defaultPromptSeed: "Floating steampunk library in the clouds",
    themeColor: "emerald",
  },
  {
    id: "cosmic_horror",
    name: "Chronos Cosmic Station",
    description: "An abandoned orbital station drifting near a black hole, where quantum anomalies and eldritch whispers distort time itself.",
    icon: "Orbit",
    suggestedCharacter: "A deep-space surveyor in a bulky high-pressure spacesuit, with a cracked visor revealing a neon-purple gravity pulse, holding an artifact analyzer.",
    exampleCharacterDesc: "An astronaut in a pristine white and obsidian void-suit with a glowing purple compass and a cosmic light visor.",
    defaultPromptSeed: "Abandoned space station docking bay next to an iridescent cosmic anomaly",
    themeColor: "purple",
  }
];

export const ART_STYLES: ArtStyle[] = [
  {
    id: "cyberpunk_pixel",
    name: "Retro Pixel Art",
    description: "16-bit detailed pixel aesthetic with vibrant hues, rich textures, and dramatic ambient lighting.",
    promptSignature: "Gorgeous retro 16-bit pixel art, highly detailed, vibrant colors, nostalgic video game aesthetic, rich shadows, and dithering effects",
    exampleImage: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=60"
  },
  {
    id: "vintage_watercolor",
    name: "Vintage Watercolor",
    description: "Dreamy ink and wash illustration with soft pastel bleeds, clean hand-drawn lines, and paper textures.",
    promptSignature: "Whimsical vintage watercolor and ink illustration, delicate hand-painted textures, sepia wash outlines, soft paper finish, cozy cinematic lighting",
    exampleImage: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=60"
  },
  {
    id: "dark_gothic",
    name: "Dark Gothic Sketch",
    description: "Moody scratchboard etching with intense ink cross-hatching, high shadow contrasts, and deep ruby accents.",
    promptSignature: "Moody dark gothic etching sketch, intense ink splatter and dense cross-hatching, high-contrast chiaroscuro, charcoal overlay texture, gothic horror vibe",
    exampleImage: "https://images.unsplash.com/photo-1549490349-8643362247b5?w=600&auto=format&fit=crop&q=60"
  },
  {
    id: "retro_anime",
    name: "90s Cel-Shaded Anime",
    description: "Nostalgic JRPG hand-painted animation panels with retro saturation and cinematic action frames.",
    promptSignature: "90s retro fantasy anime, hand-painted grain, gorgeous cel-shaded aesthetic, vibrant nostalgic colors, epic movie cinematic lighting keyframe",
    exampleImage: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=60"
  },
  {
    id: "low_poly",
    name: "Vibrant Low-Poly 3D",
    description: "Charming geometric low-poly model render with rich material reflections and soft dioramas.",
    promptSignature: "Stylized low-poly 3D render game asset, clean polygonal topology, rich satin shaders, soft isometric studio lighting, bright colorful pop colors",
    exampleImage: "https://images.unsplash.com/photo-1563089145-599997674d42?w=600&auto=format&fit=crop&q=60"
  }
];
