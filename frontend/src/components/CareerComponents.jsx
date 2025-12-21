import React from 'react';
import { motion } from 'framer-motion';

export const CareerLadder = ({ currentLevel, xp }) => {
    const levels = [
        { name: 'Helper', minXp: 0, benefit: 'Basic Access' },
        { name: 'Skilled', minXp: 1000, benefit: 'Verified Badge, Higher Visibility' },
        { name: 'Professional', minXp: 5000, benefit: 'Premium Jobs, Lower Fees' },
        { name: 'Master', minXp: 20000, benefit: 'Top Rated, Mentor Status' }
    ];

    // Calculate progress
    const currentLevelIdx = levels.findIndex(l => l.name === currentLevel);
    const safeLevelIdx = currentLevelIdx === -1 ? 0 : currentLevelIdx;

    const nextLevel = levels[safeLevelIdx + 1];
    const prevLevelXp = levels[safeLevelIdx].minXp;
    const nextLevelXp = nextLevel ? nextLevel.minXp : (xp || 0) * 1.5 + 1000; // Cap if master

    const currentXp = xp || 0;
    const progressPercent = Math.min(100, Math.max(0, ((currentXp - prevLevelXp) / (nextLevelXp - prevLevelXp)) * 100));

    return (
        <div className="glass-panel" style={{ padding: '20px', borderRadius: '15px' }}>
            <h3 style={{ marginBottom: '15px', color: 'var(--neon-cyan)' }}>Career Ladder</h3>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{currentLevel}</span>
                <span style={{ color: 'var(--text-muted)' }}>{xp} XP</span>
            </div>

            <div style={{ width: '100%', height: '10px', background: '#333', borderRadius: '5px', overflow: 'hidden', marginBottom: '20px' }}>
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    style={{ height: '100%', background: 'linear-gradient(90deg, var(--neon-cyan), var(--neon-lime))' }}
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                {levels.map((level, idx) => {
                    const isUnlocked = idx <= currentLevelIdx;
                    const isNext = idx === currentLevelIdx + 1;

                    return (
                        <div key={level.name} style={{
                            padding: '10px',
                            borderRadius: '10px',
                            background: isUnlocked ? 'rgba(0,255,255,0.1)' : 'rgba(255,255,255,0.05)',
                            border: isUnlocked ? '1px solid var(--neon-cyan)' : '1px solid transparent',
                            borderTop: isNext ? '2px solid var(--neon-lime)' : undefined,
                            opacity: isUnlocked || isNext ? 1 : 0.5,
                            textAlign: 'center'
                        }}>
                            <div style={{ fontWeight: 'bold', fontSize: '0.9rem', color: isUnlocked ? '#fff' : '#aaa' }}>{level.name}</div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '5px' }}>{level.minXp} XP</div>
                            <div style={{ fontSize: '0.65rem', color: 'var(--neon-lime)', marginTop: '5px' }}>{level.benefit}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export const SkillEndorsements = ({ skills = [], endorsements = [], onEndorse, canEndorse }) => {
    return (
        <div className="glass-panel" style={{ padding: '20px', borderRadius: '15px', marginTop: '20px' }}>
            <h3 style={{ marginBottom: '15px', color: 'var(--neon-pink)' }}>Skills & Endorsements</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
                {skills.map(skill => {
                    const skillEndorsements = endorsements.filter(e => e.skill === skill);

                    return (
                        <div key={skill} style={{ padding: '15px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontWeight: 'bold' }}>{skill}</span>
                                <span style={{ fontSize: '0.8rem', color: 'var(--neon-lime)', background: 'rgba(0,255,0,0.1)', padding: '2px 8px', borderRadius: '10px' }}>
                                    {skillEndorsements.length} Verified
                                </span>
                            </div>

                            {skillEndorsements.length > 0 && (
                                <div style={{ marginTop: '10px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                    Endorsed by: {skillEndorsements.slice(0, 2).map(e => e.endorserName).join(', ')}
                                    {skillEndorsements.length > 2 && ` +${skillEndorsements.length - 2} more`}
                                </div>
                            )}

                            {canEndorse && (
                                <button
                                    onClick={() => onEndorse(skill)}
                                    className="btn-neon"
                                    style={{ marginTop: '10px', width: '100%', fontSize: '0.8rem', padding: '5px' }}
                                >
                                    🏅 Endorse
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
