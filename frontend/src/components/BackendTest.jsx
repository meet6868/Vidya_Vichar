import React, { useState, useEffect } from 'react';
import API_CONFIG from '../../config/api.js';

const BackendTest = () => {
  const [status, setStatus] = useState('testing');
  const [backendInfo, setBackendInfo] = useState(null);

  useEffect(() => {
    testBackendConnection();
  }, []);

  const testBackendConnection = async () => {
    try {
      setStatus('testing');
      const baseUrl = API_CONFIG.BASE_URL.replace('/api', ''); // Remove /api to get base URL
      console.log('Testing backend connection to:', baseUrl);
      
      const response = await fetch(baseUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Don't include credentials for the base route test
      });
      
      if (response.ok) {
        const data = await response.json();
        setBackendInfo(data);
        setStatus('connected');
        console.log('✅ Backend is reachable:', data);
      } else {
        setStatus('error');
        console.log('❌ Backend returned error:', response.status);
      }
    } catch (error) {
      setStatus('error');
      console.log('❌ Backend connection failed:', error);
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'connected': return 'text-green-400';
      case 'error': return 'text-red-400';
      default: return 'text-yellow-400';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'connected': return '✅';
      case 'error': return '❌';
      default: return '🔄';
    }
  };

  return (
    <div className="fixed bottom-4 left-4 bg-slate-800 text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <h3 className="font-bold mb-2 text-blue-400">🌐 Backend Status</h3>
      <div className="space-y-1">
        <div>
          Status: <span className={getStatusColor()}>
            {getStatusIcon()} {status}
          </span>
        </div>
        <div>URL: <span className="text-slate-300">{API_CONFIG.BASE_URL.replace('/api', '')}</span></div>
        {backendInfo && (
          <>
            <div>Message: <span className="text-slate-300">{backendInfo.message}</span></div>
            <div>Version: <span className="text-slate-300">{backendInfo.version}</span></div>
          </>
        )}
        <button 
          onClick={testBackendConnection}
          className="mt-2 px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs"
        >
          Test Again
        </button>
      </div>
    </div>
  );
};

export default BackendTest;
