
export type PersonaType = 
  | 'adaptive' 
  | 'multimodal' 
  | 'predictive' 
  | 'timeshift' 
  | 'social' 
  | 'gamified' 
  | 'community' 
  | 'voice' 
  | 'quantum'
  | string;

export interface Persona {
  id: PersonaType;
  name: string;
  description: string;
  icon: string;
  color: string;
  model: string;
  systemInstruction: string;
  isCustom?: boolean;
  basePersonaId?: PersonaType;
  tutorialSteps?: string[];
}

export interface Message {
  id: string;
  role: 'user' | 'model' | 'system';
  parts: { text?: string; inlineData?: { mimeType: string; data: string } }[];
  timestamp: number;
  personaId: PersonaType;
  isEdited?: boolean;
}

export interface ChatSession {
  id: string;
  personaId: PersonaType;
  startTime: number;
  messages: Message[];
  summary?: string;
  dateString: string; // YYYY-MM-DD for indexing
}

export interface CloudSyncState {
  isConnected: boolean;
  lastSync: number | null;
  accountEmail: string | null;
  autoSync: boolean;
}

export interface ProactiveAdvice {
  id: string;
  title: string;
  content: string;
  type: 'insight' | 'productivity' | 'wellness' | 'reminder';
  timestamp: number;
}

export interface UserStats {
  xp: number;
  level: number;
  completedQuests: string[];
  usagePerPersona: Record<PersonaType, number>;
  seenPersonas: PersonaType[];
  avatar?: string;
  tokenUsage: number;
  cloudSync?: CloudSyncState;
  activeAdvice?: ProactiveAdvice[];
}

export interface SavedImage {
  id: string;
  url: string;
  prompt: string;
  timestamp: number;
  aspectRatio: string;
  size: string;
  styleIds: string[];
  mockupId: string | null;
  model?: string;
}

export interface Suggestion {
  id: string;
  title: string;
  description: string;
  type: 'calendar' | 'health' | 'productivity';
}
