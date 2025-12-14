import { BarChart3, Landmark, ChevronRight, Home as HomeIcon, CircleDollarSign, UserCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { useTransactions } from "@/context/TransactionContext";
import { useState } from "react";
import TransactionDetail from "@/components/TransactionDetail";
import { Transaction } from "@/lib/mockData";

export default function Money() {
    const [, setLocation] = useLocation();
    const { transactions } = useTransactions();
    const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);

    return (
        <div className="min-h-screen bg-background text-foreground pb-24">
            {/* Simple Header */}
            <div className="px-4 pt-4 pb-3">
                <h1 className="text-lg font-semibold text-foreground">Money</h1>
            </div>

            {/* Content */}
            <div className="px-4 space-y-4">
                {/* Bank Balances Card */}
                <motion.div
                    whileTap={{ scale: 0.98 }}
                    className="bg-card rounded-2xl p-5 cursor-pointer border border-border"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-900/30 rounded-full flex items-center justify-center">
                                <Landmark size={24} className="text-blue-500" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground">Bank balances</h3>
                                <p className="text-sm text-muted-foreground">7 accounts</p>
                            </div>
                        </div>
                        <button className="text-blue-500 font-medium text-sm px-4 py-2 bg-blue-500/10 rounded-full">
                            Check
                        </button>
                    </div>
                </motion.div>

                {/* CIBIL Score Card */}
                <motion.div
                    whileTap={{ scale: 0.98 }}
                    className="bg-card rounded-2xl p-5 cursor-pointer border border-border"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-900/30 rounded-full flex items-center justify-center">
                                <BarChart3 size={24} className="text-green-500" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground">CIBIL score</h3>
                                <p className="text-sm text-muted-foreground">New score available</p>
                            </div>
                        </div>
                        <button className="text-blue-500 font-medium text-sm px-4 py-2 bg-blue-500/10 rounded-full">
                            Check
                        </button>
                    </div>
                </motion.div>

                {/* Credit for you */}
                <div>
                    <h2 className="text-lg font-semibold text-foreground mb-3 px-1">Credit for you</h2>
                    <div className="grid grid-cols-2 gap-3">
                        <CreditCard
                            title="Personal loan"
                            description="Up to ₹10 lakh, instant approval"
                        />
                        <CreditCard
                            title="Gold loan"
                            description="Interest rate starting at 0.96% monthly"
                        />
                    </div>
                </div>

                {/* Transaction History */}
                <div>
                    <div className="flex items-center justify-between mb-3 px-1">
                        <h2 className="text-lg font-semibold text-foreground">Transaction history</h2>
                        <button className="text-blue-500 text-sm font-medium flex items-center gap-1">
                            See all
                            <ChevronRight size={16} />
                        </button>
                    </div>
                    <div className="space-y-2">
                        {transactions.map((txn) => (
                            <TransactionItem
                                key={txn.id}
                                name={txn.recipient}
                                amount={`₹${txn.amount}`}
                                date={new Date(txn.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long' })}
                                onClick={() => setSelectedTxn(txn)}
                                type={txn.type}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {selectedTxn && (
                    <TransactionDetail
                        txn={selectedTxn}
                        onClose={() => setSelectedTxn(null)}
                    />
                )}
            </AnimatePresence>

            {/* Bottom Navigation */}
            <div className="fixed bottom-0 left-0 w-full bg-background border-t border-border py-2 px-6 flex justify-around items-center z-50">
                <NavItem
                    icon={<HomeIcon size={24} />}
                    label="Home"
                    isActive={false}
                    onClick={() => setLocation('/')}
                />
                <NavItem
                    icon={<CircleDollarSign size={24} />}
                    label="Money"
                    isActive={true}
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

function CreditCard({ title, description }: { title: string; description: string }) {
    return (
        <motion.div
            whileTap={{ scale: 0.98 }}
            className="bg-card rounded-xl p-4 cursor-pointer border border-border"
        >
            <div className="text-3xl mb-2">💰</div>
            <h3 className="font-semibold text-foreground mb-1">{title}</h3>
            <p className="text-xs text-muted-foreground mb-3">{description}</p>
            <button className="text-blue-500 text-sm font-medium">Apply</button>
        </motion.div>
    );
}

function TransactionItem({ name, amount, date, onClick, type }: { name: string; amount: string; date: string; onClick: () => void; type: 'sent' | 'received' }) {
    return (
        <motion.div
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className="bg-card rounded-xl p-4 flex items-center justify-between cursor-pointer border border-border"
        >
            <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${type === 'received' ? 'bg-green-600' : 'bg-orange-600'}`}>
                    {name[0]}
                </div>
                <div>
                    <h4 className="font-medium text-foreground text-sm">{name}</h4>
                    <p className="text-xs text-muted-foreground">{date}</p>
                </div>
            </div>
            <div className={`font-semibold ${type === 'received' ? 'text-green-500' : 'text-foreground'}`}>
                {type === 'received' ? '+' : '-'} {amount}
            </div>
        </motion.div>
    );
}
