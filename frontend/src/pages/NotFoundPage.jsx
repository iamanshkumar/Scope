import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 text-center">
      <h1 className="text-9xl font-bold text-brand">404</h1>
      <p className="text-2xl text-slate-600 dark:text-slate-300 mt-4">Page Not Found</p>
      <Link to="/login" className="mt-8 px-6 py-3 bg-brand text-white rounded-lg hover:bg-brand/90 transition-colors">
        Go Home
      </Link>
    </div>
  );
};
export default NotFoundPage;