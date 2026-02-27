/* eslint-disable @typescript-eslint/no-explicit-any */

export const ErrorFallbackComponent = ({ error }: any) => {
    return (
        <div role="alert" className="flex justify-center h-auto items-center">
            <h2>Something went wrong:</h2>
            <pre style={{ color: 'red' }}>{error.message}</pre>
        </div>
    );
};
