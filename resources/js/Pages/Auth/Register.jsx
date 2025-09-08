import { Head, Link, useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import { showError, showSuccess } from '@/Utils/sweetalert';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            showError('Please check the form and try again.');
        }
    }, [errors]);

    const submit = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    return (
        <>
            <Head title="Register" />
            
            <div className="login-container">
                <div className="login-card">
                    <div className="login-header">
                        <h1 className="login-title">Create account</h1>
                        <p className="login-subtitle">Sign up to get started</p>
                    </div>

                    <form onSubmit={submit} className="login-form">
                        <div className="form-group">
                            <label htmlFor="name" className="form-label">
                                Name
                            </label>
                            <input
                                id="name"
                                type="text"
                                className={`form-input ${errors.name ? 'error' : ''}`}
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Enter your full name"
                                required
                                autoFocus
                            />
                            {errors.name && (
                                <div className="error-message">{errors.name}</div>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="email" className="form-label">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                className={`form-input ${errors.email ? 'error' : ''}`}
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="Enter your email"
                                required
                            />
                            {errors.email && (
                                <div className="error-message">{errors.email}</div>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="password" className="form-label">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                className={`form-input ${errors.password ? 'error' : ''}`}
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="Enter your password"
                                required
                            />
                            {errors.password && (
                                <div className="error-message">{errors.password}</div>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="password_confirmation" className="form-label">
                                Confirm Password
                            </label>
                            <input
                                id="password_confirmation"
                                type="password"
                                className={`form-input ${errors.password_confirmation ? 'error' : ''}`}
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                placeholder="Confirm your password"
                                required
                            />
                            {errors.password_confirmation && (
                                <div className="error-message">{errors.password_confirmation}</div>
                            )}
                        </div>

                        <button 
                            type="submit" 
                            className="login-button" 
                            disabled={processing}
                        >
                            {processing ? 'Creating account...' : 'Create account'}
                        </button>
                    </form>

                    <div className="login-footer">
                        <div className="signup-link">
                            <span className="signup-text">Already have an account? </span>
                            <Link href={route('login')} className="signup-button">
                                Sign in
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
