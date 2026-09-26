import React from 'react';
import { Pencil, Trash2, CheckCircle, Circle, Clock } from 'lucide-react';

const TodoItem = ({ todo, onEdit, onDelete, onStatusChange }) => {
  const getPriorityClass = (priority) => {
    switch(priority) {
      case 'High': return 'badge-High';
      case 'Medium': return 'badge-Medium';
      case 'Low': return 'badge-Low';
      default: return 'badge-Medium';
    }
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'Pending': return 'badge-Pending';
      case 'In Progress': return 'badge-In-Progress';
      case 'Completed': return 'badge-Completed';
      default: return 'badge-Pending';
    }
  };

  const isCompleted = todo.status === 'Completed';

  return (
    <div className={`todo-item ${isCompleted ? 'completed' : ''}`} style={{ opacity: isCompleted ? 0.7 : 1 }}>
      <div className="todo-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button 
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: isCompleted ? 'var(--success-color)' : 'var(--text-secondary)' }}
            onClick={() => onStatusChange(todo.id, isCompleted ? 'Pending' : 'Completed')}
          >
            {isCompleted ? <CheckCircle size={24} /> : <Circle size={24} />}
          </button>
          <span className="todo-title" style={{ textDecoration: isCompleted ? 'line-through' : 'none' }}>
            {todo.title}
          </span>
        </div>
        <div className="todo-actions">
          <button 
            onClick={() => onEdit(todo)} 
            className="btn btn-small btn-outline"
            style={{ padding: '0.25rem 0.5rem' }}
            title="Edit"
          >
            <Pencil size={16} />
          </button>
          <button 
            onClick={() => onDelete(todo.id)} 
            className="btn btn-small btn-danger"
            style={{ padding: '0.25rem 0.5rem' }}
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      
      {todo.description && (
        <p className="todo-desc">{todo.description}</p>
      )}

      <div className="todo-meta">
        <span className={`badge ${getPriorityClass(todo.priority)}`}>
          {todo.priority} Priority
        </span>
        <span className={`badge ${getStatusClass(todo.status)}`}>
          {todo.status}
        </span>
        {todo.dueDate && (
          <span className="badge" style={{ background: '#f3f4f6', color: '#4b5563', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={12} /> {new Date(todo.dueDate).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );
};

export default TodoItem;
