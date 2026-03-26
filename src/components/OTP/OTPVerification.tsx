import React, { useState, useEffect } from 'react';
import { ShieldCheck } from 'lucide-react';
import { Button } from '../ui/Button';

interface OTPVerificationProps {
    role: string;
    email: string;
    onVerified: () => void;
}

export const OTPVerification: React.FC<OTPVerificationProps> = ({ role, email, onVerified }) => {
    const [otp, setOtp] = useState('');
    const [enteredOtp, setEnteredOtp] = useState('');
    const [loading, setLoading] = useState(true);
    const [timer, setTimer] = useState(20);

    // Generate OTP
    const generateOtp = () => {
        const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
        setOtp(newOtp);
    };

    useEffect(() => {
        const load = setTimeout(() => {
            generateOtp();
            setLoading(false);
        }, 1000);

        return () => clearTimeout(load);
    }, []);

    // Timer 
    useEffect(() => {
        if (timer === 0) return;

        const interval = setInterval(() => {
            setTimer((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [timer]);

    const handleVerify = () => {
        if (enteredOtp === otp) {
            alert('OTP verified! ✅');
            onVerified();
        } else {
            alert('Invalid OTP ❌');
        }
    };

    // Resend OTP
    const handleResend = () => {
        generateOtp();
        setTimer(20);
        alert('New OTP sent!');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 sm:p-8">

                <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-md">
                        <ShieldCheck size={24} className="text-white" />
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
                    OTP Verification
                </h2>
                <p className="text-center text-sm text-gray-500 mb-6">
                    Enter the OTP sent to your email
                </p>

                {loading ? (
                    <div className="animate-pulse space-y-4">
                        <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
                        <div className="h-10 bg-gray-300 rounded"></div>
                        <div className="h-10 bg-gray-300 rounded"></div>
                    </div>
                ) : (
                    <>
                        <p className="text-sm text-gray-500 text-center mb-4">
                            OTP sent to <span className="font-medium">{email}</span> (Demo):
                            <span className="ml-1 font-bold text-primary-600">{otp}</span>
                        </p>

                        <input
                            type="text"
                            maxLength={6}
                            placeholder="Enter 6-digit OTP"
                            value={enteredOtp}
                            onChange={(e) => setEnteredOtp(e.target.value)}
                            className="w-full border border-gray-300 focus:border-primary-500 focus:ring-2 
              focus:ring-primary-200 px-4 py-3 rounded-xl mb-4 text-center text-lg tracking-widest"
                        />

                        <Button fullWidth onClick={handleVerify}>
                            Verify OTP
                        </Button>

                        {/* Resend Section */}
                        <p className="text-xs text-center text-gray-400 mt-4">
                            Didn’t receive OTP?{" "}
                            {timer > 0 ? (
                                <span>Resend in {timer}s</span>
                            ) : (
                                <span
                                    onClick={handleResend}
                                    className="text-primary-600 cursor-pointer hover:underline"
                                >
                                    Resend OTP
                                </span>
                            )}
                        </p>
                    </>
                )}
            </div>
        </div>
    );
};