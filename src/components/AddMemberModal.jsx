import { useState } from 'react';

const AddMemberModal = ({ onClose, onAdd }) => {
    const [formData, setFormData] = useState({
        secondaryUserId: '',
        dailyLimit: 1000,
        monthlyLimit: 10000
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await onAdd({
                secondaryUserId: parseInt(formData.secondaryUserId),
                dailyLimit: parseFloat(formData.dailyLimit),
                monthlyLimit: parseFloat(formData.monthlyLimit)
            });
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content fade-in">
                <div className="modal-header">
                    <h3>Add Family Member</h3>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                {error && <div className="alert alert-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Secondary User ID</label>
                        <input
                            type="number"
                            name="secondaryUserId"
                            className="form-input"
                            placeholder="Enter user ID"
                            value={formData.secondaryUserId}
                            onChange={handleChange}
                            required
                        />
                        <p className="text-muted text-sm mt-1">
                            Ask the user to provide their User ID from their profile
                        </p>
                    </div>

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
                            {loading ? 'Adding...' : 'Add Member'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddMemberModal;
