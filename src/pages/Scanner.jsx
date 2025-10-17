import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI, scanAPI } from '../services/api';
import { Html5QrcodeScanner } from 'html5-qrcode';
import './Scanner.css';

const Scanner = () => {
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(false);
  const [cameraMode, setCameraMode] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [marking, setMarking] = useState(false);
  const [scannedCodes, setScannedCodes] = useState(new Set());
  const scannerRef = useRef(null);
  const html5QrcodeScannerRef = useRef(null);

  // Initialize QR Scanner when camera mode is enabled
  useEffect(() => {
    if (cameraMode && !html5QrcodeScannerRef.current) {
      const scanner = new Html5QrcodeScanner(
        'qr-reader',
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        false
      );

      scanner.render(onScanSuccess, onScanError);
      html5QrcodeScannerRef.current = scanner;
    }

    return () => {
      if (html5QrcodeScannerRef.current) {
        html5QrcodeScannerRef.current.clear().catch((err) => {
          console.error('Failed to clear scanner:', err);
        });
        html5QrcodeScannerRef.current = null;
      }
    };
  }, [cameraMode]);

  const onScanSuccess = async (decodedText, decodedResult) => {
    console.log('QR Code scanned:', decodedText);
    
    // Stop the scanner immediately to prevent multiple scans
    if (html5QrcodeScannerRef.current) {
      html5QrcodeScannerRef.current.pause(true);
    }
    
    // Check if this code was already scanned in this session
    if (scannedCodes.has(decodedText.trim())) {
      setError('This QR code was already scanned in this session');
      if (html5QrcodeScannerRef.current) {
        html5QrcodeScannerRef.current.clear();
        html5QrcodeScannerRef.current = null;
      }
      setCameraMode(false);
      return;
    }
    
    setCameraMode(false);
    setLoading(true);
    setError('');
    setScanResult(null);

    try {
      // Fetch registration details without marking attendance
      const response = await scanAPI.getDetails(decodedText.trim());
      setScanResult(response);
      
      // Add to scanned codes set
      setScannedCodes(prev => new Set([...prev, decodedText.trim()]));
      
      // Clear the scanner
      if (html5QrcodeScannerRef.current) {
        html5QrcodeScannerRef.current.clear();
        html5QrcodeScannerRef.current = null;
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch details');
      // Clear the scanner on error
      if (html5QrcodeScannerRef.current) {
        html5QrcodeScannerRef.current.clear();
        html5QrcodeScannerRef.current = null;
      }
    } finally {
      setLoading(false);
    }
  };

  const onScanError = (errorMessage) => {
    // Ignore frequent scan errors, they're normal when searching for QR codes
    console.log('Scan error (ignoring):', errorMessage);
  };

  const toggleCameraMode = () => {
    if (cameraMode && html5QrcodeScannerRef.current) {
      html5QrcodeScannerRef.current.clear();
      html5QrcodeScannerRef.current = null;
    }
    setCameraMode(!cameraMode);
    setError('');
    setScanResult(null);
  };

  const handleLogout = () => {
    if (html5QrcodeScannerRef.current) {
      html5QrcodeScannerRef.current.clear();
    }
    authAPI.logout();
    navigate('/login');
  };

  const handleManualScan = async (e) => {
    e.preventDefault();
    if (!manualInput.trim()) return;

    const registrationId = manualInput.trim();
    
    // Check if this code was already scanned in this session
    if (scannedCodes.has(registrationId)) {
      setError('This QR code was already scanned in this session');
      return;
    }

    setLoading(true);
    setError('');
    setScanResult(null);

    try {
      // Fetch registration details without marking attendance
      const response = await scanAPI.getDetails(registrationId);
      setScanResult(response);
      setManualInput('');
      
      // Add to scanned codes set
      setScannedCodes(prev => new Set([...prev, registrationId]));
    } catch (err) {
      setError(err.message || 'Failed to fetch details');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAttendance = async () => {
    if (!scanResult || !scanResult.data) return;
    
    setMarking(true);
    setError('');

    try {
      const response = await scanAPI.markAttendance(scanResult.data.registrationId);
      
      // Update scan result with the new data from response
      setScanResult({
        ...response,
        justMarked: true // Flag to show success message instead of warning
      });
    } catch (err) {
      setError(err.message || 'Failed to mark attendance');
    } finally {
      setMarking(false);
    }
  };

  const resetScan = () => {
    setScanResult(null);
    setError('');
    setManualInput('');
    if (html5QrcodeScannerRef.current) {
      html5QrcodeScannerRef.current.clear();
      html5QrcodeScannerRef.current = null;
    }
    setCameraMode(false);
    // Don't clear scannedCodes - keep tracking across scans
  };

  return (
    <div className="scanner-container">
      <header className="scanner-header">
        <div className="header-content">
          <h1>📱 QR Scanner</h1>
          <p>DJ Night 2025 - Entry Verification</p>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <div className="scanner-content">
        {!scanResult && !error && (
          <div className="scanner-section">
            <div className="scanner-mode-toggle">
              <button 
                className={`mode-btn ${!cameraMode ? 'active' : ''}`}
                onClick={() => {
                  if (cameraMode) toggleCameraMode();
                }}
              >
                ⌨️ Manual Entry
              </button>
              <button 
                className={`mode-btn ${cameraMode ? 'active' : ''}`}
                onClick={toggleCameraMode}
              >
                📷 Camera Scan
              </button>
            </div>

            {!cameraMode ? (
              <>
                <div className="scanner-instructions">
                  <h2>How to Scan</h2>
                  <ol>
                    <li>Enter the Registration ID from the QR code</li>
                    <li>Or use Camera Scan mode to scan directly</li>
                    <li>Submit to verify entry</li>
                  </ol>
                </div>

                <form onSubmit={handleManualScan} className="manual-input-form">
                  <h3>Enter Registration ID</h3>
                  <div className="input-group">
                    <input
                      type="text"
                      value={manualInput}
                      onChange={(e) => setManualInput(e.target.value.toUpperCase())}
                      placeholder="DJ2025-0001"
                      className="scan-input"
                      autoFocus
                      disabled={loading}
                    />
                    <button 
                      type="submit" 
                      className="scan-btn"
                      disabled={loading || !manualInput.trim()}
                    >
                      {loading ? 'Verifying...' : 'Verify Entry'}
                    </button>
                  </div>
                  <p className="input-hint">Format: DJ2025-XXXX</p>
                </form>

                <div className="scanner-note">
                  <p>💡 <strong>Tip:</strong> Click Camera Scan button above to scan QR codes directly</p>
                </div>
              </>
            ) : (
              <div className="camera-scanner-section">
                <h2>📷 Camera Scanner</h2>
                <p className="camera-instructions">
                  Allow camera access when prompted, then point your camera at the QR code
                </p>
                
                <div id="qr-reader" ref={scannerRef} className="qr-reader-container"></div>
                
                {loading && (
                  <div className="scanning-overlay">
                    <div className="spinner"></div>
                    <p>Verifying registration...</p>
                  </div>
                )}
                
                <button className="cancel-camera-btn" onClick={toggleCameraMode}>
                  Cancel Camera Scan
                </button>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="result-section error-result">
            <div className="result-icon">❌</div>
            <h2>Access Denied</h2>
            <p className="result-message">{error}</p>
            <button className="reset-btn" onClick={resetScan}>
              Scan Another Code
            </button>
          </div>
        )}

        {scanResult && scanResult.valid && (
          <div className={`result-section compact ${
            scanResult.justMarked ? 'success-result' : 
            (scanResult.data.attended ? 'warning-result' : 'info-result')
          }`}>
            
            {/* Status Header */}
            <div className="result-header">
              <div className="status-badge-large">
                {scanResult.justMarked ? '✅' : (scanResult.data.attended ? '⚠️' : '📋')}
                <span>
                  {scanResult.justMarked ? 'Check-In Complete' : 
                   (scanResult.data.attended ? 'Already Checked In' : 'Ready to Check In')}
                </span>
              </div>
            </div>

            {/* Main Info Grid - Compact 2-column layout */}
            <div className="info-grid-compact">
              <div className="info-card">
                <div className="info-label">Guest Name</div>
                <div className="info-value large">{scanResult.data.name}</div>
              </div>
              
              <div className="info-card">
                <div className="info-label">Registration ID</div>
                <div className="info-value mono">{scanResult.data.registrationId}</div>
              </div>
              
              <div className="info-card highlight">
                <div className="info-label">Type</div>
                <div className="info-value">{scanResult.data.type}</div>
              </div>
              
              <div className="info-card highlight">
                <div className="info-label">Total Guests</div>
                <div className="info-value large">{scanResult.data.totalMembers}</div>
              </div>
              
              <div className="info-card">
                <div className="info-label">Status</div>
                <div className={`info-value ${scanResult.data.status === 'Accepted' ? 'status-accepted' : 'status-pending'}`}>
                  {scanResult.data.status === 'Accepted' ? '✓ ' : '⏳ '}{scanResult.data.status}
                </div>
              </div>
              
              <div className="info-card">
                <div className="info-label">Payment</div>
                <div className="info-value">₹{scanResult.data.amount.toLocaleString()}</div>
              </div>
            </div>

            {/* Additional Members - Compact Pills */}
            {scanResult.data.additionalMembers && scanResult.data.additionalMembers.length > 0 && (
              <div className="members-compact">
                <div className="members-label">
                  👥 +{scanResult.data.additionalMembers.length} Guest{scanResult.data.additionalMembers.length > 1 ? 's' : ''}:
                </div>
                <div className="members-pills">
                  {scanResult.data.additionalMembers.map((member, index) => (
                    <span key={index} className="member-pill">
                      {member.firstName} {member.lastName}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Check-in Status Alert */}
            {scanResult.data.attended && !scanResult.justMarked && (
              <div className="alert-banner warning">
                <span className="alert-icon">⚠️</span>
                <div className="alert-content">
                  <strong>Already Checked In</strong>
                  <span className="alert-time">
                    {new Date(scanResult.data.attendedAt).toLocaleString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            )}

            {scanResult.justMarked && (
              <div className="alert-banner success">
                <span className="alert-icon">✅</span>
                <div className="alert-content">
                  <strong>Check-In Successful!</strong>
                  <span className="alert-time">
                    Entry allowed at {new Date(scanResult.data.attendedAt).toLocaleString('en-IN', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            )}

            {scanResult.data.status !== 'Accepted' && (
              <div className="alert-banner error">
                <span className="alert-icon">🚫</span>
                <div className="alert-content">
                  <strong>Cannot Check In</strong>
                  <span className="alert-time">Registration not approved</span>
                </div>
              </div>
            )}

            {/* Action Buttons - Compact */}
            <div className="action-buttons-compact">
              {!scanResult.data.attended && !scanResult.justMarked && scanResult.data.status === 'Accepted' && (
                <button 
                  className="btn-primary-large" 
                  onClick={handleMarkAttendance}
                  disabled={marking}
                >
                  {marking ? (
                    <>
                      <span className="spinner-small"></span>
                      Processing...
                    </>
                  ) : (
                    <>
                      ✓ Confirm Check-In
                    </>
                  )}
                </button>
              )}
              
              <button className="btn-secondary-large" onClick={resetScan}>
                ← Scan Next
              </button>
            </div>
          </div>
        )}
      </div>

      <footer className="scanner-footer">
        <div className="footer-stats">
          <p>Scan and verify guest entries quickly and securely</p>
        </div>
      </footer>
    </div>
  );
};

export default Scanner;
