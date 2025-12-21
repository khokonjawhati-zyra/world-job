import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import FinancialsPanel from '../components/FinancialsPanel';
import ReferralDashboard from '../components/ReferralDashboard';

const UserProfile = () => {
    // In a real app, this might come from params or auth context
    const { userId, role } = useParams();
    // Mocking for preview; normally we'd fetch based on params
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        alert("Profile link copied to clipboard!");
    };

    const handleSave = () => {
        setIsSaving(true);

        fetch(`http://localhost:3001/profiles/${userId}/update`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...profile, role })
        })
            .then(res => res.json())
            .then(data => {
                setIsSaving(false);
                if (data.success) {
                    setIsEditing(false); // Only close edit mode if success
                    alert("Profile updated successfully!");
                    if (data.profile) setProfile(data.profile);
                } else {
                    alert("Error updating profile: " + data.message);
                }
            })
            .catch(err => {
                setIsSaving(false);
                console.error(err);
                alert("Network error updating profile.");
            });
    };

    const [showVerificationModal, setShowVerificationModal] = useState(false);

    // Simulated Fetch with Demo Fallback
    useEffect(() => {
        setLoading(true);
        // Fetch Real Profile Data
        fetch(`http://localhost:3001/profiles/${userId}?role=${role}`)
            .then(res => res.json())
            .then(data => {
                if (data && !data.error) {
                    setProfile(data);
                    setLoading(false);
                } else {
                    throw new Error("Profile not found");
                }
            })
            .catch(err => {
                console.warn('Using Demo Profile (Backend Unreachable):', err);
                // Mock Data based on role
                if (role === 'worker') {
                    setProfile({
                        name: "Alice Dev (Demo)",
                        title: "Full Stack Developer",
                        bio: "Passionate developer building the future of work. I specialize in React, Node.js, and modern web technologies. Open for new opportunities.",
                        experience: 5,
                        hourlyRate: 45,
                        skills: ["React", "Node.js", "MongoDB", "TypeScript", "AWS"],
                        languages: ["English", "Spanish"],
                        socialLinks: { linkedin: "alice-dev", github: "alice-codes" },
                        portfolio: [
                            { title: "E-Commerce Platform", description: "Built a fully functional marketplace with Stripe integration.", link: "github.com/alice/market" },
                            { title: "Task Manager", description: "Real-time task management app using Socket.io.", link: "github.com/alice/tasks" }
                        ],
                        performanceHistory: [
                            { projectId: "101", rating: 5, feedback: "Excellent work, delivered on time!" },
                            { projectId: "102", rating: 5, feedback: "Highly recommended." }
                        ],
                        documents: [],
                        profileImage: null,
                        verified: true
                    });
                } else {
                    setProfile({
                        companyName: "Tech Corp (Demo)",
                        industry: "Software Development",
                        size: "51-200",
                        foundedYear: "2015",
                        email: "contact@techcorp.com",
                        website: "https://techcorp.com",
                        bio: "Leading software solutions provider specialized in enterprise applications and AI integration.",
                        postingHistory: [
                            { title: "Senior React Developer", date: "2025-01-10" },
                            { title: "UI/UX Designer", date: "2024-12-05" }
                        ],
                        documents: [],
                        socialLinks: { linkedin: "tech-corp" },
                        verified: true,
                        investmentPortfolio: [] // For investor fallback compatibility
                    });
                }
                setLoading(false);
            });
    }, [userId, role]);

    const TabButton = ({ id, label }) => (
        <button
            onClick={() => setActiveTab(id)}
            style={{
                padding: '10px 20px',
                background: activeTab === id ? 'var(--neon-cyan)' : 'transparent',
                color: activeTab === id ? '#000' : 'var(--text-muted)',
                border: 'none',
                borderRadius: '20px',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'all 0.3s'
            }}
        >
            {label}
        </button>
    );

    const handleFileUpload = (file, type) => {
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('role', role);

        const endpoint = type === 'image'
            ? `http://localhost:3001/profiles/${userId}/upload-image`
            : `http://localhost:3001/profiles/${userId}/upload-document`;

        fetch(endpoint, {
            method: 'POST',
            body: formData
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    if (type === 'image') {
                        setProfile(prev => ({
                            ...prev,
                            profileImage: data.url,
                            logo: data.url
                        }));
                    } else {
                        setProfile(prev => ({ ...prev, documents: data.documents }));
                    }
                    alert('File uploaded successfully!');
                } else {
                    alert('Upload failed: ' + data.message);
                }
            })
            .catch(err => {
                console.error(err);
                alert('Error uploading file');
            });
    };

    if (loading) return <div className="container" style={{ paddingTop: '100px', color: '#fff' }}>Loading Profile...</div>;
    if (!profile) return <div className="container" style={{ paddingTop: '100px', color: '#fff' }}>Profile not found</div>;

    return (
        <div className="container" style={{ paddingTop: '80px', paddingBottom: '50px' }}>
            {/* Banner Section */}
            <div style={{ height: '200px', background: 'linear-gradient(90deg, #111, #222)', borderRadius: '20px 20px 0 0', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'url(https://via.placeholder.com/1200x300/111/333) center/cover opacity-30' }}></div>
            </div>

            <div className="glass-panel" style={{ borderRadius: '0 0 20px 20px', padding: '0 40px 40px 40px', marginTop: '-1px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '-50px', marginBottom: '30px' }}>
                    <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-end', flex: 1 }}>
                        <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: '#333', border: '5px solid #000', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '2.5rem', color: '#fff', position: 'relative', flexShrink: 0, overflow: 'hidden' }}>
                            {profile.profileImage || profile.logo ? (
                                <img src={profile.profileImage || profile.logo} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                (profile.name || profile.companyName || 'U').charAt(0)
                            )}

                            {isEditing && (
                                <div
                                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10 }}
                                    onClick={() => document.getElementById('avatar-upload').click()}
                                >
                                    📷
                                    <input id="avatar-upload" type="file" hidden accept="image/*" onChange={(e) => handleFileUpload(e.target.files[0], 'image')} />
                                </div>
                            )}

                            {profile.verified && <div style={{ position: 'absolute', bottom: '5px', right: '5px', width: '25px', height: '25px', background: 'var(--neon-green)', borderRadius: '50%', border: '3px solid #000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: '#000', zIndex: 5 }}>✓</div>}
                        </div>
                        <div style={{ paddingBottom: '10px', width: '100%' }}>
                            {isEditing ? (
                                <div style={{ display: 'grid', gap: '10px', maxWidth: '400px' }}>
                                    <input
                                        type="text"
                                        value={role === 'employer' ? profile.companyName : profile.name}
                                        onChange={(e) => setProfile({ ...profile, [role === 'employer' ? 'companyName' : 'name']: e.target.value })}
                                        style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid var(--glass-border)', color: '#fff', padding: '8px', borderRadius: '5px', fontSize: '1.5rem', fontWeight: 'bold' }}
                                    />
                                    <input
                                        type="text"
                                        value={role === 'employer' ? profile.industry : profile.title}
                                        onChange={(e) => setProfile({ ...profile, [role === 'employer' ? 'industry' : 'title']: e.target.value })}
                                        style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid var(--glass-border)', color: 'var(--neon-cyan)', padding: '5px', borderRadius: '5px', fontSize: '1.1rem' }}
                                    />
                                </div>
                            ) : (
                                <>
                                    <h1 style={{ marginBottom: '5px' }}>{profile.name || profile.companyName}</h1>
                                    <p style={{ color: 'var(--neon-cyan)', fontSize: '1.1rem' }}>{profile.title || profile.industry || 'Investor'}</p>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{role === 'employer' ? `${profile.size} • ${profile.foundedYear}` : profile.availability || 'Verified Investor'}</p>
                                </>
                            )}
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '15px', paddingBottom: '10px' }}>
                        {isEditing ? (
                            <>
                                <button onClick={handleSave} className="btn-neon" style={{ borderColor: 'var(--neon-green)', color: 'var(--neon-green)', opacity: isSaving ? 0.7 : 1 }} disabled={isSaving}>
                                    {isSaving ? 'Saving...' : 'Save Changes'}
                                </button>
                                <button onClick={() => setIsEditing(false)} className="btn-neon" style={{ borderColor: 'red', color: 'red' }}>Cancel</button>
                            </>
                        ) : (
                            <>
                                {!profile.verified && <button onClick={() => setShowVerificationModal(true)} className="btn-neon" style={{ borderColor: 'var(--neon-lime)', color: 'var(--neon-lime)' }}>Get Verified</button>}
                                <button onClick={() => setIsEditing(true)} className="btn-neon">Edit Profile</button>
                                <button onClick={handleShare} className="btn-neon" style={{ borderColor: 'var(--text-muted)', color: 'var(--text-muted)' }}>Share</button>
                            </>
                        )}
                    </div>
                </div>

                {showVerificationModal && (
                    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                        <div className="glass-panel" style={{ padding: '30px', borderRadius: '20px', maxWidth: '500px', width: '90%' }}>
                            <h2>Verify Your Identity</h2>
                            <p style={{ color: 'var(--text-muted)', margin: '15px 0' }}>Upload a government-issued ID to receive the "Verified" badge and boost your trust score.</p>

                            <label style={{ display: 'block', margin: '10px 0', color: '#fff' }}>Role</label>
                            <input type="text" value={role.toUpperCase()} disabled style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '5px', color: '#aaa' }} />

                            <label style={{ display: 'block', margin: '15px 0 10px', color: '#fff' }}>Document URL (Mock)</label>
                            <input type="text" placeholder="http://example.com/my-id.jpg" id="verify-doc-url" style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.1)', border: '1px solid var(--glass-border)', borderRadius: '5px', color: '#fff' }} />

                            <div style={{ display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'flex-end' }}>
                                <button onClick={() => setShowVerificationModal(false)} style={{ background: 'transparent', border: '1px solid #aaa', color: '#aaa', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}>Cancel</button>
                                <button
                                    onClick={() => {
                                        const url = document.getElementById('verify-doc-url').value;
                                        if (!url) return alert("Please enter a URL");

                                        fetch('http://localhost:3001/verification/submit', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ userId, userType: role.toUpperCase(), type: 'IDENTITY', data: url })
                                        }).then(() => {
                                            alert("Verification request submitted!");
                                            setShowVerificationModal(false);
                                        });
                                    }}
                                    className="btn-neon"
                                    style={{ background: 'var(--neon-lime)', color: '#000', border: 'none' }}
                                >
                                    Submit Request
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {role === 'worker' && (
                    <>
                        {isEditing ? (
                            <textarea
                                value={profile.bio}
                                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                style={{ width: '100%', minHeight: '100px', background: 'rgba(255,255,255,0.1)', border: '1px solid var(--glass-border)', color: '#ddd', padding: '10px', borderRadius: '10px', marginBottom: '30px', fontFamily: 'inherit' }}
                            />
                        ) : (
                            <p style={{ maxWidth: '800px', color: '#ddd', lineHeight: '1.6', marginBottom: '30px' }}>{profile.bio}</p>
                        )}

                        <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px' }}>
                            <TabButton id="overview" label="Overview" />
                            <TabButton id="portfolio" label="Portfolio" />
                            <TabButton id="reviews" label="Reviews" />
                            <TabButton id="documents" label="Documents" />
                            <TabButton id="financials" label="Financials" />
                            <TabButton id="referrals" label="Referrals 🎁" />
                        </div>

                        {activeTab === 'financials' && (
                            <FinancialsPanel userId={userId} role={role} />
                        )}

                        {activeTab === 'referrals' && (
                            <ReferralDashboard user={profile} />
                        )}

                        {activeTab === 'documents' && (
                            <div className="glass-panel" style={{ padding: '20px', background: 'rgba(255,255,255,0.03)' }}>
                                <h3 style={{ marginBottom: '20px' }}>My Documents</h3>
                                <div style={{ display: 'grid', gap: '15px', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
                                    {profile.documents && profile.documents.map((doc, idx) => (
                                        <div key={idx} style={{ padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>📄</div>
                                            <a href={doc} target="_blank" rel="noreferrer" style={{ color: 'var(--neon-cyan)', fontSize: '0.9rem', marginBottom: '5px' }}>View Document {idx + 1}</a>
                                        </div>
                                    ))}
                                    {isEditing && (
                                        <div style={{ padding: '15px', border: '2px dashed var(--text-muted)', borderRadius: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} onClick={() => document.getElementById('doc-upload').click()}>
                                            <span style={{ fontSize: '2rem', color: 'var(--text-muted)' }}>+</span>
                                            <span style={{ color: 'var(--text-muted)' }}>Upload New</span>
                                            <input
                                                id="doc-upload"
                                                type="file"
                                                hidden
                                                onChange={(e) => handleFileUpload(e.target.files[0], 'document')}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'overview' && (
                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
                                <div style={{ display: 'grid', gap: '30px' }}>
                                    <div>
                                        <h3 style={{ marginBottom: '15px' }}>Experience & Education</h3>
                                        <div style={{ padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '15px' }}>
                                            {isEditing ? (
                                                <div style={{ display: 'grid', gap: '10px' }}>
                                                    <label style={{ color: 'var(--text-muted)' }}>Years of Experience</label>
                                                    <input
                                                        type="number"
                                                        value={profile.experience}
                                                        onChange={(e) => setProfile({ ...profile, experience: parseInt(e.target.value) || 0 })}
                                                        style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid var(--glass-border)', color: '#fff', padding: '8px', borderRadius: '5px' }}
                                                    />
                                                </div>
                                            ) : (
                                                <p style={{ fontWeight: 'bold' }}>{profile.experience} Years Experience</p>
                                            )}

                                            {profile.education && profile.education.map((edu, i) => (
                                                <div key={i} style={{ marginTop: '10px', color: 'var(--text-muted)' }}>
                                                    🎓 {edu.degree} at {edu.school} ({edu.year})
                                                </div>
                                            ))}
                                            {/* Note: Complex nested array editing omitted for brevity, focusing on main fields */}
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gap: '20px', height: 'fit-content' }}>
                                    <div className="glass-panel" style={{ padding: '20px', background: 'rgba(255,255,255,0.03)' }}>
                                        {isEditing ? (
                                            <>
                                                <label style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Hourly Rate ($)</label>
                                                <input
                                                    type="number"
                                                    value={profile.hourlyRate}
                                                    onChange={(e) => setProfile({ ...profile, hourlyRate: parseInt(e.target.value) || 0 })}
                                                    style={{ width: '100%', background: 'rgba(255,255,255,0.1)', border: '1px solid var(--glass-border)', color: 'var(--neon-lime)', padding: '5px', borderRadius: '5px', fontWeight: 'bold' }}
                                                />
                                            </>
                                        ) : (
                                            <>
                                                <h3 style={{ color: 'var(--neon-lime)' }}>${profile.hourlyRate}/hr</h3>
                                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Hourly Rate</p>
                                            </>
                                        )}
                                    </div>
                                    <div>
                                        <h4 style={{ marginBottom: '10px' }}>Skills</h4>
                                        {isEditing ? (
                                            <textarea
                                                value={profile.skills.join(', ')}
                                                onChange={(e) => setProfile({ ...profile, skills: e.target.value.split(',').map(s => s.trim()) })}
                                                placeholder="React, Node.js, etc."
                                                style={{ width: '100%', background: 'rgba(255,255,255,0.1)', border: '1px solid var(--glass-border)', color: '#fff', padding: '8px', borderRadius: '5px', fontFamily: 'inherit' }}
                                            />
                                        ) : (
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                                {profile.skills.map(s => <span key={s} style={{ background: 'rgba(255,255,255,0.1)', padding: '5px 10px', borderRadius: '15px', fontSize: '0.8rem' }}>{s}</span>)}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h4 style={{ marginBottom: '10px' }}>Languages</h4>
                                        {isEditing ? (
                                            <textarea
                                                value={profile.languages.join(', ')}
                                                onChange={(e) => setProfile({ ...profile, languages: e.target.value.split(',').map(s => s.trim()) })}
                                                placeholder="English, Spanish, etc."
                                                style={{ width: '100%', background: 'rgba(255,255,255,0.1)', border: '1px solid var(--glass-border)', color: '#fff', padding: '8px', borderRadius: '5px', fontFamily: 'inherit' }}
                                            />
                                        ) : (
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                                {profile.languages.map(l => <span key={l} style={{ border: '1px solid var(--text-muted)', color: 'var(--text-muted)', padding: '5px 10px', borderRadius: '15px', fontSize: '0.8rem' }}>{l}</span>)}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h4 style={{ marginBottom: '10px' }}>Socials</h4>
                                        {isEditing ? (
                                            <div style={{ display: 'grid', gap: '5px' }}>
                                                <input
                                                    placeholder="LinkedIn URL"
                                                    value={profile.socialLinks.linkedin || ''}
                                                    onChange={(e) => setProfile({ ...profile, socialLinks: { ...profile.socialLinks, linkedin: e.target.value } })}
                                                    style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid var(--glass-border)', color: 'var(--neon-cyan)', padding: '5px', borderRadius: '5px', fontSize: '0.8rem' }}
                                                />
                                                <input
                                                    placeholder="GitHub URL"
                                                    value={profile.socialLinks.github || ''}
                                                    onChange={(e) => setProfile({ ...profile, socialLinks: { ...profile.socialLinks, github: e.target.value } })}
                                                    style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid var(--glass-border)', color: '#fff', padding: '5px', borderRadius: '5px', fontSize: '0.8rem' }}
                                                />
                                            </div>
                                        ) : (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '0.9rem' }}>
                                                {profile.socialLinks.linkedin && <a href={`https://${profile.socialLinks.linkedin}`} style={{ color: 'var(--neon-cyan)' }}>LinkedIn</a>}
                                                {profile.socialLinks.github && <a href={`https://${profile.socialLinks.github}`} style={{ color: '#fff' }}>GitHub</a>}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                        {/* Keep Portfolio and Reviews as read-only for now or simple display */}
                        {activeTab === 'portfolio' && (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                                {profile.portfolio.map((item, idx) => (
                                    <div key={idx} style={{ padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '15px', border: '1px solid var(--glass-border)' }}>
                                        <h3 style={{ marginBottom: '10px' }}>{item.title}</h3>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '15px' }}>{item.description}</p>
                                        <a href={`https://${item.link}`} target="_blank" rel="noreferrer" className="btn-neon" style={{ fontSize: '0.8rem' }}>View Project</a>
                                    </div>
                                ))}
                            </div>
                        )}
                        {activeTab === 'reviews' && (
                            <div style={{ display: 'grid', gap: '20px' }}>
                                {profile.performanceHistory.map((rev, idx) => (
                                    <div key={idx} style={{ padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '15px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                            <span style={{ color: 'gold' }}>{'★'.repeat(rev.rating)}</span>
                                            <span style={{ color: 'var(--text-muted)' }}>Project #{rev.projectId}</span>
                                        </div>
                                        <p>"{rev.feedback}"</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}

                {role === 'employer' && (
                    <>
                        {isEditing ? (
                            <textarea
                                value={profile.bio}
                                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                style={{ width: '100%', minHeight: '100px', background: 'rgba(255,255,255,0.1)', border: '1px solid var(--glass-border)', color: '#ddd', padding: '10px', borderRadius: '10px', marginBottom: '30px', fontFamily: 'inherit' }}
                            />
                        ) : (
                            <p style={{ maxWidth: '800px', color: '#ddd', lineHeight: '1.6', marginBottom: '30px' }}>{profile.bio}</p>
                        )}

                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
                            <div>
                                <h3 style={{ marginBottom: '15px' }}>Job Posting History</h3>
                                {profile.postingHistory.map((job, idx) => (
                                    <div key={idx} style={{ padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
                                        <span>{job.title}</span>
                                        <span style={{ color: 'var(--text-muted)' }}>{job.date}</span>
                                    </div>
                                ))}
                            </div>
                            <div style={{ display: 'grid', gap: '20px', height: 'fit-content' }}>
                                <div className="glass-panel" style={{ padding: '20px', background: 'rgba(255,255,255,0.03)' }}>
                                    <h4 style={{ marginBottom: '10px' }}>Details</h4>
                                    {isEditing ? (
                                        <div style={{ display: 'grid', gap: '10px' }}>
                                            <input
                                                type="text"
                                                placeholder="Size (e.g. 11-50)"
                                                value={profile.size}
                                                onChange={(e) => setProfile({ ...profile, size: e.target.value })}
                                                style={{ width: '100%', background: 'rgba(255,255,255,0.1)', border: '1px solid var(--glass-border)', color: '#fff', padding: '5px', borderRadius: '5px' }}
                                            />
                                            <input
                                                type="text"
                                                placeholder="Founded Year"
                                                value={profile.foundedYear}
                                                onChange={(e) => setProfile({ ...profile, foundedYear: e.target.value })}
                                                style={{ width: '100%', background: 'rgba(255,255,255,0.1)', border: '1px solid var(--glass-border)', color: '#fff', padding: '5px', borderRadius: '5px' }}
                                            />
                                        </div>
                                    ) : (
                                        <p style={{ color: 'var(--text-muted)' }}>{profile.size} • Est. {profile.foundedYear}</p>
                                    )}
                                </div>

                                <div className="glass-panel" style={{ padding: '20px', background: 'rgba(255,255,255,0.03)' }}>
                                    <h4 style={{ marginBottom: '10px' }}>Contact</h4>
                                    {isEditing ? (
                                        <div style={{ display: 'grid', gap: '10px' }}>
                                            <input
                                                type="email"
                                                value={profile.email}
                                                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                                style={{ width: '100%', background: 'rgba(255,255,255,0.1)', border: '1px solid var(--glass-border)', color: '#fff', padding: '5px', borderRadius: '5px' }}
                                            />
                                            <input
                                                type="text"
                                                value={profile.website}
                                                onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                                                style={{ width: '100%', background: 'rgba(255,255,255,0.1)', border: '1px solid var(--glass-border)', color: 'var(--neon-cyan)', padding: '5px', borderRadius: '5px' }}
                                            />
                                            <input
                                                placeholder="LinkedIn URL"
                                                value={profile.socialLinks.linkedin || ''}
                                                onChange={(e) => setProfile({ ...profile, socialLinks: { ...profile.socialLinks, linkedin: e.target.value } })}
                                                style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid var(--glass-border)', color: 'var(--neon-cyan)', padding: '5px', borderRadius: '5px', fontSize: '0.8rem' }}
                                            />
                                        </div>
                                    ) : (
                                        <>
                                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '5px' }}>{profile.email}</p>
                                            <a href={profile.website} style={{ color: 'var(--neon-cyan)', fontSize: '0.9rem', display: 'block', marginBottom: '5px' }}>Website</a>
                                            {profile.socialLinks.linkedin && <a href={`https://${profile.socialLinks.linkedin}`} style={{ color: 'var(--neon-cyan)', fontSize: '0.9rem' }}>LinkedIn</a>}
                                        </>
                                    )}
                                </div>
                                <div>
                                    <h4 style={{ marginBottom: '10px' }}>Stats</h4>
                                    <p>Jobs Posted: {profile.postingHistory.length}</p>
                                </div>
                            </div>
                        </div>

                        {/* Employer Documents Section */}
                        <div className="glass-panel" style={{ marginTop: '30px', padding: '20px', background: 'rgba(255,255,255,0.03)' }}>
                            <h3 style={{ marginBottom: '20px' }}>Company Documents</h3>
                            <div style={{ display: 'grid', gap: '15px', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
                                {profile.documents && profile.documents.map((doc, idx) => (
                                    <div key={idx} style={{ padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <div style={{ fontSize: '3rem', marginBottom: '10px' }}>📄</div>
                                        <a href={doc} target="_blank" rel="noreferrer" style={{ color: 'var(--neon-cyan)', fontSize: '0.9rem', marginBottom: '5px' }}>View Document {idx + 1}</a>
                                    </div>
                                ))}
                                {isEditing && (
                                    <div style={{ padding: '15px', border: '2px dashed var(--text-muted)', borderRadius: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} onClick={() => document.getElementById('emp-doc-upload').click()}>
                                        <span style={{ fontSize: '2rem', color: 'var(--text-muted)' }}>+</span>
                                        <span style={{ color: 'var(--text-muted)' }}>Upload New</span>
                                        <input
                                            id="emp-doc-upload"
                                            type="file"
                                            hidden
                                            onChange={(e) => handleFileUpload(e.target.files[0], 'document')}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}

                {role === 'investor' && (
                    <>
                        {isEditing ? (
                            <textarea
                                value={profile.bio}
                                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                style={{ width: '100%', minHeight: '100px', background: 'rgba(255,255,255,0.1)', border: '1px solid var(--glass-border)', color: '#ddd', padding: '10px', borderRadius: '10px', marginBottom: '30px', fontFamily: 'inherit' }}
                            />
                        ) : (
                            <p style={{ maxWidth: '800px', color: '#ddd', lineHeight: '1.6', marginBottom: '30px' }}>{profile.bio}</p>
                        )}

                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
                            <div>
                                <h3 style={{ marginBottom: '15px' }}>Investment Portfolio</h3>
                                {profile.investmentPortfolio.map((inv, idx) => (
                                    <div key={idx} style={{ padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
                                        <span>Project #{inv.projectId}</span>
                                        <span style={{ color: 'var(--neon-green)' }}>${inv.amount.toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                            <div style={{ display: 'grid', gap: '20px', height: 'fit-content' }}>
                                <div className="glass-panel" style={{ padding: '20px', background: 'rgba(255,255,255,0.03)' }}>
                                    <p style={{ color: 'var(--text-muted)' }}>Total Invested</p>
                                    <h2 style={{ color: 'var(--neon-green)' }}>${profile.totalInvested.toLocaleString()}</h2>
                                </div>
                                <div className="glass-panel" style={{ padding: '20px', background: 'rgba(255,255,255,0.03)' }}>
                                    <p style={{ color: 'var(--text-muted)' }}>Preferences</p>
                                    {isEditing ? (
                                        <div style={{ display: 'grid', gap: '10px', marginTop: '10px' }}>
                                            <label style={{ fontSize: '0.8rem', color: '#ccc' }}>Industries (comma separated)</label>
                                            <textarea
                                                value={profile.investmentPreferences.industries.join(', ')}
                                                onChange={(e) => setProfile({ ...profile, investmentPreferences: { ...profile.investmentPreferences, industries: e.target.value.split(',').map(s => s.trim()) } })}
                                                style={{ width: '100%', background: 'rgba(255,255,255,0.1)', border: '1px solid var(--glass-border)', color: '#fff', padding: '5px', borderRadius: '5px' }}
                                            />
                                            <label style={{ fontSize: '0.8rem', color: '#ccc' }}>Risk Tolerance</label>
                                            <select
                                                value={profile.investmentPreferences.riskTolerance}
                                                onChange={(e) => setProfile({ ...profile, investmentPreferences: { ...profile.investmentPreferences, riskTolerance: e.target.value } })}
                                                style={{ width: '100%', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--glass-border)', color: '#fff', padding: '5px', borderRadius: '5px' }}
                                            >
                                                <option value="Low">Low</option>
                                                <option value="Medium">Medium</option>
                                                <option value="High">High</option>
                                            </select>
                                            <label style={{ fontSize: '0.8rem', color: '#ccc' }}>LinkedIn</label>
                                            <input
                                                value={profile.linkedIn || ''}
                                                onChange={(e) => setProfile({ ...profile, linkedIn: e.target.value })}
                                                style={{ width: '100%', background: 'rgba(255,255,255,0.1)', border: '1px solid var(--glass-border)', color: 'var(--neon-cyan)', padding: '5px', borderRadius: '5px', fontSize: '0.8rem' }}
                                            />
                                        </div>
                                    ) : (
                                        <>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '5px' }}>
                                                {profile.investmentPreferences.industries.map(ind => <span key={ind} style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.1)', padding: '2px 5px', borderRadius: '4px' }}>{ind}</span>)}
                                            </div>
                                            <p style={{ marginTop: '10px', fontSize: '0.9rem' }}>Risk: <span style={{ color: 'orange' }}>{profile.investmentPreferences.riskTolerance}</span></p>
                                            {profile.linkedIn && <a href={`https://${profile.linkedIn}`} style={{ display: 'block', marginTop: '10px', color: 'var(--neon-cyan)', fontSize: '0.9rem' }}>LinkedIn Profile</a>}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default UserProfile;
