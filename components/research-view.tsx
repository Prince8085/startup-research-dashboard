"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Search,
  Upload,
  Plus,
  Loader2,
  CheckCircle,
  XCircle,
  Download,
  Trash2,
  ExternalLink,
  Building2,
  Users,
  Calendar,
  Globe,
} from "lucide-react"
import type { CompanyResearch, BulkResearchProgress } from "@/types/company"
import { motion, AnimatePresence } from "framer-motion"
import { HRContactsSection } from "./hr-contacts-section"

interface ResearchViewProps {
  companies: CompanyResearch[]
  onAddCompanies: (companies: CompanyResearch[]) => void
  onRemoveCompany: (companyName: string) => void
}

export function ResearchView({ companies, onAddCompanies, onRemoveCompany }: ResearchViewProps) {
  const [singleCompany, setSingleCompany] = useState("")
  const [bulkCompanies, setBulkCompanies] = useState("")
  const [isResearching, setIsResearching] = useState(false)
  const [bulkProgress, setBulkProgress] = useState<BulkResearchProgress | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedIndustry, setSelectedIndustry] = useState<string>("all")

  const industries = ["all", ...new Set(companies.map((c) => c.industry))]

  const filteredCompanies = companies.filter((company) => {
    const matchesSearch =
      company.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.industry.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesIndustry = selectedIndustry === "all" || company.industry === selectedIndustry
    return matchesSearch && matchesIndustry
  })

  const handleSingleResearch = async () => {
    if (!singleCompany.trim()) return

    setIsResearching(true)
    try {
      const response = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName: singleCompany.trim() }),
      })

      if (!response.ok) throw new Error("Failed to research company")

      const data = await response.json()
      data.timestamp = new Date(data.timestamp)
      data.id = crypto.randomUUID()
      data.status = "completed"

      onAddCompanies([data])
      setSingleCompany("")
    } catch (error) {
      console.error("Research failed:", error)
    } finally {
      setIsResearching(false)
    }
  }

  const handleBulkResearch = async () => {
    const companyList = bulkCompanies
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)

    if (companyList.length === 0) return

    setIsResearching(true)
    setBulkProgress({
      total: companyList.length,
      completed: 0,
      failed: 0,
      errors: [],
    })

    const results: CompanyResearch[] = []

    for (let i = 0; i < companyList.length; i++) {
      const companyName = companyList[i]

      setBulkProgress((prev) =>
        prev
          ? {
              ...prev,
              current: companyName,
            }
          : null,
      )

      try {
        const response = await fetch("/api/research", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ companyName }),
        })

        if (!response.ok) throw new Error("Failed to research company")

        const data = await response.json()
        data.timestamp = new Date(data.timestamp)
        data.id = crypto.randomUUID()
        data.status = "completed"

        results.push(data)

        setBulkProgress((prev) =>
          prev
            ? {
                ...prev,
                completed: prev.completed + 1,
              }
            : null,
        )

        // Add delay to avoid rate limiting
        if (i < companyList.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 1000))
        }
      } catch (error) {
        setBulkProgress((prev) =>
          prev
            ? {
                ...prev,
                failed: prev.failed + 1,
                errors: [
                  ...prev.errors,
                  {
                    company: companyName,
                    error: error instanceof Error ? error.message : "Unknown error",
                  },
                ],
              }
            : null,
        )
      }
    }

    onAddCompanies(results)
    setBulkCompanies("")
    setIsResearching(false)

    // Clear progress after 3 seconds
    setTimeout(() => setBulkProgress(null), 3000)
  }

  const exportToCSV = () => {
    const headers = [
      "Company Name",
      "Industry",
      "Founded Year",
      "Website",
      "Founders",
      "Key Differentiators",
      "Funding Notes",
    ]

    const csvContent = [
      headers.join(","),
      ...companies.map((company) =>
        [
          `"${company.companyName}"`,
          `"${company.industry}"`,
          company.foundedYear,
          `"${company.website}"`,
          `"${company.founders.map((f) => `${f.name} (${f.title})`).join("; ")}"`,
          `"${company.keyDifferentiators.replace(/"/g, '""')}"`,
          `"${company.fundingNotes || "N/A"}"`,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `startup-research-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Research</h2>
          <p className="text-muted-foreground">Add and manage your startup research portfolio</p>
        </div>

        <div className="flex gap-2">
          <Button onClick={exportToCSV} variant="outline" disabled={companies.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Research Input Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Single Company Research
            </CardTitle>
            <CardDescription>Research one company at a time for detailed analysis</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Enter company name..."
              value={singleCompany}
              onChange={(e) => setSingleCompany(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSingleResearch()}
            />
            <Button onClick={handleSingleResearch} disabled={isResearching || !singleCompany.trim()} className="w-full">
              {isResearching ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Researching...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Research Company
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Bulk Research
            </CardTitle>
            <CardDescription>Research multiple companies at once (one per line)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="OpenAI&#10;Stripe&#10;Notion&#10;..."
              value={bulkCompanies}
              onChange={(e) => setBulkCompanies(e.target.value)}
              rows={4}
            />
            <Button onClick={handleBulkResearch} disabled={isResearching || !bulkCompanies.trim()} className="w-full">
              {isResearching ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Bulk Research
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Bulk Progress */}
      <AnimatePresence>
        {bulkProgress && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Bulk Research Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>
                      {bulkProgress.completed + bulkProgress.failed} / {bulkProgress.total}
                    </span>
                  </div>
                  <Progress value={((bulkProgress.completed + bulkProgress.failed) / bulkProgress.total) * 100} />
                </div>

                {bulkProgress.current && (
                  <p className="text-sm text-muted-foreground">
                    Currently researching: <strong>{bulkProgress.current}</strong>
                  </p>
                )}

                <div className="flex gap-4 text-sm">
                  <div className="flex items-center gap-1 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    {bulkProgress.completed} completed
                  </div>
                  <div className="flex items-center gap-1 text-red-600">
                    <XCircle className="h-4 w-4" />
                    {bulkProgress.failed} failed
                  </div>
                </div>

                {bulkProgress.errors.length > 0 && (
                  <Alert>
                    <AlertDescription>
                      <strong>Errors:</strong>
                      <ul className="mt-2 space-y-1">
                        {bulkProgress.errors.slice(0, 3).map((error, index) => (
                          <li key={index} className="text-sm">
                            • {error.company}: {error.error}
                          </li>
                        ))}
                        {bulkProgress.errors.length > 3 && (
                          <li className="text-sm text-muted-foreground">
                            ... and {bulkProgress.errors.length - 3} more
                          </li>
                        )}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Company Portfolio ({filteredCompanies.length})</CardTitle>
          <CardDescription>Manage and view your researched companies</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="px-3 py-2 border rounded-md bg-background"
            >
              {industries.map((industry) => (
                <option key={industry} value={industry}>
                  {industry === "all" ? "All Industries" : industry}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-4">
            {filteredCompanies.length > 0 ? (
              filteredCompanies.map((company, index) => (
                <motion.div
                  key={company.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">{company.companyName}</h3>
                            <Badge variant="secondary">{company.industry}</Badge>
                            {company.status === "completed" && <CheckCircle className="h-4 w-4 text-green-600" />}
                          </div>

                          <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{company.whatTheyDo}</p>

                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Founded {company.foundedYear}
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {company.founders.length} founder{company.founders.length !== 1 ? "s" : ""}
                            </div>
                            {company.website && (
                              <div className="flex items-center gap-1">
                                <Globe className="h-3 w-3" />
                                <a
                                  href={company.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="hover:underline"
                                >
                                  Website
                                </a>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                  <Building2 className="h-5 w-5" />
                                  {company.companyName}
                                </DialogTitle>
                                <DialogDescription>Detailed research report</DialogDescription>
                              </DialogHeader>

                              <div className="space-y-6">
                                <div>
                                  <h4 className="font-semibold mb-2">What They Do</h4>
                                  <p className="text-muted-foreground">{company.whatTheyDo}</p>
                                </div>

                                <Separator />

                                <div>
                                  <h4 className="font-semibold mb-2">Key Differentiators</h4>
                                  <p className="text-muted-foreground">{company.keyDifferentiators}</p>
                                </div>

                                {company.fundingNotes && (
                                  <>
                                    <Separator />
                                    <div>
                                      <h4 className="font-semibold mb-2">Funding & Valuation</h4>
                                      <p className="text-muted-foreground">{company.fundingNotes}</p>
                                    </div>
                                  </>
                                )}

                                <Separator />

                                <div>
                                  <h4 className="font-semibold mb-2">Founders</h4>
                                  <div className="space-y-2">
                                    {company.founders.map((founder, idx) => (
                                      <div
                                        key={idx}
                                        className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded"
                                      >
                                        <div>
                                          <p className="font-medium">{founder.name}</p>
                                          <p className="text-sm text-muted-foreground">{founder.title}</p>
                                        </div>
                                        {founder.linkedin && (
                                          <Button variant="ghost" size="sm" asChild>
                                            <a href={founder.linkedin} target="_blank" rel="noopener noreferrer">
                                              LinkedIn <ExternalLink className="h-3 w-3 ml-1" />
                                            </a>
                                          </Button>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                <Separator />

                                <HRContactsSection company={company} />
                              </div>
                            </DialogContent>
                          </Dialog>

                          <Button variant="ghost" size="sm" onClick={() => onRemoveCompany(company.companyName)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-12">
                <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No companies found</h3>
                <p className="text-muted-foreground">
                  {companies.length === 0
                    ? "Start by researching your first company above"
                    : "Try adjusting your search or filter criteria"}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
