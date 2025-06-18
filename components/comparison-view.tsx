"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Building2, Users, Calendar, Globe, DollarSign, ExternalLink, Download } from "lucide-react"
import type { CompanyResearch } from "@/types/company"

interface ComparisonViewProps {
  companies: CompanyResearch[]
}

export function ComparisonView({ companies }: ComparisonViewProps) {
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([])

  const toggleCompany = (companyId: string) => {
    setSelectedCompanies(
      (prev) => (prev.includes(companyId) ? prev.filter((id) => id !== companyId) : [...prev, companyId].slice(0, 4)), // Limit to 4 companies
    )
  }

  const selectedCompanyData = companies.filter((c) => selectedCompanies.includes(c.id))

  const exportComparison = () => {
    const comparisonData = {
      timestamp: new Date().toISOString(),
      companies: selectedCompanyData.map((company) => ({
        name: company.companyName,
        industry: company.industry,
        founded: company.foundedYear,
        founders: company.founders.length,
        website: company.website,
        keyDifferentiators: company.keyDifferentiators,
        fundingNotes: company.fundingNotes,
      })),
    }

    const blob = new Blob([JSON.stringify(comparisonData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `company-comparison-${new Date().toISOString().split("T")[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Compare Companies</h2>
          <p className="text-muted-foreground">Select up to 4 companies to compare side by side</p>
        </div>

        {selectedCompanies.length > 0 && (
          <Button onClick={exportComparison} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Comparison
          </Button>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Company Selection */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Select Companies</CardTitle>
            <CardDescription>Choose companies to compare ({selectedCompanies.length}/4)</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96">
              <div className="space-y-3">
                {companies.map((company) => (
                  <div key={company.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={company.id}
                      checked={selectedCompanies.includes(company.id)}
                      onCheckedChange={() => toggleCompany(company.id)}
                      disabled={!selectedCompanies.includes(company.id) && selectedCompanies.length >= 4}
                    />
                    <label
                      htmlFor={company.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      <div>
                        <p className="font-medium">{company.companyName}</p>
                        <p className="text-xs text-muted-foreground">{company.industry}</p>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Comparison Table */}
        <div className="lg:col-span-3">
          {selectedCompanyData.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Company Comparison</CardTitle>
                <CardDescription>Side-by-side comparison of selected companies</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4 font-medium">Attribute</th>
                        {selectedCompanyData.map((company) => (
                          <th key={company.id} className="text-left p-4 font-medium min-w-48">
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4" />
                              {company.companyName}
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {/* Industry */}
                      <tr className="border-b">
                        <td className="p-4 font-medium">Industry</td>
                        {selectedCompanyData.map((company) => (
                          <td key={company.id} className="p-4">
                            <Badge variant="secondary">{company.industry}</Badge>
                          </td>
                        ))}
                      </tr>

                      {/* Founded Year */}
                      <tr className="border-b">
                        <td className="p-4 font-medium">Founded</td>
                        {selectedCompanyData.map((company) => (
                          <td key={company.id} className="p-4">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3 text-muted-foreground" />
                              {company.foundedYear}
                            </div>
                          </td>
                        ))}
                      </tr>

                      {/* Founders */}
                      <tr className="border-b">
                        <td className="p-4 font-medium">Founders</td>
                        {selectedCompanyData.map((company) => (
                          <td key={company.id} className="p-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Users className="h-3 w-3" />
                                {company.founders.length} founder{company.founders.length !== 1 ? "s" : ""}
                              </div>
                              {company.founders.slice(0, 2).map((founder, idx) => (
                                <div key={idx} className="text-xs">
                                  <span className="font-medium">{founder.name}</span>
                                  <br />
                                  <span className="text-muted-foreground">{founder.title}</span>
                                </div>
                              ))}
                              {company.founders.length > 2 && (
                                <div className="text-xs text-muted-foreground">+{company.founders.length - 2} more</div>
                              )}
                            </div>
                          </td>
                        ))}
                      </tr>

                      {/* Website */}
                      <tr className="border-b">
                        <td className="p-4 font-medium">Website</td>
                        {selectedCompanyData.map((company) => (
                          <td key={company.id} className="p-4">
                            {company.website ? (
                              <a
                                href={company.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-blue-600 hover:underline text-sm"
                              >
                                <Globe className="h-3 w-3" />
                                Visit Site
                                <ExternalLink className="h-2 w-2" />
                              </a>
                            ) : (
                              <span className="text-muted-foreground text-sm">N/A</span>
                            )}
                          </td>
                        ))}
                      </tr>

                      {/* Key Differentiators */}
                      <tr className="border-b">
                        <td className="p-4 font-medium">Key Differentiators</td>
                        {selectedCompanyData.map((company) => (
                          <td key={company.id} className="p-4">
                            <div className="text-sm text-muted-foreground max-w-xs">
                              <p className="line-clamp-3">{company.keyDifferentiators}</p>
                            </div>
                          </td>
                        ))}
                      </tr>

                      {/* Funding */}
                      <tr className="border-b">
                        <td className="p-4 font-medium">Funding</td>
                        {selectedCompanyData.map((company) => (
                          <td key={company.id} className="p-4">
                            {company.fundingNotes ? (
                              <div className="text-sm text-muted-foreground max-w-xs">
                                <div className="flex items-center gap-1 mb-1">
                                  <DollarSign className="h-3 w-3" />
                                  <span className="font-medium">Funding Info</span>
                                </div>
                                <p className="line-clamp-2">{company.fundingNotes}</p>
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-sm">No funding info</span>
                            )}
                          </td>
                        ))}
                      </tr>

                      {/* Research Date */}
                      <tr>
                        <td className="p-4 font-medium">Research Date</td>
                        {selectedCompanyData.map((company) => (
                          <td key={company.id} className="p-4">
                            <span className="text-sm text-muted-foreground">
                              {company.timestamp.toLocaleDateString()}
                            </span>
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-96">
                <div className="text-center">
                  <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Companies Selected</h3>
                  <p className="text-muted-foreground">Select companies from the left panel to start comparing</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
