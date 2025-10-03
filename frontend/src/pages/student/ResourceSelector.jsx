import React, { useState, useEffect } from 'react';

const ResourceSelector = ({ courseId, selectedResources = [], onResourceToggle, onClose }) => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  useEffect(() => {
    if (courseId) {
      fetchResources();
    }
  }, [courseId]);

  const fetchResources = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/resources/course/${courseId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setResources(data.data.resources || []);
      } else {
        setError(data.message || 'Failed to fetch resources');
      }
    } catch (error) {
      console.error('Error fetching resources:', error);
      setError('Failed to load resources. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredResources = () => {
    let filtered = resources;

    if (selectedTopic !== 'all') {
      filtered = filtered.filter(resource => 
        resource.topic === selectedTopic || (!resource.topic && selectedTopic === 'general')
      );
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(resource => resource.resource_type === selectedType);
    }

    if (searchQuery) {
      filtered = filtered.filter(resource =>
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    return filtered;
  };

  const getUniqueTopics = () => {
    const topics = new Set();
    resources.forEach(resource => {
      topics.add(resource.topic || 'General');
    });
    return Array.from(topics).sort();
  };

  const getUniqueTypes = () => {
    const types = new Set();
    resources.forEach(resource => {
      types.add(resource.resource_type);
    });
    return Array.from(types).sort();
  };

  const getResourceTypeIcon = (type) => {
    const icons = {
      text: '📄',
      pdf: '📕',
      video: '🎥',
      link: '🔗',
      image: '🖼️',
      document: '📋'
    };
    return icons[type] || '📄';
  };

  const isResourceSelected = (resourceId) => {
    return selectedResources.includes(resourceId);
  };

  const ResourceCard = ({ resource }) => (
    <div 
      className={`bg-white border rounded-xl p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
        isResourceSelected(resource._id) 
          ? 'border-indigo-500 bg-indigo-50 shadow-md' 
          : 'border-slate-200'
      }`}
      onClick={() => onResourceToggle(resource._id)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 flex-1">
          <span className="text-xl">{getResourceTypeIcon(resource.resource_type)}</span>
          <div className="flex-1">
            <h3 className="font-semibold text-slate-800 mb-1 text-sm leading-tight">{resource.title}</h3>
            <p className="text-xs text-slate-500 uppercase tracking-wide">{resource.resource_type}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isResourceSelected(resource._id) && (
            <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          )}
          {resource.topic && (
            <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full">
              {resource.topic}
            </span>
          )}
        </div>
      </div>

      <p className="text-slate-700 text-sm mb-3 line-clamp-2">{resource.description}</p>

      {resource.content && resource.resource_type === 'text' && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 mb-3">
          <p className="text-xs text-slate-600 line-clamp-2">{resource.content}</p>
        </div>
      )}

      {resource.tags && resource.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {resource.tags.slice(0, 3).map((tag, index) => (
            <span key={index} className="px-2 py-1 bg-slate-100 text-slate-500 text-xs rounded-full">
              #{tag}
            </span>
          ))}
          {resource.tags.length > 3 && (
            <span className="px-2 py-1 bg-slate-100 text-slate-500 text-xs rounded-full">
              +{resource.tags.length - 3} more
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden">
          <div className="p-6">
            <div className="flex justify-center items-center py-12">
              <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                <p className="text-slate-600">Loading resources...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Reference Resources</h2>
            <p className="text-slate-600 text-sm">Select resources related to your question</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search resources..."
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Topics</option>
                {getUniqueTopics().map(topic => (
                  <option key={topic} value={topic}>{topic}</option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Types</option>
                {getUniqueTypes().map(type => (
                  <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Selected Resources Summary */}
          {selectedResources.length > 0 && (
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-6">
              <p className="text-indigo-800 font-medium text-sm mb-2">
                Selected Resources ({selectedResources.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedResources.map(resourceId => {
                  const resource = resources.find(r => r._id === resourceId);
                  return resource ? (
                    <span key={resourceId} className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full">
                      <span>{getResourceTypeIcon(resource.resource_type)}</span>
                      <span>{resource.title}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onResourceToggle(resourceId);
                        }}
                        className="ml-1 text-indigo-600 hover:text-indigo-800"
                      >
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </span>
                  ) : null;
                })}
              </div>
            </div>
          )}

          {/* Resources Grid */}
          {getFilteredResources().length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 text-slate-400">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm3 7a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm1-4a1 1 0 100 2h4a1 1 0 100-2H8z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-700 mb-2">No Resources Found</h3>
              <p className="text-slate-600 text-sm">
                {searchQuery || selectedTopic !== 'all' || selectedType !== 'all'
                  ? 'No resources match your current filters.'
                  : 'No resources have been added to this course yet.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {getFilteredResources().map((resource) => (
                <ResourceCard key={resource._id} resource={resource} />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-slate-200">
          <p className="text-slate-600 text-sm">
            Click on resources to reference them in your question
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceSelector;
