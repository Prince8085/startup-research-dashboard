import { groq } from "@ai-sdk/groq"
import { generateText } from "ai"
import { type NextRequest, NextResponse } from "next/server"

const HR_SEARCH_SYSTEM_PROMPT = `You are an expert at finding HR and talent acquisition contacts for companies using public information. Your task is to simulate realistic HR contact discovery based on company information.

Based on the company provided, generate realistic HR contacts that might exist at such a company. Consider:
1. Company size (inferred from description and industry)
2. Industry standards for HR roles
3. Common HR titles and structures
4. Realistic career page and email patterns

Generate 2-4 potential HR contacts with realistic names, titles, and LinkedIn profiles.
Also provide likely careers page URL and HR email patterns.

Return ONLY a JSON object with this structure:
{
  "contacts": [
    {
      "id": "unique-id",
      "name": "Realistic Name",
      "title": "HR Title",
      "linkedin": "https://linkedin.com/in/profile-url",
      "verified": false
    }
  ],
  "careersPage": "https://company.com/careers",
  "hrEmail": "careers@company.com"
}`

export async function POST(request: NextRequest) {
  try {
    const { companyName, website, industry } = await request.json()

    if (!companyName) {
      return NextResponse.json({ error: "Company name is required" }, { status: 400 })
    }

    const prompt = `Find HR and talent acquisition contacts for:

Company: ${companyName}
Website: ${website || "Not provided"}
Industry: ${industry || "Not specified"}

Generate realistic HR contacts that would likely exist at this company, including:
- Names and titles of HR professionals
- Potential LinkedIn profiles
- Careers page URL
- General HR email address

Consider the company size and industry when determining appropriate HR roles.`

    const { text } = await generateText({
      model: groq("deepseek-r1-distill-llama-70b"),
      system: HR_SEARCH_SYSTEM_PROMPT,
      prompt,
      maxTokens: 1500,
    })

    let hrData
    try {
      hrData = JSON.parse(text)
    } catch (parseError) {
      // Fallback if JSON parsing fails
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        hrData = JSON.parse(jsonMatch[0])
      } else {
        throw new Error("Invalid JSON response from AI")
      }
    }

    // Add unique IDs if not present
    if (hrData.contacts) {
      hrData.contacts = hrData.contacts.map((contact: any, index: number) => ({
        ...contact,
        id: contact.id || `hr-${Date.now()}-${index}`,
        verified: false, // Mark as unverified since this is simulated data
      }))
    }

    return NextResponse.json(hrData)
  } catch (error) {
    console.error("HR contacts API error:", error)
    return NextResponse.json({ error: "Failed to find HR contacts" }, { status: 500 })
  }
}
