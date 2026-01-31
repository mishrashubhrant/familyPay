import { useState } from 'react';

const SetLimitModal = ({ member, onClose, onUpdate }) => {
    const [formData, setFormData] = useState({
        dailyLimit: member.dailyLimit,
        monthlyLimit: member.monthlyLimit
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: parseFloat(e.target.value)
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await onUpdate(member.id, formData);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content fade-in">
                <div className="modal-header">
                    <h3>Set Limits for {member.secondaryUser.name}</h3>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                {error && <div className="alert alert-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Daily Limit (₹)</label>
                        <input
                            type="number"
                            name="dailyLimit"
                            className="form-input"
                            min="0"
                            step="100"
                            value={formData.dailyLimit}
                            onChange={handleChange}
                            required
                        />
                        <p className="text-muted text-sm mt-1">
                            Current spending: ₹{member.currentDailySpent}
                        </p>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Monthly Limit (₹)</label>
                        <input
                            type="number"
                            name="monthlyLimit"
                            className="form-input"
                            min="0"
                            step="100"
                            value={formData.monthlyLimit}
                            onChange={handleChange}
                            required
                        />
                        <p className="text-muted text-sm mt-1">
                            Current spending: ₹{member.currentMonthlySpent}
                        </p>
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
                            {loading ? 'Updating...' : 'Update Limits'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SetLimitModal;
