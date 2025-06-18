"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Settings,
  Download,
  Upload,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Database,
  Zap,
  Shield,
  Bell,
} from "lucide-react"
import type { CompanyResearch } from "@/types/company"

interface SettingsViewProps {
  companies: CompanyResearch[]
  onClearAll: () => void
}

export function SettingsView({ companies, onClearAll }: SettingsViewProps) {
  const [apiKey, setApiKey] = useState("")
  const [notifications, setNotifications] = useState(true)
  const [autoSave, setAutoSave] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  const exportAllData = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      version: "1.0",
      totalCompanies: companies.length,
      companies: companies.map((company) => ({
        ...company,
        timestamp: company.timestamp.toISOString(),
      })),
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `startup-research-backup-${new Date().toISOString().split("T")[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        console.log("Import data:", data)
        // Here you would handle importing the data
        alert("Data import functionality would be implemented here")
      } catch (error) {
        alert("Invalid file format")
      }
    }
    reader.readAsText(file)
  }

  const handleClearAll = () => {
    onClearAll()
    setShowConfirmDialog(false)
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">Manage your account preferences and data</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* API Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              API Configuration
            </CardTitle>
            <CardDescription>Configure your AI research settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="api-key">Groq API Key</Label>
              <Input
                id="api-key"
                type="password"
                placeholder="Enter your Groq API key..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Your API key is stored securely and never shared</p>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-save Research</Label>
                <p className="text-xs text-muted-foreground">Automatically save research results</p>
              </div>
              <Switch checked={autoSave} onCheckedChange={setAutoSave} />
            </div>

            <Button className="w-full">
              <CheckCircle className="h-4 w-4 mr-2" />
              Save API Settings
            </Button>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Preferences
            </CardTitle>
            <CardDescription>Customize your experience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-xs text-muted-foreground">Get notified about research completion</p>
              </div>
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Dark Mode</Label>
                <p className="text-xs text-muted-foreground">Toggle dark theme</p>
              </div>
              <Switch checked={darkMode} onCheckedChange={setDarkMode} />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Research Quality</Label>
              <select className="w-full px-3 py-2 border rounded-md bg-background">
                <option value="standard">Standard</option>
                <option value="detailed">Detailed</option>
                <option value="comprehensive">Comprehensive</option>
              </select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Data Management
          </CardTitle>
          <CardDescription>Export, import, and manage your research data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <h4 className="font-medium">Export Data</h4>
              <p className="text-sm text-muted-foreground">Download all your research data</p>
              <Button onClick={exportAllData} variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Export All ({companies.length})
              </Button>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Import Data</h4>
              <p className="text-sm text-muted-foreground">Import research from backup file</p>
              <div className="relative">
                <Input type="file" accept=".json" onChange={handleImportData} className="hidden" id="import-file" />
                <Button variant="outline" className="w-full" asChild>
                  <label htmlFor="import-file" className="cursor-pointer">
                    <Upload className="h-4 w-4 mr-2" />
                    Import Data
                  </label>
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Clear Data</h4>
              <p className="text-sm text-muted-foreground">Remove all research data</p>
              <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                <DialogTrigger asChild>
                  <Button variant="destructive" className="w-full">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear All
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                      Confirm Data Deletion
                    </DialogTitle>
                    <DialogDescription>
                      This action cannot be undone. This will permanently delete all {companies.length} companies from
                      your research portfolio.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
                      Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleClearAll}>
                      Delete All Data
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Account Information
          </CardTitle>
          <CardDescription>Your subscription and usage details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Plan</span>
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Pro Plan</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Companies Researched</span>
                <span className="text-sm">{companies.length} / ∞</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">API Calls This Month</span>
                <span className="text-sm">247 / 10,000</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Storage Used</span>
                <span className="text-sm">2.4 MB / 1 GB</span>
              </div>
            </div>

            <div className="space-y-3">
              <Alert>
                <Bell className="h-4 w-4" />
                <AlertDescription>
                  Your Pro plan includes unlimited company research, advanced analytics, and priority support.
                </AlertDescription>
              </Alert>

              <Button variant="outline" className="w-full">
                Manage Subscription
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
