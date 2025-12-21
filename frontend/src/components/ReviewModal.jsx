
import React, { useState } from 'react';
import { Star } from 'lucide-react';

const ReviewModal = ({ projectId, onClose }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    const handleSubmit = async () => {
        // Mock API Call
        console.log("Submitting review:", { projectId, rating, comment });

        try {
            await fetch('http://localhost:3000/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ projectId, rating, comment, reviewerId: '1' })
            });
            alert('Review Submitted!');
            onClose();
        } catch (e) {
            alert('Error submitting review');
        }
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
            <div className="glass-panel" style={{ width: '400px', padding: '30px', borderRadius: '20px' }}>
                <h2>Rate Experience</h2>
                <div style={{ display: 'flex', gap: '10px', margin: '20px 0', cursor: 'pointer' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                            key={star}
                            fill={star <= rating ? '#FFD700' : 'none'}
                            color={star <= rating ? '#FFD700' : '#666'}
                            onClick={() => setRating(star)}
                        />
                    ))}
                </div>
                <textarea
                    placeholder="Write your feedback..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    style={{ width: '100%', height: '100px', background: '#222', color: '#fff', border: '1px solid #444', borderRadius: '10px', padding: '10px' }}
                />
                <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                    <button onClick={handleSubmit} className="btn-neon" style={{ flex: 1 }}>Submit</button>
                    <button onClick={onClose} className="btn-neon" style={{ flex: 1, borderColor: '#666', color: '#ccc' }}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default ReviewModal;
