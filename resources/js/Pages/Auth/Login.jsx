import { Head, Link, useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import { showError, showSuccess } from '@/Utils/sweetalert';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
    });

    useEffect(() => {
        if (status) {
            showSuccess(status);
        }
    }, [status]);

    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            showError('Please check your credentials and try again.');
        }
    }, [errors]);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <>
            <Head title="Log in" />
            
            <div className="login-container">
                <div className="login-card">
                    <div className="login-header">
                        <h1 className="login-title">Welcome back</h1>
                        <p className="login-subtitle">Sign in to your account</p>
                    </div>

                    <form onSubmit={submit} className="login-form">
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
                                autoFocus
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

                        <button 
                            type="submit" 
                            className="login-button" 
                            disabled={processing}
                        >
                            {processing ? 'Signing in...' : 'Sign in'}
                        </button>
                    </form>

                    <div className="login-footer">
                        {canResetPassword && (
                            <div className="forgot-password">
                                <Link href={route('password.request')}>
                                    Forgot password?
                                </Link>
                            </div>
                        )}
                        <div className="signup-link">
                            <span className="signup-text">Don't have an account? </span>
                            <Link href={route('register')} className="signup-button">
                                Sign up
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

 