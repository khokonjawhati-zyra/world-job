
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Filter } from 'lucide-react';

const AdvancedSearch = ({ onSearch }) => {
    const { t } = useTranslation();
    const [query, setQuery] = useState('');
    const [filters, setFilters] = useState({ minBudget: 0, maxBudget: 10000 });
    const [showFilters, setShowFilters] = useState(false);

    const handleSearch = () => {
        onSearch({ query, filters });
    };

    return (
        <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ flex: 1, position: 'relative' }}>
                    <Search style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
                    <input
                        type="text"
                        placeholder={t('search_placeholder')}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        style={{ width: '100%', padding: '15px 15px 15px 45px', borderRadius: '30px', border: 'none', background: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: '1rem' }}
                    />
                </div>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: '50px', height: '50px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                    <Filter color="var(--neon-cyan)" />
                </button>
                <button onClick={handleSearch} className="btn-neon">Search</button>
            </div>

            {showFilters && (
                <div className="glass-panel" style={{ marginTop: '10px', padding: '20px', borderRadius: '15px' }}>
                    <h4 style={{ marginBottom: '10px' }}>{t('filter_budget')}</h4>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <input
                            type="number"
                            placeholder="Min"
                            value={filters.minBudget}
                            onChange={(e) => setFilters({ ...filters, minBudget: e.target.value })}
                            style={{ background: '#222', border: '1px solid #444', padding: '5px', color: '#fff', borderRadius: '5px' }}
                        />
                        <span>-</span>
                        <input
                            type="number"
                            placeholder="Max"
                            value={filters.maxBudget}
                            onChange={(e) => setFilters({ ...filters, maxBudget: e.target.value })}
                            style={{ background: '#222', border: '1px solid #444', padding: '5px', color: '#fff', borderRadius: '5px' }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdvancedSearch;
