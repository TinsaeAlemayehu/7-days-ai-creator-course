export interface Mentor {
  id: string;
  name: string;
  role: string;
  personality: string;
  avatar: string;
  primaryColor: string;
}

export interface LessonStep {
  id: string;
  type: 'card' | 'quiz' | 'prompt-fix' | 'interaction';
  content: string;
  options?: string[];
  correctAnswer?: string;
  hint?: string;
}

export interface Mission {
  day: number;
  title: string;
  goal: string;
  mentorId: string;
  steps: LessonStep[];
  toolId: string;
  reward: {
    badgeId: string;
    xp: number;
    avatarItem?: string;
  };
}

export const MENTORS: Mentor[] = [
  {
    id: 'sparky',
    name: 'Sparky',
    role: 'Prompt Captain',
    personality: 'Hyper-energetic robot who loves glitches and lightbulbs.',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Sparky&backgroundColor=FFD700',
    primaryColor: '#FFD700'
  },
  {
    id: 'pixel',
    name: 'Pixel',
    role: 'Art Genius',
    personality: 'Cool, laid-back artist who sees the world in brushstrokes.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pixel&backgroundColor=9370DB',
    primaryColor: '#9370DB'
  },
  {
    id: 'logic',
    name: 'Logic',
    role: 'Code Owl',
    personality: 'Very wise and slightly sarcastic owl who loves patterns.',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Logic&backgroundColor=10B981',
    primaryColor: '#10B981'
  }
];

export const CHALLENGE_DATA: Mission[] = [
  {
    day: 1,
    title: 'The AI Spark',
    goal: 'Learn to speak Robot (Prompting basics)',
    mentorId: 'sparky',
    toolId: 'mascot-creator',
    reward: { badgeId: 'spark-master', xp: 500 },
    steps: [
      {
        id: 'd1s1',
        type: 'card',
        content: "Hi Future Creator! I'm Sparky. Did you know AI is like a giant brain that needs YOUR help to think?"
      },
      {
        id: 'd1s2',
        type: 'quiz',
        content: "What do we call the special instructions we give to an AI to help it create?",
        options: ["Pushes", "Prompts", "Poke-points"],
        correctAnswer: "Prompts"
      },
      {
        id: 'd1s3',
        type: 'card',
        content: "Correct! The better your prompt, the more magical the result. Today, you'll use prompts to create your own AI Mascot!"
      }
    ]
  },
  {
    day: 2,
    title: 'Pixel Power',
    goal: 'Design incredible AI Posters',
    mentorId: 'pixel',
    toolId: 'poster-gen',
    reward: { badgeId: 'pixel-wizard', xp: 750 },
    steps: [
      {
        id: 'd2s1',
        type: 'card',
        content: "Yo! I'm Pixel. AI can paint anything you can imagine—from a neon jungle to a space cat."
      },
      {
        id: 'd2s2',
        type: 'quiz',
        content: "If you want the AI to make a high-quality drawing, what should you add to your prompt?",
        options: ["'Low quality'", "'Detailed, masterpiece, 4k'", "'Blurry'"],
        correctAnswer: "'Detailed, masterpiece, 4k'"
      }
    ]
  },
  {
    day: 3,
    title: 'Story Weaver',
    goal: 'Write a Comic with AI',
    mentorId: 'logic',
    toolId: 'comic-maker',
    reward: { badgeId: 'story-hero', xp: 1000 },
    steps: [
      {
        id: 'd3s1',
        type: 'card',
        content: "Hoo-hoo! I'm Logic. Patterns are everywhere, even in stories. Let's use AI to build a world."
      }
    ]
  }
];
