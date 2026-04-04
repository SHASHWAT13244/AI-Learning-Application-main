/* eslint-disable @typescript-eslint/no-explicit-any */

export const ErrorFallbackComponent = ({ error }: any) => {
    return (
        <div role="alert" className="flex justify-center h-auto items-center p-4">
            <div className="text-center">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">Something went wrong:</h2>
                <pre className="text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                    {error.message}
                </pre>
            </div>
        </div>
    );
};
