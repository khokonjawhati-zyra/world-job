import React, { useState } from 'react';

import NDAModal from './NDAModal'; // Import the NDAModal

const ApplicantSelectionModal = ({ job, onClose, onHire }) => {
    // Mock Applicants for the specific job
    // Mock User Database for mapping IDs to Profile Info
    const USER_DB = {
        '101': { name: 'Alice Developer', skills: ['React', 'Node.js'], rating: 4.8 },
        '102': { name: 'Bob Backend', skills: ['NestJS', 'PostgreSQL'], rating: 4.5 },
        '103': { name: 'Charlie Design', skills: ['Figma', 'UI/UX'], rating: 4.9 },
    };

    // Map job.applicants (array of IDs) to object array
    const applicants = (job.applicants || []).map(id => ({
        id: id,
        name: USER_DB[id]?.name || `Worker ${id}`,
        skills: USER_DB[id]?.skills || ['General'],
        rating: USER_DB[id]?.rating || 'New',
        bid: job.salaryMax || job.budget || 0
    }));

    const [selectedApplicant, setSelectedApplicant] = useState(null);
    const [offerAmount, setOfferAmount] = useState(job.salaryMax || job.budget || '');
    const [showNDAModal, setShowNDAModal] = useState(false);

    // Hardcoded User ID for Buyer (Employer) - In real app, this comes from context/auth
    const CURRENT_USER_ID = '201';

    const handleHireInitialClick = () => {
        if (!selectedApplicant || !offerAmount) return alert("Please select an applicant and confirm the amount.");
        // Open NDA Modal instead of hiring directly
        setShowNDAModal(true);
    };

    const handleSignAndHire = async (signatureName) => {
        console.log("handleSignAndHire called with:", signatureName);
        try {
            // 1. Log the signature (NDA/Contract)
            // We use a dummy proposalId 'new-hire-{timestamp}' because the true permit ID doesn't exist yet.
            // Or better, we associate it with the Job ID.
            const requestBody = {
                proposalId: `JOB-${job.id}-HIRE-${selectedApplicant.id}`, // Logical link
                userId: CURRENT_USER_ID,
                type: 'CONTRACT', // Or NDA, but "CONTRACT" fits "Work Permit Creation" context well
                signature: signatureName
            };
            console.log("Sending NDA sign request:", requestBody);

            const legalRes = await fetch('https://world-job-backend.vercel.app/investment/nda/sign', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            });

            console.log("NDA sign response status:", legalRes.status);

            if (!legalRes.ok) {
                const errData = await legalRes.json().catch(() => ({}));
                console.error("NDA sign error data:", errData);
                throw new Error(errData.message || "Legal signature failed");
            }

            console.log("NDA signed successfully. Proceeding to hire.");

            // 2. Proceed to Hire
            setShowNDAModal(false);
            onHire(selectedApplicant.id, offerAmount);

        } catch (error) {
            console.error("Error in handleSignAndHire:", error);
            alert("Process Failed: " + error.message);
        }
    };

    const styles = {
        overlay: {
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.7)', display: 'flex',
            justifyContent: 'center', alignItems: 'center', zIndex: 1000
        },
        panel: {
            backgroundColor: '#1f2937', padding: '30px', borderRadius: '15px',
            width: '600px', maxWidth: '90%', maxHeight: '90vh', overflowY: 'auto',
            color: 'white', fontFamily: 'sans-serif', border: '1px solid #374151',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
        },
        applicantCard: {
            backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: '15px',
            marginBottom: '10px', borderRadius: '8px', cursor: 'pointer',
            border: '1px solid transparent', display: 'flex', justifyContent: 'space-between',
            alignItems: 'center'
        },
        selectedCard: {
            borderColor: '#06b6d4', backgroundColor: 'rgba(6, 182, 212, 0.1)'
        },
        btnHire: {
            backgroundColor: '#06b6d4', color: 'white', border: 'none',
            padding: '12px 24px', borderRadius: '8px', cursor: 'pointer',
            fontSize: '16px', fontWeight: 'bold', width: '100%', marginTop: '20px'
        },
        btnCancel: {
            backgroundColor: 'transparent', color: '#9ca3af', border: 'none',
            padding: '10px ', cursor: 'pointer', marginTop: '10px', width: '100%'
        },
        input: {
            width: '100%', padding: '10px', marginTop: '5px',
            backgroundColor: 'rgba(0, 0, 0, 0.2)', border: '1px solid #4b5563',
            color: 'white', borderRadius: '6px'
        }
    };

    return (
        <>
            <div style={styles.overlay} onClick={onClose}>
                <div style={styles.panel} onClick={(e) => e.stopPropagation()}>
                    <h2 style={{ marginBottom: '5px' }}>Hire for: {job.title}</h2>
                    <p style={{ color: '#9ca3af', marginBottom: '20px' }}>Select an applicant to create a Work Permit.</p>

                    <div style={{ marginBottom: '20px' }}>
                        {applicants.length === 0 ? (
                            <p>No applicants yet.</p>
                        ) : (
                            applicants.map(app => (
                                <div
                                    key={app.id}
                                    style={{
                                        ...styles.applicantCard,
                                        ...(selectedApplicant?.id === app.id ? styles.selectedCard : {})
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedApplicant(app);
                                        setOfferAmount(app.bid); // Auto-fill with their bid
                                    }}
                                >
                                    <div>
                                        <div style={{ fontWeight: 'bold', fontSize: '1.1em' }}>{app.name}</div>
                                        <div style={{ fontSize: '0.9em', color: '#9ca3af' }}>{app.skills.join(', ')} • Rating: {app.rating}⭐</div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontWeight: 'bold', color: '#34d399' }}>${app.bid}</div>
                                        <div style={{ fontSize: '0.8em', color: '#6b7280' }}>Bid Amount</div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {selectedApplicant && (
                        <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #374151' }}>
                            <h3 style={{ fontSize: '1.1em', marginBottom: '15px' }}>Terms of Work Permit</h3>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.9em', color: '#9ca3af' }}>Agreed Total Amount (USD)</label>
                                <input
                                    type="number"
                                    style={styles.input}
                                    value={offerAmount}
                                    onChange={(e) => setOfferAmount(e.target.value)}
                                />
                                <p style={{ fontSize: '0.8em', color: '#6b7280', marginTop: '5px' }}>
                                    This amount will be secured in Escrow upon Worker acceptance and Admin activation.
                                </p>
                            </div>
                            <button style={styles.btnHire} onClick={handleHireInitialClick}>
                                ✨ Sign Contract & Create Work Permit
                            </button>
                        </div>
                    )}

                    <button style={styles.btnCancel} onClick={onClose}>Cancel</button>
                </div>
            </div>

            {/* Legal Signing Modal */}
            <NDAModal
                isOpen={showNDAModal}
                onClose={() => setShowNDAModal(false)}
                onSign={handleSignAndHire}
                userId={CURRENT_USER_ID} // Should act as Buyer ID
                type="CONTRACT"
                projectTitle={`Hiring: ${job.title}`}
            />
        </>
    );
};

export default ApplicantSelectionModal;
