
import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

const TreeNode = ({ node, level = 0, expanded, toggleExpand, onAddSub }) => {
    const isExpanded = expanded[node.id];
    const hasChildren = node.children && node.children.length > 0;

    return (
        <div style={{ marginLeft: level * 20 + 'px', marginTop: '5px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span
                    onClick={() => toggleExpand(node.id)}
                    style={{ cursor: hasChildren ? 'pointer' : 'default', width: '20px', display: 'inline-block', color: 'var(--text-muted)' }}
                >
                    {hasChildren ? (isExpanded ? '▼' : '▶') : '•'}
                </span>
                <span style={{
                    color: node.type === 'INDUSTRY' ? 'var(--neon-green)' : node.type === 'SECTOR' ? 'var(--neon-cyan)' : '#fff',
                    fontWeight: node.type === 'INDUSTRY' ? 'bold' : 'normal'
                }}>
                    {node.name}
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', border: '1px solid #333', padding: '2px 5px', borderRadius: '4px' }}>
                    {node.type}
                </span>
                <button
                    onClick={() => onAddSub(node)}
                    className="btn-neon"
                    style={{ padding: '2px 8px', fontSize: '0.7rem', marginLeft: '10px', opacity: 0.7 }}
                >
                    +
                </button>
            </div>
            {isExpanded && node.children.map(child => (
                <TreeNode key={child.id} node={child} level={level + 1} expanded={expanded} toggleExpand={toggleExpand} onAddSub={onAddSub} />
            ))}
        </div>
    );
};

const AdminCategoryPanel = () => {
    const [tree, setTree] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newCat, setNewCat] = useState({ name: '', type: 'INDUSTRY', parentId: '' });
    const [expanded, setExpanded] = useState({});
    const [error, setError] = useState(null);

    // Fetch initial tree
    useEffect(() => {
        fetchTree();
    }, []);

    const fetchTree = () => {
        setLoading(true);
        setError(null);
        fetch(`${API_BASE_URL}/categories/tree`)
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                setTree(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Fetch error (using mock):", err);
                // Mock Data Fallback
                setTree([
                    {
                        id: '1', name: 'Technology', type: 'INDUSTRY', children: [
                            { id: '1-1', name: 'Software Development', type: 'SECTOR', children: [] },
                            { id: '1-2', name: 'Cybersecurity', type: 'SECTOR', children: [] }
                        ]
                    },
                    { id: '2', name: 'Healthcare', type: 'INDUSTRY', children: [] }
                ]);
                setLoading(false);
            });
    };

    const handleAdd = () => {
        if (!newCat.name) return;
        fetch(`${API_BASE_URL}/categories`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newCat)
        })
            .then(res => res.json())
            .then(() => {
                // alert('Category Added!');
                setNewCat({ name: '', type: 'INDUSTRY', parentId: '' });
                fetchTree();
            })
            .catch(err => alert("Error adding category: " + err.message));
    };

    const toggleExpand = (id) => {
        setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <div className="glass-panel" style={{ padding: '30px', borderRadius: '20px' }}>
            <h2 style={{ marginBottom: '20px' }}>Global Skill Categorization</h2>

            {/* Add New Form */}
            <div style={{ padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '15px', marginBottom: '30px' }}>
                <h3>Add New Category</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '10px', marginTop: '10px' }}>
                    <input
                        type="text" placeholder="Category Name"
                        value={newCat.name}
                        onChange={e => setNewCat({ ...newCat, name: e.target.value })}
                        style={{ padding: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', color: '#fff', borderRadius: '5px' }}
                    />
                    <select
                        value={newCat.type}
                        onChange={e => setNewCat({ ...newCat, type: e.target.value })}
                        style={{ padding: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', color: '#fff', borderRadius: '5px' }}
                    >
                        <option value="INDUSTRY">Industry (Root)</option>
                        <option value="SECTOR">Sector</option>
                        <option value="SKILL">Skill</option>
                    </select>
                    <input
                        type="text" placeholder="Parent ID (Optional if Root)"
                        value={newCat.parentId || ''}
                        onChange={e => setNewCat({ ...newCat, parentId: e.target.value })}
                        style={{ padding: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', color: '#fff', borderRadius: '5px' }}
                    />
                    <button onClick={handleAdd} className="btn-neon">ADD</button>
                </div>
            </div>

            {/* Tree View */}
            <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                {loading && <p>Loading hierarchical data...</p>}
                {error && <p style={{ color: 'red' }}>Error loading categories: {error}</p>}
                {!loading && !error && tree.map(node => (
                    <TreeNode
                        key={node.id}
                        node={node}
                        expanded={expanded}
                        toggleExpand={toggleExpand}
                        onAddSub={(n) => setNewCat({ ...newCat, parentId: n.id, type: n.type === 'INDUSTRY' ? 'SECTOR' : 'SKILL' })}
                    />
                ))}
            </div>
        </div>
    );
};

export default AdminCategoryPanel;
