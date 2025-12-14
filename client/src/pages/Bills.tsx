import { motion } from "framer-motion";
import { ChevronRight, Home as HomeIcon, CircleDollarSign, UserCircle2 } from "lucide-react";
import { useLocation } from "wouter";

export default function Bills() {
    const [, setLocation] = useLocation();

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white pb-24">
            {/* Header */}
            <div className="px-4 pt-4 pb-2">
                <h1 className="text-2xl font-bold">Bills & recharges</h1>
                <button className="text-sm text-gray-400 flex items-center gap-1 mt-1">
                    Manage
                    <ChevronRight size={14} />
                </button>
            </div>

            {/* Service Providers */}
            <div className="px-4 mt-4 space-y-6">
                <div className="grid grid-cols-4 gap-y-5 gap-x-2">
                    <ServiceItem name="HDFC Bank Credit Card" color="bg-blue-700" icon="H" badge="Overdue" badgeColor="bg-red-500" />
                    <ServiceItem name="BESCOM - Bangalore ..." color="bg-blue-600" icon="B" />
                    <ServiceItem name="Jio Prepaid" color="bg-blue-600" icon="J" />
                    <ServiceItem name="Airtel Prepaid" color="bg-red-600" icon="A" />
                </div>

                {/* Utility Services */}
                <div className="grid grid-cols-4 gap-4">
                    <UtilityButton icon="📱" label="Mobile recharge" />
                    <UtilityButton icon="📺" label="DTH / Cable TV" />
                    <UtilityButton icon="💡" label="Electricity" />
                    <UtilityButton icon="🚗" label="FASTag recharge" />
                </div>

                {/* Businesses */}
                <div>
                    <h2 className="text-base font-semibold text-white mb-4 px-1">Businesses</h2>
                    <div className="grid grid-cols-4 gap-y-5 gap-x-2">
                        <BusinessItem name="SHAHIDALI..." color="bg-orange-600" initial="S" />
                        <BusinessItem name="Muhamma..." color="bg-teal-600" initial="M" />
                        <BusinessItem name="TASTY BITES" color="bg-gray-600" initial="T" />
                        <MoreButton label="More" />
                    </div>
                </div>

                {/* Gift Cards & More */}
                <div>
                    <h2 className="text-base font-semibold text-white mb-4 px-1">Gift cards & more</h2>
                    <div className="grid grid-cols-2 gap-3">
                        <GiftCard
                            icon="📱"
                            title="Subscriptions"
                            description="Buy plans from leading OTT platforms"
                        />
                        <GiftCard
                            icon="🎁"
                            title="Gift cards"
                            description="Buy gift cards from the biggest brands"
                        />
                    </div>
                </div>
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
            <div className={`transition-colors ${isActive ? 'text-blue-500' : 'text-gray-500'}`}>
                {icon}
            </div>
            {isActive && <span className="text-[10px] font-medium text-blue-500">{label}</span>}
        </button>
    );
}

function ServiceItem({ name, color, icon, badge, badgeColor }: { name: string; color: string; icon: string; badge?: string; badgeColor?: string }) {
    return (
        <div className="flex flex-col items-center gap-2">
            <div className="relative">
                <div className={`w-14 h-14 ${color} rounded-full flex items-center justify-center text-white text-xl font-bold`}>
                    {icon}
                </div>
                {badge && (
                    <div className={`absolute -top-1 -right-1 ${badgeColor} text-white text-[9px] px-1.5 py-0.5 rounded-full font-medium`}>
                        {badge}
                    </div>
                )}
            </div>
            <span className="text-[0.7rem] text-gray-300 font-medium text-center leading-tight">{name}</span>
        </div>
    );
}

function UtilityButton({ icon, label }: { icon: string; label: string }) {
    return (
        <motion.div
            whileTap={{ scale: 0.95 }}
            className="flex flex-col items-center gap-2.5 cursor-pointer"
        >
            <div className="w-full aspect-square bg-blue-700 hover:bg-blue-600 rounded-2xl flex items-center justify-center text-2xl transition-colors">
                {icon}
            </div>
            <span className="text-[0.7rem] text-center text-gray-300 font-medium leading-tight">{label}</span>
        </motion.div>
    );
}

function BusinessItem({ name, color, initial }: { name: string; color: string; initial: string }) {
    return (
        <div className="flex flex-col items-center gap-2">
            <div className={`w-14 h-14 ${color} rounded-full flex items-center justify-center text-white text-xl font-bold`}>
                {initial}
            </div>
            <span className="text-[0.7rem] text-gray-300 font-medium text-center">{name}</span>
        </div>
    );
}

function MoreButton({ label }: { label: string }) {
    return (
        <div className="flex flex-col items-center gap-2 cursor-pointer">
            <div className="w-14 h-14 rounded-full bg-gray-800 border-2 border-gray-700 flex items-center justify-center text-gray-400">
                <ChevronRight size={24} />
            </div>
            <span className="text-[0.7rem] text-gray-300 font-medium">{label}</span>
        </div>
    );
}

function GiftCard({ icon, title, description }: { icon: string; title: string; description: string }) {
    return (
        <motion.div
            whileTap={{ scale: 0.98 }}
            className="bg-[#1C1C1C] rounded-2xl p-4 cursor-pointer"
        >
            <div className="text-3xl mb-2">{icon}</div>
            <h3 className="font-semibold text-white mb-1 text-sm">{title}</h3>
            <p className="text-xs text-gray-400">{description}</p>
            <div className="flex gap-1 mt-3">
                <div className="w-5 h-5 bg-blue-600 rounded-full" />
                <div className="w-5 h-5 bg-purple-600 rounded-full -ml-2" />
                <div className="w-5 h-5 bg-pink-600 rounded-full -ml-2" />
            </div>
        </motion.div>
    );
}
