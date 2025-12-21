import React, { useState } from 'react';

const JobPostTemplate = ({ onSubmit, initialData = {} }) => {
    const [formData, setFormData] = useState({
        jobTitle: initialData.jobTitle || '',
        jobCategory: initialData.jobCategory || 'Online', // Online, Offline, Enterprise, Government, Daily Labor
        jobType: initialData.jobType || 'Full-time', // Full-time, Part-time, Freelance, Contract, Daily
        industry: initialData.industry || '',
        workMode: initialData.workMode || 'Remote', // Remote, On-site, Hybrid
        location: initialData.location || '',
        description: initialData.description || '',
        skills: initialData.skills || '',
        experienceLevel: initialData.experienceLevel || 'Mid',
        education: initialData.education || '',
        language: initialData.language || '',
        workingHours: initialData.workingHours || '',
        startDate: initialData.startDate || '',
        duration: initialData.duration || '',
        salaryType: initialData.salaryType || 'Monthly',
        salaryMin: initialData.salaryMin || '',
        salaryMax: initialData.salaryMax || '',
        benefits: initialData.benefits || '',
        applicationMethod: initialData.applicationMethod || 'One-click apply',
        interviewType: initialData.interviewType || 'Online'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSubmit) {
            onSubmit(formData);
        } else {
            console.log('Job Posted:', formData);
            alert('Job Posted Successfully! (Console Check)');
        }
    };

    const inputStyle = {
        width: '100%',
        padding: '12px',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid var(--glass-border)',
        borderRadius: '8px',
        color: 'white',
        fontFamily: 'inherit',
        marginBottom: '15px'
    };

    const labelStyle = {
        display: 'block',
        color: 'var(--text-muted)',
        marginBottom: '5px',
        fontSize: '0.9rem'
    };

    const sectionStyle = {
        background: 'rgba(255,255,255,0.02)',
        padding: '20px',
        borderRadius: '15px',
        marginBottom: '20px',
        border: '1px solid rgba(255,255,255,0.05)'
    };

    const headerStyle = {
        color: 'var(--neon-cyan)',
        marginBottom: '15px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
    };

    return (
        <form onSubmit={handleSubmit} style={{ maxWidth: '900px', margin: '0 auto', animation: 'fadeIn 0.5s ease-in-out' }}>
            <h2 style={{ marginBottom: '30px', textAlign: 'center' }}>📄 Create Standardized Job Post</h2>

            {/* SECTION 1: Basic Info */}
            <div style={sectionStyle}>
                <h3 style={headerStyle}>📌 Basic Information</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                        <label style={labelStyle}>Job Title</label>
                        <input
                            type="text"
                            name="jobTitle"
                            value={formData.jobTitle}
                            onChange={handleChange}
                            placeholder="e.g. Senior React Developer"
                            style={inputStyle}
                            required
                        />
                    </div>
                    <div>
                        <label style={labelStyle}>Industry / Sector</label>
                        <input
                            type="text"
                            name="industry"
                            value={formData.industry}
                            onChange={handleChange}
                            placeholder="e.g. IT, Healthcare, Construction"
                            style={inputStyle}
                        />
                    </div>
                    <div>
                        <label style={labelStyle}>Job Category</label>
                        <select name="jobCategory" value={formData.jobCategory} onChange={handleChange} style={inputStyle}>
                            <option value="Online" style={{ backgroundColor: '#000' }}>Online Jobs</option>
                            <option value="Offline" style={{ backgroundColor: '#000' }}>Offline Jobs</option>
                            <option value="Enterprise" style={{ backgroundColor: '#000' }}>Enterprise Jobs</option>
                            <option value="Government" style={{ backgroundColor: '#000' }}>Government Jobs</option>
                            <option value="Daily Labor" style={{ backgroundColor: '#000' }}>Daily Labor Jobs</option>
                            <option value="Freelance" style={{ backgroundColor: '#000' }}>Freelance & Contract</option>
                        </select>
                    </div>
                    <div>
                        <label style={labelStyle}>Job Type</label>
                        <select name="jobType" value={formData.jobType} onChange={handleChange} style={inputStyle}>
                            <option value="Full-time" style={{ backgroundColor: '#000' }}>Full-time</option>
                            <option value="Part-time" style={{ backgroundColor: '#000' }}>Part-time</option>
                            <option value="Freelance" style={{ backgroundColor: '#000' }}>Freelance</option>
                            <option value="Contract" style={{ backgroundColor: '#000' }}>Contract</option>
                            <option value="Daily" style={{ backgroundColor: '#000' }}>Daily</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* SECTION 2: Location & Work Mode */}
            <div style={sectionStyle}>
                <h3 style={headerStyle}>🌍 Location & Work Mode</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                        <label style={labelStyle}>Work Mode</label>
                        <select name="workMode" value={formData.workMode} onChange={handleChange} style={inputStyle}>
                            <option value="Remote" style={{ backgroundColor: '#000' }}>Remote</option>
                            <option value="On-site" style={{ backgroundColor: '#000' }}>On-site</option>
                            <option value="Hybrid" style={{ backgroundColor: '#000' }}>Hybrid</option>
                        </select>
                    </div>
                    <div>
                        <label style={labelStyle}>Location</label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="e.g. New York, USA (or Fully Remote)"
                            style={inputStyle}
                        />
                    </div>
                </div>
            </div>

            {/* SECTION 3: Job Description & Skills */}
            <div style={sectionStyle}>
                <h3 style={headerStyle}>📝 Job Details & Requirements</h3>
                <div>
                    <label style={labelStyle}>Job Description</label>
                    <textarea
                        name="description"
                        rows="5"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Detailed description of roles and responsibilities..."
                        style={{ ...inputStyle, minHeight: '120px' }}
                        required
                    ></textarea>
                </div>
                <div>
                    <label style={labelStyle}>Required Skills (comma separated)</label>
                    <input
                        type="text"
                        name="skills"
                        value={formData.skills}
                        onChange={handleChange}
                        placeholder="e.g. React, Node.js, Teamwork"
                        style={inputStyle}
                    />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                    <div>
                        <label style={labelStyle}>Experience Level</label>
                        <select name="experienceLevel" value={formData.experienceLevel} onChange={handleChange} style={inputStyle}>
                            <option value="No Experience" style={{ backgroundColor: '#000' }}>No Experience</option>
                            <option value="Entry" style={{ backgroundColor: '#000' }}>Entry Level</option>
                            <option value="Mid" style={{ backgroundColor: '#000' }}>Mid Level</option>
                            <option value="Senior" style={{ backgroundColor: '#000' }}>Senior Level</option>
                        </select>
                    </div>
                    <div>
                        <label style={labelStyle}>Education / Certification</label>
                        <input
                            type="text"
                            name="education"
                            value={formData.education}
                            onChange={handleChange}
                            placeholder="e.g. Bachelor's Degree"
                            style={inputStyle}
                        />
                    </div>
                    <div>
                        <label style={labelStyle}>Language Requirements</label>
                        <input
                            type="text"
                            name="language"
                            value={formData.language}
                            onChange={handleChange}
                            placeholder="e.g. English, Spanish"
                            style={inputStyle}
                        />
                    </div>
                </div>
            </div>

            {/* SECTION 4: Work Details & Salary */}
            <div style={sectionStyle}>
                <h3 style={headerStyle}>💰 Salary & Benefits</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                        <label style={labelStyle}>Salary Type</label>
                        <select name="salaryType" value={formData.salaryType} onChange={handleChange} style={inputStyle}>
                            <option value="Monthly" style={{ backgroundColor: '#000' }}>Monthly</option>
                            <option value="Weekly" style={{ backgroundColor: '#000' }}>Weekly</option>
                            <option value="Daily" style={{ backgroundColor: '#000' }}>Daily</option>
                            <option value="Hourly" style={{ backgroundColor: '#000' }}>Hourly</option>
                            <option value="Project-based" style={{ backgroundColor: '#000' }}>Project-based</option>
                        </select>
                    </div>
                    <div>
                        <label style={labelStyle}>Salary Range ($)</label>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <input
                                type="number"
                                name="salaryMin"
                                value={formData.salaryMin}
                                onChange={handleChange}
                                placeholder="Min"
                                style={inputStyle}
                            />
                            <span style={{ alignSelf: 'center', color: '#fff' }}>-</span>
                            <input
                                type="number"
                                name="salaryMax"
                                value={formData.salaryMax}
                                onChange={handleChange}
                                placeholder="Max"
                                style={inputStyle}
                            />
                        </div>
                    </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                        <label style={labelStyle}>Working Hours</label>
                        <input
                            type="text"
                            name="workingHours"
                            value={formData.workingHours}
                            onChange={handleChange}
                            placeholder="e.g. 9 AM - 5 PM EST"
                            style={inputStyle}
                        />
                    </div>
                    <div>
                        <label style={labelStyle}>Start Date & Duration</label>
                        <input
                            type="text"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleChange}
                            placeholder="e.g. Immediate, 6 Months"
                            style={inputStyle}
                        />
                    </div>
                </div>
                <div>
                    <label style={labelStyle}>Benefits & Perks</label>
                    <input
                        type="text"
                        name="benefits"
                        value={formData.benefits}
                        onChange={handleChange}
                        placeholder="e.g. Health Insurance, Remote Work, Bonuses"
                        style={inputStyle}
                    />
                </div>
            </div>

            {/* SECTION 5: Application Process */}
            <div style={sectionStyle}>
                <h3 style={headerStyle}>📩 Application Process</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                        <label style={labelStyle}>Application Method</label>
                        <select name="applicationMethod" value={formData.applicationMethod} onChange={handleChange} style={inputStyle}>
                            <option value="One-click apply" style={{ backgroundColor: '#000' }}>One-click Apply</option>
                            <option value="CV upload" style={{ backgroundColor: '#000' }}>CV Upload Required</option>
                            <option value="Direct contact" style={{ backgroundColor: '#000' }}>Direct Contact</option>
                        </select>
                    </div>
                    <div>
                        <label style={labelStyle}>Interview Type</label>
                        <select name="interviewType" value={formData.interviewType} onChange={handleChange} style={inputStyle}>
                            <option value="Online" style={{ backgroundColor: '#000' }}>Online (Zoom/Meet)</option>
                            <option value="Offline" style={{ backgroundColor: '#000' }}>Offline / In-person</option>
                            <option value="Phone" style={{ backgroundColor: '#000' }}>Phone Screen</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* SECTION 6: Trust & Safety (Read Only / Badge) */}
            <div style={{ ...sectionStyle, background: 'rgba(0,255,150,0.05)', border: '1px solid var(--neon-lime)' }}>
                <h3 style={{ ...headerStyle, color: 'var(--neon-lime)' }}>🔒 Trust & Safety</h3>
                <p style={{ color: '#ccc', fontSize: '0.9rem' }}>
                    Your job post will be reviewed by our admin team (`Admin Approval Status`).
                    A <strong>Verified Badge</strong> will be displayed if your account is verified.
                    Anti-scam protection is active for this post.
                </p>
            </div>

            <button type="submit" className="btn-neon" style={{ width: '100%', padding: '15px', fontSize: '1.2rem', marginTop: '10px' }}>
                🚀 Publish Job Now
            </button>
        </form>
    );
};

export default JobPostTemplate;
