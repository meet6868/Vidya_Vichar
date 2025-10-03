import React, { useState } from 'react';

const QuestionForm = ({ 
  onSubmit, 
  onCancel, 
  submitting = false 
}) => {
  const [questionText, setQuestionText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (questionText.trim()) {
      onSubmit(questionText.trim());
      // Reset form
      setQuestionText('');
    }
  };

  const handleCancel = () => {
    setQuestionText('');
    onCancel();
  };

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-6">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Ask a Question</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Your Question *
          </label>
          <textarea
            required
            rows="4"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="What would you like to ask about this lecture?"
          />
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={submitting || !questionText.trim()}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Submitting...' : 'Ask Question'}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-2 text-slate-600 hover:text-slate-800 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuestionForm;
