import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI, scanAPI } from '../services/api';
import { Html5QrcodeScanner } from 'html5-qrcode';
import './Scanner.css';

const Scanner = () => {
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(false);
  const [cameraMode, setCameraMode] = useState(true); // Start with camera mode ON by default
  const [manualInput, setManualInput] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [marking, setMarking] = useState(false);
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
    
    setCameraMode(false);
    setLoading(true);
    setError('');
    setScanResult(null);

    try {
      // Fetch registration details without marking attendance
      const response = await scanAPI.getDetails(decodedText.trim());
      setScanResult(response);
      
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
    if (!manualInput.trim() || manualInput.length !== 4) return;

    // Add BB_ prefix to the 4-digit number
    const ticketId = `BB_${manualInput.trim()}`;

    setLoading(true);
    setError('');
    setScanResult(null);

    try {
      // Fetch registration details without marking attendance using ticket ID
      const response = await scanAPI.getDetails(ticketId);
      setScanResult(response);
      setManualInput('');
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
      // Use ticket ID to mark attendance
      const ticketId = scanResult.data.assignedTicketId || scanResult.data.ticketId;
      const response = await scanAPI.markAttendance(ticketId);
      
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
  };

  return (
    <div className="scanner-container">
      <header className="scanner-header">
        <div className="header-content">
          <h1>📱 QR Scanner</h1>
          <p>BEAT BLAZE 2025 - Entry Verification</p>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <div className="scanner-content">
        {!scanResult && !error && (
          <div className="scanner-section">
            {cameraMode ? (
              <div className="camera-scanner-section">
                <div className="scanner-header-simple">
                  <h2>📷 Scan QR Code</h2>
                  <p className="camera-instructions-simple">
                    Point your camera at the QR code
                  </p>
                </div>
                
                <div id="qr-reader" ref={scannerRef} className="qr-reader-container"></div>
                
                {loading && (
                  <div className="scanning-overlay">
                    <div className="spinner"></div>
                    <p>Verifying registration...</p>
                  </div>
                )}
                
                <div className="scanner-actions-simple">
                  <button className="btn-switch-mode" onClick={() => setCameraMode(false)}>
                    ⌨️ Enter ID Manually
                  </button>
                </div>
              </div>
            ) : (
              <div className="manual-input-section">
                <div className="scanner-header-simple">
                  <h2>⌨️ Enter Ticket ID</h2>
                  <p className="camera-instructions-simple">
                    Enter the 4-digit number (e.g., 0001)
                  </p>
                </div>

                <form onSubmit={handleManualScan} className="manual-input-form-simple">
                  <div className="input-group-simple">
                    <div className="prefix-input-wrapper">
                      <span className="input-prefix">BB_</span>
                      <input
                        type="text"
                        value={manualInput}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          if (value.length <= 4) {
                            setManualInput(value);
                          }
                        }}
                        placeholder="0001"
                        className="scan-input-large with-prefix"
                        maxLength={4}
                        autoFocus
                        disabled={loading}
                      />
                    </div>
                    <button 
                      type="submit" 
                      className="scan-btn-large"
                      disabled={loading || manualInput.length !== 4}
                    >
                      {loading ? '⏳ Verifying...' : '✓ Verify'}
                    </button>
                  </div>
                </form>

                <div className="scanner-actions-simple">
                  <button className="btn-switch-mode" onClick={() => setCameraMode(true)}>
                    📷 Use Camera Instead
                  </button>
                </div>
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
          <div className={`result-section-simple ${
            scanResult.justMarked ? 'success-state' : 
            (scanResult.data.attended ? 'already-checked' : 'ready-state')
          }`}>
            
            {/* Large Status Indicator */}
            <div className="status-hero">
              {scanResult.justMarked ? (
                <>
                  <div className="status-icon success">✅</div>
                  <h2 className="status-title">Check-In Complete!</h2>
                </>
              ) : scanResult.data.attended ? (
                <>
                  <div className="status-icon warning">⚠️</div>
                  <h2 className="status-title">Already Checked In</h2>
                  <p className="status-time">
                    {new Date(scanResult.data.attendedAt).toLocaleString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </>
              ) : scanResult.data.status === 'Accepted' ? (
                <>
                  <div className="status-icon ready">✓</div>
                  <h2 className="status-title">Ready to Check In</h2>
                </>
              ) : (
                <>
                  <div className="status-icon error">🚫</div>
                  <h2 className="status-title">Not Approved</h2>
                  <p className="status-time">Registration pending approval</p>
                </>
              )}
            </div>

            {/* Guest Information - Clean 2-Row Layout */}
            <div className="guest-info-simple">
              <div className="guest-main">
                <div className="guest-name">{scanResult.data.name}</div>
                <div className="guest-id">{scanResult.data.assignedTicketId || scanResult.data.ticketId}</div>
              </div>
              
              <div className="guest-details-row">
                <div className="detail-chip">
                  <span className="chip-label">Type:</span>
                  <span className="chip-value">{scanResult.data.type}</span>
                </div>
                <div className="detail-chip highlight">
                  <span className="chip-label">Guests:</span>
                  <span className="chip-value-large">{scanResult.data.totalMembers}</span>
                </div>
              </div>
            </div>

            {/* Additional Members - Simple List */}
            {scanResult.data.additionalMembers && scanResult.data.additionalMembers.length > 0 && (
              <div className="members-simple">
                <div className="members-title">
                  +{scanResult.data.additionalMembers.length} Additional Guest{scanResult.data.additionalMembers.length > 1 ? 's' : ''}:
                </div>
                <div className="members-names">
                  {scanResult.data.additionalMembers.map((member, index) => (
                    <span key={index} className="member-name">
                      {member.firstName} {member.lastName}
                    </span>
                  )).reduce((prev, curr) => [prev, ', ', curr])}
                </div>
              </div>
            )}

            {/* Action Buttons - Large and Clear */}
            <div className="actions-simple">
              {!scanResult.data.attended && !scanResult.justMarked && scanResult.data.status === 'Accepted' && (
                <button 
                  className="btn-check-in" 
                  onClick={handleMarkAttendance}
                  disabled={marking}
                >
                  {marking ? (
                    <>
                      <span className="spinner-small"></span>
                      Marking Attendance...
                    </>
                  ) : (
                    <>
                      ✓ Mark Attendance
                    </>
                  )}
                </button>
              )}
              
              <button className="btn-next-scan" onClick={resetScan}>
                Scan Next Guest →
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
