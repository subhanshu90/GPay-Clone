import { useState, useMemo } from 'react';
import { Search, X, User, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Contact {
    id: string;
    name: string;
    phone: string;
    upiId: string;
    avatar?: string;
    verified: boolean;
}

// Mock contacts database
const MOCK_CONTACTS: Contact[] = [
    { id: '1', name: 'Rahul Sharma', phone: '9876543210', upiId: 'rahul@paytm', verified: true },
    { id: '2', name: 'Priya Singh', phone: '9123456789', upiId: 'priya@oksbi', verified: true },
    { id: '3', name: 'Amit Patel', phone: '9988776655', upiId: 'amit.patel@ybl', verified: true },
    { id: '4', name: 'Sneha Reddy', phone: '9876512345', upiId: 'sneha@paytm', verified: true },
    { id: '5', name: 'Vikram Kumar', phone: '9123498765', upiId: 'vikram@axisbank', verified: true },
    { id: '6', name: 'Anita Desai', phone: '9876501234', upiId: 'anita@icici', verified: true },
    { id: '7', name: 'Rajesh Verma', phone: '9988772233', upiId: 'rajesh.v@paytm', verified: true },
    { id: '8', name: 'Kavya Nair', phone: '9123487654', upiId: 'kavya@ybl', verified: true },
];

interface PayBySearchProps {
    onClose: () => void;
    onSelectRecipient: (contact: Contact) => void;
}

export default function PayBySearch({ onClose, onSelectRecipient }: PayBySearchProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    // Filter contacts based on search
    const filteredContacts = useMemo(() => {
        if (!searchQuery) return [];

        const query = searchQuery.toLowerCase().trim();
        return MOCK_CONTACTS.filter(contact =>
            contact.name.toLowerCase().includes(query) ||
            contact.phone.includes(query) ||
            contact.upiId.toLowerCase().includes(query)
        );
    }, [searchQuery]);

    const handleSearch = (value: string) => {
        setSearchQuery(value);
        if (value.length > 2) {
            setIsSearching(true);
            // Simulate network lookup
            setTimeout(() => setIsSearching(false), 300);
        }
    };

    const handleSelectContact = (contact: Contact) => {
        onSelectRecipient(contact);
    };

    return (
        <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-0 bg-[#0A0A0A] z-50 flex flex-col"
        >
            {/* Header */}
            <div className="bg-[#0A0A0A] border-b border-gray-900 px-4 py-3 flex items-center gap-3">
                <button onClick={onClose} className="p-2 -ml-2">
                    <X size={24} className="text-white" />
                </button>
                <h1 className="text-lg font-semibold text-white">Pay anyone</h1>
            </div>

            {/* Search Bar */}
            <div className="px-4 py-3 bg-[#0A0A0A]">
                <div className="relative">
                    <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        placeholder="Enter UPI ID, phone or name"
                        autoFocus
                        className="w-full bg-[#1C1C1C] border border-gray-800 rounded-full py-3 pl-12 pr-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-gray-700 transition-all"
                    />
                </div>

                {/* Quick Suggestions */}
                {!searchQuery && (
                    <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                        <SuggestionChip label="Phone number" onClick={() => setSearchQuery('9')} />
                        <SuggestionChip label="UPI ID" onClick={() => setSearchQuery('@')} />
                        <SuggestionChip label="Bank account" />
                    </div>
                )}
            </div>

            {/* Results */}
            <div className="flex-1 overflow-y-auto">
                {isSearching ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
                    </div>
                ) : searchQuery && filteredContacts.length > 0 ? (
                    <div className="px-4 py-2">
                        <h2 className="text-sm font-medium text-gray-400 mb-3 px-2">
                            {filteredContacts.length} {filteredContacts.length === 1 ? 'result' : 'results'} found
                        </h2>
                        <div className="space-y-1">
                            {filteredContacts.map((contact) => (
                                <ContactItem
                                    key={contact.id}
                                    contact={contact}
                                    onClick={() => handleSelectContact(contact)}
                                />
                            ))}
                        </div>
                    </div>
                ) : searchQuery && filteredContacts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 px-6">
                        <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mb-4">
                            <Search size={28} className="text-gray-600" />
                        </div>
                        <h3 className="text-lg font-medium text-white mb-2">No results found</h3>
                        <p className="text-sm text-gray-400 text-center">
                            Try searching with a different UPI ID, phone number, or name
                        </p>
                    </div>
                ) : (
                    <div className="px-4 py-8">
                        <h2 className="text-sm font-medium text-gray-400 mb-4 px-2">Recent contacts</h2>
                        <div className="space-y-1">
                            {MOCK_CONTACTS.slice(0, 5).map((contact) => (
                                <ContactItem
                                    key={contact.id}
                                    contact={contact}
                                    onClick={() => handleSelectContact(contact)}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Info Section */}
            {!searchQuery && (
                <div className="px-4 py-4 bg-[#1C1C1C] border-t border-gray-900">
                    <p className="text-xs text-gray-500 text-center">
                        You can also pay using phone number, UPI ID or QR code
                    </p>
                </div>
            )}
        </motion.div>
    );
}

function ContactItem({ contact, onClick }: { contact: Contact; onClick: () => void }) {
    return (
        <motion.div
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className="flex items-center gap-3 p-3 bg-[#1C1C1C] hover:bg-[#252525] rounded-xl cursor-pointer transition-colors"
        >
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                {contact.avatar || contact.name[0]}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                    <h3 className="font-medium text-white truncate">{contact.name}</h3>
                    {contact.verified && (
                        <CheckCircle2 size={14} className="text-blue-500 flex-shrink-0" fill="currentColor" />
                    )}
                </div>
                <p className="text-sm text-gray-400 truncate">{contact.upiId}</p>
            </div>
            <ArrowRight size={20} className="text-gray-600 flex-shrink-0" />
        </motion.div>
    );
}

function SuggestionChip({ label, onClick }: { label: string; onClick?: () => void }) {
    return (
        <button
            onClick={onClick}
            className="px-4 py-2 bg-[#1C1C1C] text-gray-300 text-sm font-medium rounded-full whitespace-nowrap hover:bg-[#252525] transition-colors"
        >
            {label}
        </button>
    );
}
