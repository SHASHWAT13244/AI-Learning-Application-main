import { type ReactNode } from 'react';

export const Pageheader = ({
    title,
    subtitle,
    children,
}: {
    title: string;
    subtitle?: string;
    children?: ReactNode;
}) => {
    return (
        <div className="flex items-center justify-between mb-6">
            <div>
                <h1 className="text-2xl font-medium text-slate-900 dark:text-slate-100 tracking-tight mb-2">
                    {title}
                </h1>
                {subtitle && (
                    <p className="text-slate-400 text-sm dark:text-slate-500">{subtitle}</p>
                )}
            </div>
            {children && <div>{children}</div>}
        </div>
    );
};
