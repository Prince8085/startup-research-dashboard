"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Users, Search, Loader2, ExternalLink, Mail, Globe, AlertCircle, UserCheck, Building2 } from "lucide-react"
import type { CompanyResearch } from "@/types/company"
import { ConnectionNoteModal } from "./connection-note-modal"

interface HRContact {
  id: string
  name: string
  title: string
  linkedin?: string
  verified: boolean
}

interface HRContactInfo {
  contacts: HRContact[]
  careersPage?: string
  hrEmail?: string
  searchCompleted: boolean
}

interface HRContactsSectionProps {
  company: CompanyResearch
}

export function HRContactsSection({ company }: HRContactsSectionProps) {
  const [hrInfo, setHrInfo] = useState<HRContactInfo>({
    contacts: [],
    searchCompleted: false,
  })
  const [isSearching, setIsSearching] = useState(false)

  const findHRContacts = async () => {
    setIsSearching(true)

    try {
      const response = await fetch("/api/hr-contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: company.companyName,
          website: company.website,
          industry: company.industry,
        }),
      })

      if (!response.ok) throw new Error("Failed to find HR contacts")

      const data = await response.json()
      setHrInfo({
        contacts: data.contacts || [],
        careersPage: data.careersPage,
        hrEmail: data.hrEmail,
        searchCompleted: true,
      })
    } catch (error) {
      console.error("HR search failed:", error)
      setHrInfo({
        contacts: [],
        searchCompleted: true,
      })
    } finally {
      setIsSearching(false)
    }
  }

  if (!hrInfo.searchCompleted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            HR & Talent Acquisition Contacts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              Discover HR team members and talent acquisition contacts at {company.companyName}
            </p>
            <Button onClick={findHRContacts} disabled={isSearching} className="w-full max-w-xs">
              {isSearching ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Searching HR Contacts...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Find HR Contacts
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-blue-600" />
          HR & Talent Acquisition Contacts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* HR Team Members */}
        <div>
          <h4 className="font-semibold flex items-center gap-2 mb-3">
            <UserCheck className="h-4 w-4" />
            Potential HR Team Members
          </h4>

          <Alert className="mb-4 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800 dark:text-blue-200">
              <strong>Note:</strong> HR contacts are generated based on public data patterns for {company.companyName}.
              LinkedIn URLs and contact details should be verified before outreach.
            </AlertDescription>
          </Alert>

          {hrInfo.contacts.length > 0 ? (
            <div className="space-y-3">
              {hrInfo.contacts.map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                      <Users className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">
                          {contact.name && contact.name.trim() !== "" ? contact.name : "Name not found"}
                        </p>
                        {contact.verified && (
                          <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                            Verified
                          </Badge>
                        )}
                        {!contact.verified && (
                          <Badge variant="outline" className="text-xs bg-amber-100 text-amber-800 border-amber-300">
                            Unverified
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {contact.title && contact.title.trim() !== "" ? contact.title : "Title not found"}
                      </p>
                      <p className="text-xs text-muted-foreground">Company: {company.companyName}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {contact.linkedin &&
                    contact.linkedin.includes("linkedin.com") &&
                    contact.linkedin.includes(company.companyName.toLowerCase().replace(/\s+/g, "")) ? (
                      <Button variant="ghost" size="sm" asChild>
                        <a href={contact.linkedin} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          LinkedIn
                        </a>
                      </Button>
                    ) : (
                      <Button variant="ghost" size="sm" disabled>
                        <ExternalLink className="h-3 w-3 mr-1" />
                        LinkedIn not found
                      </Button>
                    )}

                    <ConnectionNoteModal
                      founder={{
                        name: contact.name || "HR Contact",
                        title: contact.title || "HR Team Member",
                        linkedin:
                          contact.linkedin && contact.linkedin.includes("linkedin.com") ? contact.linkedin : undefined,
                      }}
                      company={company}
                      isHRContact={true}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No specific HR profiles readily found via public search for {company.companyName}. Try checking the
                company careers page.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <Separator />

        {/* General HR Contact Information */}
        <div>
          <h4 className="font-semibold flex items-center gap-2 mb-3">
            <Building2 className="h-4 w-4" />
            General HR Contact Information
          </h4>

          <div className="space-y-3">
            {hrInfo.careersPage && (
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Careers Page:</span>
                <Button variant="link" size="sm" className="p-0 h-auto" asChild>
                  <a href={hrInfo.careersPage} target="_blank" rel="noopener noreferrer">
                    View Careers Page
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </Button>
              </div>
            )}

            {hrInfo.hrEmail && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">HR Email:</span>
                <Button variant="link" size="sm" className="p-0 h-auto" asChild>
                  <a href={`mailto:${hrInfo.hrEmail}`}>{hrInfo.hrEmail}</a>
                </Button>
              </div>
            )}

            {!hrInfo.careersPage && !hrInfo.hrEmail && (
              <p className="text-sm text-muted-foreground">
                No general HR contact information found. Try visiting the company website directly.
              </p>
            )}
          </div>
        </div>

        <Separator />

        {/* Disclaimer */}
        <Alert className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800 dark:text-amber-200">
            <strong>Disclaimer:</strong> Information is based on public search. Please verify details, especially email
            addresses, before outreach.
          </AlertDescription>
        </Alert>

        {/* Refresh Button */}
        <div className="flex justify-center pt-2">
          <Button variant="outline" size="sm" onClick={findHRContacts} disabled={isSearching}>
            {isSearching ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Refreshing...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Refresh HR Search
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
