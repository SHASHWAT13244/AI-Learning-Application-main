import { useState, type ReactNode } from 'react';
import { Sider } from './Sider';
import { Header } from './Header';

export const AppLayout = ({ children }: { children: ReactNode }) => {
    const [isSidebarEnabled, setIsSidebarEnabled] = useState<boolean>(false);
    const toggleSidebar = () => {
        setIsSidebarEnabled(!isSidebarEnabled);
    };
    return (
        <div className="flex h-screen bg-neutral-50 text-neutral-900">
            <Sider
                isSidebarOpen={isSidebarEnabled}
                toggleSidebar={toggleSidebar}
            />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header toggleSidebar={toggleSidebar} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};
