'use client'

import React, { useState } from 'react'
import { useChat } from 'ai/react'
import { brainRegions, BrainRegion } from './brain-region'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Brain, Send, RefreshCw, Save, Share2 } from 'lucide-react'

interface Message {
  role: string
  content: string
  region?: string
}

// Define or import PrefrontalCortexChat type
type PrefrontalCortexChat = ReturnType<typeof useChat>;

export default function Home() {
  const [activity, setActivity] = useState('')
  const [difficulty, setDifficulty] = useState(1)
  const [selectedRegion, setSelectedRegion] = useState<BrainRegion | null>(null)
  const [conversations, setConversations] = useState<{ [key: string]: Message[] }>({})
  const [objectives, setObjectives] = useState<string[]>([])
  const [newObjective, setNewObjective] = useState('')
  const [progress, setProgress] = useState(0)
  const [summary, setSummary] = useState('')

  const regionChats: { [K in BrainRegion['name']]: PrefrontalCortexChat } = {
    'Prefrontal Cortex': useChat({
      api: `/api/claude-chat/${encodeURIComponent('Prefrontal Cortex')}`,
      initialMessages: [],
      body: { difficulty },
    }),
    'Hippocampus': useChat({
      api: `/api/claude-chat/${encodeURIComponent('Hippocampus')}`,
      initialMessages: [],
      body: { difficulty },
    }),
    'Amygdala': useChat({
      api: `/api/claude-chat/${encodeURIComponent('Amygdala')}`,
      initialMessages: [],
      body: { difficulty },
    }),
    'Cerebellum': useChat({
      api: `/api/claude-chat/${encodeURIComponent('Cerebellum')}`,
      initialMessages: [],
      body: { difficulty },
    }),
    "Broca's Area": useChat({
      api: `/api/claude-chat/${encodeURIComponent("Broca's Area")}`,
      initialMessages: [],
      body: { difficulty },
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!activity.trim()) return

    const newConversations: { [key: string]: Message[] } = {}

    for (const region of brainRegions) {
      const chat = regionChats[region.name]
      await chat.append({
        role: 'user',
        content: `New activity: "${activity}". Discuss how you, as the ${region.name}, are involved in this activity. Consider interactions with other brain regions. Use language appropriate for difficulty level ${difficulty} (1-5, where 1 is beginner and 5 is expert).`
      })
      newConversations[region.name] = chat.messages
    }

    setConversations(newConversations)
    setActivity('')
  }

  const handleContinueConversation = async () => {
    const newConversations: { [key: string]: Message[] } = { ...conversations }

    for (const region of brainRegions) {
      const chat = regionChats[region.name]
      if (chat.messages.length > 0) {
        await chat.append({
          role: 'user',
          content: `Continue the discussion about the current activity. Consider recent inputs from other regions. Maintain the current difficulty level (${difficulty}).`
        })
        newConversations[region.name] = chat.messages
      }
    }

    setConversations(newConversations)
  }

  const handleSaveConversation = () => {
    const conversationText = Object.entries(conversations)
      .map(([region, messages]) => 
        `${region}:\n${messages.map(m => `${m.role}: ${m.content}`).join('\n')}`
      )
      .join('\n\n')
    const blob = new Blob([conversationText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'brain-conversation.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleShareConversation = () => {
    const conversationText = Object.entries(conversations)
      .map(([region, messages]) => 
        `${region}:\n${messages.map(m => `${m.role}: ${m.content}`).join('\n')}`
      )
      .join('\n\n')
    navigator.clipboard.writeText(conversationText).then(() => {
      alert('Conversation copied to clipboard!')
    }, () => {
      alert('Failed to copy conversation to clipboard')
    })
  }

  const generateSummary = async () => {
    const { append } = regionChats[Object.keys(regionChats)[0]]
    await append({
      role: 'user',
      content: 'Please provide a concise summary of our conversation about brain regions and their interactions during the discussed activity. Highlight key points and insights.'
    })
    setSummary(regionChats[Object.keys(regionChats)[0]].messages.slice(-1)[0].content)
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <Card className="mb-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center flex items-center justify-center">
            <Brain className="mr-2 h-8 w-8" />
            Neuroscience Learning Chat
          </CardTitle>
        </CardHeader>
      </Card>

      <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
        <Card className="bg-gradient-to-b from-gray-900 to-gray-800 text-white">
          <CardHeader>
            <CardTitle className="flex items-center">Brain Activity Simulation</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px] pr-4">
              {Object.entries(conversations).map(([region, messages]) => (
                <div key={region} className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">{region}</h3>
                  {messages.map((message, index) => (
                    <div key={index} className={`mb-2 p-2 rounded-lg ${
                      message.role === 'user' ? 'bg-blue-600' : 'bg-gray-700'
                    } text-white`}>
                      <p>{message.content}</p>
                    </div>
                  ))}
                </div>
              ))}
            </ScrollArea>
          </CardContent>
          <CardFooter>
            <form onSubmit={handleSubmit} className="flex space-x-2 w-full">
              <Input
                type="text"
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                placeholder="Enter an activity (e.g., 'solving a puzzle')"
                className="flex-grow bg-white/10 text-white placeholder-white/50 border-white/20"
              />
              <Button type="submit" className="bg-white text-purple-600 hover:bg-white/90">
                <Send className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
            </form>
          </CardFooter>
        </Card>

        <div className="space-y-4">
          <Card className="bg-gradient-to-b from-gray-800 to-gray-700 text-white">
            <CardHeader>
              <CardTitle>Difficulty Level</CardTitle>
            </CardHeader>
            <CardContent>
              <Slider
                min={1}
                max={5}
                step={1}
                value={[difficulty]}
                onValueChange={(value) => setDifficulty(value[0])}
                className="w-full"
              />
              <p className="mt-2 text-sm text-center">
                Current Level: {difficulty} ({difficulty === 1 ? 'Beginner' : difficulty === 5 ? 'Expert' : 'Intermediate'})
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-b from-gray-800 to-gray-700 text-white">
            <CardContent>
              <Button 
                onClick={handleContinueConversation} 
                disabled={Object.keys(conversations).length === 0} 
                className="w-full bg-white/10 hover:bg-white/20"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Continue Conversation
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-b from-gray-800 to-gray-700 text-white">
            <CardHeader>
              <CardTitle>Brain Regions</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {brainRegions.map((region, index) => (
                  <li 
                    key={index} 
                    className={`flex items-center space-x-2 p-2 rounded-lg bg-gradient-to-r ${region.color} cursor-pointer`}
                    onClick={() => setSelectedRegion(region)}
                  >
                    <span className="text-2xl">{region.emoji}</span>
                    <span className="text-sm font-medium">{region.name}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {selectedRegion && (
            <Card className="bg-gradient-to-b from-gray-800 to-gray-700 text-white">
              <CardHeader>
                <CardTitle>{selectedRegion.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-semibold">{selectedRegion.role}</p>
                <p className="mt-2 text-sm">{selectedRegion.description}</p>
              </CardContent>
            </Card>
          )}

          <Card className="bg-gradient-to-b from-gray-800 to-gray-700 text-white">
            <CardHeader>
              <CardTitle>Learning Objectives</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="mb-4">
                {objectives.map((objective, index) => (
                  <li key={index} className="mb-2">{objective}</li>
                ))}
              </ul>
              <form onSubmit={(e) => {
                e.preventDefault()
                if (newObjective.trim()) {
                  setObjectives([...objectives, newObjective.trim()])
                  setNewObjective('')
                }
              }} className="flex space-x-2">
                <Input
                  type="text"
                  value={newObjective}
                  onChange={(e) => setNewObjective(e.target.value)}
                  placeholder="Add a new learning objective"
                  className="flex-grow bg-white/10 text-white placeholder-white/50 border-white/20"
                />
                <Button type="submit">Add</Button>
              </form>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-b from-gray-800 to-gray-700 text-white">
            <CardHeader>
              <CardTitle>Learning Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mb-4">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <Button onClick={() => setProgress(Math.min(100, progress + 10))} className="w-full">
                Mark Progress
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-b from-gray-800 to-gray-700 text-white">
            <CardHeader>
              <CardTitle>Conversation Summary</CardTitle>
            </CardHeader>
            <CardContent>
              {summary ? (
                <p className="text-sm">{summary}</p>
              ) : (
                <Button onClick={generateSummary} className="w-full">Generate Summary</Button>
              )}
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-b from-gray-800 to-gray-700 text-white">
            <CardContent className="flex space-x-2">
              <Button onClick={handleSaveConversation} className="flex-1">
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button onClick={handleShareConversation} className="flex-1">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
