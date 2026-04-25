import React, { useState, useRef, useEffect } from 'react';
import { FileText, Download, Plus, Trash2, Printer, Calculator, Building2, MapPin, Phone } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { AppSettings } from '../types';

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

interface Props {
  settings?: AppSettings | null;
}

export const InvoiceGeneratorPanel: React.FC<Props> = ({ settings }) => {
  const [invoiceNumber, setInvoiceNumber] = useState(`INV-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-001`);
  const [date, setTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [clientName, setClientName] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  
  // Clinic Info (Editable)
  const [clinicName, setClinicName] = useState(settings?.clinicName || 'TCM PRO');
  const [clinicAddress, setClinicAddress] = useState(settings?.clinicAddress || 'Jl. Kesehatan No. 123, Jakarta');
  const [clinicPhone, setClinicPhone] = useState(settings?.clinicPhone || '+62 812 3456 7890');

  useEffect(() => {
    if (settings) {
      if (settings.clinicName) setClinicName(settings.clinicName);
      if (settings.clinicAddress) setClinicAddress(settings.clinicAddress);
      if (settings.clinicPhone) setClinicPhone(settings.clinicPhone);
    }
  }, [settings]);

  const [items, setItems] = useState<InvoiceItem[]>([
    { id: Date.now().toString(), description: 'TCM Consultation & Treatment', quantity: 1, unitPrice: 0 }
  ]);
  const [notes, setCatatan] = useState('Thank you for your business!');
  const [isGenerating, setIsGenerating] = useState(false);

  const invoiceRef = useRef<HTMLDivElement>(null);

  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), description: '', quantity: 1, unitPrice: 0 }]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  const calculateSubTotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);
  };

  const handleDownloadPDF = async () => {
    if (!invoiceRef.current) return;
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(invoiceRef.current, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${invoiceNumber}_${clientName.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadTXT = () => {
    let txtContent = `==================================================\n`;
    txtContent += `                    INVOICE\n`;
    txtContent += `==================================================\n\n`;
    txtContent += `Clinic     : ${clinicName}\n`;
    txtContent += `Address    : ${clinicAddress}\n`;
    txtContent += `Phone      : ${clinicPhone}\n`;
    txtContent += `\n--------------------------------------------------\n`;
    txtContent += `Invoice No : ${invoiceNumber}\n`;
    txtContent += `Tanggal       : ${date}\n`;
    txtContent += `Client     : ${clientName}\n`;
    if (clientAddress) txtContent += `Address    : ${clientAddress}\n`;
    txtContent += `\n--------------------------------------------------\n`;
    txtContent += `Description                          Qty    Price       Total\n`;
    txtContent += `--------------------------------------------------\n`;
    
    items.forEach(item => {
      const desc = item.description.padEnd(35, ' ').substring(0, 35);
      const qty = item.quantity.toString().padStart(3, ' ');
      const price = item.unitPrice.toString().padStart(10, ' ');
      const Total = (item.quantity * item.unitPrice).toString().padStart(10, ' ');
      txtContent += `${desc} ${qty} ${price} ${Total}\n`;
    });
    
    txtContent += `--------------------------------------------------\n`;
    txtContent += `Total Amount: ${formatCurrency(calculateSubTotal())}\n\n`;
    if (notes) txtContent += `Catatan:\n${notes}\n`;
    txtContent += `==================================================\n`;

    const blob = new Blob([txtContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${invoiceNumber}_${clientName.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full flex flex-col md:flex-row bg-purple-50 overflow-hidden animate-fade-in font-sans">
      {/* Input Form Panel */}
      <div className="w-full md:w-1/2 lg:w-5/12 border-r border-purple-200 bg-white flex flex-col h-full z-10 shadow-lg">
        <div className="p-6 border-b border-purple-100 bg-purple-50/50">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-2xl border border-purple-200">
              <Calculator className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-black text-purple-900 tracking-tighter uppercase">Invoice Generator</h2>
              <p className="text-xs text-purple-500 font-bold tracking-widest uppercase">Create & Export Billing</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Clinic Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-black text-purple-800 uppercase tracking-widest border-b border-purple-100 pb-2 flex items-center gap-2">
              <Building2 className="w-4 h-4" /> Clinic Information
            </h3>
            <div>
              <label className="block text-xs font-bold text-purple-600 uppercase tracking-wider mb-1">Clinic Name</label>
              <input 
                type="text" 
                value={clinicName} 
                onChange={e => setClinicName(e.target.value)}
                className="w-full bg-purple-50 border border-purple-200 rounded-xl px-3 py-2 text-sm text-purple-900 focus:border-purple-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-purple-600 uppercase tracking-wider mb-1">Clinic Address</label>
              <input 
                type="text" 
                value={clinicAddress} 
                onChange={e => setClinicAddress(e.target.value)}
                className="w-full bg-purple-50 border border-purple-200 rounded-xl px-3 py-2 text-sm text-purple-900 focus:border-purple-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-purple-600 uppercase tracking-wider mb-1">Clinic Phone</label>
              <input 
                type="text" 
                value={clinicPhone} 
                onChange={e => setClinicPhone(e.target.value)}
                className="w-full bg-purple-50 border border-purple-200 rounded-xl px-3 py-2 text-sm text-purple-900 focus:border-purple-400 outline-none"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-black text-purple-800 uppercase tracking-widest border-b border-purple-100 pb-2">Invoice Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-purple-600 uppercase tracking-wider mb-1">Invoice Number</label>
                <input 
                  type="text" 
                  value={invoiceNumber} 
                  onChange={e => setInvoiceNumber(e.target.value)}
                  className="w-full bg-purple-50 border border-purple-200 rounded-xl px-3 py-2 text-sm text-purple-900 focus:border-purple-400 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-purple-600 uppercase tracking-wider mb-1">Tanggal</label>
                <input 
                  type="date" 
                  value={date} 
                  onChange={e => setTanggal(e.target.value)}
                  className="w-full bg-purple-50 border border-purple-200 rounded-xl px-3 py-2 text-sm text-purple-900 focus:border-purple-400 outline-none"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-purple-600 uppercase tracking-wider mb-1">Client Name</label>
              <input 
                type="text" 
                value={clientName} 
                onChange={e => setClientName(e.target.value)}
                placeholder="Patient or Company Name"
                className="w-full bg-purple-50 border border-purple-200 rounded-xl px-3 py-2 text-sm text-purple-900 focus:border-purple-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-purple-600 uppercase tracking-wider mb-1">Client Address</label>
              <textarea 
                value={clientAddress} 
                onChange={e => setClientAddress(e.target.value)}
                placeholder="Optional address"
                rows={2}
                className="w-full bg-purple-50 border border-purple-200 rounded-xl px-3 py-2 text-sm text-purple-900 focus:border-purple-400 outline-none resize-none"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-purple-100 pb-2">
              <h3 className="text-sm font-black text-purple-800 uppercase tracking-widest">Line Items</h3>
              <button 
                onClick={addItem}
                className="text-xs font-bold text-purple-600 bg-purple-100 hover:bg-purple-200 px-3 py-1 rounded-lg transition-colors flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Add Item
              </button>
            </div>
            
            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={item.id} className="bg-white border border-purple-200 p-4 rounded-2xl shadow-sm relative group">
                  <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => removeItem(item.id)}
                      disabled={items.length === 1}
                      className="bg-red-100 text-red-600 p-1.5 rounded-full hover:bg-red-200 disabled:opacity-50"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-bold text-purple-500 uppercase tracking-wider mb-1">Description</label>
                      <input 
                        type="text" 
                        value={item.description} 
                        onChange={e => updateItem(item.id, 'description', e.target.value)}
                        placeholder="Item description"
                        className="w-full bg-purple-50 border border-purple-100 rounded-lg px-3 py-1.5 text-sm text-purple-900 focus:border-purple-400 outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-purple-500 uppercase tracking-wider mb-1">Quantity</label>
                        <input 
                          type="number" 
                          min="1"
                          value={item.quantity} 
                          onChange={e => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                          className="w-full bg-purple-50 border border-purple-100 rounded-lg px-3 py-1.5 text-sm text-purple-900 focus:border-purple-400 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-purple-500 uppercase tracking-wider mb-1">Unit Price (IDR)</label>
                        <input 
                          type="number" 
                          min="0"
                          value={item.unitPrice} 
                          onChange={e => updateItem(item.id, 'unitPrice', parseInt(e.target.value) || 0)}
                          className="w-full bg-purple-50 border border-purple-100 rounded-lg px-3 py-1.5 text-sm text-purple-900 focus:border-purple-400 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-black text-purple-800 uppercase tracking-widest border-b border-purple-100 pb-2">Additional Catatan</h3>
            <textarea 
              value={notes} 
              onChange={e => setCatatan(e.target.value)}
              placeholder="Thank you for your business!"
              rows={3}
              className="w-full bg-purple-50 border border-purple-200 rounded-xl px-3 py-2 text-sm text-purple-900 focus:border-purple-400 outline-none resize-none"
            />
          </div>
        </div>

        <div className="p-6 border-t border-purple-100 bg-white">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-bold text-purple-600 uppercase tracking-widest">Total Amount</span>
            <span className="text-xl font-black text-purple-900">{formatCurrency(calculateSubTotal())}</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={handleDownloadTXT}
              className="py-3 bg-purple-100 text-purple-700 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-purple-200 transition-colors flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4" /> TXT
            </button>
            <button 
              onClick={handleDownloadPDF}
              disabled={isGenerating}
              className="py-3 bg-purple-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-purple-900/20 disabled:opacity-70"
            >
              {isGenerating ? <span className="animate-pulse">Generating...</span> : <><Download className="w-4 h-4" /> PDF</>}
            </button>
          </div>
        </div>
      </div>

      {/* Preview Panel */}
      <div className="w-full md:w-1/2 lg:w-7/12 bg-purple-100/50 p-4 md:p-8 overflow-y-auto flex justify-center items-start">
        <div 
          ref={invoiceRef}
          className="bg-white w-full max-w-2xl p-8 md:p-12 shadow-xl rounded-sm print:shadow-none print:p-0"
          style={{ minHeight: '297mm' }} // A4 proportion
        >
          {/* Invoice Header */}
          <div className="flex justify-between items-start border-b-2 border-purple-900 pb-6 mb-8">
            <div>
              <h1 className="text-4xl font-black text-purple-900 tracking-tighter uppercase mb-2">INVOICE</h1>
              <p className="text-sm text-purple-600 font-medium">No: {invoiceNumber}</p>
              <p className="text-sm text-purple-600 font-medium">Tanggal: {new Date(date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center justify-end gap-2 mb-2">
                <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-black text-xl">{clinicName.charAt(0)}</span>
                </div>
                <h2 className="text-xl font-black text-purple-900 tracking-tighter">{clinicName}</h2>
              </div>
              <p className="text-xs text-purple-500">Traditional Chinese Medicine Clinic</p>
              <p className="text-xs text-purple-500">{clinicAddress}</p>
              <p className="text-xs text-purple-500">Tel: {clinicPhone}</p>
            </div>
          </div>

          {/* Bill To */}
          <div className="mb-10">
            <h3 className="text-xs font-black text-purple-400 uppercase tracking-widest mb-2">Billed To</h3>
            <p className="text-lg font-bold text-purple-900">{clientName || 'Client Name'}</p>
            {clientAddress && <p className="text-sm text-purple-700 whitespace-pre-wrap mt-1">{clientAddress}</p>}
          </div>

          {/* Items Table */}
          <table className="w-full mb-10">
            <thead>
              <tr className="border-b-2 border-purple-200">
                <th className="text-left py-3 text-xs font-black text-purple-500 uppercase tracking-widest w-1/2">Description</th>
                <th className="text-center py-3 text-xs font-black text-purple-500 uppercase tracking-widest">Qty</th>
                <th className="text-right py-3 text-xs font-black text-purple-500 uppercase tracking-widest">Unit Price</th>
                <th className="text-right py-3 text-xs font-black text-purple-500 uppercase tracking-widest">Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={item.id} className={idx !== items.length - 1 ? "border-b border-purple-100" : ""}>
                  <td className="py-4 text-sm text-purple-900 font-medium">{item.description || '-'}</td>
                  <td className="py-4 text-sm text-purple-700 text-center">{item.quantity}</td>
                  <td className="py-4 text-sm text-purple-700 text-right">{formatCurrency(item.unitPrice)}</td>
                  <td className="py-4 text-sm text-purple-900 font-bold text-right">{formatCurrency(item.quantity * item.unitPrice)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Total */}
          <div className="flex justify-end mb-12">
            <div className="w-1/2 bg-purple-50 p-6 rounded-2xl border border-purple-100">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-purple-600 font-bold">SubTotal</span>
                <span className="text-sm text-purple-900 font-bold">{formatCurrency(calculateSubTotal())}</span>
              </div>
              <div className="flex justify-between items-center border-t border-purple-200 pt-3 mt-3">
                <span className="text-base font-black text-purple-900 uppercase tracking-widest">Total Due</span>
                <span className="text-xl font-black text-purple-600">{formatCurrency(calculateSubTotal())}</span>
              </div>
            </div>
          </div>

          {/* Catatan */}
          {notes && (
            <div className="border-t border-purple-100 pt-6">
              <h3 className="text-xs font-black text-purple-400 uppercase tracking-widest mb-2">Catatan</h3>
              <p className="text-sm text-purple-700 whitespace-pre-wrap">{notes}</p>
            </div>
          )}
          
          <div className="mt-16 text-center text-[10px] text-purple-400 font-bold uppercase tracking-widest">
            Generated by {clinicName} System
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceGeneratorPanel;
