import { groq } from "@ai-sdk/groq"
import { generateText } from "ai"
import { type NextRequest, NextResponse } from "next/server"

const CONNECTION_NOTE_SYSTEM_PROMPT = `You are an expert at crafting professional, personalized LinkedIn connection request messages. Your goal is to create concise, engaging messages that are under 300 characters and show genuine interest in the founder's work.

Guidelines:
1. Keep messages under 300 characters (LinkedIn limit)
2. Address the founder by name
3. Mention their company specifically
4. Reference something specific about their business/industry
5. Provide a clear, brief reason for connecting
6. Maintain professional but friendly tone
7. Avoid generic phrases
8. Show you've done research

Generate 3 distinct variations with different approaches:
- Variation 1: Professional & Direct
- Variation 2: Enthusiastic & Specific  
- Variation 3: Research-Focused

Return ONLY a JSON array with this structure:
[
  {
    "message": "Hi [Name], impressed by [Company]'s approach to [specific aspect]. As a [role], I'd love to connect and learn from your journey.",
    "style": "Professional & Direct",
    "characterCount": 150
  }
]`

export async function POST(request: NextRequest) {
  try {
    const { founder, company, userRole = "researcher" } = await request.json()

    if (!founder || !company) {
      return NextResponse.json({ error: "Founder and company data required" }, { status: 400 })
    }

    const prompt = `Generate 3 LinkedIn connection request messages for:

Founder: ${founder.name} (${founder.title})
Company: ${company.companyName}
Industry: ${company.industry}
What they do: ${company.whatTheyDo}
Key differentiators: ${company.keyDifferentiators}
User role: ${userRole}

Create personalized messages under 300 characters each.`

    const { text } = await generateText({
      model: groq("deepseek-r1-distill-llama-70b"),
      system: CONNECTION_NOTE_SYSTEM_PROMPT,
      prompt,
      maxTokens: 1000,
    })

    let messages
    try {
      messages = JSON.parse(text)
    } catch (parseError) {
      // Fallback if JSON parsing fails
      const jsonMatch = text.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        messages = JSON.parse(jsonMatch[0])
      } else {
        throw new Error("Invalid JSON response from AI")
      }
    }

    return NextResponse.json({ messages })
  } catch (error) {
    console.error("Connection note API error:", error)
    return NextResponse.json({ error: "Failed to generate connection notes" }, { status: 500 })
  }
}
