import React, { useState, useEffect } from "react";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";

interface Transaction {
  id: number;
  type: "Deposit" | "Withdraw" | "Transfer";
  amount: number;
  sender: string;
  receiver: string;
  status: "Completed";
}

const key = "nexus_wallet";
const transaction = "nexus_transactions";

export const Payments: React.FC = () => {
  // Load balance from localStorage, fallback to 5000
  const [balance, setBalance] = useState<number>(() => {
    const storedWallet = localStorage.getItem(key);
    return storedWallet ? Number(storedWallet) : 5000;
  });

  // Load transactions from localStorage
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const storedTx = localStorage.getItem(transaction);
    if (storedTx) {
      try { return JSON.parse(storedTx); } catch { return []; }
    }
    return [];
  });

  const [amount, setAmount] = useState<string>("");
  const [receiver, setReceiver] = useState<string>("");

  // Save balance & transactions to localStorage
  useEffect(() => {
    localStorage.setItem(key, balance.toString());
  }, [balance]);

  useEffect(() => {
    localStorage.setItem(transaction, JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (tx: Transaction) => {
    setTransactions(prev => [tx, ...prev]);
  };

  const handleDeposit = () => {
    const num = Number(amount);
    if (!num || num <= 0) return alert("Enter a valid amount");

    addTransaction({
      id: Date.now(),
      type: "Deposit",
      amount: num,
      sender: "You",
      receiver: "Wallet",
      status: "Completed",
    });

    setBalance(prev => prev + num);
    setAmount("");
  };

  const handleWithdraw = () => {
    const num = Number(amount);
    if (!num || num <= 0 || num > balance) return alert("Invalid amount");

    addTransaction({
      id: Date.now(),
      type: "Withdraw",
      amount: num,
      sender: "Wallet",
      receiver: "You",
      status: "Completed",
    });

    setBalance(prev => prev - num);
    setAmount("");
  };

  const handleTransfer = () => {
    const num = Number(amount);
    if (!receiver || !num || num <= 0 || num > balance) return alert("Invalid transfer");

    addTransaction({
      id: Date.now(),
      type: "Transfer",
      amount: num,
      sender: "You",
      receiver,
      status: "Completed",
    });

    setBalance(prev => prev - num);
    setAmount("");
    setReceiver("");
  };

  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to clear transaction history?")) {
      setTransactions([]);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">
      <h1 className="text-3xl font-bold text-primary-600">Payments / Wallet</h1>

      {/* Wallet Balance */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-medium">Wallet Balance: ${balance}</h2>
        </CardHeader>
        <CardBody className="space-y-4 flex flex-col md:flex-row md:items-center gap-4">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="border p-2 rounded w-full md:w-1/4"
          />
          <input
            type="text"
            value={receiver}
            onChange={(e) => setReceiver(e.target.value)}
            placeholder="Receiver (for Transfer)"
            className="border p-2 rounded w-full md:w-1/4"
          />
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={handleDeposit}
              className="bg-green-600 hover:bg-green-700 text-white focus:outline-none focus:ring-0"
            >
              Deposit
            </Button>

            <Button
              onClick={handleWithdraw}
              className="bg-red-600 hover:bg-red-700 text-white focus:outline-none focus:ring-0"
            >
              Withdraw
            </Button>

            <Button
              onClick={handleTransfer}
              className="bg-blue-600 hover:bg-blue-700 text-white focus:outline-none focus:ring-0"
            >
              Transfer
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Transaction History */}
      <Card>
        <CardHeader className="flex justify-between items-center">
          <h2 className="text-lg font-medium">Transaction History</h2>
          <Button
            onClick={handleClearHistory}
            className="bg-red-500 text-white px-3 py-1 text-sm rounded hover:bg-red-600 
            focus:outline-none focus:ring-0"
          >
            Clear History
          </Button>
        </CardHeader>
        <CardBody className="max-h-[400px] overflow-y-auto">
          {transactions.length === 0 ? (
            <p>No transactions yet</p>
          ) : (
            <table className="w-full border-collapse text-center min-w-[500px]">
              <thead className="bg-gray-100 sticky top-0">
                <tr>
                  <th className="border p-2">Type</th>
                  <th className="border p-2">Amount</th>
                  <th className="border p-2">Sender</th>
                  <th className="border p-2">Receiver</th>
                  <th className="border p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(tx => (
                  <tr key={tx.id} className="hover:bg-gray-50">
                    <td className="border p-2">{tx.type}</td>
                    <td className="border p-2">${tx.amount}</td>
                    <td className="border p-2">{tx.sender}</td>
                    <td className="border p-2">{tx.receiver}</td>
                    <td className="border p-2">{tx.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardBody>
      </Card>
    </div>
  );
};