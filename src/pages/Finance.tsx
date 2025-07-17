"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../../lib/supabase"

// Types
interface FinanceEntry {
  id?: string
  date: string
  description: string
  amount_received: number
  doctors_cut: number
  bioline_cut: number
  net_revenue: number
  created_at?: string
}

interface SummaryData {
  totalAmountReceived: number
  totalDoctorsCut: number
  totalBiolineCut: number
  totalNetRevenue: number
}

// Database functions using Supabase
const database = {
  async getEntries(startDate: string, endDate: string): Promise<FinanceEntry[]> {
    const { data, error } = await supabase
      .from('finance_entries')
      .select('*')
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: false })

    if (error) {
      console.error('Error fetching entries:', error)
      throw error
    }

    return data || []
  },

  async saveEntry(entry: FinanceEntry): Promise<FinanceEntry> {
    if (entry.id) {
      // Update existing entry
      const { data, error } = await supabase
        .from('finance_entries')
        .update({
          date: entry.date,
          description: entry.description,
          amount_received: entry.amount_received,
          doctors_cut: entry.doctors_cut,
          bioline_cut: entry.bioline_cut,
        })
        .eq('id', entry.id)
        .select()
        .single()

      if (error) {
        console.error('Error updating entry:', error)
        throw error
      }

      return data
    } else {
      // Insert new entry
      const { data, error } = await supabase
        .from('finance_entries')
        .insert({
          date: entry.date,
          description: entry.description,
          amount_received: entry.amount_received,
          doctors_cut: entry.doctors_cut,
          bioline_cut: entry.bioline_cut,
        })
        .select()
        .single()

      if (error) {
        console.error('Error inserting entry:', error)
        throw error
      }

      return data
    }
  },

  async deleteEntry(id: string): Promise<void> {
    const { error } = await supabase
      .from('finance_entries')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting entry:', error)
      throw error
    }
  },
}

// Icons
const CalendarIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
)

const PlusIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
)

const TrashIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
)

const DownloadIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
)

const ArrowLeftIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
)

const SaveIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
    />
  </svg>
)

export default function Finance() {
  const navigate = useNavigate()
  const [entries, setEntries] = useState<FinanceEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Date range state
  const [startDate, setStartDate] = useState(() => {
    const date = new Date()
    date.setDate(1) // First day of current month
    return date.toISOString().split("T")[0]
  })

  const [endDate, setEndDate] = useState(() => {
    const date = new Date()
    return date.toISOString().split("T")[0]
  })

  // Summary calculations
  const summary: SummaryData = entries.reduce(
    (acc, entry) => ({
      totalAmountReceived: acc.totalAmountReceived + (entry.amount_received || 0),
      totalDoctorsCut: acc.totalDoctorsCut + (entry.doctors_cut || 0),
      totalBiolineCut: acc.totalBiolineCut + (entry.bioline_cut || 0),
      totalNetRevenue: acc.totalNetRevenue + (entry.net_revenue || 0),
    }),
    { totalAmountReceived: 0, totalDoctorsCut: 0, totalBiolineCut: 0, totalNetRevenue: 0 },
  )

  // Load entries when date range changes
  useEffect(() => {
    loadEntries()
  }, [startDate, endDate])

  const loadEntries = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await database.getEntries(startDate, endDate)
      setEntries(data)
    } catch (error) {
      console.error("Error loading entries:", error)
      setError("Failed to load entries. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const addNewRow = () => {
    const newEntry: FinanceEntry = {
      date: new Date().toISOString().split("T")[0],
      description: "",
      amount_received: 0,
      doctors_cut: 0,
      bioline_cut: 0,
      net_revenue: 0,
    }
    setEntries([...entries, newEntry])
  }

  const updateEntry = (index: number, field: keyof FinanceEntry, value: string | number) => {
    const updatedEntries = [...entries]
    updatedEntries[index] = { ...updatedEntries[index], [field]: value }

    // Auto-calculate net revenue
    if (field === "amount_received" || field === "doctors_cut" || field === "bioline_cut") {
      const entry = updatedEntries[index]
      entry.net_revenue = (entry.amount_received || 0) - (entry.doctors_cut || 0) - (entry.bioline_cut || 0)
    }

    setEntries(updatedEntries)
  }

  const deleteEntry = async (index: number) => {
    const entry = entries[index]
    if (entry.id) {
      try {
        await database.deleteEntry(entry.id)
      } catch (error) {
        console.error("Error deleting entry:", error)
        setError("Failed to delete entry. Please try again.")
        return
      }
    }
    const updatedEntries = entries.filter((_, i) => i !== index)
    setEntries(updatedEntries)
  }

  const saveAllEntries = async () => {
    setSaving(true)
    setError(null)
    try {
      const savePromises = entries
        .filter(entry => entry.date && (entry.description || entry.amount_received || entry.doctors_cut || entry.bioline_cut))
        .map((entry) => database.saveEntry(entry))
      
      await Promise.all(savePromises)
      
      // Reload entries to get the latest data
      await loadEntries()
    } catch (error) {
      console.error("Error saving entries:", error)
      setError("Failed to save entries. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const exportToCSV = () => {
    const headers = ["Date", "Description", "Amount Received", "Doctors Cut", "Bioline Cut", "Net Revenue"]
    const csvContent = [
      headers.join(","),
      ...entries.map((entry) =>
        [
          entry.date,
          `"${entry.description}"`,
          entry.amount_received,
          entry.doctors_cut,
          entry.bioline_cut,
          entry.net_revenue,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `finance-report-${startDate}-to-${endDate}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      {/* Header */}
      <div className="bg-gray-800/50 backdrop-blur-xl border-b border-gray-700/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate("/")} className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors">
                <ArrowLeftIcon className="w-5 h-5" />
              </button>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                Finance Tracker
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={saveAllEntries}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg transition-colors"
              >
                <SaveIcon className="w-4 h-4" />
                {saving ? "Saving..." : "Save All"}
              </button>

              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
              >
                <DownloadIcon className="w-4 h-4" />
                Export CSV
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-600/20 border border-red-500/30 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 backdrop-blur-xl border border-green-500/30 rounded-2xl p-6">
            <h3 className="text-green-400 text-sm font-medium mb-2">Total Amount Received</h3>
            <p className="text-3xl font-bold text-white">{formatCurrency(summary.totalAmountReceived)}</p>
          </div>

          <div className="bg-gradient-to-br from-red-600/20 to-red-800/20 backdrop-blur-xl border border-red-500/30 rounded-2xl p-6">
            <h3 className="text-red-400 text-sm font-medium mb-2">Total Doctors Cut</h3>
            <p className="text-3xl font-bold text-white">{formatCurrency(summary.totalDoctorsCut)}</p>
          </div>

          <div className="bg-gradient-to-br from-orange-600/20 to-orange-800/20 backdrop-blur-xl border border-orange-500/30 rounded-2xl p-6">
            <h3 className="text-orange-400 text-sm font-medium mb-2">Total Bioline Cut</h3>
            <p className="text-3xl font-bold text-white">{formatCurrency(summary.totalBiolineCut)}</p>
          </div>

          <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-6">
            <h3 className="text-blue-400 text-sm font-medium mb-2">Total Net Revenue</h3>
            <p className="text-3xl font-bold text-white">{formatCurrency(summary.totalNetRevenue)}</p>
          </div>
        </div>

        {/* Date Range Selector */}
        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-gray-400" />
              <span className="text-gray-400 font-medium">Date Range:</span>
            </div>

            <div className="flex items-center gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">From</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">To</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Data Entry Table */}
        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-gray-700/50">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Financial Entries</h2>
              <button
                onClick={addNewRow}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
              >
                <PlusIcon className="w-4 h-4" />
                Add Entry
              </button>
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <p className="mt-4 text-gray-400">Loading entries...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700/30">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Description</th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-gray-300">Amount Received</th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-gray-300">Doctors Cut</th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-gray-300">Bioline Cut</th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-gray-300">Net Revenue</th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/50">
                  {entries.map((entry, index) => (
                    <tr key={entry.id || index} className="hover:bg-gray-700/20 transition-colors">
                      <td className="px-6 py-4">
                        <input
                          type="date"
                          value={entry.date}
                          onChange={(e) => updateEntry(index, "date", e.target.value)}
                          className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          value={entry.description}
                          onChange={(e) => updateEntry(index, "description", e.target.value)}
                          placeholder="Enter description..."
                          className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="number"
                          value={entry.amount_received || ""}
                          onChange={(e) =>
                            updateEntry(index, "amount_received", Number.parseFloat(e.target.value) || 0)
                          }
                          placeholder="0.00"
                          className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white text-sm text-right focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                          step="0.01"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="number"
                          value={entry.doctors_cut || ""}
                          onChange={(e) => updateEntry(index, "doctors_cut", Number.parseFloat(e.target.value) || 0)}
                          placeholder="0.00"
                          className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white text-sm text-right focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                          step="0.01"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="number"
                          value={entry.bioline_cut || ""}
                          onChange={(e) => updateEntry(index, "bioline_cut", Number.parseFloat(e.target.value) || 0)}
                          placeholder="0.00"
                          className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white text-sm text-right focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                          step="0.01"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="px-3 py-2 bg-gray-600/30 border border-gray-600/30 rounded-lg text-white text-sm text-right">
                          {formatCurrency(entry.net_revenue || 0)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => deleteEntry(index)}
                          className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}

                  {entries.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                        No entries found for the selected date range.
                        <br />
                        <button onClick={addNewRow} className="mt-4 text-blue-400 hover:text-blue-300 underline">
                          Add your first entry
                        </button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        {entries.length > 0 && (
          <div className="mt-8 bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-400">{entries.length}</p>
                <p className="text-sm text-gray-400">Total Entries</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-400">
                  {formatCurrency(entries.length > 0 ? summary.totalAmountReceived / entries.length : 0)}
                </p>
                <p className="text-sm text-gray-400">Average Amount</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-400">
                  {((summary.totalNetRevenue / summary.totalAmountReceived) * 100 || 0).toFixed(1)}%
                </p>
                <p className="text-sm text-gray-400">Net Margin</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}