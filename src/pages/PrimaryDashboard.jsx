import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { mockAPI, mockCircle } from '../services/mockData';
import AddMemberModal from '../components/AddMemberModal';
import SetLimitModal from '../components/SetLimitModal';
import './Dashboard.css';

const PrimaryDashboard = () => {
    const { user, logout } = useAuth();

    const [circle, setCircle] = useState(mockCircle);
    const [pendingPayments, setPendingPayments] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showAddMember, setShowAddMember] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            const [circleRes, pendingRes, analyticsRes] = await Promise.all([
                mockAPI.getCircle(),
                mockAPI.getPendingPayments(),
                mockAPI.getAnalytics()
            ]);

            setCircle(circleRes.data.data);
            setPendingPayments(pendingRes.data.data);
            setAnalytics(analyticsRes.data.data);
            setLoading(false);
        } catch (err) {
            console.error('Error loading dashboard:', err);
            setLoading(false);
        }
    };

    const handleApprovePayment = async (transactionId, approved) => {
        try {
            await mockAPI.approvePayment(transactionId, approved);
            loadDashboardData();
        } catch (err) {
            alert('Failed to process payment');
        }
    };

    const handleUpdateLimit = async (memberId, limits) => {
        try {
            // Update mock data
            const member = circle.members.find(m => m.id === memberId);
            if (member) {
                member.dailyLimit = limits.dailyLimit;
                member.monthlyLimit = limits.monthlyLimit;
                setCircle({ ...circle });
            }
            setSelectedMember(null);
        } catch (err) {
            throw new Error('Failed to update limits');
        }
    };

    if (loading) {
        return (
            <div className="dashboard-container flex-center">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="dashboard-container fade-in">
            <header className="dashboard-header">
                <div>
                    <h1>Primary Dashboard</h1>
                    <p className="text-muted">Welcome back, {user.name}! 👋</p>
                </div>
                <div className="flex gap-sm">
                    <span className="badge badge-success">DEMO MODE</span>
                    <button className="btn btn-secondary" onClick={logout}>
                        Refresh Demo
                    </button>
                </div>
            </header>

            {/* Analytics Summary */}
            {analytics && (
                <div className="grid grid-4 mb-4">
                    <div className="stat-card">
                        <div className="stat-label">Total Members</div>
                        <div className="stat-value">{analytics.circle.memberCount}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">Total Spent</div>
                        <div className="stat-value">₹{analytics.overall.totalSpent.toFixed(2)}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">Transactions</div>
                        <div className="stat-value">{analytics.overall.totalTransactions}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">Pending Approvals</div>
                        <div className="stat-value">{analytics.overall.pendingApprovals}</div>
                    </div>
                </div>
            )}

            {/* Pending Approvals */}
            {pendingPayments.length > 0 && (
                <div className="card mb-4">
                    <div className="card-header">
                        <h3 className="card-title">⏳ Pending Approvals</h3>
                    </div>
                    <div className="approval-list">
                        {pendingPayments.map((payment) => (
                            <div key={payment.id} className="approval-item">
                                <div className="approval-info">
                                    <strong>{payment.fromUser.name}</strong>
                                    <span className="text-muted">{payment.description}</span>
                                    <div className="flex gap-sm mt-1">
                                        <span className="badge badge-info">₹{payment.amount}</span>
                                        <span className="text-muted text-sm">To: {payment.toUpiId}</span>
                                    </div>
                                </div>
                                <div className="approval-actions">
                                    <button
                                        className="btn btn-success btn-sm"
                                        onClick={() => handleApprovePayment(payment.id, true)}
                                    >
                                        ✓ Approve
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleApprovePayment(payment.id, false)}
                                    >
                                        ✗ Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Circle Members */}
            <div className="card">
                <div className="card-header flex-between">
                    <h3 className="card-title">👥 Family Members ({circle.members.length})</h3>
                    <button className="btn btn-primary" onClick={() => setShowAddMember(true)}>
                        + Add Member
                    </button>
                </div>

                <div className="members-grid">
                    {circle.members.map((member) => (
                        <div key={member.id} className="member-card">
                            <div className="member-header">
                                <div>
                                    <h4>{member.secondaryUser.name}</h4>
                                    <p className="text-muted text-sm">{member.secondaryUser.upiId}</p>
                                    {member.secondaryUser.isMinor && (
                                        <span className="badge badge-warning mt-1">Minor</span>
                                    )}
                                </div>
                            </div>

                            <div className="member-limits">
                                <div className="limit-item">
                                    <span className="text-muted">Daily Limit</span>
                                    <span className="limit-bar">
                                        <div
                                            className="limit-progress"
                                            style={{
                                                width: `${(member.currentDailySpent / member.dailyLimit) * 100}%`
                                            }}
                                        ></div>
                                    </span>
                                    <span className="text-sm">
                                        ₹{member.currentDailySpent.toFixed(2)} / ₹{member.dailyLimit.toFixed(2)}
                                    </span>
                                </div>

                                <div className="limit-item">
                                    <span className="text-muted">Monthly Limit</span>
                                    <span className="limit-bar">
                                        <div
                                            className="limit-progress"
                                            style={{
                                                width: `${(member.currentMonthlySpent / member.monthlyLimit) * 100}%`
                                            }}
                                        ></div>
                                    </span>
                                    <span className="text-sm">
                                        ₹{member.currentMonthlySpent.toFixed(2)} / ₹{member.monthlyLimit.toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            <div className="member-actions">
                                <button
                                    className="btn btn-secondary btn-sm"
                                    onClick={() => setSelectedMember(member)}
                                >
                                    Set Limits
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modals */}
            {showAddMember && (
                <AddMemberModal
                    onClose={() => setShowAddMember(false)}
                    onAdd={async () => {
                        alert('Demo Mode: Member addition simulated');
                        setShowAddMember(false);
                    }}
                />
            )}

            {selectedMember && (
                <SetLimitModal
                    member={selectedMember}
                    onClose={() => setSelectedMember(null)}
                    onUpdate={handleUpdateLimit}
                />
            )}
        </div>
    );
};

export default PrimaryDashboard;
