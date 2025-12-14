import { useLocation } from "wouter";
import { Home as HomeIcon, CircleDollarSign, UserCircle2, Moon, Sun, Bell, Settings, CreditCard, Shield } from "lucide-react";
import { useTheme } from "@/lib/ThemeContext";
import { MOCK_USER } from "@/lib/mockData";
import { motion } from "framer-motion";

export default function You() {
    const [, setLocation] = useLocation();
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white pb-24">
            {/* Header */}
            <div className="px-4 pt-6 pb-4">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold text-2xl">
                        {MOCK_USER.avatar}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">{MOCK_USER.name}</h1>
                        <p className="text-sm text-gray-400">{MOCK_USER.upiId}</p>
                    </div>
                </div>
            </div>

            {/* Menu Options */}
            <div className="px-4 space-y-2">
                <MenuItem
                    icon={theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    label="Theme"
                    value={theme === 'dark' ? 'Dark' : 'Light'}
                    onClick={toggleTheme}
                />
                <MenuItem
                    icon={<Bell size={20} />}
                    label="Notifications"
                />
                <MenuItem
                    icon={<CreditCard size={20} />}
                    label="Payment methods"
                />
                <MenuItem
                    icon={<Shield size={20} />}
                    label="Privacy & security"
                />
                <MenuItem
                    icon={<Settings size={20} />}
                    label="Settings"
                />
            </div>

            {/* Bottom Navigation */}
            <div className="fixed bottom-0 left-0 w-full bg-[#0A0A0A] border-t border-gray-900 py-2 px-6 flex justify-around items-center z-50">
                <NavItem
                    icon={<HomeIcon size={24} />}
                    label="Home"
                    isActive={false}
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
                    isActive={true}
                    onClick={() => setLocation('/you')}
                />
            </div>
        </div>
    );
}

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

function MenuItem({ icon, label, value, onClick }: { icon: React.ReactNode; label: string; value?: string; onClick?: () => void }) {
    return (
        <motion.div
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className="bg-[#1C1C1C] rounded-xl p-4 flex items-center justify-between cursor-pointer"
        >
            <div className="flex items-center gap-3">
                <div className="text-blue-500">
                    {icon}
                </div>
                <span className="font-medium">{label}</span>
            </div>
            {value && (
                <span className="text-sm text-gray-400">{value}</span>
            )}
        </motion.div>
    );
}
