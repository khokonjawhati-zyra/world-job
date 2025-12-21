
import React, { useState, useEffect } from 'react';

export const CommunityGroupsPanel = ({ userId }) => {
    const [groups, setGroups] = useState([]);
    const [locationFilter, setLocationFilter] = useState('');

    useEffect(() => {
        fetch(`http://localhost:3000/community/groups?location=${locationFilter}`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setGroups(data);
                } else {
                    console.error("Expected array but got:", data);
                    setGroups([]);
                }
            })
            .catch(err => {
                console.error(err);
                setGroups([]);
            });
    }, [locationFilter]);

    const handleJoin = (groupId) => {
        fetch(`http://localhost:3000/community/groups/${groupId}/join`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId })
        })
            .then(res => res.json())
            .then(updatedGroup => {
                setGroups(groups.map(g => g.id === updatedGroup.id ? updatedGroup : g));
                alert('Joined group!');
            })
            .catch(console.error);
    };

    return (
        <div className="glass-panel" style={{ padding: '20px', borderRadius: '15px' }}>
            <h2 style={{ color: 'var(--neon-cyan)', marginBottom: '20px' }}>🌍 Worker Community Groups</h2>

            <div style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder="Filter by location (e.g., New York, Remote)"
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    style={{ padding: '10px', width: '100%', borderRadius: '10px', border: '1px solid #333', background: 'rgba(255,255,255,0.05)', color: '#fff' }}
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {groups.map(group => {
                    const isMember = group.members.includes(userId);
                    return (
                        <div key={group.id} style={{ padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '15px', border: '1px solid var(--glass-border)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ margin: 0 }}>{group.name}</h3>
                                <span style={{ fontSize: '0.8rem', background: '#333', padding: '2px 8px', borderRadius: '5px' }}>{group.location}</span>
                            </div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '10px 0' }}>{group.description}</p>

                            <div style={{ marginBottom: '15px' }}>
                                <small style={{ color: 'var(--neon-lime)' }}>{group.members.length} Members</small>
                            </div>

                            {group.updates.length > 0 && (
                                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '10px', marginBottom: '15px' }}>
                                    <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--neon-pink)' }}>Latest Update:</div>
                                    <p style={{ fontSize: '0.85rem', margin: '5px 0' }}>{group.updates[0].content}</p>
                                    <small style={{ color: 'var(--text-muted)' }}>- {group.updates[0].author}</small>
                                </div>
                            )}

                            <button
                                onClick={() => handleJoin(group.id)}
                                className="btn-neon"
                                disabled={isMember}
                                style={{ width: '100%', opacity: isMember ? 0.6 : 1, cursor: isMember ? 'default' : 'pointer', background: isMember ? 'transparent' : 'var(--neon-cyan)', border: isMember ? '1px solid var(--neon-cyan)' : 'none', color: isMember ? 'var(--neon-cyan)' : '#000' }}
                            >
                                {isMember ? '✓ Member' : 'Join Group'}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export const MentorshipPanel = ({ userId }) => {
    const [mentorships, setMentorships] = useState([]);
    const [view, setView] = useState('mentee'); // 'mentee' or 'mentor'
    const [showRequestForm, setShowRequestForm] = useState(false);

    const fetchMentorships = () => {
        fetch(`http://localhost:3000/community/mentorships?userId=${userId}&role=${view}`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setMentorships(data);
                } else {
                    console.error("Mentorships fetch error:", data);
                    setMentorships([]);
                }
            })
            .catch(err => {
                console.error(err);
                setMentorships([]);
            });
    };

    useEffect(() => {
        fetchMentorships();
    }, [view]);

    // Mock request function
    const handleRequest = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const aim = formData.get('goal');
        const mentorId = formData.get('mentorId'); // In real app, you select from list

        fetch('http://localhost:3000/community/mentorships/request', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mentorId, menteeId: userId, goal: aim })
        })
            .then(res => res.json())
            .then(() => {
                alert('Request Sent');
                setShowRequestForm(false);
                fetchMentorships();
            })
            .catch(console.error);
    };

    return (
        <div className="glass-panel" style={{ padding: '20px', borderRadius: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ color: 'var(--neon-purple)' }}>🎓 Mentorship Program</h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => setView('mentee')} style={{ background: view === 'mentee' ? 'var(--neon-purple)' : 'transparent', border: '1px solid var(--neon-purple)', color: '#fff', padding: '5px 15px', borderRadius: '20px', cursor: 'pointer' }}>My Mentors</button>
                    <button onClick={() => setView('mentor')} style={{ background: view === 'mentor' ? 'var(--neon-purple)' : 'transparent', border: '1px solid var(--neon-purple)', color: '#fff', padding: '5px 15px', borderRadius: '20px', cursor: 'pointer' }}>My Mentees</button>
                </div>
            </div>

            {view === 'mentee' && (
                <div style={{ marginBottom: '20px' }}>
                    <button onClick={() => setShowRequestForm(!showRequestForm)} className="btn-neon" style={{ fontSize: '0.9rem' }}>+ Request a Mentor</button>
                    {showRequestForm && (
                        <form onSubmit={handleRequest} style={{ marginTop: '15px', background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '10px' }}>
                            <h4 style={{ marginBottom: '10px' }}>Find a Mentor</h4>
                            <input name="mentorId" placeholder="Mentor ID (e.g. 105 for Sarah Leader)" required style={{ display: 'block', width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px', border: 'none' }} />
                            <textarea name="goal" placeholder="What is your goal? (e.g. Learn React)" required style={{ display: 'block', width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px', border: 'none' }}></textarea>
                            <button type="submit" className="btn-neon">Send Request</button>
                        </form>
                    )}
                </div>
            )}

            <div style={{ display: 'grid', gap: '15px' }}>
                {mentorships.length === 0 ? <p style={{ color: 'var(--text-muted)' }}>No mentorships found.</p> : mentorships.map(m => (
                    <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>
                        <div>
                            <h4 style={{ margin: 0, color: '#fff' }}>{view === 'mentee' ? `Mentor #${m.mentorId}` : `Mentee #${m.menteeId}`}</h4>
                            <p style={{ margin: '5px 0', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Goal: {m.goal}</p>
                        </div>
                        <span style={{
                            padding: '5px 10px', borderRadius: '15px', fontSize: '0.8rem',
                            background: m.status === 'accepted' ? 'rgba(0,255,0,0.2)' : m.status === 'pending' ? 'rgba(255,165,0,0.2)' : '#333',
                            color: m.status === 'accepted' ? '#0f0' : m.status === 'pending' ? 'orange' : '#ccc'
                        }}>
                            {m.status.toUpperCase()}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};
