import React, { useState, useRef } from 'react';
import { Upload, FileText, Send, Plus, X, Trash2, Edit3, Heart } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

interface UploadedPDF {
  id: string;
  file: File;
  name: string;
}

interface ProcessedPDF {
  url: string;
  filename: string;
}

function App() {
  const [uploadedPDFs, setUploadedPDFs] = useState<UploadedPDF[]>([]);
  const [processedPDF, setProcessedPDF] = useState<ProcessedPDF | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pdfName, setPdfName] = useState('merged_lab_report');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Header and footer image paths
  const HEADER_IMAGE_PATH = '/header.png';
  const FOOTER_IMAGE_PATH = '/footer.png';

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newPDFs: UploadedPDF[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type === 'application/pdf') {
          newPDFs.push({
            id: Date.now().toString() + i,
            file,
            name: file.name
          });
        }
      }
      setUploadedPDFs(prev => [...prev, ...newPDFs]);
      setProcessedPDF(null);
    }
  };

  const removePDF = (id: string) => {
    setUploadedPDFs(prev => prev.filter(pdf => pdf.id !== id));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    const newPDFs: UploadedPDF[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type === 'application/pdf') {
        newPDFs.push({
          id: Date.now().toString() + i,
          file,
          name: file.name
        });
      }
    }
    setUploadedPDFs(prev => [...prev, ...newPDFs]);
    setProcessedPDF(null);
  };

  const loadImageFromPath = async (path: string) => {
    const response = await fetch(path);
    const arrayBuffer = await response.arrayBuffer();
    return arrayBuffer;
  };

  const embedImageInPDF = async (pdfDoc: PDFDocument, imagePath: string) => {
    const imageBytes = await loadImageFromPath(imagePath);
    // Using PNG format for header and footer images
    return await pdfDoc.embedPng(imageBytes);
  };

  const processPDFs = async () => {
    if (uploadedPDFs.length === 0) return;

    setIsProcessing(true);
    
    try {
      // Create a new PDF document for merging
      const mergedPDF = await PDFDocument.create();

      // Embed header and footer images from local files
      const headerImageEmbed = await embedImageInPDF(mergedPDF, HEADER_IMAGE_PATH);
      const footerImageEmbed = await embedImageInPDF(mergedPDF, FOOTER_IMAGE_PATH);

      // Process each PDF
      for (const pdfFile of uploadedPDFs) {
        const pdfArrayBuffer = await pdfFile.file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(pdfArrayBuffer);

        // Copy pages to merged document
        const copiedPages = await mergedPDF.copyPages(pdfDoc, pdfDoc.getPageIndices());
        copiedPages.forEach((page) => mergedPDF.addPage(page));
      }

      // Add header and footer to all pages in the merged document
      const allPages = mergedPDF.getPages();
      allPages.forEach((page) => {
        const { width, height } = page.getSize();
        
        // Calculate dimensions for header (10% of page)
        const headerHeight = height * 0.14;
        const headerWidth = width;
        
        // Calculate dimensions for footer (8% of page)
        const footerHeight = height * 0.12;
        const footerWidth = width;

        // Draw header at the top
        page.drawImage(headerImageEmbed, {
          x: 0,
          y: height - headerHeight,
          width: headerWidth,
          height: headerHeight,
          opacity: 1,
        });

        // Draw footer at the bottom
        page.drawImage(footerImageEmbed, {
          x: 0,
          y: 0,
          width: footerWidth,
          height: footerHeight,
          opacity: 1,
        });
      });

      const pdfBytes = await mergedPDF.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      setProcessedPDF({
        url,
        filename: `${pdfName || 'merged_lab_report'}.pdf`
      });
    } catch (error) {
      console.error('Error processing PDFs:', error);
      alert('Error processing PDFs. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const openWhatsApp = () => {
    if (!whatsappNumber || whatsappNumber.length !== 10) return;
    
    const message = encodeURIComponent(`Here is your processed lab report: ${processedPDF?.filename || `${pdfName}.pdf`}`);
    const whatsappUrl = `https://wa.me/91${whatsappNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const downloadPDF = () => {
    if (!processedPDF) return;
    
    const link = document.createElement('a');
    link.href = processedPDF.url;
    link.download = processedPDF.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    // Limit to 10 digits for Indian numbers
    return digits.slice(0, 10);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setWhatsappNumber(formatted);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <img 
                src="erasebg-transformed.png" 
                alt="JS Labs Logo" 
                className="w-16 h-16 rounded-full border-2 border-blue-500 mr-4"
              />
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  JS Labs Report Processor
                </h1>
                <p className="text-gray-400 text-lg">
                  Upload multiple PDFs, add headers/footers, merge and send via WhatsApp
                </p>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Upload Section */}
            <div className="space-y-6">
              {/* PDF Upload */}
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                  <FileText className="w-6 h-6 text-blue-400" />
                  Upload Lab Reports
                </h2>
                
                <div
                  className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-300 mb-2">Drag and drop multiple PDFs here</p>
                  <p className="text-gray-500 text-sm">or click to browse files</p>
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />

                {/* Uploaded PDFs List */}
                {uploadedPDFs.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <h3 className="font-semibold text-gray-300">Uploaded PDFs ({uploadedPDFs.length})</h3>
                    {uploadedPDFs.map((pdf) => (
                      <div key={pdf.id} className="flex items-center justify-between bg-gray-700 p-3 rounded">
                        <span className="text-sm text-gray-300 truncate">{pdf.name}</span>
                        <button
                          onClick={() => removePDF(pdf.id)}
                          className="text-red-400 hover:text-red-300 p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => setUploadedPDFs([])}
                      className="flex items-center gap-2 text-red-400 hover:text-red-300 text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                      Clear All
                    </button>
                  </div>
                )}
              </div>

              {/* PDF Name Input */}
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <label className="block text-gray-300 mb-2">
                  <Edit3 className="w-4 h-4 inline mr-2" />
                  PDF Name
                </label>
                <input
                  type="text"
                  value={pdfName}
                  onChange={(e) => setPdfName(e.target.value)}
                  placeholder="Enter PDF name"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                />
              </div>

              {/* Process Button */}
              <button
                onClick={processPDFs}
                disabled={uploadedPDFs.length === 0 || isProcessing}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    Process & Merge PDFs
                  </>
                )}
              </button>
            </div>

            {/* Preview and WhatsApp Section */}
            <div className="space-y-6">
              {/* Preview */}
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h2 className="text-2xl font-semibold text-white mb-4">
                  Preview
                </h2>
                
                {processedPDF ? (
                  <div className="space-y-4">
                    <div className="border border-gray-600 rounded overflow-hidden">
                      <iframe
                        src={processedPDF.url}
                        className="w-full h-80"
                        title="PDF Preview"
                      />
                    </div>
                    <p className="text-green-400 text-sm">
                      ✓ PDF processed successfully: {processedPDF.filename}
                    </p>
                    <button
                      onClick={downloadPDF}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 mt-4"
                    >
                      <FileText className="w-4 h-4" />
                      Download PDF
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Upload PDFs and process to see preview</p>
                  </div>
                )}
              </div>

              {/* WhatsApp Section */}
              {processedPDF && (
                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                  <h2 className="text-2xl font-semibold text-white mb-4">
                    Send via WhatsApp
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-300 mb-2">
                        WhatsApp Number (Indian)
                      </label>
                      <div className="flex">
                        <span className="bg-gray-700 px-3 py-2 border border-gray-600 rounded-l text-gray-300">
                          +91
                        </span>
                        <input
                          type="tel"
                          value={whatsappNumber}
                          onChange={handlePhoneChange}
                          placeholder="Enter 10-digit number"
                          maxLength={10}
                          className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-r focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
                        />
                      </div>
                      {whatsappNumber && whatsappNumber.length === 10 && (
                        <p className="text-green-400 text-sm mt-1">
                          ✓ Valid number: +91{whatsappNumber}
                        </p>
                      )}
                    </div>
                    
                    <button
                      onClick={openWhatsApp}
                      disabled={!whatsappNumber || whatsappNumber.length !== 10}
                      className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                    >
                      <Send className="w-5 h-5" />
                      Open WhatsApp
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Footer */}
          <div className="text-center mt-12 pt-8 border-t border-gray-700">
            <p className="text-gray-400 flex items-center justify-center gap-2">
              Built with <Heart className="w-4 h-4 text-red-500" /> by Harshith J
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;