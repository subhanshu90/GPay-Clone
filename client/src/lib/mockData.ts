export interface Transaction {
  id: string;
  amount: number;
  recipient: string;
  recipientUpi: string;
  date: string;
  status: 'success' | 'failed' | 'processing';
  type: 'sent' | 'received';
  bankRefId: string;
}

export interface BankAccount {
  bankName: string;
  accountNumber: string;
  ifsc: string;
  balance: number;
  type: 'savings' | 'current';
}

export const MOCK_USER = {
  name: "Arjun Kumar",
  upiId: "arjun.kumar@oksbi",
  avatar: "A",
  bankAccount: {
    bankName: "State Bank of India",
    accountNumber: "XXXX8932",
    ifsc: "SBIN0004321",
    balance: 24500.50,
    type: "savings"
  } as BankAccount
};

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "txn_1",
    amount: 1500,
    recipient: "Rahul Sharma",
    recipientUpi: "rahul@okaxis",
    date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    status: 'success',
    type: 'sent',
    bankRefId: "324567890123"
  },
  {
    id: "txn_2",
    amount: 340,
    recipient: "Zomato",
    recipientUpi: "zomato@okicici",
    date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    status: 'success',
    type: 'sent',
    bankRefId: "324567890124"
  },
  {
    id: "txn_3",
    amount: 5000,
    recipient: "Priya Singh",
    recipientUpi: "priya@okhdfcbank",
    date: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
    status: 'success',
    type: 'received',
    bankRefId: "324567890125"
  }
];

export const generateTransactionId = () => {
  return "T" + Date.now() + Math.floor(Math.random() * 1000);
};

export const generateBankRefId = () => {
  return Math.floor(Math.random() * 1000000000000).toString();
};
