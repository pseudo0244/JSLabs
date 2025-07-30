"use client"

import { useState, useRef } from "react"
import { Trash2, Plus, Search, Printer } from "lucide-react"

// Test data structure
const testData = [
  // Blood Tests
  { name: "HB", amount: 100, sampleType: "EDTA", category: "Blood Tests" },
  { name: "TC", amount: 100, sampleType: "EDTA", category: "Blood Tests" },
  { name: "DC", amount: 100, sampleType: "EDTA", category: "Blood Tests" },
  { name: "ESR", amount: 100, sampleType: "EDTA", category: "Blood Tests" },
  { name: "HB, TC, DC, ESR", amount: 350, sampleType: "EDTA", category: "Blood Tests" },
  { name: "CBC (Complete Blood Count)", amount: 300, sampleType: "EDTA", category: "Blood Tests" },
  { name: "CBC & ESR", amount: 350, sampleType: "EDTA", category: "Blood Tests" },
  { name: "Haemogram with PS", amount: 600, sampleType: "EDTA", category: "Blood Tests" },
  { name: "AEC", amount: 150, sampleType: "EDTA", category: "Blood Tests" },
  { name: "PS Study", amount: 300, sampleType: "EDTA", category: "Blood Tests" },
  { name: "Blood Group", amount: 100, sampleType: "EDTA", category: "Blood Tests" },
  { name: "PCV", amount: 100, sampleType: "EDTA", category: "Blood Tests" },
  { name: "Platelet Count", amount: 150, sampleType: "EDTA", category: "Blood Tests" },
  { name: "MP Slide", amount: 150, sampleType: "EDTA", category: "Blood Tests" },
  { name: "MP Rapid", amount: 300, sampleType: "EDTA", category: "Blood Tests" },
  { name: "BT CT", amount: 100, sampleType: "", category: "Blood Tests" },
  { name: "FBS / PPBS", amount: 80, sampleType: "SERUM", category: "Blood Tests" },
  { name: "RBS", amount: 50, sampleType: "SERUM", category: "Blood Tests" },
  { name: "OGCGT", amount: 50, sampleType: "SERUM", category: "Blood Tests" },
  { name: "Cholesterol", amount: 150, sampleType: "SERUM", category: "Blood Tests" },
  { name: "Triglyceride", amount: 150, sampleType: "SERUM", category: "Blood Tests" },
  { name: "Lipid Profile", amount: 500, sampleType: "SERUM", category: "Blood Tests" },
  { name: "LFT (Liver Function Test)", amount: 500, sampleType: "SERUM", category: "Blood Tests" },
  { name: "RFT (Renal Function Test)", amount: 1000, sampleType: "SERUM", category: "Blood Tests" },
  { name: "Bilirubin (Total & Direct)", amount: 200, sampleType: "SERUM", category: "Blood Tests" },
  { name: "SGOT", amount: 150, sampleType: "SERUM", category: "Blood Tests" },
  { name: "SGPT", amount: 150, sampleType: "SERUM", category: "Blood Tests" },
  { name: "ALK PHOS", amount: 150, sampleType: "SERUM", category: "Blood Tests" },
  { name: "Calcium", amount: 250, sampleType: "SERUM", category: "Blood Tests" },
  { name: "Uric Acid", amount: 200, sampleType: "SERUM", category: "Blood Tests" },
  { name: "Urea", amount: 150, sampleType: "SERUM", category: "Blood Tests" },
  { name: "Creatinine", amount: 150, sampleType: "SERUM", category: "Blood Tests" },
  { name: "HbA1c (GHB)", amount: 650, sampleType: "EDTA", category: "Blood Tests" },
  { name: "T3 T4 TSH", amount: 300, sampleType: "SERUM", category: "Blood Tests" },
  { name: "TSH", amount: 300, sampleType: "SERUM", category: "Blood Tests" },
  { name: "FT3 FT4 TSH", amount: 600, sampleType: "SERUM", category: "Blood Tests" },
  { name: "FSH", amount: 500, sampleType: "SERUM", category: "Blood Tests" },
  { name: "LH", amount: 500, sampleType: "SERUM", category: "Blood Tests" },
  { name: "Prolactin", amount: 500, sampleType: "SERUM", category: "Blood Tests" },
  { name: "TFT & Free TFT", amount: 1000, sampleType: "SERUM", category: "Blood Tests" },
  { name: "Testosterone Total", amount: 500, sampleType: "SERUM", category: "Blood Tests" },
  { name: "Testosterone Free", amount: 1500, sampleType: "SERUM", category: "Blood Tests" },
  { name: "Insulin", amount: 900, sampleType: "SERUM", category: "Blood Tests" },
  { name: "IGE", amount: 1000, sampleType: "SERUM", category: "Blood Tests" },
  { name: "Anti TPO", amount: 1200, sampleType: "SERUM", category: "Blood Tests" },
  { name: "HBSAG ELISA", amount: 800, sampleType: "SERUM", category: "Blood Tests" },
  { name: "Anti dsDNA", amount: 1600, sampleType: "SERUM", category: "Blood Tests" },
  { name: "FOLIC ACID", amount: 1200, sampleType: "SERUM", category: "Blood Tests" },
  { name: "CD4 CD8", amount: 1800, sampleType: "SERUM", category: "Blood Tests" },
  { name: "TYPHIDOT", amount: 600, sampleType: "SERUM", category: "Blood Tests" },
  { name: "GTT", amount: 250, sampleType: "SERUM", category: "Blood Tests" },
  { name: "BETA HCG", amount: 850, sampleType: "SERUM", category: "Blood Tests" },
  { name: "PROGESTERONE", amount: 900, sampleType: "SERUM", category: "Blood Tests" },
  { name: "ESTODIAL (E2)", amount: 900, sampleType: "SERUM", category: "Blood Tests" },
  { name: "ANA", amount: 900, sampleType: "SERUM", category: "Blood Tests" },
  { name: "DHEAS", amount: 1100, sampleType: "SERUM", category: "Blood Tests" },
  { name: "AMH", amount: 2000, sampleType: "SERUM", category: "Blood Tests" },
  { name: "TPO ANTIBODY", amount: 1200, sampleType: "SERUM", category: "Blood Tests" },
  { name: "WIDAL", amount: 200, sampleType: "SERUM", category: "Blood Tests" },
  { name: "VDRL", amount: 150, sampleType: "SERUM", category: "Blood Tests" },
  { name: "HIV I & II", amount: 400, sampleType: "SERUM", category: "Blood Tests" },
  { name: "HBSAG", amount: 400, sampleType: "SERUM", category: "Blood Tests" },
  { name: "HCV", amount: 500, sampleType: "SERUM", category: "Blood Tests" },
  { name: "RA FACTOR", amount: 300, sampleType: "SERUM", category: "Blood Tests" },
  { name: "CRP", amount: 300, sampleType: "SERUM", category: "Blood Tests" },
  { name: "ASLO", amount: 350, sampleType: "SERUM", category: "Blood Tests" },
  { name: "MONTUX", amount: 150, sampleType: "", category: "Blood Tests" },
  // Urine Tests
  { name: "URINE ROUTINE", amount: 100, sampleType: "URINE", category: "Urine Tests" },
  { name: "URINE COMPLETE ANALYSIS", amount: 150, sampleType: "URINE", category: "Urine Tests" },
  { name: "URINE BS BP", amount: 150, sampleType: "URINE", category: "Urine Tests" },
  { name: "URINE ALBUMIN", amount: 100, sampleType: "URINE", category: "Urine Tests" },
  { name: "URINE KETONE BODIES", amount: 100, sampleType: "URINE", category: "Urine Tests" },
  { name: "URINE PREGNANCY TEST", amount: 100, sampleType: "URINE", category: "Urine Tests" },
  { name: "URINE CULTURE", amount: 500, sampleType: "URINE", category: "Urine Tests" },
  { name: "URINE MICROALBUMIN", amount: 500, sampleType: "URINE", category: "Urine Tests" },
  { name: "URINE PROTEIN CREATININE RATIO", amount: 600, sampleType: "URINE", category: "Urine Tests" },
  // Stool Tests
  { name: "STOOL ROUTINE", amount: 200, sampleType: "STOOL", category: "Stool Tests" },
  { name: "STOOL HANGING DROP", amount: 200, sampleType: "STOOL", category: "Stool Tests" },
  { name: "STOOL OCCULT BLOOD", amount: 150, sampleType: "STOOL", category: "Stool Tests" },
  { name: "STOOL CULTURE", amount: 500, sampleType: "STOOL", category: "Stool Tests" },
  { name: "SPUTUM AFB", amount: 150, sampleType: "SPUTUM", category: "Stool Tests" },
  { name: "SPUTUM GRAM STAIN", amount: 150, sampleType: "SPUTUM", category: "Stool Tests" },
  { name: "SPUTUM CULTURE", amount: 500, sampleType: "SPUTUM", category: "Stool Tests" },
  { name: "PUS CULTURE", amount: 500, sampleType: "PUS", category: "Stool Tests" },
  { name: "SEMEN CULTURE", amount: 500, sampleType: "SEMEN", category: "Stool Tests" },
  { name: "SEMEN ANALYSIS", amount: 350, sampleType: "SEMEN", category: "Stool Tests" },
  // Profile Packages
  { name: "MASTER HEALTH CHECKUP", amount: 2250, sampleType: "MULTIPLE", category: "Profile Packages" },
  { name: "ARTHRITIS PROFILE", amount: 2500, sampleType: "MULTIPLE", category: "Profile Packages" },
  { name: "COAGULATION PROFILE", amount: 2200, sampleType: "MULTIPLE", category: "Profile Packages" },
  { name: "ANTENATAL PROFILE", amount: 1200, sampleType: "MULTIPLE", category: "Profile Packages" },
  { name: "ANTENATAL PROFILE 1", amount: 1500, sampleType: "MULTIPLE", category: "Profile Packages" },
  { name: "DIABETIC PROFILE", amount: 2000, sampleType: "MULTIPLE", category: "Profile Packages" },
  { name: "RENAL PROFILE (RFT)", amount: 1200, sampleType: "MULTIPLE", category: "Profile Packages" },
  { name: "IRON PROFILE (with Ferritin)", amount: 1600, sampleType: "MULTIPLE", category: "Profile Packages" },
  // Miscellaneous Tests
  { name: "Serum CEA", amount: 1100, sampleType: "SERUM", category: "Miscellaneous Tests" },
  { name: "Troponin T", amount: 1200, sampleType: "EDTA", category: "Miscellaneous Tests" },
  { name: "Homocysteine", amount: 1200, sampleType: "SERUM", category: "Miscellaneous Tests" },
  { name: "CKMS", amount: 700, sampleType: "SERUM", category: "Miscellaneous Tests" },
  { name: "GGT", amount: 300, sampleType: "SERUM", category: "Miscellaneous Tests" },
  { name: "SEMEN ANALYSIS", amount: 300, sampleType: "SEMEN", category: "Miscellaneous Tests" },
  { name: "DENGUE PROFILE IGG IGM NS1AG", amount: 1000, sampleType: "SERUM", category: "Miscellaneous Tests" },
  { name: "LEPTOSPIRA IGG & IGM CARD TEST", amount: 1600, sampleType: "SERUM", category: "Miscellaneous Tests" },
  { name: "LEPTOSPIRA IGG & IGM ELISA TEST", amount: 2200, sampleType: "SERUM", category: "Miscellaneous Tests" },
  { name: "CHIKUNGUNYA", amount: 900, sampleType: "SERUM", category: "Miscellaneous Tests" },
  { name: "TYPHIDOT IGG IGM", amount: 600, sampleType: "SERUM", category: "Miscellaneous Tests" },
  { name: "AMYLASE", amount: 400, sampleType: "SERUM", category: "Miscellaneous Tests" },
  { name: "LIPASE", amount: 500, sampleType: "SERUM", category: "Miscellaneous Tests" },
  { name: "ELECTROLYTES", amount: 450, sampleType: "SERUM", category: "Miscellaneous Tests" },
  { name: "CORTISOL", amount: 1000, sampleType: "SERUM", category: "Miscellaneous Tests" },
  { name: "CPK", amount: 600, sampleType: "SERUM", category: "Miscellaneous Tests" },
  { name: "CA 125", amount: 1200, sampleType: "SERUM", category: "Miscellaneous Tests" },
  { name: "CA 15.3", amount: 1200, sampleType: "SERUM", category: "Miscellaneous Tests" },
  { name: "CA 19.9", amount: 1200, sampleType: "SERUM", category: "Miscellaneous Tests" },
  { name: "SODIUM", amount: 200, sampleType: "SERUM", category: "Miscellaneous Tests" },
  { name: "POTASSIUM", amount: 200, sampleType: "SERUM", category: "Miscellaneous Tests" },
  { name: "CHLORIDE", amount: 200, sampleType: "SERUM", category: "Miscellaneous Tests" },
  { name: "COOMBS DIRECT", amount: 600, sampleType: "SERUM", category: "Miscellaneous Tests" },
  { name: "COOMBS INDIRECT", amount: 600, sampleType: "SERUM", category: "Miscellaneous Tests" },
  { name: "SERUM IRON AND TIBC", amount: 1100, sampleType: "SERUM", category: "Miscellaneous Tests" },
  { name: "SERUM IRON", amount: 600, sampleType: "SERUM", category: "Miscellaneous Tests" },
  { name: "SERUM LDH", amount: 800, sampleType: "SERUM", category: "Miscellaneous Tests" },
  { name: "SERUM FERRITIN", amount: 900, sampleType: "SERUM", category: "Miscellaneous Tests" },
  { name: "VITAMIN D3", amount: 1600, sampleType: "SERUM", category: "Miscellaneous Tests" },
  { name: "VITAMIN B12", amount: 1000, sampleType: "SERUM", category: "Miscellaneous Tests" },
  { name: "ANDROSTENIODINE", amount: 1400, sampleType: "SERUM", category: "Miscellaneous Tests" },
  { name: "PSA", amount: 1000, sampleType: "SERUM", category: "Miscellaneous Tests" },
  { name: "ANTIBODIES ACLA", amount: 2000, sampleType: "SERUM", category: "Miscellaneous Tests" },
  { name: "APL ANTIBODIES APLA", amount: 2000, sampleType: "SERUM", category: "Miscellaneous Tests" },
  { name: "ANTI DS DNA", amount: 1100, sampleType: "SERUM", category: "Miscellaneous Tests" },
  { name: "ANTI HAV IGM", amount: 1200, sampleType: "SERUM", category: "Miscellaneous Tests" },
  { name: "ANTI HBC TOTAL", amount: 1200, sampleType: "SERUM", category: "Miscellaneous Tests" },
  { name: "ANTI HBC IGM", amount: 1000, sampleType: "SERUM", category: "Miscellaneous Tests" },
  { name: "ANTI HBE", amount: 1100, sampleType: "SERUM", category: "Miscellaneous Tests" },
  { name: "ANTI HBS", amount: 1100, sampleType: "SERUM", category: "Miscellaneous Tests" },
  { name: "ANTI HEV IGM", amount: 1300, sampleType: "SERUM", category: "Miscellaneous Tests" },
  { name: "ANTI HEV IGG", amount: 2200, sampleType: "SERUM", category: "Miscellaneous Tests" },
  { name: "HBEAG", amount: 1000, sampleType: "SERUM", category: "Miscellaneous Tests" },
  { name: "ANTI AMA", amount: 2000, sampleType: "SERUM", category: "Miscellaneous Tests" },
  { name: "CPK MB", amount: 900, sampleType: "SERUM", category: "Miscellaneous Tests" },
  { name: "CPK", amount: 800, sampleType: "SERUM", category: "Miscellaneous Tests" },
  { name: "PT", amount: 400, sampleType: "CITRATE", category: "Miscellaneous Tests" },
  { name: "APTT", amount: 500, sampleType: "CITRATE", category: "Miscellaneous Tests" },
  { name: "ANC PROFILE WITH TSH", amount: 1200, sampleType: "EDTA/SRM", category: "Miscellaneous Tests" },
  { name: "TB PCR", amount: 2500, sampleType: "EDTA", category: "Miscellaneous Tests" },
  { name: "TORCH PROFILE", amount: 2800, sampleType: "SERUM", category: "Miscellaneous Tests" },
  { name: "TORCH IGM STUDY", amount: 1500, sampleType: "SERUM", category: "Miscellaneous Tests" },
  { name: "TORCH IGG STUDY", amount: 1500, sampleType: "SERUM", category: "Miscellaneous Tests" },
  { name: "INFERTILITY PROFILE (FEMALE)", amount: 2800, sampleType: "SERUM", category: "Miscellaneous Tests" },
  { name: "INFERTILITY PROFILE (MALE)", amount: 2800, sampleType: "SERUM", category: "Miscellaneous Tests" },
  { name: "DOUBLE MARKER", amount: 2500, sampleType: "SERUM", category: "Miscellaneous Tests" },
  { name: "TRIPLE MARKER", amount: 2500, sampleType: "SERUM", category: "Miscellaneous Tests" },
  { name: "QUADRUPLE MARKER", amount: 3100, sampleType: "SERUM", category: "Miscellaneous Tests" },
  { name: "BLOOD CULTURE", amount: 600, sampleType: "", category: "Miscellaneous Tests" },
  { name: "TOXO IGM", amount: 800, sampleType: "SERUM", category: "Miscellaneous Tests" },
  { name: "TOXO IGG", amount: 800, sampleType: "SERUM", category: "Miscellaneous Tests" },
  { name: "ANTI CCP", amount: 1600, sampleType: "SERUM", category: "Miscellaneous Tests" },
  { name: "HLA B27", amount: 1500, sampleType: "SERUM", category: "Miscellaneous Tests" },
  { name: "TB GOLD (QUANTIFERON)", amount: 3500, sampleType: "SPECIAL", category: "Miscellaneous Tests" },
  { name: "TB PCR", amount: 3500, sampleType: "EDTA", category: "Miscellaneous Tests" },
  { name: "RUBELLA IGM", amount: 800, sampleType: "SERUM", category: "Miscellaneous Tests" },
  { name: "RUBELLA IGG", amount: 800, sampleType: "SERUM", category: "Miscellaneous Tests" },
  { name: "HSV IGG", amount: 800, sampleType: "SERUM", category: "Miscellaneous Tests" },
  { name: "HSV IGM", amount: 800, sampleType: "SERUM", category: "Miscellaneous Tests" },
  { name: "ACTH", amount: 2000, sampleType: "EDTA", category: "Miscellaneous Tests" },
  { name: "ANTI TG", amount: 1200, sampleType: "SERUM", category: "Miscellaneous Tests" },
  { name: "TPHA", amount: 500, sampleType: "SERUM", category: "Miscellaneous Tests" },
  { name: "ANTI THYROID ANTIBODIES", amount: 2400, sampleType: "SERUM", category: "Miscellaneous Tests" },
  { name: "PTH (PARATHYROID HORMONE)", amount: 1200, sampleType: "SERUM", category: "Miscellaneous Tests" },
  { name: "D-DIMER", amount: 1600, sampleType: "SERUM", category: "Miscellaneous Tests" },
]

interface Test {
  name: string
  amount: number
  sampleType: string
  category: string
}

interface SelectedTest extends Test {
  id: string
  customAmount: number // New field for custom price
  individualDiscount: number // New field for individual test discount
}

interface PatientDetails {
  name: string
  age: string
  gender: string
  doctorReferred: string
}

export default function Billing() {
  const [patientDetails, setPatientDetails] = useState<PatientDetails>({
    name: "",
    age: "",
    gender: "",
    doctorReferred: "",
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTests, setSelectedTests] = useState<SelectedTest[]>([])
  const [extraDiscount, setExtraDiscount] = useState(0) // Renamed from 'discount' to avoid confusion
  const billRef = useRef<HTMLDivElement>(null)

  const filteredTests = testData.filter(
    (test) =>
      test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const addTest = (test: Test) => {
    const newTest: SelectedTest = {
      ...test,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      customAmount: test.amount, // Initialize custom amount with original amount
      individualDiscount: 0, // Initialize individual discount to 0
    }
    setSelectedTests([...selectedTests, newTest])
    setSearchTerm("")
  }

  const removeTest = (id: string) => {
    setSelectedTests(selectedTests.filter((test) => test.id !== id))
  }

  const handleCustomAmountChange = (id: string, newAmount: number) => {
    setSelectedTests((prevTests) =>
      prevTests.map((test) => (test.id === id ? { ...test, customAmount: newAmount } : test)),
    )
  }

  const handleIndividualDiscountChange = (id: string, newDiscount: number) => {
    setSelectedTests((prevTests) =>
      prevTests.map((test) => (test.id === id ? { ...test, individualDiscount: newDiscount } : test)),
    )
  }

  const subtotal = selectedTests.reduce((sum, test) => sum + test.customAmount, 0)
  const totalIndividualDiscount = selectedTests.reduce((sum, test) => sum + test.individualDiscount, 0)
  const amountAfterIndividualDiscounts = subtotal - totalIndividualDiscount
  const finalAmount = amountAfterIndividualDiscounts - extraDiscount

  const handlePrint = () => {
    window.print()
  }

  const currentDate = new Date().toLocaleDateString("en-IN")
  const billNumber = `BILL-${Date.now().toString().slice(-6)}`

  return (
    <>
      <div className="min-h-screen bg-gray-900 text-white p-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel - Form */}
          <div className="space-y-6">
            {/* Patient Details */}
            <div className="bg-gray-800 rounded-lg border border-gray-700">
              <div className="p-4 border-b border-gray-700">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Patient Details
                </h3>
              </div>
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                      Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={patientDetails.name}
                      onChange={(e) => setPatientDetails({ ...patientDetails, name: e.target.value })}
                      placeholder="Enter patient name"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="age" className="block text-sm font-medium text-gray-300 mb-1">
                      Age
                    </label>
                    <input
                      id="age"
                      type="text"
                      value={patientDetails.age}
                      onChange={(e) => setPatientDetails({ ...patientDetails, age: e.target.value })}
                      placeholder="Enter age"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-300 mb-1">
                      Gender
                    </label>
                    <select
                      id="gender"
                      value={patientDetails.gender}
                      onChange={(e) => setPatientDetails({ ...patientDetails, gender: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="doctor" className="block text-sm font-medium text-gray-300 mb-1">
                      Doctor Referred
                    </label>
                    <input
                      id="doctor"
                      type="text"
                      value={patientDetails.doctorReferred}
                      onChange={(e) => setPatientDetails({ ...patientDetails, doctorReferred: e.target.value })}
                      placeholder="Enter doctor name"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Test Search */}
            <div className="bg-gray-800 rounded-lg border border-gray-700">
              <div className="p-4 border-b border-gray-700">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  Search & Add Tests
                </h3>
              </div>
              <div className="p-4">
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Search tests by name or category..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {searchTerm && (
                    <div className="max-h-60 overflow-y-auto border border-gray-600 rounded-md bg-gray-700">
                      {filteredTests.slice(0, 10).map((test, index) => (
                        <div
                          key={index}
                          className="p-3 border-b border-gray-600 hover:bg-gray-600 cursor-pointer flex justify-between items-center last:border-b-0"
                          onClick={() => addTest(test)}
                        >
                          <div>
                            <div className="font-medium text-white">{test.name}</div>
                            <div className="text-sm text-gray-400">
                              {test.category} • {test.sampleType}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-1 bg-gray-600 text-gray-200 text-xs rounded">₹{test.amount}</span>
                            <Plus className="w-4 h-4 text-green-400" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Selected Tests */}
            <div className="bg-gray-800 rounded-lg border border-gray-700">
              <div className="p-4 border-b border-gray-700">
                <h3 className="text-lg font-semibold">Selected Tests ({selectedTests.length})</h3>
              </div>
              <div className="p-4">
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {selectedTests.map((test) => (
                    <div key={test.id} className="flex flex-col gap-2 p-3 bg-gray-700 rounded">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium text-sm text-white">{test.name}</div>
                          <div className="text-xs text-gray-400">{test.sampleType}</div>
                        </div>
                        <button
                          onClick={() => removeTest(test.id)}
                          className="p-1 text-red-400 hover:text-red-300 hover:bg-gray-600 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor={`amount-${test.id}`} className="block text-xs font-medium text-gray-300 mb-1">
                            Amount (₹)
                          </label>
                          <input
                            id={`amount-${test.id}`}
                            type="number"
                            value={test.customAmount}
                            onChange={(e) => handleCustomAmountChange(test.id, Number(e.target.value) || 0)}
                            className="w-full px-2 py-1 bg-gray-600 border border-gray-500 rounded-md text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor={`discount-${test.id}`}
                            className="block text-xs font-medium text-gray-300 mb-1"
                          >
                            Discount (₹)
                          </label>
                          <input
                            id={`discount-${test.id}`}
                            type="number"
                            value={test.individualDiscount}
                            onChange={(e) => handleIndividualDiscountChange(test.id, Number(e.target.value) || 0)}
                            className="w-full px-2 py-1 bg-gray-600 border border-gray-500 rounded-md text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                      <div className="text-right text-sm font-bold text-blue-300">
                        Net: ₹{test.customAmount - test.individualDiscount}
                      </div>
                    </div>
                  ))}
                  {selectedTests.length === 0 && (
                    <div className="text-center text-gray-500 py-4">No tests selected</div>
                  )}
                </div>
              </div>
            </div>

            {/* Extra Discount Section */}
            <div className="bg-gray-800 rounded-lg border border-gray-700">
              <div className="p-4 border-b border-gray-700">
                <h3 className="text-lg font-semibold">Overall Discount</h3>
              </div>
              <div className="p-4">
                <div>
                  <label htmlFor="extraDiscount" className="block text-sm font-medium text-gray-300 mb-1">
                    Extra Discount (₹)
                  </label>
                  <input
                    id="extraDiscount"
                    type="number"
                    value={extraDiscount}
                    onChange={(e) => setExtraDiscount(Number(e.target.value) || 0)}
                    placeholder="0"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Bill Preview */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Bill Preview</h2>
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                <Printer className="w-4 h-4" />
                Print Bill
              </button>
            </div>
            {/* Bill */}
            <div
              ref={billRef}
              className="bg-white text-black shadow-lg print-bill"
              style={{ width: "148mm", minHeight: "210mm" }}
            >
              <div className="p-6 space-y-4 relative">
                {/* Watermark */}
                <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                  <img
                    src="https://res.cloudinary.com/dtzqrfg6q/image/upload/v1753884050/erasebg-transformed_oqwj4h.png"
                    alt="Watermark"
                    className="w-120 h-120 object-contain"
                  />
                </div>
                {/* Header */}
               <div className="pb-4 relative z-10">
  <img
    src="https://res.cloudinary.com/dtzqrfg6q/image/upload/v1752733928/1_qstzba.png"
    alt="Lab Header"
    className="mx-auto mb-2 relative -top-10"
  />
</div>


                {/* Bill Info */}
                <div className="grid grid-cols-2 gap-4 text-sm relative z-30 -top-20">
                  <div>
                    <p>
                      <strong>Bill No:</strong> {billNumber}
                    </p>
                    <p>
                      <strong>Date:</strong> {currentDate}
                    </p>
                  </div>
                  <div className="text-right">
                    <p>
                      <strong>Time:</strong> {new Date().toLocaleTimeString("en-IN")}
                    </p>
                  </div>
                </div>
                {/* Patient Details */}
                <div className="border rounded p-3  relative z-10 -top-20">
                  <h3 className="font-semibold mb-2">Patient Information</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <p>
                      <strong>Name:</strong> {patientDetails.name || "N/A"}
                    </p>
                    <p>
                      <strong>Age:</strong> {patientDetails.age || "N/A"}
                    </p>
                    <p>
                      <strong>Gender:</strong> {patientDetails.gender || "N/A"}
                    </p>
                    <p>
                      <strong>Referred by:</strong> {patientDetails.doctorReferred || "N/A"}
                    </p>
                  </div>
                </div>
                {/* Tests Table */}
                <div className="relative z-10 -top-20">
                  <h3 className="font-semibold mb-2">Laboratory Investigations</h3>
                  <table className="w-full text-xs border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 p-2 text-left">S.No</th>
                        <th className="border border-gray-300 p-2 text-left">Test Name</th>
                        <th className="border border-gray-300 p-2 text-left">Sample</th>
                        <th className="border border-gray-300 p-2 text-right">Amount (₹)</th>
                        <th className="border border-gray-300 p-2 text-right">Disc. (₹)</th>
                        <th className="border border-gray-300 p-2 text-right">Net (₹)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedTests.map((test, index) => (
                        <tr key={test.id}>
                          <td className="border border-gray-300 p-2">{index + 1}</td>
                          <td className="border border-gray-300 p-2">{test.name}</td>
                          <td className="border border-gray-300 p-2">{test.sampleType}</td>
                          <td className="border border-gray-300 p-2 text-right">{test.customAmount}</td>
                          <td className="border border-gray-300 p-2 text-right">{test.individualDiscount}</td>
                          <td className="border border-gray-300 p-2 text-right">
                            {test.customAmount - test.individualDiscount}
                          </td>
                        </tr>
                      ))}
                      {selectedTests.length === 0 && (
                        <tr>
                          <td colSpan={6} className="border border-gray-300 p-4 text-center text-gray-500">
                            No tests selected
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                {/* Bill Summary */}
                <div className="border-t pt-4 relative z-10 -top-20">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>₹{subtotal}</span>
                    </div>
                    {totalIndividualDiscount > 0 && (
                      <div className="flex justify-between text-red-600">
                        <span>Discount:</span>
                        <span>-₹{totalIndividualDiscount}</span>
                      </div>
                    )}
                    {extraDiscount > 0 && (
                      <div className="flex justify-between text-red-600">
                        <span>Overall Discount:</span>
                        <span>-₹{extraDiscount}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                      <span>Final Amount:</span>
                      <span>₹{finalAmount}</span>
                    </div>
                  </div>
                </div>
                {/* Footer */}
                <div className="text-center text-xs pt-4 relative z-10 -bottom-7">
                  <img src="https://res.cloudinary.com/dtzqrfg6q/image/upload/v1752733928/2_cahezd.png" alt="Lab Footer" className="mx-auto mb-2" />
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Print Styles */}
      <style>{`
          @media print {
            body * {
              visibility: hidden;
            }
            .print-bill,
            .print-bill * {
              visibility: visible;
            }
            .print-bill {
              position: absolute;
              left: 0;
              top: 0;
              width: 148mm !important;
              height: auto !important;
              box-shadow: none !important;
            }
            @page {
              size: A5;
              margin: 10mm;
            }
          }
        `}</style>
    </>
  )
}
