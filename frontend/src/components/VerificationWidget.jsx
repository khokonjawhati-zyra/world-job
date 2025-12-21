
import React, { useState, useEffect } from 'react';

const VerificationWidget = ({ userId = '101', userType = 'WORKER' }) => {
    const [status, setStatus] = useState({ isVerified: false, requests: [] });
    const [loading, setLoading] = useState(true);
    // Added country and identityDocType state
    const [formData, setFormData] = useState({ type: 'IDENTITY', identityDocType: 'NATIONAL_ID', country: 'United States', data: '' });
    const [file, setFile] = useState(null);
    const [uploadMode, setUploadMode] = useState('FILE'); // 'FILE' or 'URL'
    const [showInsurance, setShowInsurance] = useState(false);

    const API_URL = 'http://localhost:3001';

    useEffect(() => {
        fetchStatus();
    }, [userId]);

    const fetchStatus = () => {
        setLoading(true);
        fetch(`${API_URL}/verification/status/${userId}`)
            .then(res => res.json())
            .then(data => {
                setStatus(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append('userId', userId);
        data.append('userType', userType);
        data.append('type', formData.type);

        if (formData.type === 'IDENTITY') {
            if (uploadMode === 'FILE' && file) {
                // File Upload Mode
                data.append('file', file);
                data.append('data', `[${formData.country}] [${formData.identityDocType}] Uploaded File`);
            } else if (uploadMode === 'URL' && formData.data) {
                // URL Mode
                const submissionData = `[${formData.country}] [${formData.identityDocType}] ${formData.data}`;
                data.append('data', submissionData);
            } else {
                // Fallback
                const submissionData = `[${formData.country}] [${formData.identityDocType}] (No Data Provided)`;
                data.append('data', submissionData);
            }
        } else {
            // Fallback for non-identity or text input
            const submissionData = formData.type === 'IDENTITY'
                ? `[${formData.country}] [${formData.identityDocType}] ${formData.data}`
                : formData.data;
            data.append('data', submissionData);
        }

        fetch(`${API_URL}/verification/submit`, {
            method: 'POST',
            body: data
        })
            .then(async res => {
                if (!res.ok) {
                    const errorText = await res.text();
                    throw new Error(`Server Error: ${res.status} ${errorText}`);
                }
                return res.json();
            })
            .then(() => {
                alert('Verification Request Submitted! Admin will review your ' + formData.identityDocType);
                fetchStatus();
                setFormData({ ...formData, data: '' });
                setFile(null);
            })
            .catch(err => {
                console.error("Verification Submission Error:", err);
                alert(`Failed to submit verification request: ${err.message}`);
            });
    };

    if (loading) return <div className="glass-panel" style={{ padding: '20px' }}>Loading Verification Status...</div>;

    // Sort requests by date descending to get the latest status
    const sortedRequests = [...status.requests].sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
    const latestIdentityReq = sortedRequests.find(r => r.type === 'IDENTITY');

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            {/* Identity Verification Panel */}
            <div className="glass-panel" style={{ padding: '30px', borderRadius: '20px', border: status.isVerified ? '1px solid var(--neon-lime)' : '1px solid var(--glass-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ margin: 0 }}>
                        Identity Verification
                        {status.isVerified && <span style={{ marginLeft: '10px', color: 'var(--neon-lime)', fontSize: '0.8rem', border: '1px solid var(--neon-lime)', padding: '2px 8px', borderRadius: '4px' }}>VERIFIED</span>}
                    </h3>
                    {status.isVerified ? (
                        <div style={{ fontSize: '2rem' }}>🛡️✅</div>
                    ) : (
                        <div style={{ fontSize: '2rem', filter: 'grayscale(100%) opacity(0.5)' }}>🛡️</div>
                    )}
                </div>

                {status.isVerified ? (
                    <p style={{ color: 'var(--neon-lime)' }}>Your identity has been verified. The Trust Badge is now active on your profile.</p>
                ) : (
                    <div>
                        {/* Show Pending Status if latest is pending */}
                        {latestIdentityReq && latestIdentityReq.status === 'PENDING' ? (
                            <div style={{ padding: '15px', background: 'rgba(255,165,0,0.1)', borderRadius: '10px', border: '1px solid orange', color: 'orange' }}>
                                <strong>Pending Approval:</strong> Your verification request is under review by our Admin team. <br />
                                <small>Submitted on {new Date(latestIdentityReq.submittedAt).toLocaleDateString()}</small>
                            </div>
                        ) : (
                            <div>
                                {/* Show Rejection Notice if latest was rejected */}
                                {latestIdentityReq && latestIdentityReq.status === 'REJECTED' && (
                                    <div style={{ padding: '15px', background: 'rgba(255,0,0,0.1)', borderRadius: '10px', border: '1px solid red', color: 'red', marginBottom: '15px' }}>
                                        <strong>Previous Request Rejected:</strong> Please check your document and try again.
                                    </div>
                                )}

                                {/* Form */}
                                <p style={{ color: 'var(--text-muted)', marginBottom: '15px' }}>Verify your identity to unlock premium jobs and get the Trust Badge.</p>
                                <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '15px', flexDirection: 'column' }}>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <select
                                            value={formData.type}
                                            onChange={e => setFormData({ ...formData, type: e.target.value })}
                                            style={{ padding: '12px', background: '#333', color: '#fff', border: '1px solid #555', borderRadius: '8px', flex: 1 }}
                                        >
                                            <option value="IDENTITY">Government ID</option>
                                            <option value="PHONE">Phone Number</option>
                                            <option value="EMAIL">Email Address</option>
                                        </select>
                                    </div>

                                    {formData.type === 'IDENTITY' && (
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                            <SearchableCountrySelector
                                                value={formData.country}
                                                onChange={(val) => setFormData({ ...formData, country: val })}
                                            />
                                            <select
                                                value={formData.identityDocType}
                                                onChange={e => setFormData({ ...formData, identityDocType: e.target.value })}
                                                style={{ padding: '12px', background: 'rgba(0,0,0,0.3)', color: '#fff', border: '1px solid var(--glass-border)', borderRadius: '8px' }}
                                            >
                                                <option value="NATIONAL_ID">National ID</option>
                                                <option value="PASSPORT">Passport</option>
                                                <option value="DRIVING_LICENSE">Driving License</option>
                                            </select>
                                        </div>
                                    )}

                                    {formData.type === 'IDENTITY' ? (
                                        <div>
                                            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                                                <button
                                                    type="button"
                                                    onClick={() => setUploadMode('FILE')}
                                                    style={{
                                                        flex: 1,
                                                        padding: '8px',
                                                        borderRadius: '5px',
                                                        border: '1px solid var(--glass-border)',
                                                        background: uploadMode === 'FILE' ? 'var(--neon-lime)' : 'transparent',
                                                        color: uploadMode === 'FILE' ? '#000' : '#fff',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    Upload File
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setUploadMode('URL')}
                                                    style={{
                                                        flex: 1,
                                                        padding: '8px',
                                                        borderRadius: '5px',
                                                        border: '1px solid var(--glass-border)',
                                                        background: uploadMode === 'URL' ? 'var(--neon-lime)' : 'transparent',
                                                        color: uploadMode === 'URL' ? '#000' : '#fff',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    Enter URL
                                                </button>
                                            </div>

                                            {uploadMode === 'FILE' ? (
                                                <div style={{ border: '2px dashed #444', padding: '20px', borderRadius: '10px', textAlign: 'center', cursor: 'pointer', position: 'relative', background: 'rgba(255,255,255,0.02)' }}>
                                                    <input
                                                        type="file"
                                                        onChange={(e) => setFile(e.target.files[0])}
                                                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                                                        accept="image/*,application/pdf"
                                                    />
                                                    {file ? (
                                                        <div style={{ color: 'var(--neon-lime)' }}>
                                                            <div style={{ fontSize: '2rem', marginBottom: '5px' }}>📄</div>
                                                            <div>{file.name}</div>
                                                            <div style={{ fontSize: '0.8rem', opacity: 0.7, marginTop: '5px' }}>(Click to change)</div>
                                                        </div>
                                                    ) : (
                                                        <div style={{ color: '#888' }}>
                                                            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📷</div>
                                                            <div>Click or Drag to Upload Document</div>
                                                            <div style={{ fontSize: '0.8rem', opacity: 0.5, marginTop: '5px' }}>Supported: JPG, PNG, PDF</div>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <input
                                                    type="text"
                                                    placeholder="Paste Document URL (Mock Upload)"
                                                    value={formData.data}
                                                    onChange={e => setFormData({ ...formData, data: e.target.value })}
                                                    style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: '#fff', borderRadius: '8px', width: '100%' }}
                                                    required
                                                />
                                            )}
                                        </div>
                                    ) : (
                                        <input
                                            type="text"
                                            placeholder={`Enter ${formData.type.toLowerCase()}`}
                                            value={formData.data}
                                            onChange={e => setFormData({ ...formData, data: e.target.value })}
                                            style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: '#fff', borderRadius: '8px' }}
                                            required
                                        />
                                    )}

                                    {formData.type === 'IDENTITY' && (
                                        <small style={{ color: 'var(--text-muted)' }}>
                                            * Verification rules apply based on <b>{formData.country}</b> regulations.
                                        </small>
                                    )}

                                    <button type="submit" className="btn-neon" style={{ padding: '12px' }}>Submit for Verification</button>
                                </form>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Worker Insurance & Background Check Panel */}
            <div className="glass-panel" style={{ padding: '30px', borderRadius: '20px' }}>
                <h3>Safety & Insurance</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '15px', border: '1px solid var(--glass-border)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                            <span style={{ fontSize: '1.5rem' }}>🛡️</span>
                            <h4 style={{ margin: 0 }}>Worker Insurance</h4>
                        </div>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '15px' }}>
                            Accident & Injury coverage for offline tasks.
                        </p>
                        {showInsurance ? (
                            <div style={{ padding: '10px', background: 'rgba(0,255,0,0.1)', border: '1px solid var(--neon-lime)', borderRadius: '8px', color: 'var(--neon-lime)', textAlign: 'center' }}>
                                Active Coverage
                            </div>
                        ) : (
                            <button
                                onClick={() => { setShowInsurance(true); alert('Insurance Plan Activated via Partner!'); }}
                                className="btn-neon"
                                style={{ width: '100%', fontSize: '0.9rem' }}
                            >
                                Activate Coverage
                            </button>
                        )}
                    </div>

                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '15px', border: '1px solid var(--glass-border)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                            <span style={{ fontSize: '1.5rem' }}>📋</span>
                            <h4 style={{ margin: 0 }}>Background Check</h4>
                        </div>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '15px' }}>
                            Optional check for high-value jobs.
                        </p>
                        <button
                            className="btn-neon"
                            style={{ width: '100%', fontSize: '0.9rem', background: 'transparent', border: '1px solid var(--text-muted)', color: 'var(--text-muted)' }}
                            disabled
                        >
                            Request (Coming Soon)
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SearchableCountrySelector = ({ value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');

    // Filter countries based on search
    const filteredCountries = COUNTRIES.filter(c =>
        c.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div style={{ position: 'relative' }}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    padding: '12px',
                    background: 'rgba(0,0,0,0.3)',
                    color: '#fff',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}
            >
                <span>{value || 'Select Country'}</span>
                <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>▼</span>
            </div>

            {isOpen && (
                <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    zIndex: 100,
                    background: '#1a1a2e',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '8px',
                    marginTop: '5px',
                    maxHeight: '300px',
                    overflowY: 'auto',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.5)'
                }}>
                    <input
                        type="text"
                        placeholder="Search country..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        autoFocus
                        style={{
                            width: '100%',
                            padding: '10px',
                            background: 'rgba(255,255,255,0.05)',
                            border: 'none',
                            borderBottom: '1px solid rgba(255,255,255,0.1)',
                            color: '#fff',
                            outline: 'none'
                        }}
                    />
                    {filteredCountries.length > 0 ? (
                        filteredCountries.map(country => (
                            <div
                                key={country}
                                onClick={() => {
                                    onChange(country);
                                    setIsOpen(false);
                                    setSearch('');
                                }}
                                style={{
                                    padding: '10px',
                                    cursor: 'pointer',
                                    transition: 'background 0.2s',
                                    background: value === country ? 'rgba(0, 255, 255, 0.1)' : 'transparent',
                                    color: value === country ? 'var(--neon-cyan)' : '#ccc'
                                }}
                                onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'}
                                onMouseLeave={(e) => e.target.style.background = value === country ? 'rgba(0, 255, 255, 0.1)' : 'transparent'}
                            >
                                {country}
                            </div>
                        ))
                    ) : (
                        <div style={{ padding: '10px', color: '#666', textAlign: 'center' }}>No matches found</div>
                    )}
                </div>
            )}
        </div>
    );
};

const COUNTRIES = [
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
    "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi",
    "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo (Congo-Brazzaville)", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czechia (Czech Republic)",
    "Democratic Republic of the Congo", "Denmark", "Djibouti", "Dominica", "Dominican Republic",
    "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia",
    "Fiji", "Finland", "France",
    "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana",
    "Haiti", "Holy See", "Honduras", "Hungary",
    "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy",
    "Jamaica", "Japan", "Jordan",
    "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan",
    "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg",
    "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar (formerly Burma)",
    "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway",
    "Oman",
    "Pakistan", "Palau", "Palestine State", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal",
    "Qatar",
    "Romania", "Russia", "Rwanda",
    "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria",
    "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu",
    "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States of America", "Uruguay", "Uzbekistan",
    "Vanuatu", "Venezuela", "Vietnam",
    "Yemen",
    "Zambia", "Zimbabwe"
];

export default VerificationWidget;
