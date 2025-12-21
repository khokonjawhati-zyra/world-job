import React from 'react';
import './Logo.css';

const Logo = ({ size = '3rem' }) => {
    return (
        <h1 className="main-logo" style={{ fontSize: size }}>
            <span className="rainbow-text">W</span>
            <span className="earth">🌎</span>
            <span className="rainbow-text">RLD J</span>
            <span className="earth">🌎</span>
            <span className="rainbow-text">B</span>
        </h1>
    );
};

export default Logo;
