export interface CompanyResearch {
  id: string
  companyName: string
  description?: string
  whatTheyDo: string
  website: string
  founders: Array<{
    name: string
    title: string
    linkedin?: string
  }>
  foundedYear: string
  industry: string
  keyDifferentiators: string
  fundingNotes?: string
  crunchbaseUrl?: string
  timestamp: Date
  status: "completed" | "processing" | "failed"
  tags?: string[]
}

export interface BulkResearchProgress {
  total: number
  completed: number
  failed: number
  current?: string
  errors: Array<{
    company: string
    error: string
  }>
}
