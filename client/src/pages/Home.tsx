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
  User
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PaymentFlow from "@/components/PaymentFlow";
import QRScanner from "@/components/QRScanner";
import PayBySearch from "@/components/PayBySearch";
import TransactionHistory from "@/components/TransactionHistory";
import TransactionDetail from "@/components/TransactionDetail";
import { MOCK_TRANSACTIONS, MOCK_USER, type Transaction } from "@/lib/mockData";

export default function Home() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const [showPayBySearch, setShowPayBySearch] = useState(false);
  const [activePayment, setActivePayment] = useState<{ name: string, upiId: string, avatar?: string } | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
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
    setTransactions([txn, ...transactions]);
    setTimeout(() => {
      setActivePayment(null);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] pb-24 font-sans text-white relative">
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
      <div className="sticky top-0 z-40 bg-[#0A0A0A]/95 backdrop-blur-sm px-4 pt-3 pb-2">
        <div className="flex items-center gap-3">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="Pay anyone on UPI"
              className="w-full bg-[#1C1C1C] border border-gray-800 rounded-full py-2.5 pl-11 pr-4 text-sm font-normal text-white placeholder:text-gray-500 focus:outline-none focus:border-gray-700 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Profile Icon */}
          <div className="flex-shrink-0">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold text-sm cursor-pointer">
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
          className="bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 rounded-2xl p-5 relative overflow-hidden cursor-pointer"
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
          <div className="flex items-center gap-2 text-gray-400">
            <div className="w-5 h-5 rounded-full bg-gray-800 flex items-center justify-center">
              <Zap size={12} className="text-blue-500" />
            </div>
            <span>Tap & Pay</span>
          </div>
          <div className="text-gray-400">
            <span>UPI Lite: ₹{(Math.random() * 100).toFixed(2)}</span>
          </div>
          <div className="text-gray-400">
            <span className="truncate max-w-32">UPI ID: {MOCK_USER.upiId}</span>
          </div>
        </div>

        {/* People Section */}
        <div>
          <h2 className="text-base font-semibold text-white mb-4 px-1">People</h2>
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
              color="bg-gray-700"
              isGroup
            />
            <PersonItem
              name="Self transfer"
              avatar={<User size={24} />}
              color="bg-gray-800"
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

        {/* Recent Transactions */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-base font-semibold text-white">Recent transactions</h2>
            <button
              onClick={() => setShowHistory(true)}
              className="text-blue-500 text-sm font-medium"
            >
              See all
            </button>
          </div>
          <div className="space-y-2">
            {transactions.slice(0, 3).map((txn) => (
              <motion.div
                key={txn.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedTxn(txn)}
                className="bg-[#1C1C1C] rounded-xl p-4 flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${txn.type === 'received' ? 'bg-green-600' : 'bg-orange-600'}`}>
                    {txn.recipient[0]}
                  </div>
                  <div>
                    <h4 className="font-medium text-white text-sm">{txn.recipient}</h4>
                    <p className="text-xs text-gray-400">
                      {new Date(txn.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                </div>
                <div className={`font-semibold ${txn.type === 'received' ? 'text-green-500' : 'text-white'}`}>
                  {txn.type === 'received' ? '+' : '-'} ₹{txn.amount.toFixed(2)}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 w-full bg-[#0A0A0A] border-t border-gray-900 py-2 px-6 flex justify-around items-center z-50">
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
      <div className={`transition-colors ${isActive ? 'text-blue-500' : 'text-gray-500'}`}>
        {icon}
      </div>
      {isActive && <span className="text-[10px] font-medium text-blue-500">{label}</span>}
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
      <div className="w-full aspect-square bg-blue-700 hover:bg-blue-600 rounded-2xl flex items-center justify-center text-white transition-colors shadow-lg shadow-blue-900/30">
        {icon}
      </div>
      <span className="text-[0.7rem] text-center text-gray-300 font-medium leading-tight">{label}</span>
    </motion.div>
  );
}

interface PersonItemProps {
  name: string;
  avatar: React.ReactNode | string;
  onClick?: () => void;
  color?: string;
  hasNotification?: boolean;
  isGroup?: boolean;
}

function PersonItem({ name, avatar, onClick, color = "bg-blue-600", hasNotification, isGroup }: PersonItemProps) {
  return (
    <div onClick={onClick} className="flex flex-col items-center gap-2 cursor-pointer group">
      <div className="relative">
        <div className={`w-14 h-14 rounded-full ${color} flex items-center justify-center text-white text-lg font-semibold overflow-hidden group-hover:scale-105 transition-transform`}>
          {typeof avatar === 'string' && avatar.startsWith('http') ? (
            <img src={avatar} alt={name} className="w-full h-full object-cover" />
          ) : typeof avatar === 'string' ? (
            avatar
          ) : (
            avatar
          )}
        </div>
        {hasNotification && (
          <div className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-teal-500 rounded-full border-2 border-[#0A0A0A]" />
        )}
        {isGroup && (
          <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-white rounded-full border-2 border-[#0A0A0A] flex items-center justify-center">
            <span className="text-[10px] text-gray-900 font-bold">3</span>
          </div>
        )}
      </div>
      <span className="text-[0.7rem] text-gray-300 font-medium truncate w-full text-center">{name}</span>
    </div>
  );
}

function MoreButton({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center gap-2 cursor-pointer group">
      <div className="w-14 h-14 rounded-full bg-gray-800 border-2 border-gray-700 flex items-center justify-center text-gray-400 group-hover:bg-gray-700 transition-colors">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
      <span className="text-[0.7rem] text-gray-300 font-medium">{label}</span>
    </div>
  );
}
