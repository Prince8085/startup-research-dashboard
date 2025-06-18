"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, TrendingUp, Users, Calendar, Globe } from "lucide-react"
import type { CompanyResearch } from "@/types/company"
import { motion } from "framer-motion"

interface DashboardViewProps {
  companies: CompanyResearch[]
}

export function DashboardView({ companies }: DashboardViewProps) {
  const stats = {
    total: companies.length,
    industries: new Set(companies.map((c) => c.industry)).size,
    totalFounders: companies.reduce((acc, c) => acc + c.founders.length, 0),
    avgFoundingYear:
      companies.length > 0
        ? Math.round(companies.reduce((acc, c) => acc + Number.parseInt(c.foundedYear), 0) / companies.length)
        : 0,
  }

  const recentCompanies = companies.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 5)

  const industryDistribution = companies.reduce(
    (acc, company) => {
      acc[company.industry] = (acc[company.industry] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Overview of your startup research portfolio</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Companies</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                +
                {companies.filter((c) => new Date().getTime() - c.timestamp.getTime() < 7 * 24 * 60 * 60 * 1000).length}{" "}
                this week
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Industries</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.industries}</div>
              <p className="text-xs text-muted-foreground">Across {stats.total} companies</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Founders</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalFounders}</div>
              <p className="text-xs text-muted-foreground">
                Avg {stats.total > 0 ? (stats.totalFounders / stats.total).toFixed(1) : 0} per company
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Founded</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgFoundingYear || "N/A"}</div>
              <p className="text-xs text-muted-foreground">Average founding year</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Companies */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Research</CardTitle>
            <CardDescription>Latest companies added to your portfolio</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentCompanies.length > 0 ? (
                recentCompanies.map((company, index) => (
                  <motion.div
                    key={company.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded">
                        <Building2 className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{company.companyName}</p>
                        <p className="text-sm text-muted-foreground">{company.industry}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">{company.timestamp.toLocaleDateString()}</p>
                      {company.website && <Globe className="h-3 w-3 text-muted-foreground ml-auto mt-1" />}
                    </div>
                  </motion.div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No companies researched yet. Start by adding some companies!
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Industry Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Industry Distribution</CardTitle>
            <CardDescription>Breakdown of companies by industry</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(industryDistribution)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 8)
                .map(([industry, count], index) => (
                  <motion.div
                    key={industry}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: `hsl(${(index * 45) % 360}, 70%, 50%)`,
                        }}
                      />
                      <span className="text-sm">{industry}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{count}</Badge>
                      <div className="w-16 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width: `${(count / Math.max(...Object.values(industryDistribution))) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
