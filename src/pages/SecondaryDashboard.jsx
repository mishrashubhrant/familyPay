import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { mockAPI, APPROVAL_THRESHOLD } from '../services/mockData';
import PaymentRequestModal from '../components/PaymentRequestModal';
import './Dashboard.css';

const SecondaryDashboard = () => {
    const { user } = useAuth();

    const [circle, setCircle] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            const [circleRes, transactionsRes] = await Promise.all([
                mockAPI.getMyCircle(),
                mockAPI.getTransactions()
            ]);

            setCircle(circleRes.data.data);
            // Filter to show only this user's transactions
            const myTransactions = transactionsRes.data.data.transactions.filter(
                t => t.fromUserId === user.id
            );
            setTransactions(myTransactions);
            setLoading(false);
        } catch (err) {
            console.error('Error loading dashboard:', err);
            setLoading(false);
        }
    };

    const handlePaymentRequest = async (paymentData) => {
        try {
            const result = await mockAPI.requestPayment(paymentData);
            loadDashboardData();
            setShowPaymentModal(false);
            return result;
        } catch (err) {
            throw new Error('Failed to submit payment request');
        }
    };

    if (loading) {
        return (
            <div className="dashboard-container flex-center">
                <div className="spinner"></div>
            </div>
        );
    }

    const dailyPercentage = circle ? (circle.currentDailySpent / circle.dailyLimit) * 100 : 0;
    const monthlyPercentage = circle ? (circle.currentMonthlySpent / circle.monthlyLimit) * 100 : 0;
    const dailyRemaining = circle ? circle.dailyLimit - circle.currentDailySpent : 0;
    const monthlyRemaining = circle ? circle.monthlyLimit - circle.currentMonthlySpent : 0;

    return (
        <div className="dashboard-container fade-in">
            <header className="dashboard-header">
                <div>
                    <h1>👤 Member Dashboard</h1>
                    <p className="text-muted">Welcome, {user.name}!</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowPaymentModal(true)}>
                    💸 Request Payment
                </button>
            </header>

            {/* Threshold Info */}
            <div className="threshold-info mb-4">
                <p className="text-sm text-muted mb-1">💡 Smart Payment System</p>
                <p>
                    Payments <strong>under ₹{APPROVAL_THRESHOLD}</strong> are approved instantly •
                    Payments <strong>above ₹{APPROVAL_THRESHOLD}</strong> require admin approval
                </p>
            </div>

            {/* Spending Limits */}
            {circle && (
                <div className="grid grid-2 mb-4">
                    <div className="card">
                        <h3 className="card-title">Daily Limit</h3>
                        <div className="limit-display">
                            <div className="limit-bar-large">
                                <div
                                    className="limit-progress"
                                    style={{ width: `${Math.min(dailyPercentage, 100)}%` }}
                                ></div>
                            </div>
                            <div className="limit-stats">
                                <div>
                                    <span className="text-muted text-sm">Spent Today</span>
                                    <strong style={{ fontSize: '1.25rem' }}>₹{circle.currentDailySpent.toFixed(2)}</strong>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <span className="text-muted text-sm">Available</span>
                                    <strong style={{ fontSize: '1.25rem', color: 'var(--success)' }}>
                                        ₹{dailyRemaining.toFixed(2)}
                                    </strong>
                                </div>
                            </div>
                            <p className="text-muted text-sm text-center mt-1">
                                Limit: ₹{circle.dailyLimit.toFixed(2)} • {dailyPercentage.toFixed(1)}% used
                            </p>
                        </div>
                    </div>

                    <div className="card">
                        <h3 className="card-title">Monthly Limit</h3>
                        <div className="limit-display">
                            <div className="limit-bar-large">
                                <div
                                    className="limit-progress"
                                    style={{ width: `${Math.min(monthlyPercentage, 100)}%` }}
                                ></div>
                            </div>
                            <div className="limit-stats">
                                <div>
                                    <span className="text-muted text-sm">Spent This Month</span>
                                    <strong style={{ fontSize: '1.25rem' }}>₹{circle.currentMonthlySpent.toFixed(2)}</strong>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <span className="text-muted text-sm">Available</span>
                                    <strong style={{ fontSize: '1.25rem', color: 'var(--success)' }}>
                                        ₹{monthlyRemaining.toFixed(2)}
                                    </strong>
                                </div>
                            </div>
                            <p className="text-muted text-sm text-center mt-1">
                                Limit: ₹{circle.monthlyLimit.toFixed(2)} • {monthlyPercentage.toFixed(1)}% used
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Recent Transactions */}
            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">📜 Your Transactions ({transactions.length})</h3>
                </div>

                {transactions.length === 0 ? (
                    <p className="text-muted text-center" style={{ padding: 'var(--space-lg)' }}>
                        No transactions yet. Click "Request Payment" to get started!
                    </p>
                ) : (
                    <div className="transaction-list">
                        {transactions.map((tx) => (
                            <div key={tx.id} className="transaction-item">
                                <div className="transaction-info">
                                    <strong>{tx.description || 'Payment'}</strong>
                                    <div className="flex gap-sm mt-1">
                                        <span className="text-muted text-sm">To: {tx.toUpiId}</span>
                                        {tx.autoApproved !== undefined && (
                                            <span className="badge badge-info text-sm">
                                                {tx.autoApproved ? '⚡ Instant' : '⏳ Approved'}
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-muted text-sm">
                                        {new Date(tx.createdAt).toLocaleString()}
                                    </span>
                                </div>
                                <div className="transaction-details">
                                    <strong style={{ fontSize: '1.125rem' }}>₹{tx.amount.toFixed(2)}</strong>
                                    {tx.status === 'COMPLETED' && (
                                        <span className="badge badge-success">✓ Completed</span>
                                    )}
                                    {tx.status === 'PENDING' && (
                                        <span className="badge badge-pending">⏳ Pending Approval</span>
                                    )}
                                    {tx.status === 'REJECTED' && (
                                        <span className="badge badge-danger">✗ Rejected</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Payment Request Modal */}
            {showPaymentModal && (
                <PaymentRequestModal
                    onClose={() => setShowPaymentModal(false)}
                    onSubmit={handlePaymentRequest}
                    isMinor={user.isMinor}
                />
            )}
        </div>
    );
};

export default SecondaryDashboard;
