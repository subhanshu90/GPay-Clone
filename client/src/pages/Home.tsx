import { useState } from "react";
import { 
  Scan, 
  Users, 
  Smartphone, 
  Landmark, 
  AtSign, 
  User, 
  Receipt, 
  Zap, 
  Search, 
  ChevronRight,
  History,
  BarChart3,
  Wallet,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownLeft
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PaymentFlow from "@/components/PaymentFlow";
import QRScanner from "@/components/QRScanner";
import { MOCK_TRANSACTIONS, MOCK_USER, type Transaction } from "@/lib/mockData";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const [activePayment, setActivePayment] = useState<{name: string, upiId: string, avatar?: string} | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);

  const handleScanSuccess = (data: string) => {
    setShowScanner(false);
    // Parse mock QR data
    const params = new URLSearchParams(data.split('?')[1]);
    setActivePayment({
      name: params.get('pn') || "Unknown Merchant",
      upiId: params.get('pa') || "merchant@upi"
    });
  };

  const handleTransactionSuccess = (txn: Transaction) => {
    setTransactions([txn, ...transactions]);
    setTimeout(() => {
      setActivePayment(null);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-white pb-24 font-sans text-[#202124] relative">
      <AnimatePresence>
        {showScanner && (
          <QRScanner 
            onClose={() => setShowScanner(false)} 
            onScan={handleScanSuccess}
          />
        )}
        {activePayment && (
          <PaymentFlow 
            recipient={activePayment} 
            onClose={() => setActivePayment(null)}
            onSuccess={handleTransactionSuccess}
          />
        )}
      </AnimatePresence>

      {/* Background Pattern */}
      <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-[#F5F8FD] to-white z-0 pointer-events-none" />

      {/* Header Section */}
      <div className="sticky top-0 z-40 bg-[#F5F8FD]/95 backdrop-blur-sm transition-all">
        <div className="px-4 py-3 flex items-center gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative shadow-sm rounded-full">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                    <Search size={20} strokeWidth={2.5} />
                </div>
                <input
                    type="text"
                    placeholder="Pay friends and merchants"
                    className="w-full bg-white border border-gray-200/80 rounded-full py-3 pl-12 pr-4 text-[0.95rem] font-medium text-gray-700 placeholder:text-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Profile Avatar */}
            <div className="relative shrink-0">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-medium text-sm cursor-pointer shadow-md ring-2 ring-white">
                    {MOCK_USER.avatar}
                </div>
            </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 pt-2 px-4 space-y-8">
        
        {/* Quick Actions Grid */}
        <div>
          <div className="grid grid-cols-4 gap-y-7 gap-x-2">
            <QuickAction icon={<Scan size={24} />} label="Scan any QR code" onClick={() => setShowScanner(true)} />
            <QuickAction icon={<Users size={24} />} label="Pay contacts" onClick={() => setActivePayment({name: "Select Contact", upiId: "contact@upi"})} />
            <QuickAction icon={<Smartphone size={24} />} label="Pay phone number" />
            <QuickAction icon={<Landmark size={24} />} label="Bank transfer" />
            <QuickAction icon={<AtSign size={24} />} label="Pay UPI ID or number" />
            <QuickAction icon={<User size={24} />} label="Self transfer" />
            <QuickAction icon={<Receipt size={24} />} label="Pay bills" />
            <QuickAction icon={<Zap size={24} />} label="Mobile recharge" />
          </div>
        </div>

        {/* People Section */}
        <div>
          <SectionHeader title="People" />
          <div className="grid grid-cols-4 gap-y-6 gap-x-2">
            <PersonItem 
              name="Rahul" 
              avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul" 
              isRecent 
              onClick={() => setActivePayment({name: "Rahul Sharma", upiId: "rahul@okaxis", avatar: "R"})} 
            />
            <PersonItem 
              name="Priya" 
              avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Priya" 
              isRecent 
              onClick={() => setActivePayment({name: "Priya Singh", upiId: "priya@okhdfcbank", avatar: "P"})}
            />
            <PersonItem name="Amit" avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Amit" isRecent />
            <PersonItem name="Sneha" avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha" isRecent />
            <PersonItem name="Vikram" avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram" />
            <PersonItem name="Anjali" avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Anjali" />
            <PersonItem name="Rohit" avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Rohit" />
            <div className="flex flex-col items-center gap-2 cursor-pointer group">
                <div className="w-[58px] h-[58px] rounded-full flex items-center justify-center bg-white border border-gray-200 shadow-sm group-hover:bg-gray-50 transition-colors text-blue-600">
                    <ChevronRight size={24} />
                </div>
                <span className="text-xs font-medium text-gray-700">More</span>
            </div>
          </div>
        </div>

        {/* Businesses Section */}
        <div>
          <SectionHeader title="Businesses" action="Explore" />
          <div className="grid grid-cols-4 gap-y-6 gap-x-2">
             <BusinessItem name="Jio" icon="J" color="bg-[#0f3cc9]" />
             <BusinessItem name="Zomato" icon="Z" color="bg-[#cb202d]" />
             <BusinessItem name="Swiggy" icon="S" color="bg-[#fc8019]" />
             <BusinessItem name="Uber" icon="U" color="bg-black" />
             <BusinessItem name="Tata Sky" icon="T" color="bg-[#e72c57]" />
             <BusinessItem name="Bescom" icon="B" color="bg-[#2a9134]" />
             <BusinessItem name="Flipkart" icon="F" color="bg-[#2874f0]" />
             <BusinessItem name="More" icon={<ChevronRight size={20} />} isMore />
          </div>
        </div>

        {/* Promotions Section */}
        <div>
           <SectionHeader title="Offers & rewards" />
           <div className="grid grid-cols-4 gap-4">
              <PromotionCard title="Rewards" icon="🎁" />
              <PromotionCard title="Offers" icon="🏷️" />
              <PromotionCard title="Referrals" icon="📣" />
              <PromotionCard title="Indi-Home" icon="🏠" />
           </div>
        </div>

        {/* Transaction History */}
        <div className="pb-4">
           <SectionHeader title="Transaction History" />
           <div className="flex flex-col gap-1">
             {transactions.map((txn) => (
               <TransactionItem key={txn.id} txn={txn} />
             ))}
           </div>
           <button className="w-full py-4 text-blue-600 font-medium text-sm flex items-center justify-center gap-1 hover:bg-gray-50 rounded-xl transition-colors mt-2">
              See all payment activity <ChevronRight size={16} />
           </button>
        </div>

        {/* Footer Actions - Manage Money */}
        <div className="pb-12 border-t border-gray-100 pt-6">
            <h2 className="text-[1rem] font-medium text-[#202124] mb-4 px-1">Manage your money</h2>
            <div className="flex flex-col gap-3">
                <FooterAction icon={<BarChart3 size={22} />} label="Check your CIBIL score" sublabel="Free at no cost" />
                <FooterAction icon={<Landmark size={22} />} label="Check bank balance" />
                <FooterAction icon={<Wallet size={22} />} label="Check wallet balance" />
            </div>
        </div>
        
        {/* Branding Footer */}
        <div className="flex flex-col items-center justify-center pb-24 text-gray-400 gap-2 opacity-60">
            <div className="flex items-center gap-1.5 text-xs font-medium tracking-wide">
                 <span className="text-gray-500 font-bold">Google</span> 
                 <span className="text-gray-400">Payment Partner</span>
            </div>
        </div>

      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-6 z-30">
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={() => setActivePayment({name: "New Payment", upiId: "payee@upi"})}
          className="bg-blue-600 text-white shadow-[0_6px_16px_rgba(26,115,232,0.3)] rounded-full px-6 py-3.5 flex items-center gap-2.5 font-medium hover:bg-blue-700 transition-colors"
        >
          <span className="text-2xl font-light leading-none mb-0.5">+</span> 
          <span className="tracking-wide">New payment</span>
        </motion.button>
      </div>
    </div>
  );
}

// --- Components ---

interface QuickActionProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

function QuickAction({ icon, label, onClick }: QuickActionProps) {
  return (
    <div onClick={onClick} className="flex flex-col items-center gap-2.5 cursor-pointer group">
      <div className="w-12 h-12 rounded-full flex items-center justify-center text-blue-600 mb-1 transition-transform group-active:scale-95">
        {icon}
      </div>
      <span className="text-[0.75rem] text-center text-[#1F1F1F] font-medium leading-tight max-w-[70px] -mt-2">{label}</span>
    </div>
  );
}

interface PersonItemProps {
  name: string;
  avatar: string;
  isRecent?: boolean;
  onClick?: () => void;
}

function PersonItem({ name, avatar, isRecent, onClick }: PersonItemProps) {
  return (
    <div onClick={onClick} className="flex flex-col items-center gap-2 cursor-pointer group">
      <div className="relative">
        <div className="w-[58px] h-[58px] rounded-full overflow-hidden border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.08)] group-hover:shadow-md transition-all">
            <img src={avatar} alt={name} className="w-full h-full object-cover" />
        </div>
        {isRecent && (
             <div className="absolute -bottom-0.5 -right-0.5 bg-white rounded-full p-[2px]">
               <div className="bg-green-500 w-2.5 h-2.5 rounded-full border-[1.5px] border-white"></div>
            </div>
        )}
      </div>
      <span className="text-[0.8rem] text-[#1F1F1F] font-medium truncate w-full text-center mt-0.5">{name}</span>
    </div>
  );
}

interface BusinessItemProps {
  name: string;
  icon: React.ReactNode;
  color?: string;
  isMore?: boolean;
}

function BusinessItem({ name, icon, color, isMore }: BusinessItemProps) {
    return (
      <div className="flex flex-col items-center gap-2 cursor-pointer group">
        <div className={`w-[58px] h-[58px] rounded-full flex items-center justify-center text-white text-xl font-bold shadow-[0_1px_3px_rgba(0,0,0,0.08)] group-hover:shadow-md transition-all ${isMore ? 'bg-white border border-gray-200 text-blue-600' : color}`}>
          {icon}
        </div>
        <span className="text-[0.8rem] text-[#1F1F1F] font-medium truncate max-w-[64px] text-center mt-0.5">{name}</span>
      </div>
    );
}

interface PromotionCardProps {
  title: string;
  icon: string;
}

function PromotionCard({ title, icon }: PromotionCardProps) {
    return (
        <div className="flex flex-col items-center gap-2 cursor-pointer group">
            <div className="w-full aspect-square rounded-[1.2rem] bg-gradient-to-br from-[#E8F0FE] to-[#F8F9FA] flex flex-col items-center justify-center border border-blue-50/50 shadow-sm group-hover:shadow-md transition-all">
                <span className="text-3xl filter drop-shadow-sm">{icon}</span>
            </div>
            <span className="text-[0.75rem] font-medium text-[#1F1F1F]">{title}</span>
        </div>
    )
}

interface FooterActionProps {
  icon: React.ReactNode;
  label: string;
  sublabel?: string;
}

function FooterAction({ icon, label, sublabel }: FooterActionProps) {
    return (
        <div className="flex items-center gap-4 py-3 px-1 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors group">
            <div className="text-blue-600 bg-blue-50 p-2.5 rounded-full group-hover:bg-blue-100 transition-colors">
                {icon}
            </div>
            <div className="flex-1">
                <div className="text-[0.95rem] font-medium text-[#1F1F1F]">{label}</div>
                {sublabel && <div className="text-xs text-green-600 mt-0.5 font-medium">{sublabel}</div>}
            </div>
            <ChevronRight size={20} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
        </div>
    )
}

function SectionHeader({ title, action }: { title: string, action?: string }) {
    return (
        <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="text-[1rem] font-medium text-[#202124]">{title}</h2>
            {action && (
                <button className="px-4 py-1.5 bg-[#E8F0FE] text-[#1967D2] text-[0.75rem] font-semibold rounded-full hover:bg-blue-100 transition-colors">
                    {action}
                </button>
            )}
        </div>
    )
}

function TransactionItem({ txn }: { txn: Transaction }) {
  const isReceived = txn.type === 'received';
  const date = new Date(txn.date);
  
  return (
    <div className="flex items-center gap-4 py-3 px-2 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
       <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold shrink-0 ${isReceived ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>
         {txn.recipient[0]}
       </div>
       <div className="flex-1 min-w-0">
          <h3 className="font-medium text-[0.95rem] text-[#1F1F1F] truncate">{txn.recipient}</h3>
          <p className="text-xs text-gray-500 truncate mt-0.5">
            {date.toLocaleDateString('en-IN', {day: 'numeric', month: 'long'})} • {date.toLocaleTimeString('en-IN', {hour: '2-digit', minute:'2-digit'})}
          </p>
       </div>
       <div className="text-right">
          <p className={`font-semibold text-[0.95rem] ${isReceived ? 'text-green-600' : 'text-[#1F1F1F]'}`}>
            {isReceived ? '+' : '-'} ₹{txn.amount}
          </p>
          {txn.status === 'success' && (
             <div className="flex items-center justify-end gap-1 mt-0.5">
                <CheckCircle2 size={12} className="text-green-600 fill-green-100" />
                <span className="text-[0.65rem] font-medium text-gray-500">Paid</span>
             </div>
          )}
       </div>
    </div>
  )
}
