
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const DisputeForm = ({ projectId, onClose }) => {
    const { t } = useTranslation();
    const [reason, setReason] = useState('');

    const handleSubmit = async () => {
        try {
            await fetch('http://localhost:3001/disputes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ projectId, reason, initiatorId: '1' })
            });
            alert(t('dispute_submitted', { defaultValue: "Dispute Submitted" }));
            onClose();
        } catch (e) {
            alert('Error submitting dispute');
        }
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
            <div className="glass-panel" style={{ width: '400px', padding: '30px', borderRadius: '20px' }}>
                <h2 style={{ color: 'var(--neon-pink)' }}>{t('dispute')}</h2>
                <textarea
                    placeholder="Describe the issue..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    style={{ width: '100%', height: '100px', background: '#222', color: '#fff', border: '1px solid #444', borderRadius: '10px', padding: '10px', marginTop: '20px' }}
                />
                <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                    <button onClick={handleSubmit} className="btn-neon" style={{ flex: 1, borderColor: 'var(--neon-pink)', color: 'var(--neon-pink)' }}>{t('submit')}</button>
                    <button onClick={onClose} className="btn-neon" style={{ flex: 1, borderColor: '#666', color: '#ccc' }}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default DisputeForm;
