import React, { useState, useMemo } from 'react';
import './App.css';
import RequestLog from './modules/requestLog/RequestLog';
import ApiLog from './modules/apiLog/ApiLog';

function App() {
  const [selectedFunction, setSelectedFunction] = useState<string | null>(null);
  const [requestLogState, setRequestLogState] = useState({
    fileContent: '',
    analysisResult: ''
  });
  const [apiLogState, setApiLogState] = useState({
    fileContent: '',
    apiNumber: ''
  });

  const handleFunctionClick = (functionName: string) => {
    setSelectedFunction(functionName);
  };

  return (
    <div className="app-container">
      <div className="sidebar">
        <div className="sidebar-header">Api Log Util</div>
        <button
          onClick={() => handleFunctionClick('flutter-request.log')}
          className={selectedFunction === 'flutter-request.log' ? 'selected' : ''}
        >
          flutter-request.log
        </button>
        <button
          onClick={() => handleFunctionClick('flutter-api.log')}
          className={selectedFunction === 'flutter-api.log' ? 'selected' : ''}
        >
          flutter-api.log
        </button>
      </div>
      <div className="main-content">
        <div className="main-header">
          {selectedFunction ? selectedFunction : 'Api Log Util'}
        </div>
        <div className="main-body">
          {selectedFunction === 'flutter-request.log' ? (
            <RequestLog
              state={requestLogState}
              setState={setRequestLogState}
            />
          ) : selectedFunction === 'flutter-api.log' ? (
            <ApiLog
              state={apiLogState}
              setState={setApiLogState}
            />
          ) : (
            <p></p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
