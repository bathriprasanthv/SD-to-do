import React from 'react';
import { Pencil, Trash2, CheckCircle2, Circle, Clock, MoreVertical } from 'lucide-react';

const TodoItem = ({ todo, onEdit, onDelete, onStatusChange }) => {
  const isCompleted = todo.status === 'Completed';
  
  const isOverdue = !isCompleted && todo.dueDate && new Date(todo.dueDate) < new Date(new Date().setHours(0,0,0,0));

  const toggleStatus = () => {
    if (todo.status === 'Pending') onStatusChange(todo.id, 'In Progress');
    else if (todo.status === 'In Progress') onStatusChange(todo.id, 'Completed');
    else onStatusChange(todo.id, 'Pending');
  };

  return (
    <div className={`task-item ${isCompleted ? 'completed' : ''}`} style={{ opacity: isCompleted ? 0.7 : 1 }}>
      <div style={{ display: 'flex', gap: '1rem', flex: 1 }}>
        <button 
          onClick={toggleStatus}
          className="btn-icon" 
          style={{ color: isCompleted ? 'var(--success-color)' : (todo.status === 'In Progress' ? 'var(--primary-color)' : 'var(--text-secondary)'), padding: 0 }}
        >
          {isCompleted ? <CheckCircle2 size={24} /> : <Circle size={24} />}
        </button>
        
        <div style={{ flex: 1 }}>
          <h4 style={{ textDecoration: isCompleted ? 'line-through' : 'none', color: isCompleted ? 'var(--text-secondary)' : 'var(--text-primary)', marginBottom: '0.25rem', fontSize: '1rem' }}>
            {todo.title}
          </h4>
          
          {todo.description && (
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
              {todo.description}
            </p>
          )}
          
          <div className="task-badges">
            <span className={`badge badge-${todo.priority.replace(' ', '-')}`}>
              {todo.priority}
            </span>
            <span className="badge badge-status">
              {todo.status}
            </span>
            {todo.dueDate && (
              <span className="badge badge-status" style={{ border: isOverdue ? '1px solid var(--danger-color)' : '1px solid var(--border-color)' }}>
                <Clock size={12} style={{ color: isOverdue ? 'var(--danger-color)' : 'inherit' }} /> 
                <span className={isOverdue ? 'overdue-text' : ''}>
                  {new Date(todo.dueDate).toLocaleDateString()} {isOverdue && '(Overdue)'}
                </span>
              </span>
            )}
          </div>
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: '0.5rem', alignSelf: 'flex-start' }}>
        <button onClick={() => onEdit(todo)} className="btn-icon" title="Edit">
          <Pencil size={18} />
        </button>
        <button onClick={() => onDelete(todo)} className="btn-icon" style={{ color: 'var(--danger-color)' }} title="Delete">
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default TodoItem;
