import React, { useState, useEffect } from 'react';
import { api } from '../../config/api';

const ResourceManager = ({ courseData, userData, onClose }) => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Form state for adding new resources
  const [newResource, setNewResource] = useState({
    title: '',
    description: '',
    resource_type: 'text',
    content: '',
    file_url: '',
    tags: '',
    topic: '',
    lecture_ids: '',
    access_level: 'enrolled_only'
  });

  useEffect(() => {
    if (courseData?.course_id) {
      fetchResources();
    }
  }, [courseData]);

  const fetchResources = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/resources/course/${courseData.course_id}`, {
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

  const handleAddResource = async (e) => {
    e.preventDefault();
    
    try {
      const resourceData = {
        course_id: courseData.course_id,
        title: newResource.title,
        description: newResource.description,
        resource_type: newResource.resource_type,
        content: newResource.content,
        file_url: newResource.file_url || null,
        tags: newResource.tags ? newResource.tags.split(',').map(tag => tag.trim()) : [],
        topic: newResource.topic || null,
        lecture_ids: newResource.lecture_ids ? newResource.lecture_ids.split(',').map(id => id.trim()) : [],
        access_level: newResource.access_level
      };

      const response = await fetch('/api/resources/add', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(resourceData)
      });

      const data = await response.json();

      if (data.success) {
        setResources([data.data.resource, ...resources]);
        setNewResource({
          title: '',
          description: '',
          resource_type: 'text',
          content: '',
          file_url: '',
          tags: '',
          topic: '',
          lecture_ids: '',
          access_level: 'enrolled_only'
        });
        setShowAddForm(false);
      } else {
        setError(data.message || 'Failed to add resource');
      }
    } catch (error) {
      console.error('Error adding resource:', error);
      setError('Failed to add resource. Please try again.');
    }
  };

  const getFilteredResources = () => {
    let filtered = resources;

    if (selectedTopic !== 'all') {
      filtered = filtered.filter(resource => 
        resource.topic === selectedTopic || (!resource.topic && selectedTopic === 'general')
      );
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

  const ResourceCard = ({ resource }) => (
    <div className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{getResourceTypeIcon(resource.resource_type)}</span>
          <div>
            <h3 className="font-semibold text-slate-800 mb-1">{resource.title}</h3>
            <p className="text-sm text-slate-600">{resource.resource_type.toUpperCase()}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {resource.topic && (
            <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full">
              {resource.topic}
            </span>
          )}
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            resource.access_level === 'public' 
              ? 'bg-green-100 text-green-700' 
              : 'bg-orange-100 text-orange-700'
          }`}>
            {resource.access_level === 'public' ? 'Public' : 'Enrolled Only'}
          </span>
        </div>
      </div>

      <p className="text-slate-700 mb-4">{resource.description}</p>

      {resource.content && resource.resource_type === 'text' && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-slate-700 line-clamp-3">{resource.content}</p>
        </div>
      )}

      {resource.file_url && (
        <div className="mb-4">
          <a 
            href={resource.file_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            View Resource
          </a>
        </div>
      )}

      {resource.tags && resource.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {resource.tags.map((tag, index) => (
            <span key={index} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between text-sm text-slate-500">
        <span>Added by {resource.added_by_role === 'teacher' ? 'Teacher' : 'TA'}</span>
        <span>{new Date(resource.created_at).toLocaleDateString()}</span>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
          <div className="p-6">
            <div className="flex justify-center items-center py-12">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                <p className="text-slate-600">Loading course resources...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Course Resources</h2>
            <p className="text-slate-600">{courseData?.course_name} ({courseData?.course_id})</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              Add Resource
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Add Resource Form */}
          {showAddForm && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Add New Resource</h3>
              <form onSubmit={handleAddResource}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Title *</label>
                    <input
                      type="text"
                      required
                      value={newResource.title}
                      onChange={(e) => setNewResource({...newResource, title: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Resource title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Type *</label>
                    <select
                      value={newResource.resource_type}
                      onChange={(e) => setNewResource({...newResource, resource_type: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="text">Text Content</option>
                      <option value="pdf">PDF Document</option>
                      <option value="video">Video</option>
                      <option value="link">Web Link</option>
                      <option value="image">Image</option>
                      <option value="document">Document</option>
                    </select>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Description *</label>
                  <textarea
                    required
                    rows="3"
                    value={newResource.description}
                    onChange={(e) => setNewResource({...newResource, description: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Brief description of the resource"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {newResource.resource_type === 'text' ? 'Content *' : 'File URL'}
                  </label>
                  <textarea
                    required={newResource.resource_type === 'text'}
                    rows="4"
                    value={newResource.content}
                    onChange={(e) => setNewResource({...newResource, content: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder={newResource.resource_type === 'text' ? 'Enter text content...' : 'https://example.com/resource'}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Topic/Chapter</label>
                    <input
                      type="text"
                      value={newResource.topic}
                      onChange={(e) => setNewResource({...newResource, topic: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="e.g., Arrays, Sorting, etc."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Tags (comma-separated)</label>
                    <input
                      type="text"
                      value={newResource.tags}
                      onChange={(e) => setNewResource({...newResource, tags: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="algorithm, practice, theory"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                  >
                    Add Resource
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-6 py-2 text-slate-600 hover:text-slate-800 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search resources..."
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Topics</option>
                {getUniqueTopics().map(topic => (
                  <option key={topic} value={topic}>{topic}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Resources Grid */}
          {getFilteredResources().length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-6 text-slate-400">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm3 7a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm1-4a1 1 0 100 2h4a1 1 0 100-2H8z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-700 mb-2">No Resources Found</h3>
              <p className="text-slate-600 mb-4">
                {searchQuery || selectedTopic !== 'all' 
                  ? 'No resources match your filters.' 
                  : 'Start by adding some resources to help your students.'}
              </p>
              {!showAddForm && (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                >
                  Add First Resource
                </button>
              )}
            </div>
          ) : (
            <div className="grid gap-6">
              {getFilteredResources().map((resource) => (
                <ResourceCard key={resource._id} resource={resource} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResourceManager;
