import React, { useState, useCallback } from 'react';
import { previewDiff, applyDiff } from '../services/syncService';

// Simple inline diff utility
function createTextDiff(oldText, newText) {
  if (!oldText && !newText) return null;
  if (!oldText) return { type: 'added', text: newText };
  if (!newText) return { type: 'removed', text: oldText };
  if (oldText === newText) return null;
  
  // Simple word-level diff
  const oldWords = oldText.split(/\s+/);
  const newWords = newText.split(/\s+/);
  
  if (oldWords.length <= 10 && newWords.length <= 10) {
    return { type: 'changed', oldText, newText };
  }
  
  // For long text, just show old -> new
  return { type: 'changed', oldText: oldText.substring(0, 100) + '...', newText: newText.substring(0, 100) + '...' };
}

function DiffValue({ oldValue, newValue }) {
  const diff = createTextDiff(oldValue, newValue);
  
  if (!diff) return <span className="text-gray-400">No change</span>;
  
  if (diff.type === 'added') {
    return <span className="text-green-400 font-mono text-sm">+ {diff.text}</span>;
  }
  
  if (diff.type === 'removed') {
    return <span className="text-red-400 font-mono text-sm">- {diff.text}</span>;
  }
  
  return (
    <div className="font-mono text-sm">
      <div className="text-red-400">- {diff.oldText}</div>
      <div className="text-green-400">+ {diff.newText}</div>
    </div>
  );
}

function FieldChanges({ changes }) {
  if (!changes || Object.keys(changes).length === 0) {
    return <div className="text-gray-400 text-sm">No field changes</div>;
  }
  
  return (
    <div className="space-y-2">
      {Object.entries(changes).map(([field, change]) => (
        <div key={field} className="border-l-2 border-blue-400 pl-3">
          <div className="font-semibold text-sm text-blue-300">{field}:</div>
          <DiffValue oldValue={change.old} newValue={change.new} />
        </div>
      ))}
    </div>
  );
}

function EntityCard({ entity, entityType }) {
  const [expanded, setExpanded] = useState(false);
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'bg-green-800 text-green-200 border-green-600';
      case 'updated': return 'bg-yellow-800 text-yellow-200 border-yellow-600';
      case 'unchanged': return 'bg-gray-700 text-gray-200 border-gray-600';
      default: return 'bg-gray-700 text-gray-200 border-gray-600';
    }
  };
  
  const getTitle = () => {
    return entity.title || entity.name || entity.company || entity.platform || `${entityType} #${entity.db_id || entity.json_id}`;
  };
  
  return (
    <div className={`border rounded-lg p-4 ${getStatusColor(entity.status)}`}>
      <div 
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div>
          <span className="font-semibold">{getTitle()}</span>
          {entity.company && <span className="text-sm ml-2">at {entity.company}</span>}
          {entity.organisation && <span className="text-sm ml-2">- {entity.organisation}</span>}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-1 bg-gray-600 text-white rounded">{entity.status}</span>
          <span className="text-sm">{expanded ? '−' : '+'}</span>
        </div>
      </div>
      
      {expanded && (
        <div className="mt-3 space-y-3">
          {entity.field_changes && (
            <div>
              <div className="font-semibold text-sm text-white">Field Changes:</div>
              <FieldChanges changes={entity.field_changes} />
            </div>
          )}
          
          {entity.skills_used && (entity.skills_used.added?.length > 0 || entity.skills_used.removed?.length > 0) && (
            <div>
              <div className="font-semibold text-sm text-white">Skills Changes:</div>
              {entity.skills_used.added?.length > 0 && (
                <div className="text-green-600 text-sm">+ {entity.skills_used.added.join(', ')}</div>
              )}
              {entity.skills_used.removed?.length > 0 && (
                <div className="text-red-600 text-sm">- {entity.skills_used.removed.join(', ')}</div>
              )}
            </div>
          )}
          
          {entity.description_points && (
            <div>
              <div className="font-semibold text-sm text-white">Description Changes:</div>
              <div className="space-y-1 text-sm">
                {entity.description_points.new?.map((point, i) => (
                  <div key={i} className="text-green-600">+ {point.point}</div>
                ))}
                {entity.description_points.updated?.map((point, i) => (
                  <div key={i} className="text-yellow-600">~ Updated description point</div>
                ))}
                {entity.description_points.stale?.map((point, i) => (
                  <div key={i} className="text-red-600">- {point.point}</div>
                ))}
              </div>
            </div>
          )}
          
          {entity.skipped_fields && entity.skipped_fields.length > 0 && (
            <div className="text-gray-400 text-sm">
              Skipped fields: {entity.skipped_fields.join(', ')}
            </div>
          )}
          
          <div className="text-xs text-gray-400">
            DB ID: {entity.db_id || 'N/A'} | JSON ID: {entity.json_id || 'N/A'}
            {entity.matched_by && <span> | Matched by: {entity.matched_by}</span>}
          </div>
        </div>
      )}
    </div>
  );
}

function StaleSection({ staleItems, entityType, selectedDeletions, onToggleDelete }) {
  if (!staleItems || staleItems.length === 0) {
    return <div className="text-gray-400 text-sm">No stale items</div>;
  }
  
  return (
    <div className="space-y-2">
      {staleItems.map((item) => (
        <div key={item.id} className="flex items-center gap-3 p-3 bg-red-900 border border-red-600 rounded">
          <input
            type="checkbox"
            checked={selectedDeletions[entityType]?.includes(item.id) || false}
            onChange={(e) => onToggleDelete(entityType, item.id, e.target.checked)}
            className="rounded"
          />
          <div className="flex-1">
            <div className="font-semibold text-white">{item.title || item.name || item.company || item.platform}</div>
            {item.company && <div className="text-sm text-red-200">at {item.company}</div>}
            {item.point && <div className="text-sm text-red-200">"{item.point.substring(0, 100)}..."</div>}
          </div>
          <div className="text-xs text-red-300">ID: {item.id}</div>
        </div>
      ))}
    </div>
  );
}

function SummaryBadge({ count, type, color }) {
  if (count === 0) return null;
  
  return (
    <span className={`px-2 py-1 text-xs font-medium rounded ${color}`}>
      {count} {type}
    </span>
  );
}

export default function SyncPage() {
  // Override any parent overflow restrictions
  React.useEffect(() => {
    // Save original styles
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalBodyHeight = document.body.style.height;
    
    // Set scrollable styles
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';
    document.body.style.height = 'auto';
    
    return () => {
      // Restore original styles
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.body.style.height = originalBodyHeight;
    };
  }, []);
  const [file, setFile] = useState(null);
  const [jsonData, setJsonData] = useState(null);
  const [diff, setDiff] = useState(null);
  const [selectedDeletions, setSelectedDeletions] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [expandedSections, setExpandedSections] = useState({});
  
  const handleFileChange = useCallback((e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    
    setError('');
    setSuccess('');
    setDiff(null);
    setSelectedDeletions({});
    
    // Validate JSON
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        setJsonData(parsed);
        setFile(selectedFile);
      } catch (err) {
        setError(`Invalid JSON file: ${err.message}`);
        setFile(null);
        setJsonData(null);
      }
    };
    reader.readAsText(selectedFile);
  }, []);
  
  const handlePreview = useCallback(async () => {
    if (!file) return;
    
    setLoading(true);
    setError('');
    
    try {
      const result = await previewDiff(file);
      setDiff(result);
    } catch (err) {
      if (err.message.includes('403') || err.message.includes('Forbidden')) {
        setError('You must be logged into /api/admin/ first. Please log in and try again.');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, [file]);
  
  const handleToggleDelete = useCallback((entityType, itemId, checked) => {
    setSelectedDeletions(prev => {
      const newDeletions = { ...prev };
      if (!newDeletions[entityType]) {
        newDeletions[entityType] = [];
      }
      
      if (checked) {
        if (!newDeletions[entityType].includes(itemId)) {
          newDeletions[entityType] = [...newDeletions[entityType], itemId];
        }
      } else {
        newDeletions[entityType] = newDeletions[entityType].filter(id => id !== itemId);
      }
      
      return newDeletions;
    });
  }, []);
  
  const handleApply = useCallback(async () => {
    if (!file || !diff) return;
    
    const confirmed = window.confirm(
      'This will modify your database. Are you sure you want to apply these changes?'
    );
    
    if (!confirmed) return;
    
    setLoading(true);
    setError('');
    
    try {
      const result = await applyDiff(file, selectedDeletions);
      setSuccess('Changes applied successfully! Portfolio.json has been refreshed.');
      setDiff(null);
      setFile(null);
      setJsonData(null);
      setSelectedDeletions({});
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [file, diff, selectedDeletions]);
  
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  const entityTypes = ['projects', 'experiences', 'categories', 'coding_skills', 'opensource', 'about'];
  
  return (
    <div 
      className="bg-gray-900 py-8 px-8" 
      style={{ 
        minHeight: '100vh', 
        height: 'auto', 
        overflow: 'visible',
        position: 'relative',
        zIndex: 1
      }}
    >
      <div className="max-w-6xl mx-auto" style={{ height: 'auto' }}>
        <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700 p-6 mb-8" style={{ height: 'auto' }}>
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white">Portfolio Sync</h1>
            <p className="text-gray-300 mt-2">
              Upload an updated portfolio.json to preview and apply changes to your database.
            </p>
          </div>
          
          {/* File Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-white mb-2">
              Select portfolio.json file
            </label>
            <input
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
            />
            {jsonData && (
              <div className="mt-2 text-sm text-green-600">
                ✓ Valid JSON loaded ({Object.keys(jsonData).join(', ')})
              </div>
            )}
          </div>
          
          {/* Actions */}
          <div className="mb-6 flex gap-3">
            <button
              onClick={handlePreview}
              disabled={!file || loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading && !diff ? 'Computing...' : 'Compute Diff'}
            </button>
            
            {diff && (
              <button
                onClick={handleApply}
                disabled={loading}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Applying...' : 'Apply Changes'}
              </button>
            )}
          </div>
          
          {/* Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-900 border border-red-600 rounded-md">
              <div className="text-red-200">{error}</div>
              {error.includes('logged into /api/admin/') && (
                <div className="mt-2">
                  <a 
                    href="/api/admin/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    → Open Django Admin
                  </a>
                </div>
              )}
            </div>
          )}
          
          {success && (
            <div className="mb-6 p-4 bg-green-900 border border-green-600 rounded-md">
              <div className="text-green-200">{success}</div>
            </div>
          )}
          
          {/* Diff Results */}
          {diff && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-4">Preview Changes</h2>
                
                {/* Global Skipped Fields Notice */}
                {diff.skipped_fields_globally && diff.skipped_fields_globally.length > 0 && (
                  <div className="mb-4 p-3 bg-yellow-900 border border-yellow-600 rounded-md">
                    <div className="text-yellow-200 text-sm">
                      <strong>Note:</strong> Image and file fields are skipped and must be managed through Django Admin: {' '}
                      {diff.skipped_fields_globally.join(', ')}
                    </div>
                  </div>
                )}
                
                {/* Summary */}
                <div className="mb-6 p-4 bg-gray-700 rounded-md border border-gray-600">
                  <h3 className="font-semibold mb-3 text-white">Summary</h3>
                  <div className="space-y-2">
                    {entityTypes.map(entityType => {
                      const summary = diff.summary[entityType];
                      if (!summary) return null;
                      
                      if (entityType === 'about') {
                        return (
                          <div key={entityType} className="flex items-center gap-4">
                            <span className="font-medium capitalize w-24">{entityType}:</span>
                            <span className={`px-2 py-1 text-xs font-medium rounded border ${
                              summary.status === 'updated' ? 'bg-yellow-800 text-yellow-200 border-yellow-600' :
                              summary.status === 'new' ? 'bg-green-800 text-green-200 border-green-600' :
                              'bg-gray-600 text-gray-200 border-gray-500'
                            }`}>
                              {summary.status}
                            </span>
                          </div>
                        );
                      }
                      
                      return (
                        <div key={entityType} className="flex items-center gap-4">
                        <span className="font-medium capitalize w-24 text-white">{entityType.replace('_', ' ')}:</span>
                        <div className="flex gap-2">
                          <SummaryBadge count={summary.new} type="new" color="bg-green-800 text-green-200 border border-green-600" />
                          <SummaryBadge count={summary.updated} type="updated" color="bg-yellow-800 text-yellow-200 border border-yellow-600" />
                          <SummaryBadge count={summary.unchanged} type="unchanged" color="bg-gray-600 text-gray-200 border border-gray-500" />
                          <SummaryBadge count={summary.stale} type="stale" color="bg-red-800 text-red-200 border border-red-600" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              
              {/* Entity Details */}
              <div className="space-y-4">
              {entityTypes.map(entityType => {
                const entities = diff.entities[entityType];
                const staleItems = diff.stale[entityType];
                
                if (!entities || (entities.length === 0 && (!staleItems || staleItems.length === 0))) {
                  return null;
                }
                
                const isExpanded = expandedSections[entityType];
                const hasChanges = entities.some(e => e.status !== 'unchanged') || (staleItems && staleItems.length > 0);
                
                return (
                  <div key={entityType} className="border border-gray-600 rounded-lg bg-gray-800">
                    <div 
                      className={`p-4 cursor-pointer flex justify-between items-center ${hasChanges ? 'bg-gray-700' : 'bg-gray-750'}`}
                      onClick={() => toggleSection(entityType)}
                    >
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold capitalize text-white">{entityType.replace('_', ' ')}</h3>
                        <span className="text-sm text-gray-300">
                          ({entities.length} items{staleItems && staleItems.length > 0 ? `, ${staleItems.length} stale` : ''})
                        </span>
                      </div>
                      <span className="text-lg text-white">{isExpanded ? '−' : '+'}</span>
                    </div>
                    
                    {isExpanded && (
                      <div className="p-4 border-t border-gray-600 space-y-4 bg-gray-750">
                        {/* Active Entities */}
                        {entities.length > 0 && (
                          <div className="space-y-3">
                            {entities.map((entity, index) => (
                              <EntityCard 
                                key={entity.db_id || entity.json_id || index} 
                                entity={entity} 
                                entityType={entityType}
                              />
                            ))}
                          </div>
                        )}
                        
                        {/* Stale Items */}
                        {staleItems && staleItems.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-red-300 mb-2">
                              Stale Items (check to delete on apply):
                            </h4>
                            <StaleSection 
                              staleItems={staleItems}
                              entityType={entityType}
                              selectedDeletions={selectedDeletions}
                              onToggleDelete={handleToggleDelete}
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}