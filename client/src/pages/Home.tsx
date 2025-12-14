import { useState } from "react";
import { useLocation } from "wouter";
import {
  Scan,
  Users,
  Smartphone,
  Landmark,
  Search,
  Home as HomeIcon,
  CircleDollarSign,
  UserCircle2,
  Repeat,
  Lightbulb,
  Zap,
  Plus,
  User,
  CreditCard,
  Tv,
  Car,
  FileText,
  Coins,
  Gauge,
  History,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PaymentFlow from "@/components/PaymentFlow";
import QRScanner from "@/components/QRScanner";
import PayBySearch from "@/components/PayBySearch";
import TransactionHistory from "@/components/TransactionHistory";
import TransactionDetail from "@/components/TransactionDetail";
import { MOCK_TRANSACTIONS, MOCK_USER, type Transaction } from "@/lib/mockData";

import { useTransactions } from "@/context/TransactionContext";

export default function Home() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const [showPayBySearch, setShowPayBySearch] = useState(false);
  const [activePayment, setActivePayment] = useState<{ name: string, upiId: string, avatar?: string } | null>(null);

  // Use global transaction state
  const { transactions, addTransaction } = useTransactions();

  const [showHistory, setShowHistory] = useState(false);
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);

  const handleScanSuccess = (data: string) => {
    setShowScanner(false);
    // Parse UPI QR data
    const params = new URLSearchParams(data.split('?')[1]);
    setActivePayment({
      name: params.get('pn') || "Unknown Merchant",
      upiId: params.get('pa') || "merchant@upi"
    });
  };

  const handleTransactionSuccess = (txn: Transaction) => {
    addTransaction(txn);
    setTimeout(() => {
      setActivePayment(null);
    }, 2000);
  };

  // ... existing code ...



  return (
    <div className="min-h-screen bg-background pb-24 font-sans text-foreground relative">
      <AnimatePresence>
        {showScanner && (
          <QRScanner
            onClose={() => setShowScanner(false)}
            onScan={handleScanSuccess}
          />
        )}
        {showPayBySearch && (
          <PayBySearch
            onClose={() => setShowPayBySearch(false)}
            onSelectRecipient={(contact) => {
              setShowPayBySearch(false);
              setActivePayment({
                name: contact.name,
                upiId: contact.upiId,
                avatar: contact.avatar || contact.name[0]
              });
            }}
          />
        )}
        {activePayment && (
          <PaymentFlow
            recipient={activePayment}
            onClose={() => setActivePayment(null)}
            onSuccess={handleTransactionSuccess}
          />
        )}
        {showHistory && (
          <TransactionHistory
            transactions={transactions}
            onClose={() => setShowHistory(false)}
          />
        )}
        {selectedTxn && (
          <TransactionDetail
            txn={selectedTxn}
            onClose={() => setSelectedTxn(null)}
          />
        )}
      </AnimatePresence>

      {/* Header Section */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm px-4 pt-3 pb-2">
        <div className="flex items-center gap-3">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="Pay anyone on UPI"
              className="w-full bg-card border border-border rounded-full py-2.5 pl-11 pr-4 text-sm font-normal text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gray-700 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Profile Icon */}
          <div className="flex-shrink-0">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold text-sm cursor-pointer border border-border">
              {MOCK_USER.avatar}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 pt-4 space-y-6">

        {/* Promotional Banner */}
        <motion.div
          whileTap={{ scale: 0.98 }}
          className="bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 rounded-2xl p-5 relative overflow-hidden cursor-pointer shadow-lg"
        >
          <div className="relative z-10">
            <h3 className="text-lg font-semibold text-white mb-1">Easy EMIs from</h3>
            <h2 className="text-2xl font-bold text-white mb-3">₹2,000 per month</h2>
            <button className="bg-white/20 hover:bg-white/30 text-white px-5 py-2 rounded-full text-sm font-medium backdrop-blur-sm flex items-center gap-2 transition-all">
              Apply now
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          {/* Decorative elements */}
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-yellow-400/20 rounded-full blur-2xl" />
          <div className="absolute -right-4 bottom-0 text-6xl opacity-30">💰</div>
        </motion.div>

        {/* Main Actions */}
        <div>
          <div className="grid grid-cols-4 gap-4">
            <ActionButton
              icon={<Scan size={24} />}
              label="Scan any QR code"
              onClick={() => setShowScanner(true)}
            />
            <ActionButton
              icon={<Users size={24} />}
              label="Pay anyone"
              onClick={() => setShowPayBySearch(true)}
            />
            <ActionButton
              icon={<Landmark size={24} />}
              label="Bank transfer"
            />
            <ActionButton
              icon={<Smartphone size={24} />}
              label="Mobile recharge"
            />
          </div>
        </div>

        {/* UPI Info Bar */}
        <div className="flex items-center justify-between px-2 py-1.5 text-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center">
              <Zap size={12} className="text-blue-500" />
            </div>
            <span>Tap & Pay</span>
          </div>
          <div className="text-muted-foreground">
            <span>UPI Lite: ₹{(Math.random() * 100).toFixed(2)}</span>
          </div>
          <div className="text-muted-foreground">
            <span className="truncate max-w-32">UPI ID: {MOCK_USER.upiId}</span>
          </div>
        </div>

        {/* People Section */}
        <div>
          <h2 className="text-base font-semibold text-foreground mb-4 px-1">People</h2>
          <div className="grid grid-cols-4 gap-y-5 gap-x-2">
            <PersonItem
              name="Luke Skywalker"
              avatar="L"
              color="bg-blue-600"
              onClick={() => setActivePayment({ name: "Luke Skywalker", upiId: "luke@jedi", avatar: "L" })}
            />
            <PersonItem
              name="Princess Leia"
              avatar="L"
              color="bg-purple-600"
              onClick={() => setActivePayment({ name: "Princess Leia", upiId: "leia@rebellion", avatar: "L" })}
            />
            <PersonItem
              name="Han Solo"
              avatar="H"
              color="bg-orange-600"
            />
            <PersonItem
              name="Rebels Group"
              avatar="R"
              color="bg-secondary"
              textColor="text-foreground"
              isGroup
            />
            <PersonItem
              name="Self transfer"
              avatar={<User size={24} />}
              color="bg-secondary"
              textColor="text-blue-600"
            />
            <PersonItem
              name="Yoda"
              avatar="Y"
              color="bg-green-700"
              hasNotification
            />
            <PersonItem
              name="Obi-Wan K..."
              avatar="O"
              color="bg-teal-600"
              hasNotification
            />
            <MoreButton label="More" />
          </div>
        </div>

        {/* Bills & Recharges */}
        <div>
          <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="text-base font-semibold text-foreground">Bills & recharges</h2>
            <button className="text-blue-400 text-xs font-medium border border-border hover:bg-secondary/50 bg-card rounded-full px-3 py-1 transition-colors">
              Manage
            </button>
          </div>
          {/* Recent Bills Row */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <BillItem name="HDFC Bank Credit Card" icon={<CreditCard size={20} />} color="bg-red-600" status="Overdue" />
            <BillItem name="BESCOM" icon={<Zap size={20} />} color="bg-blue-500" />
            <BillItem name="Jio Prepaid" icon="Jio" color="bg-blue-600" />
            <BillItem name="Airtel Prepaid" icon="Airtel" color="bg-red-500" />
          </div>
          {/* Categories Grid */}
          <div className="grid grid-cols-4 gap-4">
            <ActionButton icon={<Smartphone size={24} />} label="Mobile recharge" />
            <ActionButton icon={<Tv size={24} />} label="DTH / Cable TV" />
            <ActionButton icon={<Lightbulb size={24} />} label="Electricity" />
            <ActionButton icon={<Car size={24} />} label="FASTag recharge" />
          </div>
        </div>

        {/* Businesses */}
        <div>
          <h2 className="text-base font-semibold text-foreground mb-4 px-1">Businesses</h2>
          <div className="grid grid-cols-4 gap-4">
            <PersonItem name="Dex's Diner" avatar="D" color="bg-orange-500" />
            <PersonItem name="Watto's Junk" avatar="W" color="bg-blue-600" />
            <PersonItem name="Imperial Cargo" avatar="I" color="bg-red-700" />
            <MoreButton label="More" />
          </div>
        </div>

        {/* Manage your money */}
        <div>
          <h2 className="text-xl font-normal text-foreground mb-6 px-1">Manage your money</h2>
          {/* Cards */}
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide mb-2">
            <MoneyCard
              icon={<FileText size={20} className="text-blue-400" />}
              title="Personal loan"
              subtitle="Up to ₹10 lakh, instant approval"
              action="Apply now"
            />
            <MoneyCard
              icon={<Coins size={20} className="text-yellow-400" />}
              title="Gold loan"
              subtitle="Interest rate starting at 0.96% monthly"
              action="Apply now"
            />
          </div>
          {/* List items */}
          <div className="space-y-1">
            <MoneyListItem icon={<Gauge size={20} className="text-blue-500" />} label="Check your CIBIL score for free" />
            <MoneyListItem
              icon={<History size={20} className="text-blue-500" />}
              label="See transaction history"
              onClick={() => setLocation('/money')}
            />
            <MoneyListItem icon={<Landmark size={20} className="text-blue-500" />} label="Check bank balance" />
          </div>
        </div>

      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 w-full bg-background border-t border-border py-2 px-6 flex justify-around items-center z-50">
        <NavItem
          icon={<HomeIcon size={24} />}
          label="Home"
          isActive={true}
          onClick={() => setLocation('/')}
        />
        <NavItem
          icon={<CircleDollarSign size={24} />}
          label="Money"
          isActive={false}
          onClick={() => setLocation('/money')}
        />
        <NavItem
          icon={<UserCircle2 size={24} />}
          label="You"
          isActive={false}
          onClick={() => setLocation('/you')}
        />
      </div>
    </div>
  );
}

// --- Components ---

function NavItem({ icon, label, isActive, onClick }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-0.5 min-w-16 py-1.5">
      <div className={`transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
        {icon}
      </div>
      {isActive && <span className="text-[10px] font-medium text-primary">{label}</span>}
    </button>
  );
}

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

function ActionButton({ icon, label, onClick }: ActionButtonProps) {
  return (
    <motion.div
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="flex flex-col items-center gap-2.5 cursor-pointer"
    >
      <div className="w-full aspect-square bg-blue-700 hover:bg-blue-600 rounded-2xl flex items-center justify-center text-white transition-colors shadow-lg shadow-blue-900/10 border border-transparent dark:border-blue-500/30">
        {icon}
      </div>
      <span className="text-[0.7rem] text-center text-muted-foreground font-medium leading-tight">{label}</span>
    </motion.div>
  );
}

interface PersonItemProps {
  name: string;
  avatar: React.ReactNode | string;
  onClick?: () => void;
  color?: string;
  textColor?: string;
  hasNotification?: boolean;
  isGroup?: boolean;
}

function PersonItem({ name, avatar, onClick, color, textColor, hasNotification, isGroup }: PersonItemProps) {
  const bgColor = color || 'bg-blue-600';
  const txtColor = textColor || 'text-white';

  return (
    <div onClick={onClick} className="flex flex-col items-center gap-2 cursor-pointer group">
      <div className="relative">
        <div className={`w-14 h-14 rounded-full ${bgColor} flex items-center justify-center ${txtColor} text-lg font-semibold overflow-hidden group-hover:scale-105 transition-transform border border-transparent dark:border-white/10`}>
          {typeof avatar === 'string' && avatar.startsWith('http') ? (
            <img src={avatar} alt={name} className="w-full h-full object-cover" />
          ) : typeof avatar === 'string' ? (
            avatar
          ) : (
            avatar
          )}
        </div>
        {hasNotification && (
          <div className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-teal-500 rounded-full border-2 border-background" />
        )}
        {isGroup && (
          <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-card rounded-full border-2 border-background flex items-center justify-center">
            <span className="text-[10px] text-foreground font-bold">3</span>
          </div>
        )}
      </div>
      <span className="text-[0.7rem] text-muted-foreground font-medium truncate w-full text-center">{name}</span>
    </div>
  );
}

function MoreButton({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center gap-2 cursor-pointer group">
      <div className="w-14 h-14 rounded-full bg-secondary border-2 border-border flex items-center justify-center text-muted-foreground group-hover:bg-secondary/80 transition-colors">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
      <span className="text-[0.7rem] text-muted-foreground font-medium">{label}</span>
    </div>
  );
}

function BillItem({ name, icon, color, status }: { name: string, icon: React.ReactNode | string, color: string, status?: string }) {
  return (
    <div className="flex flex-col items-center gap-2 cursor-pointer">
      <div className="relative">
        <div className={`w-14 h-14 rounded-full bg-white flex items-center justify-center overflow-hidden border-2 border-border`}>
          {typeof icon === 'string' ? (
            <span className={`text-[10px] font-bold ${color === 'bg-blue-600' ? 'text-blue-600' : 'text-red-600'}`}>{icon}</span>
          ) : (
            <div className={color === 'bg-red-600' ? 'text-red-600' : 'text-blue-500'}>{icon}</div>
          )}
        </div>
        {status && (
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[9px] px-1.5 py-0.5 rounded-full font-medium whitespace-nowrap">
            {status}
          </div>
        )}
      </div>
      <span className="text-[0.7rem] text-muted-foreground font-medium truncate w-full text-center leading-tight">{name}</span>
    </div>
  );
}

function MoneyCard({ icon, title, subtitle, action }: { icon: React.ReactNode, title: string, subtitle: string, action: string }) {
  return (
    <div className="min-w-[160px] max-w-[160px] bg-card rounded-2xl p-4 flex flex-col h-full border border-border">
      <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center mb-3">
        {icon}
      </div>
      <h3 className="text-sm font-medium text-foreground mb-1">{title}</h3>
      <p className="text-[10px] text-muted-foreground mb-4 leading-relaxed">{subtitle}</p>
      <span className="text-xs text-blue-400 font-medium mt-auto">{action}</span>
    </div>
  );
}

function MoneyListItem({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick?: () => void }) {
  return (
    <button onClick={onClick} className="w-full flex items-center justify-between p-3 hover:bg-card/50 rounded-xl transition-colors group">
      <div className="flex items-center gap-4">
        <div className="text-blue-500">{icon}</div>
        <span className="text-sm text-foreground font-medium">{label}</span>
      </div>
      <ChevronRight size={16} className="text-muted-foreground group-hover:text-foreground transition-colors" />
    </button>
  );
}
