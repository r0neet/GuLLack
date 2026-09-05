import React from "react";

const NotFoundPage: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-gray-900">
            <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">Page Not Found</p>
            <a href="/" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">
                Go Home
            </a>
        </div>
    );
};

export default NotFoundPage;
