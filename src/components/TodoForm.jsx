import React, { useState, useEffect } from 'react';

const TodoForm = ({ onSubmit, initialData, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState('Pending');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setPriority(initialData.priority || 'Medium');
      setDueDate(initialData.dueDate || '');
      setStatus(initialData.status || 'Pending');
    } else {
      setTitle('');
      setDescription('');
      setPriority('Medium');
      setDueDate('');
      setStatus('Pending');
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title) {
      setError('Title is required');
      return;
    }
    setError('');
    onSubmit({
      title,
      description,
      priority,
      dueDate,
      status
    });
    
    if (!initialData) {
      setTitle('');
      setDescription('');
      setPriority('Medium');
      setDueDate('');
      setStatus('Pending');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <span className="error-msg" style={{marginBottom: '1rem', display: 'block'}}>{error}</span>}
      <div className="form-group">
        <label>Title</label>
        <input 
          type="text" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Todo title"
        />
      </div>
      <div className="form-group">
        <label>Description</label>
        <textarea 
          value={description} 
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          rows="3"
        />
      </div>
      <div className="form-group">
        <label>Priority</label>
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>
      <div className="form-group">
        <label>Due Date</label>
        <input 
          type="date" 
          value={dueDate} 
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>
      {initialData && (
        <div className="form-group">
          <label>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      )}
      <div style={{display: 'flex', gap: '1rem', marginTop: '1rem'}}>
        <button type="submit" className="btn btn-primary">{initialData ? 'Update Todo' : 'Add Todo'}</button>
        {onCancel && (
          <button type="button" className="btn btn-outline" onClick={onCancel}>Cancel</button>
        )}
      </div>
    </form>
  );
};

export default TodoForm;
