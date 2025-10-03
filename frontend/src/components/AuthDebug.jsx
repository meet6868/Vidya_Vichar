import React, { useEffect, useState } from 'react';

const AuthDebug = () => {
  const [authState, setAuthState] = useState({});

  useEffect(() => {
    const checkAuthState = () => {
      const token = localStorage.getItem('token');
      const userRole = localStorage.getItem('userRole');
      const userData = localStorage.getItem('userData');

      setAuthState({
        hasToken: !!token,
        tokenPreview: token ? token.substring(0, 20) + '...' : 'None',
        userRole,
        hasUserData: !!userData,
        userData: userData ? JSON.parse(userData) : null,
        timestamp: new Date().toISOString()
      });
    };

    checkAuthState();
    // Check every 5 seconds
    const interval = setInterval(checkAuthState, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 bg-slate-800 text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <h3 className="font-bold mb-2 text-yellow-400">🔍 Auth Debug</h3>
      <div className="space-y-1">
        <div>Token: <span className={authState.hasToken ? 'text-green-400' : 'text-red-400'}>
          {authState.hasToken ? '✅ Present' : '❌ Missing'}
        </span></div>
        <div>Preview: <span className="text-slate-300">{authState.tokenPreview}</span></div>
        <div>Role: <span className="text-blue-400">{authState.userRole || 'None'}</span></div>
        <div>User Data: <span className={authState.hasUserData ? 'text-green-400' : 'text-red-400'}>
          {authState.hasUserData ? '✅ Present' : '❌ Missing'}
        </span></div>
        {authState.userData && (
          <div>Name: <span className="text-slate-300">{authState.userData.name || 'N/A'}</span></div>
        )}
        <div className="text-slate-400 text-xs mt-2">Updated: {authState.timestamp}</div>
      </div>
    </div>
  );
};

export default AuthDebug;
