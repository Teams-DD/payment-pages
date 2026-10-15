import { useState, useEffect } from 'react';
import { CreditCard, Smartphone, Bitcoin, Lock, ShieldCheck, Copy, CheckCircle2, ChevronRight, QrCode, X, ImagePlus } from 'lucide-react';

type PaymentMethod = 'card' | 'mobile' | 'crypto';

type Provider = {
  id: string;
  name: string;
  type: 'mobile' | 'crypto';
  color: string;
  symbol: string;
  merchantNumber?: string;
};

const mobileProviders: Provider[] = [
  { id: 'bkash', name: 'bKash', type: 'mobile', color: 'bg-[#e2136e]', symbol: 'b', merchantNumber: '01712345678' },
  { id: 'nagad', name: 'Nagad', type: 'mobile', color: 'bg-[#ed1c24]', symbol: 'N', merchantNumber: '01812345678' },
  { id: 'rocket', name: 'Rocket', type: 'mobile', color: 'bg-[#8c1596]', symbol: 'R', merchantNumber: '01912345678' },
  { id: 'upay', name: 'Upay', type: 'mobile', color: 'bg-[#00529b]', symbol: 'U', merchantNumber: '01412345678' },
];

const cryptoProviders: Provider[] = [
  { id: 'usdt', name: 'USDT', type: 'crypto', color: 'bg-[#26a17b]', symbol: '₮' },
  { id: 'btc', name: 'Bitcoin', type: 'crypto', color: 'bg-[#f7931a]', symbol: '₿' },
  { id: 'eth', name: 'Ethereum', type: 'crypto', color: 'bg-[#627eea]', symbol: 'Ξ' },
  { id: 'bnb', name: 'BNB', type: 'crypto', color: 'bg-[#f3ba2f]', symbol: 'B' },
];

export default function Checkout() {
  const [method, setMethod] = useState<PaymentMethod>('card');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  
  // Manual Payment State
  const [trxId, setTrxId] = useState('');
  const [screenshot, setScreenshot] = useState<File | null>(null);

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (selectedProvider) {
      document.body.style.overflow = 'hidden';
      // Reset state when opening modal
      setTrxId('');
      setScreenshot(null);
      setCopiedField(null);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedProvider]);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setScreenshot(e.target.files[0]);
    }
  };

  const renderProviderGrid = (providers: Provider[]) => (
    <div className="grid grid-cols-2 gap-2.5 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {providers.map((provider) => (
        <button
          key={provider.id}
          onClick={() => setSelectedProvider(provider)}
          className="group relative flex flex-col items-center justify-center p-3.5 rounded-xl border border-gray-200 bg-white hover:border-gray-300 transition-all hover:shadow-sm cursor-pointer"
        >
          <div className={`w-10 h-10 rounded-full ${provider.color} text-white flex items-center justify-center font-bold text-lg mb-2 group-hover:scale-110 transition-transform shadow-sm`}>
            {provider.symbol}
          </div>
          <span className="text-[13px] font-semibold text-gray-800">{provider.name}</span>
        </button>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans text-gray-900">
      <div className="w-full max-w-[360px] bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden relative">
        
        {/* Header / Order Summary */}
        <div className="bg-gray-50/50 p-5 border-b border-gray-100 flex flex-col items-center text-center">
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-3 ring-4 ring-white shadow-sm">
            <Lock className="w-4 h-4" />
          </div>
          <h2 className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-1">Total Amount</h2>
          <div className="text-2xl font-bold tracking-tight text-gray-900">$299.00</div>
          <p className="text-[13px] text-gray-500 mt-1 font-medium">Nike Air Max 2024</p>
        </div>

        {/* Payment Methods Tabs */}
        <div className="flex border-b border-gray-100 relative bg-gray-50/30">
          <button
            onClick={() => setMethod('card')}
            className={`flex-1 py-3 text-[13px] font-semibold flex items-center justify-center gap-1.5 transition-colors
              ${method === 'card' ? 'text-blue-600 border-b-2 border-blue-600 bg-white' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            Card
          </button>
          <button
            onClick={() => setMethod('mobile')}
            className={`flex-1 py-3 text-[13px] font-semibold flex items-center justify-center gap-1.5 transition-colors
              ${method === 'mobile' ? 'text-blue-600 border-b-2 border-blue-600 bg-white' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            Mobile
          </button>
          <button
            onClick={() => setMethod('crypto')}
            className={`flex-1 py-3 text-[13px] font-semibold flex items-center justify-center gap-1.5 transition-colors
              ${method === 'crypto' ? 'text-blue-600 border-b-2 border-blue-600 bg-white' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
          >
            <Bitcoin className="w-3.5 h-3.5" />
            Crypto
          </button>
        </div>

        {/* Content Area */}
        <div className="p-5 min-h-[260px]">
          {method === 'card' && (
            <div className="space-y-3.5 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-700">Card Number</label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="0000 0000 0000 0000" 
                    className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all font-mono"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-700">Expiry Date</label>
                  <input 
                    type="text" 
                    placeholder="MM/YY" 
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-700">CVC</label>
                  <input 
                    type="text" 
                    placeholder="123" 
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-700">Cardholder Name</label>
                <input 
                  type="text" 
                  placeholder="John Doe" 
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all"
                />
              </div>

              <button className="w-full mt-5 bg-gray-900 hover:bg-gray-800 text-white font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors focus:outline-none focus:ring-4 focus:ring-gray-900/20 shadow-sm text-[13px]">
                Pay $299.00
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {method === 'mobile' && (
            <div className="space-y-1">
              <h3 className="text-xs font-medium text-gray-500 mb-2.5">Select a provider to continue</h3>
              {renderProviderGrid(mobileProviders)}
            </div>
          )}

          {method === 'crypto' && (
            <div className="space-y-1">
              <h3 className="text-xs font-medium text-gray-500 mb-2.5">Select network to generate QR</h3>
              {renderProviderGrid(cryptoProviders)}
            </div>
          )}
        </div>
        
        {/* Footer info */}
        <div className="px-5 py-3.5 bg-gray-50/80 border-t border-gray-100 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span className="text-[11px] text-gray-500 font-semibold tracking-wide uppercase">Secured by 256-bit SSL</span>
        </div>
      </div>

      {/* Payment Modal */}
      {selectedProvider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-[340px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-100 max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className={`${selectedProvider.color} p-4 flex items-center justify-between text-white relative overflow-hidden shrink-0`}>
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-10 -mt-10 blur-xl"></div>
              <div className="flex items-center gap-2.5 relative z-10">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-lg shadow-inner border border-white/10">
                  {selectedProvider.symbol}
                </div>
                <h3 className="font-semibold text-[15px] tracking-tight">Manual {selectedProvider.name} Payment</h3>
              </div>
              <button 
                onClick={() => setSelectedProvider(null)} 
                className="relative z-10 text-white/70 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-4 overflow-y-auto custom-scrollbar">
              {selectedProvider.type === 'mobile' ? (
                <div className="space-y-4">
                  
                  {/* Step 1: Payment Details */}
                  <div className="bg-gray-50 rounded-xl p-2.5 border border-gray-100 space-y-2.5">
                    <div className="flex items-center gap-1.5">
                      <span className="w-3.5 h-3.5 rounded-full bg-gray-200 text-gray-600 text-[9px] font-bold flex items-center justify-center">1</span>
                      <h4 className="text-[12px] font-semibold text-gray-700">Send Payment To</h4>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="space-y-1">
                        <label className="text-[10px] font-medium text-gray-500">Merchant Account (Personal)</label>
                        <div className="flex gap-1.5">
                          <input 
                            type="text" 
                            readOnly
                            value={selectedProvider.merchantNumber} 
                            className="flex-1 px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-[12px] text-gray-800 font-mono outline-none shadow-sm"
                          />
                          <button 
                            onClick={() => handleCopy(selectedProvider.merchantNumber || '', 'phone')}
                            className="px-2.5 py-1.5 bg-white hover:bg-gray-50 text-gray-700 rounded-lg transition-colors border border-gray-200 shadow-sm"
                            title="Copy Number"
                          >
                            {copiedField === 'phone' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-medium text-gray-500">Amount to Send</label>
                        <div className="flex gap-1.5">
                          <input 
                            type="text" 
                            readOnly
                            value="299.00" 
                            className="flex-1 px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-[12px] text-gray-800 font-mono outline-none shadow-sm"
                          />
                          <button 
                            onClick={() => handleCopy('299.00', 'amount')}
                            className="px-2.5 py-1.5 bg-white hover:bg-gray-50 text-gray-700 rounded-lg transition-colors border border-gray-200 shadow-sm"
                            title="Copy Amount"
                          >
                            {copiedField === 'amount' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Step 2: Verification Details */}
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-1.5">
                      <span className="w-3.5 h-3.5 rounded-full bg-gray-200 text-gray-600 text-[9px] font-bold flex items-center justify-center">2</span>
                      <h4 className="text-[12px] font-semibold text-gray-700">Verify Transaction</h4>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-medium text-gray-700">Transaction ID (TrxID)</label>
                      <input 
                        type="text" 
                        value={trxId}
                        onChange={(e) => setTrxId(e.target.value)}
                        placeholder="e.g. 9B8A7C6D5E" 
                        className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all font-mono uppercase placeholder:normal-case" 
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-medium text-gray-700">Screenshot (Optional)</label>
                      <div className="flex gap-1.5">
                        <label className="flex-1 flex items-center justify-center gap-1.5 px-2.5 py-1.5 bg-gray-50 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors group">
                          <ImagePlus className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600 shrink-0" />
                          <span className="text-[11px] text-gray-500 font-medium group-hover:text-gray-700 truncate max-w-[150px]">
                            {screenshot ? screenshot.name : 'Upload file'}
                          </span>
                          <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                        </label>
                        {screenshot && (
                          <button 
                            onClick={() => setScreenshot(null)}
                            className="px-2 py-1.5 text-gray-400 hover:text-red-500 transition-colors bg-gray-50 rounded-lg border border-gray-200 shrink-0 flex items-center justify-center shadow-sm hover:border-red-200 hover:bg-red-50"
                            title="Remove"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => setSelectedProvider(null)}
                    className={`w-full ${selectedProvider.color} hover:opacity-90 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-[0.98] mt-1 text-[12px]`}
                  >
                    Submit Verification
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="text-center mb-1">
                    <p className="text-[10px] text-gray-500 font-medium">Send exactly</p>
                    <p className="text-lg font-bold text-gray-900">299.00 {selectedProvider.name}</p>
                  </div>

                  <div className="flex justify-center mb-2">
                    <div className="w-28 h-28 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center p-2.5">
                      <QrCode className="w-full h-full text-gray-800" strokeWidth={1.5} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-medium text-gray-700">Wallet Address</label>
                    <div className="flex gap-1.5">
                      <input 
                        type="text" 
                        readOnly
                        value="0x1234567890abcdef1234567890abc" 
                        className="flex-1 px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-[12px] text-gray-600 font-mono outline-none"
                      />
                      <button 
                        onClick={() => handleCopy('0x1234567890abcdef1234567890abc', 'cryptoWallet')}
                        className="px-2.5 py-1.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-colors flex items-center justify-center shrink-0 shadow-sm"
                        title="Copy Address"
                      >
                        {copiedField === 'cryptoWallet' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <button 
                    onClick={() => setSelectedProvider(null)}
                    className="w-full mt-2 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-2 px-4 rounded-lg transition-colors active:scale-[0.98] text-[12px]"
                  >
                    I have completed the transfer
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
