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
  MoreVertical, 
  ChevronRight,
  History,
  BarChart3,
  Copy,
  QrCode,
  Share2
} from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-white pb-20 font-sans text-[#202124]">
      {/* Header Section */}
      <div className="sticky top-0 z-10 bg-white">
        {/* Top Bar with Search */}
        <div className="px-4 py-3 flex items-center gap-3 shadow-sm">
          <div className="flex-1 relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              <Search size={20} />
            </div>
            <input
              type="text"
              placeholder="Pay friends and merchants"
              className="w-full bg-white border border-gray-300 rounded-full py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-gray-500 shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-purple-600 flex items-center justify-center text-white font-medium text-sm cursor-pointer hover:opacity-90 transition-opacity">
              A
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 bg-white rounded-full p-0.5">
               <div className="bg-green-500 w-2.5 h-2.5 rounded-full border border-white"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Scroll */}
      <div className="pt-2">
        
        {/* Hero / UPI ID Display */}
        <div className="px-4 mb-6 relative">
             <div className="bg-[#E8F0FE] rounded-2xl p-4 flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-purple-500 to-red-400"></div>
                <div className="flex items-center gap-2 mb-2">
                    <QrCode size={48} className="text-[#1A73E8]" />
                </div>
                <p className="text-xs text-gray-600 font-medium mb-1">UPI ID: user@oksbi</p>
                 <div className="flex gap-4 mt-2">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full text-xs font-medium text-gray-700 shadow-sm border border-gray-200">
                        <Copy size={12} /> Copy
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full text-xs font-medium text-gray-700 shadow-sm border border-gray-200">
                        <Share2 size={12} /> Share
                    </button>
                 </div>
             </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="px-4 mb-6">
          <div className="grid grid-cols-4 gap-y-6 gap-x-2">
            <QuickAction icon={<Scan size={24} />} label="Scan any QR code" color="text-blue-600" />
            <QuickAction icon={<Users size={24} />} label="Pay contacts" color="text-blue-600" />
            <QuickAction icon={<Smartphone size={24} />} label="Pay phone number" color="text-blue-600" />
            <QuickAction icon={<Landmark size={24} />} label="Bank transfer" color="text-blue-600" />
            <QuickAction icon={<AtSign size={24} />} label="Pay UPI ID or number" color="text-blue-600" />
            <QuickAction icon={<User size={24} />} label="Self transfer" color="text-blue-600" />
            <QuickAction icon={<Receipt size={24} />} label="Pay bills" color="text-blue-600" />
            <QuickAction icon={<Zap size={24} />} label="Mobile recharge" color="text-blue-600" />
          </div>
        </div>

        {/* People Section */}
        <div className="mb-6">
          <div className="px-4 mb-3 flex items-center justify-between">
            <h2 className="text-[1.1rem] font-medium text-[#202124]">People</h2>
            <button className="p-1.5 hover:bg-gray-100 rounded-full">
                <MoreVertical size={20} className="text-gray-500" />
            </button>
          </div>
          <div className="overflow-x-auto pb-4 px-4 scrollbar-hide flex gap-6">
            <PersonItem name="Rahul" avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul" />
            <PersonItem name="Priya" avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Priya" />
            <PersonItem name="Amit" avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Amit" />
            <PersonItem name="Sneha" avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha" />
            <PersonItem name="Vikram" avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram" />
            <PersonItem name="Anjali" avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Anjali" />
            <PersonItem name="Rohit" avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Rohit" />
          </div>
        </div>

        {/* Businesses Section */}
        <div className="mb-8">
          <div className="px-4 mb-3 flex items-center justify-between">
            <h2 className="text-[1.1rem] font-medium text-[#202124]">Businesses</h2>
            <button className="px-3 py-1.5 bg-[#E8F0FE] text-[#1967D2] text-xs font-semibold rounded-full hover:bg-blue-100 transition-colors">
              Explore
            </button>
          </div>
          <div className="grid grid-cols-4 gap-y-6 gap-x-2 px-4">
             <BusinessItem name="Jio" icon="J" color="bg-blue-600" />
             <BusinessItem name="Zomato" icon="Z" color="bg-red-500" />
             <BusinessItem name="Swiggy" icon="S" color="bg-orange-500" />
             <BusinessItem name="Uber" icon="U" color="bg-black" />
             <BusinessItem name="Tata Sky" icon="T" color="bg-pink-600" />
             <BusinessItem name="Bescom" icon="B" color="bg-green-600" />
             <BusinessItem name="More" icon={<ChevronRight size={20} />} isMore />
          </div>
        </div>

        {/* Promotions Section */}
        <div className="mb-8 px-4">
           <h2 className="text-[1.1rem] font-medium text-[#202124] mb-4">Promotions</h2>
           <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              <PromotionCard title="Rewards" icon="🎁" subtext="8 rewards" />
              <PromotionCard title="Offers" icon="🏷️" subtext="See offers" />
              <PromotionCard title="Referrals" icon="📣" subtext="₹201" />
              <PromotionCard title="Indi-Home" icon="🏠" subtext="Play now" />
           </div>
        </div>

        {/* Footer Actions */}
        <div className="px-4 flex flex-col gap-1 pb-8">
            <FooterAction icon={<BarChart3 size={20} />} label="Check your CIBIL score" />
            <FooterAction icon={<History size={20} />} label="See transaction history" />
            <FooterAction icon={<Landmark size={20} />} label="Check bank balance" />
        </div>
        
        {/* Branding Footer */}
        <div className="flex flex-col items-center justify-center py-8 text-gray-400 gap-2">
            <div className="flex items-center gap-1.5 text-xs font-medium tracking-wide">
                 <span className="text-gray-500">Google</span> 
                 <span className="text-gray-400">Payment Partner</span>
            </div>
        </div>

      </div>

      {/* Floating Action Button - Only shows when scrolling down usually, but sticky here for easy access */}
      <div className="fixed bottom-6 right-6">
        <motion.button 
          whileTap={{ scale: 0.95 }}
          className="bg-white text-[#1A73E8] shadow-lg rounded-full px-5 py-3 flex items-center gap-2 font-medium border border-[#E8F0FE]"
        >
          <span className="text-2xl font-light">+</span> New payment
        </motion.button>
      </div>
    </div>
  );
}

interface QuickActionProps {
  icon: React.ReactNode;
  label: string;
  color: string;
}

function QuickAction({ icon, label, color }: QuickActionProps) {
  return (
    <div className="flex flex-col items-center gap-2 cursor-pointer group">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-white shadow-sm border border-gray-100 group-hover:bg-gray-50 transition-colors ${color}`}>
        {icon}
      </div>
      <span className="text-[0.7rem] text-center text-gray-700 font-medium leading-tight max-w-[70px]">{label}</span>
    </div>
  );
}

interface PersonItemProps {
  name: string;
  avatar: string;
}

function PersonItem({ name, avatar }: PersonItemProps) {
  return (
    <div className="flex flex-col items-center gap-2 min-w-[64px] cursor-pointer">
      <div className="w-14 h-14 rounded-full overflow-hidden border border-gray-100 shadow-sm">
        <img src={avatar} alt={name} className="w-full h-full object-cover" />
      </div>
      <span className="text-xs text-gray-700 font-medium truncate w-full text-center">{name}</span>
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
        <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-sm ${isMore ? 'bg-white border border-gray-200 text-blue-600' : color}`}>
          {icon}
        </div>
        <span className="text-xs text-gray-700 font-medium truncate max-w-[64px] text-center">{name}</span>
      </div>
    );
}

interface PromotionCardProps {
  title: string;
  icon: string;
  subtext?: string;
}

function PromotionCard({ title, icon, subtext }: PromotionCardProps) {
    return (
        <div className="min-w-[100px] flex flex-col items-center gap-1 cursor-pointer">
            <div className="w-full aspect-square rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col items-center justify-center border border-gray-100 shadow-sm">
                <span className="text-3xl mb-1">{icon}</span>
            </div>
            <div className="text-center">
                 <span className="block text-xs font-semibold text-gray-800">{title}</span>
                 {subtext && <span className="block text-[0.65rem] text-gray-500">{subtext}</span>}
            </div>
        </div>
    )
}

interface FooterActionProps {
  icon: React.ReactNode;
  label: string;
}

function FooterAction({ icon, label }: FooterActionProps) {
    return (
        <div className="flex items-center gap-4 py-3.5 hover:bg-gray-50 rounded-lg px-2 -mx-2 cursor-pointer transition-colors">
            <div className="text-[#1A73E8]">
                {icon}
            </div>
            <span className="text-sm font-medium text-[#202124] flex-1">{label}</span>
            <ChevronRight size={16} className="text-gray-400" />
        </div>
    )
}
