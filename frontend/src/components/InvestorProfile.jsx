import React, { useState, useEffect } from 'react';

const InvestorProfile = ({ investorId }) => {
    const [profile, setProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = React.useRef(null);
    const docInputRef = React.useRef(null);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        bio: '',
        linkedin: '',
        riskTolerance: '',
        industries: '',
        capital: 0
    });

    const fetchProfile = React.useCallback(() => {
        setLoading(true);
        // Ensure we pass role=investor to find the correct profile type
        fetch(`https://world-job-backend.vercel.app/profiles/${investorId}?role=investor`)
            .then(res => res.json())
            .then(data => {
                if (data) {
                    setProfile(data);
                    setFormData({
                        name: data.name || '',
                        bio: data.bio || '',
                        linkedin: data.socialLinks || '', // Assuming socialLinks maps to this string from mock
                        riskTolerance: data.preferences?.riskTolerance || 'Medium',
                        industries: data.preferences?.industries?.join(', ') || '',
                        capital: data.totalAssetValue || 0
                    });
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [investorId]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const handleSave = () => {
        const updates = {
            name: formData.name,
            bio: formData.bio,
            socialLinks: formData.linkedin,
            preferences: {
                riskTolerance: formData.riskTolerance,
                industries: formData.industries.split(',').map(s => s.trim())
            },
            totalAssetValue: Number(formData.capital),
            role: 'investor' // Required by backend
        };

        fetch(`https://world-job-backend.vercel.app/profiles/${investorId}/update`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates)
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setProfile(data.profile);
                    setIsEditing(false);
                    alert("Profile Updated Successfully!");
                } else {
                    alert("Update failed");
                }
            })
            .catch(err => alert("Error updating profile"));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('role', 'investor');

        setUploading(true);
        fetch(`https://world-job-backend.vercel.app/profiles/${investorId}/upload-image`, {
            method: 'POST',
            body: formData
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setProfile(prev => ({ ...prev, profileImage: data.url }));
                    alert('Profile Image Updated!');
                } else {
                    alert('Upload failed');
                }
                setUploading(false);
            })
            .catch(err => {
                console.error(err);
                setUploading(false);
                alert('Error uploading image');
            });
    };

    const handleDocUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('role', 'investor');

        setUploading(true);
        fetch(`https://world-job-backend.vercel.app/profiles/${investorId}/upload-document`, {
            method: 'POST',
            body: formData
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setProfile(prev => ({ ...prev, documents: data.documents }));
                    alert('Document Uploaded!');
                } else {
                    alert('Upload failed');
                }
                setUploading(false);
            })
            .catch(err => {
                console.error(err);
                setUploading(false);
                alert('Error uploading document');
            });
    };

    if (loading) return <div style={{ color: '#fff' }}>Loading Profile...</div>;
    if (!profile) return <div style={{ color: '#fff' }}>Profile not found</div>;

    return (
        <div className="glass-panel" style={{ maxWidth: '800px', margin: '0 auto', color: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div
                        style={{
                            width: '80px', height: '80px', borderRadius: '50%',
                            background: profile.profileImage ? `url(${profile.profileImage}) center/cover` : 'linear-gradient(45deg, var(--neon-cyan), var(--neon-blue))',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold',
                            position: 'relative', cursor: 'pointer', border: '2px solid var(--neon-cyan)'
                        }}
                        onClick={() => fileInputRef.current.click()}
                        title="Click to change profile picture"
                    >
                        {!profile.profileImage && (profile.name?.charAt(0) || 'I')}
                        <div style={{ position: 'absolute', bottom: 0, right: 0, background: '#000', borderRadius: '50%', padding: '5px', fontSize: '0.8rem' }}>📷</div>
                    </div>
                    <input type="file" ref={fileInputRef} onChange={handleImageUpload} style={{ display: 'none' }} accept="image/*" />
                    <div>
                        <h2 style={{ margin: 0 }}>{profile.name}</h2>
                        <div style={{ color: 'var(--neon-cyan)', fontSize: '0.9rem' }}>✅ {profile.kycStatus || 'Verified Investor'}</div>
                    </div>
                </div>
                <button
                    onClick={() => {
                        if (isEditing) handleSave();
                        else setIsEditing(true);
                    }}
                    className="btn-neon"
                    style={{ minWidth: '120px' }}
                >
                    {isEditing ? '💾 Save Changes' : '✏️ Edit Profile'}
                </button>
            </div>

            {isEditing ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div style={{ gridColumn: '1 / -1' }}>
                        <label style={{ display: 'block', marginBottom: '5px', color: '#aaa' }}>Full Name</label>
                        <input
                            className="neon-input"
                            style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid #444', borderRadius: '5px', color: '#fff' }}
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div style={{ gridColumn: '1 / -1' }}>
                        <label style={{ display: 'block', marginBottom: '5px', color: '#aaa' }}>Investment Bio</label>
                        <textarea
                            className="neon-input"
                            style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid #444', borderRadius: '5px', color: '#fff', minHeight: '100px' }}
                            value={formData.bio}
                            onChange={e => setFormData({ ...formData, bio: e.target.value })}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', color: '#aaa' }}>Direct Capital ($)</label>
                        <input
                            type="number"
                            className="neon-input"
                            style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid #444', borderRadius: '5px', color: '#fff' }}
                            value={formData.capital}
                            onChange={e => setFormData({ ...formData, capital: e.target.value })}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', color: '#aaa' }}>Risk Tolerance</label>
                        <select
                            style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid #444', borderRadius: '5px', color: '#fff' }}
                            value={formData.riskTolerance}
                            onChange={e => setFormData({ ...formData, riskTolerance: e.target.value })}
                        >
                            <option value="Low">Low (Conservative)</option>
                            <option value="Medium">Medium (Balanced)</option>
                            <option value="High">High (Aggressive)</option>
                        </select>
                    </div>

                    <div style={{ gridColumn: '1 / -1' }}>
                        <label style={{ display: 'block', marginBottom: '5px', color: '#aaa' }}>Target Industries (comma separated)</label>
                        <input
                            className="neon-input"
                            style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid #444', borderRadius: '5px', color: '#fff' }}
                            value={formData.industries}
                            onChange={e => setFormData({ ...formData, industries: e.target.value })}
                        />
                    </div>

                    <div style={{ gridColumn: '1 / -1' }}>
                        <label style={{ display: 'block', marginBottom: '5px', color: '#aaa' }}>LinkedIn / Social</label>
                        <input
                            className="neon-input"
                            style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid #444', borderRadius: '5px', color: '#fff' }}
                            value={formData.linkedin}
                            onChange={e => setFormData({ ...formData, linkedin: e.target.value })}
                        />
                    </div>

                    <button
                        onClick={() => setIsEditing(false)}
                        style={{ padding: '10px', background: 'transparent', border: '1px solid #666', color: '#aaa', borderRadius: '5px', cursor: 'pointer', marginTop: '10px' }}
                    >
                        Cancel
                    </button>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '15px' }}>
                        <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px', marginTop: 0 }}>📊 Financial Profile</h3>
                        <Field label="Total Capital Deployment" value={`$${profile.totalAssetValue?.toLocaleString()}`} />
                        <Field label="Active Investments" value={profile.portfolio?.length || 0} />
                        <Field label="Total ROI (Est.)" value="12.5%" />
                    </div>

                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '15px' }}>
                        <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px', marginTop: 0 }}>🎯 Strategy</h3>
                        <Field label="Risk Tolerance" value={profile.preferences?.riskTolerance} />
                        <div style={{ marginBottom: '15px' }}>
                            <div style={{ color: '#888', fontSize: '0.8rem', marginBottom: '5px' }}>Industries</div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {profile.preferences?.industries?.map((ind, i) => (
                                    <span key={i} style={{ background: 'rgba(0, 255, 255, 0.15)', color: 'cyan', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem' }}>
                                        {ind}
                                    </span>
                                )) || 'Generalist'}
                            </div>
                        </div>
                    </div>

                    <div style={{ gridColumn: '1 / -1', background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '15px' }}>
                        <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px', marginTop: 0 }}>📝 Bio & Identity</h3>
                        <Field label="Email" value={profile.contactEmail} />
                        <Field label="Social / LinkedIn" value={profile.socialLinks} />
                        <div style={{ marginTop: '15px' }}>
                            <div style={{ color: '#888', fontSize: '0.8rem', marginBottom: '5px' }}>About Me</div>
                            <p style={{ lineHeight: '1.6', color: '#ddd' }}>{profile.bio || "No bio yet."}</p>
                        </div>
                    </div>

                    <div style={{ gridColumn: '1 / -1', background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '15px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px', marginBottom: '15px' }}>
                            <h3 style={{ margin: 0 }}>📁 Verified Documents</h3>
                            <button onClick={() => docInputRef.current.click()} style={{ background: 'transparent', border: '1px solid var(--neon-cyan)', color: 'var(--neon-cyan)', borderRadius: '5px', cursor: 'pointer', padding: '5px 10px' }}>
                                + Upload
                            </button>
                            <input type="file" ref={docInputRef} onChange={handleDocUpload} style={{ display: 'none' }} accept=".pdf,.doc,.docx,.jpg,.png" />
                        </div>
                        {profile.documents && profile.documents.length > 0 ? (
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {profile.documents.map((doc, i) => (
                                    <li key={i} style={{ padding: '10px', background: 'rgba(0,0,0,0.2)', marginBottom: '5px', borderRadius: '5px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <span>📄</span>
                                        <a href={doc} target="_blank" rel="noopener noreferrer" style={{ color: 'cyan', textDecoration: 'none', flex: 1 }}>
                                            Document {i + 1}
                                        </a>
                                        <span style={{ fontSize: '0.8rem', color: '#666' }}>Verified</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div style={{ color: '#888', fontStyle: 'italic' }}>No documents uploaded yet.</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

const Field = ({ label, value }) => (
    <div style={{ marginBottom: '15px' }}>
        <div style={{ color: '#888', fontSize: '0.8rem', marginBottom: '5px' }}>{label}</div>
        <div style={{ fontSize: '1.1rem', color: '#fff' }}>{value || 'N/A'}</div>
    </div>
);

export default InvestorProfile;
