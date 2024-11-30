
export const brainRegions = [
    {
      name: 'Prefrontal Cortex',
      role: 'Executive function and decision-making',
      description: 'Responsible for complex cognitive behaviors, personality expression, decision making, and moderating social behavior.',
      color: 'from-blue-500 to-blue-700',
      emoji: '🧠'
    },
    {
      name: 'Hippocampus',
      role: 'Memory formation and spatial navigation',
      description: 'Critical for the formation of new memories about experienced events and spatial memory.',
      color: 'from-green-500 to-green-700',
      emoji: '🗺️'
    },
    {
      name: 'Amygdala',
      role: 'Emotional processing and fear response',
      description: 'Processes emotions, particularly those related to survival, such as fear, anger, and pleasure.',
      color: 'from-red-500 to-red-700',
      emoji: '😨'
    },
    {
      name: 'Cerebellum',
      role: 'Motor control and cognitive functions',
      description: 'Involved in motor control, balance, and is also important for certain cognitive functions.',
      color: 'from-yellow-500 to-yellow-700',
      emoji: '🤸'
    },
    {
      name: 'Broca\'s Area',
      role: 'Speech production and language processing',
      description: 'Crucial for speech production, language processing, and comprehension.',
      color: 'from-purple-500 to-purple-700',
      emoji: '🗣️'
    }
  ]
  
  export type BrainRegion = typeof brainRegions[number]