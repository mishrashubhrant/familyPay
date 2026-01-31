import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Register = () => {
    const navigate = useNavigate();
    const { register } = useAuth();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        role: 'PRIMARY',
        isMinor: false,
        upiId: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({
            ...formData,
            [e.target.name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.phone.length !== 10) {
            setError('Phone number must be 10 digits');
            return;
        }

        if (!formData.upiId.includes('@')) {
            setError('Invalid UPI ID format (example: user@bank)');
            return;
        }

        setLoading(true);

        const { confirmPassword, ...registerData } = formData;
        const result = await register(registerData);

        if (result.success) {
            // Navigate based on role
            if (result.data.role === 'PRIMARY') {
                navigate('/dashboard/primary');
            } else {
                navigate('/dashboard/secondary');
            }
        } else {
            setError(result.error);
        }

        setLoading(false);
    };

    return (
        <div className="auth-container">
            <div className="auth-card fade-in">
                <div className="auth-header">
                    <h1>My Family Pay</h1>
                    <p className="text-muted">Create your account</p>
                </div>

                {error && (
                    <div className="alert alert-error">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            className="form-input"
                            placeholder="Enter your name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            name="email"
                            className="form-input"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Phone Number</label>
                        <input
                            type="tel"
                            name="phone"
                            className="form-input"
                            placeholder="10 digit phone number"
                            value={formData.phone}
                            onChange={handleChange}
                            pattern="[0-9]{10}"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">UPI ID</label>
                        <input
                            type="text"
                            name="upiId"
                            className="form-input"
                            placeholder="yourname@bank"
                            value={formData.upiId}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Role</label>
                        <select
                            name="role"
                            className="form-select"
                            value={formData.role}
                            onChange={handleChange}
                        >
                            <option value="PRIMARY">Primary User (Family Head)</option>
                            <option value="SECONDARY">Secondary User (Family Member)</option>
                        </select>
                    </div>

                    {formData.role === 'SECONDARY' && (
                        <div className="form-group">
                            <label className="flex" style={{ alignItems: 'center', gap: '0.5rem' }}>
                                <input
                                    type="checkbox"
                                    name="isMinor"
                                    className="form-checkbox"
                                    checked={formData.isMinor}
                                    onChange={handleChange}
                                />
                                <span className="form-label" style={{ marginBottom: 0 }}>I am a minor (requires approval for all payments)</span>
                            </label>
                        </div>
                    )}

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            name="password"
                            className="form-input"
                            placeholder="Create a password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            minLength="6"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            className="form-input"
                            placeholder="Confirm your password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-full"
                        disabled={loading}
                    >
                        {loading ? 'Creating account...' : 'Register'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        Already have an account?{' '}
                        <Link to="/login" className="link">Sign in here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
