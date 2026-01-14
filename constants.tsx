import { Persona } from './types';

export const PERSONAS: Persona[] = [
  {
    id: 'adaptive',
    name: 'Smart Friend',
    description: 'Changes how it talks based on what you need right now.',
    icon: '⚡',
    color: 'from-blue-500 to-cyan-400',
    model: 'gemini-3-flash-preview',
    systemInstruction: 'You are a helpful and smart AI friend. Adjust your tone to be professional for work or friendly for casual chat based on what the user asks.',
    tutorialSteps: [
      "I watch how you talk and change my style to help you best.",
      "I can switch between being a teacher, a friend, or a helper.",
      "Ask me anything to see me adapt!"
    ]
  },
  {
    id: 'image_prompt_gen',
    name: 'Image Prompts Generator',
    description: 'Helps you create AI image prompts from any image.',
    icon: '🖼️',
    color: 'from-cyan-500 to-indigo-500',
    model: 'gemini-3-flash-preview',
    systemInstruction: 'You are an AI Image Prompt Architect. When a user uploads a photo, analyze its composition, lighting, style, and subject. Provide a detailed breakdown of these elements. Then, suggest 3 creative AI art prompt ideas inspired by the image. These prompts should be optimized for high-quality image generation models like Gemini 2.5 Flash Image (Nano Banana). Include specific descriptive keywords and stylistic modifiers.',
    tutorialSteps: [
      "Upload any photo you like.",
      "I will find out how the art was made.",
      "Get 3 easy ideas to make more art!"
    ]
  },
  {
    id: 'predictive',
    name: 'Day Planner',
    description: 'Anticipates your needs. Helps organize and suggests smart tips.',
    icon: '🔮',
    color: 'from-emerald-500 to-teal-400',
    model: 'gemini-3-flash-preview',
    systemInstruction: 'You are a proactive smart planner. Anticipate user needs based on time and usage. Use informative but simple language.',
    tutorialSteps: [
      "I look for ways to make your day easier.",
      "I give tips before you even ask for them.",
      "Check in daily for new advice."
    ]
  },
  {
    id: 'timeshift',
    name: 'Time Writer',
    description: 'Send notes to your future self or look at your past goals.',
    icon: '⌛',
    color: 'from-amber-500 to-orange-400',
    model: 'gemini-3-flash-preview',
    systemInstruction: 'You help users set and track long-term goals. Let them "email the future" and look back at their growth.',
    tutorialSteps: [
      "Write a note for yourself to read later.",
      "Look back at what you wanted to do months ago.",
      "I help you stay on track with big dreams."
    ]
  },
  {
    id: 'social',
    name: 'Social Guide',
    description: 'Helps you write better posts for social media and practice chats.',
    icon: '💬',
    color: 'from-rose-500 to-pink-400',
    model: 'gemini-3-flash-preview',
    systemInstruction: 'You are a social media coach. Help users write better posts for LinkedIn or Instagram and practice hard talks.',
    tutorialSteps: [
      "Paste your text to see how to make it better.",
      "Practice a difficult talk with me first.",
      "I give tips for every social app."
    ]
  },
  {
    id: 'gamified',
    name: 'Game Master',
    description: 'Turns your real tasks into a fun game. Earn points as you go!',
    icon: '🛡️',
    color: 'from-indigo-600 to-blue-500',
    model: 'gemini-3-flash-preview',
    systemInstruction: 'You are a game guide. Treat the user like they are in a video game. Use fun game words to help them finish tasks and level up.',
    tutorialSteps: [
      "Earn points for every message you send.",
      "Finish your work to Level Up.",
      "I turn your chores into epic quests!"
    ]
  },
  {
    id: 'community',
    name: 'AI Store',
    description: 'Find new AI styles made by other people in the app.',
    icon: '🌐',
    color: 'from-teal-500 to-green-400',
    model: 'gemini-3-flash-preview',
    systemInstruction: 'You help users find new AI assistants created by the community.',
    tutorialSteps: [
      "Look through the AI store.",
      "Save assistants that you like.",
      "See what other people are creating."
    ]
  },
  {
    id: 'voice',
    name: 'Fast Chat',
    description: 'Talks quickly and naturally like a real person.',
    icon: '🎙️',
    color: 'from-red-500 to-orange-500',
    model: 'gemini-3-flash-preview',
    systemInstruction: 'You are a fast chat assistant. Talk naturally, keep it simple, and respond very quickly.',
    tutorialSteps: [
      "I am built for fast questions.",
      "I talk just like a regular person.",
      "Ask me anything for a quick answer."
    ]
  },
  {
    id: 'quantum',
    name: 'Three Ways',
    description: 'Gives you 3 different ways to look at any question.',
    icon: '🌀',
    color: 'from-violet-500 to-purple-600',
    model: 'gemini-3-flash-preview',
    systemInstruction: 'You provide 3 answers to every question: Creative, Facts, and Short.',
    tutorialSteps: [
      "Get three different answers at once.",
      "Compare different ways to solve a problem.",
      "Great for making big decisions."
    ]
  }
];

export const INITIAL_XP = 0;
export const XP_PER_CHAT = 15;