import React from 'react';
import { Inbox } from 'lucide-react';

const EmptyState = ({ title, message, actionText, onAction }) => {
  return (
    <div style={{ textAlign: 'center', padding: '4rem 2rem', backgroundColor: 'var(--card-bg)', borderRadius: 'var(--radius)', border: '1px dashed var(--border-color)' }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--bg-color)', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
        <Inbox size={32} />
      </div>
      <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>{title}</h3>
      <p style={{ color: 'var(--text-secondary)', marginBottom: actionText ? '2rem' : '0' }}>{message}</p>
      
      {actionText && onAction && (
        <button className="btn btn-primary" onClick={onAction}>
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
