"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart3, TrendingUp, Calendar, Building2, Users, Globe, DollarSign, Target } from "lucide-react"
import type { CompanyResearch } from "@/types/company"
import { motion } from "framer-motion"

interface AnalyticsViewProps {
  companies: CompanyResearch[]
}

export function AnalyticsView({ companies }: AnalyticsViewProps) {
  // Analytics calculations
  const totalCompanies = companies.length
  const totalFounders = companies.reduce((acc, c) => acc + c.founders.length, 0)
  const avgFounders = totalCompanies > 0 ? (totalFounders / totalCompanies).toFixed(1) : 0

  const industryDistribution = companies.reduce(
    (acc, company) => {
      acc[company.industry] = (acc[company.industry] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const foundingYearDistribution = companies.reduce(
    (acc, company) => {
      const decade = Math.floor(Number.parseInt(company.foundedYear) / 10) * 10
      const decadeLabel = `${decade}s`
      acc[decadeLabel] = (acc[decadeLabel] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const companiesWithFunding = companies.filter((c) => c.fundingNotes).length
  const fundingPercentage = totalCompanies > 0 ? (companiesWithFunding / totalCompanies) * 100 : 0

  const companiesWithWebsite = companies.filter((c) => c.website).length
  const websitePercentage = totalCompanies > 0 ? (companiesWithWebsite / totalCompanies) * 100 : 0

  const recentActivity = companies.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 10)

  const topIndustries = Object.entries(industryDistribution)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
        <p className="text-muted-foreground">Insights and trends from your startup research portfolio</p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Portfolio Size</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCompanies}</div>
              <p className="text-xs text-muted-foreground">Companies researched</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Founders</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalFounders}</div>
              <p className="text-xs text-muted-foreground">Avg {avgFounders} per company</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Funding Coverage</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{fundingPercentage.toFixed(0)}%</div>
              <p className="text-xs text-muted-foreground">{companiesWithFunding} companies have funding data</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Web Presence</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{websitePercentage.toFixed(0)}%</div>
              <p className="text-xs text-muted-foreground">{companiesWithWebsite} companies have websites</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Industry Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Industry Distribution
            </CardTitle>
            <CardDescription>Breakdown of companies by industry sector</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topIndustries.map(([industry, count], index) => (
                <motion.div
                  key={industry}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: `hsl(${(index * 72) % 360}, 70%, 50%)`,
                        }}
                      />
                      <span className="text-sm font-medium">{industry}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{count}</span>
                      <Badge variant="secondary">{((count / totalCompanies) * 100).toFixed(0)}%</Badge>
                    </div>
                  </div>
                  <Progress value={(count / Math.max(...Object.values(industryDistribution))) * 100} className="h-2" />
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Founding Year Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Founding Year Trends
            </CardTitle>
            <CardDescription>When were these companies founded?</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(foundingYearDistribution)
                .sort(([a], [b]) => b.localeCompare(a))
                .map(([decade, count], index) => (
                  <motion.div
                    key={decade}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{decade}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{count}</span>
                        <Badge variant="outline">{((count / totalCompanies) * 100).toFixed(0)}%</Badge>
                      </div>
                    </div>
                    <Progress
                      value={(count / Math.max(...Object.values(foundingYearDistribution))) * 100}
                      className="h-2"
                    />
                  </motion.div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Recent Research Activity
          </CardTitle>
          <CardDescription>Latest companies added to your portfolio</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((company, index) => (
                <motion.div
                  key={company.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded">
                      <Building2 className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">{company.companyName}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Badge variant="secondary" className="text-xs">
                          {company.industry}
                        </Badge>
                        <span>•</span>
                        <span>Founded {company.foundedYear}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">{company.timestamp.toLocaleDateString()}</p>
                    <p className="text-xs text-muted-foreground">{company.timestamp.toLocaleTimeString()}</p>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8">
                <TrendingUp className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">No research activity yet</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Portfolio Insights */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Target className="h-4 w-4" />
              Most Common Industry
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topIndustries.length > 0 ? (
              <div>
                <div className="text-2xl font-bold">{topIndustries[0][0]}</div>
                <p className="text-sm text-muted-foreground">
                  {topIndustries[0][1]} companies ({((topIndustries[0][1] / totalCompanies) * 100).toFixed(0)}%)
                </p>
              </div>
            ) : (
              <p className="text-muted-foreground">No data available</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Calendar className="h-4 w-4" />
              Average Company Age
            </CardTitle>
          </CardHeader>
          <CardContent>
            {companies.length > 0 ? (
              <div>
                <div className="text-2xl font-bold">
                  {(
                    new Date().getFullYear() -
                    companies.reduce((acc, c) => acc + Number.parseInt(c.foundedYear), 0) / companies.length
                  ).toFixed(0)}{" "}
                  years
                </div>
                <p className="text-sm text-muted-foreground">Based on {companies.length} companies</p>
              </div>
            ) : (
              <p className="text-muted-foreground">No data available</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="h-4 w-4" />
              Founder Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            {companies.length > 0 ? (
              <div>
                <div className="text-2xl font-bold">{avgFounders}</div>
                <p className="text-sm text-muted-foreground">Average founders per company</p>
                <div className="mt-2 text-xs text-muted-foreground">
                  Range: {Math.min(...companies.map((c) => c.founders.length))} -{" "}
                  {Math.max(...companies.map((c) => c.founders.length))} founders
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">No data available</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
