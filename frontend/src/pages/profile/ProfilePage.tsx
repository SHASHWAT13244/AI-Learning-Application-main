import { useEffect, useState, type ChangeEvent } from 'react';
import { Pageheader } from '../../components/common/Pageheader';
import { Lock, Mail, User } from 'lucide-react';
import { Button } from '../../components/common/Button';
import AuthServices from '../../services/AuthServices';
import toast from 'react-hot-toast';
import Spinner from '../../components/common/Spinner';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallbackComponent } from '../../components/common/ErrorFallbackComponent';

const ProfilePage = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [passwordLoading, setPasswordLoading] = useState<boolean>(false);

    const [userName, setUserName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [currentPassword, setCurrentPassword] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [cfrmNewPassword, setCfrmNewPassword] = useState<string>('');

    //fetch user profile
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await AuthServices.getProfile();
                setUserName(data.username);
                setEmail(data.email);
            } catch (error) {
                console.error(error);
                toast.error('Failed to fetch profile data');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChangePassword = async (e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (newPassword !== cfrmNewPassword) {
            toast.error('New Password does not match');
            return;
        }
        if (newPassword.length < 6) {
            toast.error('New password must be atleast 6 characters long!');
            return;
        }
        setPasswordLoading(true);
        try {
            await AuthServices.changePassword({ currentPassword, newPassword });
            toast.success('Password changed successfully');
            setCfrmNewPassword('');
            setNewPassword('');
            setCurrentPassword('');
        } catch (error) {
            console.error(error);
            if (error instanceof Error) {
                toast.error(error?.message);
            } else {
                toast.error('Failed to change password');
            }
        } finally {
            setPasswordLoading(false);
        }
    };

    if (loading) {
        return <Spinner />;
    }
    return (
        <div>
            <Pageheader title="Profile Settings" />
            <ErrorBoundary
                fallbackRender={props => <ErrorFallbackComponent {...props} />}
            >
                <div className="space-y-8">
                    {/* User Information display */}
                    <div className="bg-white border border-neutral-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                            User Information
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                                    UserName
                                </label>

                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="w-4 h-4 text-neutral-400" />
                                    </div>
                                    <p className="w-full h-9 pl-9 pr-3 pt-2 border border-neutral-200 rounded-lg bg-neutral-50 text-sm text-neutral-900">
                                        {userName}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                                    Email Address
                                </label>

                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="w-4 h-4 text-neutral-400" />
                                    </div>
                                    <p className="w-full h-9 pl-9 pr-3 pt-2 border border-neutral-200 rounded-lg bg-neutral-50 text-sm text-neutral-900">
                                        {email}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Change pwd form  */}
                    <div className="bg-white border border-neutral-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                            Change Password
                        </h3>
                        <form
                            onSubmit={handleChangePassword}
                            className="space-y-4"
                        >
                            <div>
                                <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                                    Current Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-4 w-4 text-neutral-400" />
                                    </div>
                                    <input
                                        type="password"
                                        value={currentPassword}
                                        onChange={(
                                            e: ChangeEvent<HTMLInputElement>
                                        ) => setCurrentPassword(e.target.value)}
                                        required
                                        className="w-full h-9 pl-9 pr-3 border border-neutral-200 rounded-lg bg-white text-sm text-neutral-900 placeholder-neutral-400 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#00d492] focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                                    New Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-4 w-4 text-neutral-400" />
                                    </div>
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(
                                            e: ChangeEvent<HTMLInputElement>
                                        ) => setNewPassword(e.target.value)}
                                        required
                                        className="w-full h-9 pl-9 pr-3 border border-neutral-200 rounded-lg bg-white text-sm text-neutral-900 placeholder-neutral-400 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#00d42] focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-4 w-4 text-neutral-400" />
                                    </div>
                                    <input
                                        type="password"
                                        value={cfrmNewPassword}
                                        onChange={(
                                            e: ChangeEvent<HTMLInputElement>
                                        ) => setCfrmNewPassword(e.target.value)}
                                        required
                                        className="w-full h-9 pl-9 pr-3 border border-neutral-200 rounded-lg bg-white text-sm text-neutral-900 placeholder-neutral-400 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#00d42] focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Button
                                    type="submit"
                                    disabled={passwordLoading}
                                >
                                    {passwordLoading
                                        ? 'Changing...'
                                        : 'Change Password'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </ErrorBoundary>
        </div>
    );
};

export default ProfilePage;
