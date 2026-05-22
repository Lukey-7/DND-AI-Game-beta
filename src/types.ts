export interface Option {
  id: string;
  text: string;
}

export interface SceneData {
  storyText: string;
  options: Option[];
  inventory: string[];
  currentQuest: string;
  detailedVisualPrompt: string;
  sceneTitle: string;
  ambientTone: string;
  imageUrl?: string;
  imageLoading?: boolean;
  imageError?: string;
  isImageFallback?: boolean;
}

export interface HistoryItem {
  sceneTitle: string;
  storyText: string;
  choiceMade: string;
  inventoryState: string[];
  questState: string;
  imageUrl?: string;
}

export interface AdventureSetting {
  id: string;
  name: string;
  description: string;
  icon: string;
  suggestedCharacter: string;
  exampleCharacterDesc: string;
  defaultPromptSeed: string;
  themeColor: string; // e.g., 'blue', 'amber', 'emerald', 'indigo', 'rose'
}

export interface ArtStyle {
  id: string;
  name: string;
  description: string;
  promptSignature: string;
  exampleImage: string;
}
