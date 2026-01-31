// Mock Data with ₹1000 threshold logic and REAL-TIME UPDATES
export const mockUsers = {
    primary: {
        id: 1,
        name: "Rajnish",
        email: "rajnish@familypay.com",
        phone: "9876543210",
        role: "PRIMARY",
        isMinor: false,
        upiId: "rajnish@paytm"
    },
    secondary1: {
        id: 2,
        name: "Sangam",
        email: "sangam@familypay.com",
        phone: "9876543211",
        role: "SECONDARY",
        isMinor: false,
        upiId: "sangam@paytm"
    },
    secondary2: {
        id: 3,
        name: "Raveena",
        email: "raveena@familypay.com",
        phone: "9876543212",
        role: "SECONDARY",
        isMinor: true,
        upiId: "raveena@paytm"
    },
    secondary3: {
        id: 4,
        name: "Shubh",
        email: "shubh@familypay.com",
        phone: "9876543213",
        role: "SECONDARY",
        isMinor: false,
        upiId: "shubh@paytm"
    }
};

export const mockCircle = {
    id: 1,
    circleName: "Doe Family Circle",
    primaryUserId: 1,
    members: [
        {
            id: 1,
            circleId: 1,
            secondaryUserId: 2,
            dailyLimit: 5000.00,
            monthlyLimit: 50000.00,
            currentDailySpent: 750.00,
            currentMonthlySpent: 8500.00,
            lastResetDate: new Date().toISOString().split('T')[0],
            secondaryUser: mockUsers.secondary1
        },
        {
            id: 2,
            circleId: 1,
            secondaryUserId: 3,
            dailyLimit: 2000.00,
            monthlyLimit: 15000.00,
            currentDailySpent: 200.00,
            currentMonthlySpent: 2300.00,
            lastResetDate: new Date().toISOString().split('T')[0],
            secondaryUser: mockUsers.secondary2
        },
        {
            id: 3,
            circleId: 1,
            secondaryUserId: 4,
            dailyLimit: 8000.00,
            monthlyLimit: 80000.00,
            currentDailySpent: 3200.00,
            currentMonthlySpent: 32800.00,
            lastResetDate: new Date().toISOString().split('T')[0],
            secondaryUser: mockUsers.secondary3
        }
    ]
};

// ₹1000 Threshold Logic
export const APPROVAL_THRESHOLD = 1000;

export const mockTransactions = [
    {
        id: 1,
        fromUserId: 2,
        toUpiId: "grocery@paytm",
        amount: 450.00,
        status: "COMPLETED",
        description: "Grocery Shopping",
        transactionRef: "UPI202601311234567",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        fromUser: mockUsers.secondary1,
        autoApproved: true
    },
    {
        id: 2,
        fromUserId: 2,
        toUpiId: "electronics@paytm",
        amount: 1500.00,
        status: "COMPLETED",
        description: "New Headphones",
        transactionRef: "UPI202601311234568",
        approvedBy: 1,
        approvedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        fromUser: mockUsers.secondary1,
        autoApproved: false
    },
    {
        id: 3,
        fromUserId: 4,
        toUpiId: "fashion@paytm",
        amount: 1200.00,
        status: "PENDING",
        description: "Designer Clothing",
        createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        fromUser: mockUsers.secondary3,
        autoApproved: false
    },
    {
        id: 4,
        fromUserId: 2,
        toUpiId: "restaurant@paytm",
        amount: 850.00,
        status: "COMPLETED",
        description: "Family Dinner",
        transactionRef: "UPI202601311234570",
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        fromUser: mockUsers.secondary1,
        autoApproved: true
    },
    {
        id: 5,
        fromUserId: 3,
        toUpiId: "toys@paytm",
        amount: 350.00,
        status: "COMPLETED",
        description: "Toy Store",
        transactionRef: "UPI202601311234571",
        approvedBy: 1,
        approvedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        fromUser: mockUsers.secondary2,
        autoApproved: false
    },
    {
        id: 6,
        fromUserId: 4,
        toUpiId: "fuel@paytm",
        amount: 2000.00,
        status: "PENDING",
        description: "Petrol - Monthly",
        createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        fromUser: mockUsers.secondary3,
        autoApproved: false
    },
    {
        id: 7,
        fromUserId: 2,
        toUpiId: "coffee@paytm",
        amount: 250.00,
        status: "COMPLETED",
        description: "Coffee Shop",
        transactionRef: "UPI202601311234572",
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        fromUser: mockUsers.secondary1,
        autoApproved: true
    },
    {
        id: 8,
        fromUserId: 4,
        toUpiId: "pharmacy@paytm",
        amount: 1800.00,
        status: "REJECTED",
        description: "Medical Supplies",
        approvedBy: 1,
        approvedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        fromUser: mockUsers.secondary3,
        autoApproved: false
    }
];

// Calculate analytics dynamically
const calculateAnalytics = () => {
    const completedTxs = mockTransactions.filter(t => t.status === 'COMPLETED');
    const totalSpent = completedTxs.reduce((sum, t) => sum + t.amount, 0);
    const pendingCount = mockTransactions.filter(t => t.status === 'PENDING').length;

    return {
        circle: {
            id: 1,
            name: "Doe Family Circle",
            memberCount: 3
        },
        overall: {
            totalTransactions: completedTxs.length,
            totalSpent: totalSpent,
            pendingApprovals: pendingCount
        },
        members: mockCircle.members.map((member) => ({
            userId: member.secondaryUserId,
            name: member.secondaryUser.name,
            upiId: member.secondaryUser.upiId,
            limits: {
                daily: member.dailyLimit,
                monthly: member.monthlyLimit,
                dailySpent: member.currentDailySpent,
                monthlySpent: member.currentMonthlySpent,
                dailyRemaining: member.dailyLimit - member.currentDailySpent,
                monthlyRemaining: member.monthlyLimit - member.currentMonthlySpent
            },
            spending: {
                totalTransactions: completedTxs.filter(t => t.fromUserId === member.secondaryUserId).length,
                totalSpent: completedTxs
                    .filter(t => t.fromUserId === member.secondaryUserId)
                    .reduce((sum, t) => sum + t.amount, 0)
            }
        }))
    };
};

// Mock API with REAL-TIME UPDATES
export const mockAPI = {
    getCircle: () => Promise.resolve({ data: { success: true, data: mockCircle } }),

    getMyCircle: () => Promise.resolve({
        data: {
            success: true,
            data: mockCircle.members[0] // Alice's membership
        }
    }),

    getPendingPayments: () => {
        const pending = mockTransactions.filter(t => t.status === 'PENDING');
        return Promise.resolve({ data: { success: true, data: pending } });
    },

    getAnalytics: () => {
        const analytics = calculateAnalytics();
        return Promise.resolve({ data: { success: true, data: analytics } });
    },

    getTransactions: () => Promise.resolve({
        data: {
            success: true,
            data: {
                transactions: mockTransactions,
                total: mockTransactions.length
            }
        }
    }),

    approvePayment: (transactionId, approved) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const tx = mockTransactions.find(t => t.id === transactionId);
                if (tx) {
                    tx.status = approved ? 'COMPLETED' : 'REJECTED';
                    tx.approvedBy = 1;
                    tx.approvedAt = new Date().toISOString();

                    if (approved) {
                        tx.transactionRef = `UPI${Date.now()}${Math.floor(Math.random() * 1000)}`;

                        // UPDATE SPENDING LIMITS IN REAL-TIME
                        const member = mockCircle.members.find(m => m.secondaryUserId === tx.fromUserId);
                        if (member) {
                            member.currentDailySpent += tx.amount;
                            member.currentMonthlySpent += tx.amount;
                        }
                    }
                }
                resolve({ data: { success: true, data: tx } });
            }, 500);
        });
    },

    requestPayment: (paymentData) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const amount = paymentData.amount;
                const requiresApproval = amount > APPROVAL_THRESHOLD;

                const newTx = {
                    id: mockTransactions.length + 1,
                    fromUserId: 2,
                    toUpiId: paymentData.toUpiId,
                    amount: amount,
                    status: requiresApproval ? 'PENDING' : 'COMPLETED',
                    description: paymentData.description,
                    transactionRef: requiresApproval ? null : `UPI${Date.now()}${Math.floor(Math.random() * 1000)}`,
                    createdAt: new Date().toISOString(),
                    fromUser: mockUsers.secondary1,
                    autoApproved: !requiresApproval
                };

                mockTransactions.unshift(newTx);

                // UPDATE SPENDING LIMITS IMMEDIATELY FOR AUTO-APPROVED PAYMENTS
                if (!requiresApproval) {
                    const member = mockCircle.members.find(m => m.secondaryUserId === 2);
                    if (member) {
                        member.currentDailySpent += amount;
                        member.currentMonthlySpent += amount;
                    }
                }

                resolve({
                    data: {
                        success: true,
                        data: newTx,
                        message: requiresApproval
                            ? `₹${amount} payment sent for admin approval (>₹${APPROVAL_THRESHOLD})`
                            : `₹${amount} payment completed instantly (<₹${APPROVAL_THRESHOLD})`
                    }
                });
            }, 800);
        });
    }
};
