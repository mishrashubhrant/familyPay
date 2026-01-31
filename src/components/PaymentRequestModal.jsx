import { useState } from 'react';
import { APPROVAL_THRESHOLD } from '../services/mockData';

const PaymentRequestModal = ({ onClose, onSubmit, isMinor }) => {
    const [formData, setFormData] = useState({
        toUpiId: '',
        amount: '',
        description: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const willRequireApproval = formData.amount && parseFloat(formData.amount) > APPROVAL_THRESHOLD;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.toUpiId.includes('@')) {
            setError('Invalid UPI ID format (example: user@bank)');
            return;
        }

        if (parseFloat(formData.amount) <= 0) {
            setError('Amount must be greater than 0');
            return;
        }

        setLoading(true);

        try {
            const result = await onSubmit({
                toUpiId: formData.toUpiId,
                amount: parseFloat(formData.amount),
                description: formData.description
            });

            // Show success message
            if (result?.data?.message) {
                alert(result.data.message);
            }
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content fade-in">
                <div className="modal-header">
                    <h3>💸 Request Payment</h3>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                <div className="threshold-info">
                    <p className="text-sm text-muted mb-1">Smart Approval System</p>
                    <p>
                        Payments <strong>under ₹1,000</strong> are approved instantly<br />
                        Payments <strong>above ₹1,000</strong> require admin approval
                    </p>
                </div>

                {isMinor && (
                    <div className="alert alert-info">
                        ℹ️ As a minor user, all your payments require admin approval regardless of amount.
                    </div>
                )}

                {error && <div className="alert alert-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Recipient UPI ID</label>
                        <input
                            type="text"
                            name="toUpiId"
                            className="form-input"
                            placeholder="recipient@bank"
                            value={formData.toUpiId}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Amount (₹)</label>
                        <input
                            type="number"
                            name="amount"
                            className="form-input"
                            placeholder="Enter amount"
                            min="1"
                            step="0.01"
                            value={formData.amount}
                            onChange={handleChange}
                            required
                        />
                        {willRequireApproval && (
                            <p className="text-sm mt-1" style={{ color: 'var(--warning)' }}>
                                ⚠️ This amount exceeds ₹1,000 - will require admin approval
                            </p>
                        )}
                        {formData.amount && !willRequireApproval && parseFloat(formData.amount) > 0 && (
                            <p className="text-sm mt-1" style={{ color: 'var(--success)' }}>
                                ✓ This payment will be approved instantly
                            </p>
                        )}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Description (Optional)</label>
                        <input
                            type="text"
                            name="description"
                            className="form-input"
                            placeholder="What is this payment for?"
                            value={formData.description}
                            onChange={handleChange}
                            maxLength="255"
                        />
                    </div>

                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : 'Send Request'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PaymentRequestModal;
