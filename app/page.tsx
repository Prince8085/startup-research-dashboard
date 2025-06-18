"use client"
import { useState, useEffect } from "react"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { DashboardView } from "@/components/dashboard-view"
import { ResearchView } from "@/components/research-view"
import { ComparisonView } from "@/components/comparison-view"
import { AnalyticsView } from "@/components/analytics-view"
import { SettingsView } from "@/components/settings-view"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import type { CompanyResearch } from "@/types/company"

export default function StartupResearchPlatform() {
  const [companies, setCompanies] = useState<CompanyResearch[]>([])
  const [activeTab, setActiveTab] = useState("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // Load saved companies from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("research-companies")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setCompanies(
          parsed.map((company: any) => ({
            ...company,
            timestamp: new Date(company.timestamp),
          })),
        )
      } catch (error) {
        console.error("Failed to load saved companies:", error)
      }
    }
  }, [])

  // Save companies to localStorage
  useEffect(() => {
    if (companies.length > 0) {
      localStorage.setItem("research-companies", JSON.stringify(companies))
    }
  }, [companies])

  const addCompanies = (newCompanies: CompanyResearch[]) => {
    setCompanies((prev) => {
      const existing = new Set(prev.map((c) => c.companyName.toLowerCase()))
      const filtered = newCompanies.filter((c) => !existing.has(c.companyName.toLowerCase()))
      return [...prev, ...filtered]
    })
  }

  const removeCompany = (companyName: string) => {
    setCompanies((prev) => prev.filter((c) => c.companyName !== companyName))
  }

  const clearAllCompanies = () => {
    setCompanies([])
    localStorage.removeItem("research-companies")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
      <Header />

      <div className="flex">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
          companiesCount={companies.length}
        />

        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-16"}`}>
          <div className="container mx-auto px-6 py-8">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsContent value="dashboard">
                <DashboardView companies={companies} />
              </TabsContent>

              <TabsContent value="research">
                <ResearchView companies={companies} onAddCompanies={addCompanies} onRemoveCompany={removeCompany} />
              </TabsContent>

              <TabsContent value="comparison">
                <ComparisonView companies={companies} />
              </TabsContent>

              <TabsContent value="analytics">
                <AnalyticsView companies={companies} />
              </TabsContent>

              <TabsContent value="settings">
                <SettingsView companies={companies} onClearAll={clearAllCompanies} />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
