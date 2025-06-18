"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { MessageSquare, Copy, RefreshCw, Check, Sparkles, Users } from "lucide-react"
import type { CompanyResearch } from "@/types/company"

interface ConnectionNoteModalProps {
  founder: {
    name: string
    title: string
    linkedin?: string
  }
  company: CompanyResearch
  isHRContact?: boolean
}

interface ConnectionMessage {
  id: number
  message: string
  style: string
}

export function ConnectionNoteModal({ founder, company, isHRContact = false }: ConnectionNoteModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ConnectionMessage[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [copiedId, setCopiedId] = useState<number | null>(null)

  const generateMessages = async () => {
    setIsGenerating(true)

    try {
      const response = await fetch("/api/connection-note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          founder,
          company,
          isHRContact,
          userRole: "researcher",
        }),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.messages && Array.isArray(data.messages)) {
          const formattedMessages = data.messages.map((msg: any, index: number) => ({
            id: index + 1,
            message: msg.message,
            style: msg.style,
          }))
          setMessages(formattedMessages)
        } else {
          // Fallback to simulated messages
          generateFallbackMessages()
        }
      } else {
        generateFallbackMessages()
      }
    } catch (error) {
      console.error("Failed to generate messages:", error)
      generateFallbackMessages()
    }

    setIsGenerating(false)
  }

  const generateFallbackMessages = () => {
    if (isHRContact) {
      const newMessages: ConnectionMessage[] = [
        {
          id: 1,
          message: `Hi ${founder.name}, as ${founder.title} at ${company.companyName}, I'm sure you're key to their success. Impressed by their ${company.industry} work. As a researcher, I'd love to connect and learn about your talent strategy.`,
          style: "Professional & Strategic",
        },
        {
          id: 2,
          message: `Hello ${founder.name}! Following ${company.companyName}'s growth in ${company.industry}. Your role in building their team must be exciting. Would appreciate connecting to learn from your HR perspective.`,
          style: "Growth-Focused",
        },
        {
          id: 3,
          message: `Hi ${founder.name}, researching innovative companies like ${company.companyName}. Your talent acquisition work in ${company.industry} is fascinating. Happy to connect and follow your insights!`,
          style: "Research-Oriented",
        },
      ]
      setMessages(newMessages)
    } else {
      // Original founder messages
      const newMessages: ConnectionMessage[] = [
        {
          id: 1,
          message: `Hi ${founder.name}, impressed by ${company.companyName}'s approach to ${company.industry}. As a researcher following innovative startups, I'd love to connect and learn from your journey.`,
          style: "Professional & Direct",
        },
        {
          id: 2,
          message: `Hello ${founder.name}! Your work at ${company.companyName} caught my attention, especially ${getKeyPoint(company)}. Would love to connect and follow your progress in ${company.industry}.`,
          style: "Enthusiastic & Specific",
        },
        {
          id: 3,
          message: `Hi ${founder.name}, I came across ${company.companyName} while researching ${company.industry} startups. Your ${getUniqueAspect(company)} is fascinating. Happy to connect!`,
          style: "Research-Focused",
        },
      ]
      setMessages(newMessages)
    }
  }

  const getKeyPoint = (company: CompanyResearch): string => {
    const differentiators = company.keyDifferentiators.toLowerCase()
    if (differentiators.includes("ai") || differentiators.includes("artificial intelligence")) return "AI innovation"
    if (differentiators.includes("platform")) return "platform approach"
    if (differentiators.includes("solution")) return "unique solution"
    if (differentiators.includes("technology")) return "technology stack"
    return "business model"
  }

  const getUniqueAspect = (company: CompanyResearch): string => {
    const whatTheyDo = company.whatTheyDo.toLowerCase()
    if (whatTheyDo.includes("platform")) return "platform strategy"
    if (whatTheyDo.includes("solution")) return "innovative approach"
    if (whatTheyDo.includes("technology")) return "tech focus"
    if (whatTheyDo.includes("service")) return "service model"
    return "vision"
  }

  const copyToClipboard = async (message: string, id: number) => {
    try {
      await navigator.clipboard.writeText(message)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (open && messages.length === 0) {
      generateMessages()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-xs">
          <MessageSquare className="h-3 w-3 mr-1" />
          Craft Connection Note
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isHRContact ? (
              <Users className="h-5 w-5 text-green-600" />
            ) : (
              <Sparkles className="h-5 w-5 text-blue-600" />
            )}
            AI-Generated LinkedIn Connection Note for {founder.name}
          </DialogTitle>
          <DialogDescription>
            {isHRContact
              ? "HR-focused connection messages. Remember to personalize further if needed!"
              : "Review and copy your preferred message below. Remember to personalize further if needed!"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Company Context */}
          <Card className="bg-slate-50 dark:bg-slate-800/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-medium">{company.companyName}</h4>
                <Badge variant="secondary">{company.industry}</Badge>
                {isHRContact && (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    HR Contact
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">{company.whatTheyDo}</p>
            </CardContent>
          </Card>

          {/* Generated Messages */}
          {isGenerating ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span className="text-sm text-muted-foreground">
                  Generating {isHRContact ? "HR-focused" : "personalized"} messages...
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg) => (
                <Card
                  key={msg.id}
                  className="border-2 hover:border-blue-200 dark:hover:border-blue-800 transition-colors"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-xs">
                        {msg.style}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <span>{msg.message.length}/300 chars</span>
                        {msg.message.length > 300 && <span className="text-red-500 font-medium">Too long!</span>}
                      </div>
                    </div>
                    <Textarea
                      value={msg.message}
                      readOnly
                      className="min-h-[80px] resize-none bg-white dark:bg-slate-900"
                    />
                    <div className="flex justify-end mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(msg.message, msg.id)}
                        className="text-xs"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="h-3 w-3 mr-1 text-green-600" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3 mr-1" />
                            Copy Message
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Generate More Options */}
          <div className="flex justify-center pt-4">
            <Button variant="outline" onClick={generateMessages} disabled={isGenerating} className="w-full">
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Generate More Options
                </>
              )}
            </Button>
          </div>

          {/* Tips */}
          <Card
            className={`${isHRContact ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800" : "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800"}`}
          >
            <CardContent className="p-4">
              <h4
                className={`font-medium mb-2 ${isHRContact ? "text-green-900 dark:text-green-100" : "text-blue-900 dark:text-blue-100"}`}
              >
                💡 {isHRContact ? "HR Outreach Tips" : "Pro Tips"}
              </h4>
              <ul
                className={`text-sm space-y-1 ${isHRContact ? "text-green-800 dark:text-green-200" : "text-blue-800 dark:text-blue-200"}`}
              >
                <li>• Keep messages under 300 characters for LinkedIn limits</li>
                {isHRContact ? (
                  <>
                    <li>• Focus on company culture and talent strategy</li>
                    <li>• Mention specific interest in their hiring approach</li>
                    <li>• Be respectful of their time and role</li>
                  </>
                ) : (
                  <>
                    <li>• Add a personal touch based on recent company news</li>
                    <li>• Mention mutual connections if you have any</li>
                    <li>• Be specific about why you're interested in connecting</li>
                  </>
                )}
              </ul>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
