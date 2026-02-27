import type { TabsTypes } from '../../types';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallbackComponent } from './ErrorFallbackComponent';

export const Tabs = ({ tab, activeTab, setActiveTab }: TabsTypes) => {
    return (
        <ErrorBoundary
            fallbackRender={props => <ErrorFallbackComponent {...props} />}
        >
            <div className="w-full">
                <div className="realtive border-2 border-slate-100">
                    <nav className="flex gap-2">
                        {tab.map(d => (
                            <button
                                key={d.name}
                                onClick={() => setActiveTab(d.name)}
                                className={`relative py-3 px-2  text-sm font-semibold transition-all duration-200 ${
                                    activeTab === d.name
                                        ? 'text-emerald-600'
                                        : 'text-slate-600 hover:text-slate-900'
                                }
          `}
                            >
                                <span className="relative z-10">{d.label}</span>
                                {activeTab === d.name && (
                                    <div className="absolute bottom-0 left-0 h-0.5 bg-linear-to-r from-emerald-500 to-teal-500 rounded-full shadow-lg shadow-emerald-500/25"></div>
                                )}
                                {activeTab === d.name && (
                                    <div className="absolute inset-0 bg-linear-to-b from-emerald-50/50 to-transparent rounded-xl -z-10"></div>
                                )}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="py-6">
                    {tab.map(d => {
                        if (d.name == activeTab) {
                            return (
                                <div
                                    key={d.name}
                                    className="animate-in fade-in duration-300"
                                >
                                    {d.content}
                                </div>
                            );
                        }
                        return null;
                    })}
                </div>
            </div>
        </ErrorBoundary>
    );
};
