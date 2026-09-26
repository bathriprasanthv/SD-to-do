import React, { useState, useEffect, useContext, useMemo } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';
import { getTodos, saveTodos } from '../utils/localStorage';
import TodoItem from '../components/TodoItem';
import TaskModal from '../components/TaskModal';
import ConfirmDialog from '../components/ConfirmDialog';
import EmptyState from '../components/EmptyState';
import { Search, Plus, ListTodo, Clock, CalendarDays, CheckCircle2 } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);
  const location = useLocation();

  const [todos, setTodos] = useState([]);
  
  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState(null);

  // Filters & Sort
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [sortBy, setSortBy] = useState('recentlyCreated');

  useEffect(() => {
    if (user) {
      const userTodos = getTodos(user.id);
      setTodos(userTodos);
    }
  }, [user]);
  
  // Set filter based on current route
  useEffect(() => {
    if (location.pathname === '/tasks') setFilter('All');
    else if (location.pathname === '/today') setFilter('Today');
    else if (location.pathname === '/upcoming') setFilter('Upcoming');
    else if (location.pathname === '/completed') setFilter('Completed');
    else if (location.pathname === '/high-priority') setFilter('High Priority');
    else setFilter('All'); // default dashboard
  }, [location.pathname]);

  const handleAddOrUpdateTodo = (todoData) => {
    let updatedTodos;
    if (editingTodo) {
      updatedTodos = todos.map(t => t.id === editingTodo.id ? { ...t, ...todoData } : t);
      addToast('Task updated successfully');
    } else {
      const newTodo = {
        ...todoData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      updatedTodos = [...todos, newTodo];
      addToast('Task created successfully');
    }
    setTodos(updatedTodos);
    saveTodos(user.id, updatedTodos);
    setIsModalOpen(false);
    setEditingTodo(null);
  };

  const confirmDelete = (todo) => {
    setTodoToDelete(todo);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteTodo = () => {
    if (todoToDelete) {
      const updatedTodos = todos.filter(t => t.id !== todoToDelete.id);
      setTodos(updatedTodos);
      saveTodos(user.id, updatedTodos);
      addToast('Task deleted successfully');
      setDeleteConfirmOpen(false);
      setTodoToDelete(null);
    }
  };

  const handleStatusChange = (id, newStatus) => {
    const updatedTodos = todos.map(t => t.id === id ? { ...t, status: newStatus } : t);
    setTodos(updatedTodos);
    saveTodos(user.id, updatedTodos);
    addToast(`Task marked as ${newStatus}`, 'success');
  };

  const openEditModal = (todo) => {
    setEditingTodo(todo);
    setIsModalOpen(true);
  };

  // Compute stats
  const totalTasks = todos.length;
  const pendingTasks = todos.filter(t => t.status === 'Pending').length;
  const inProgressTasks = todos.filter(t => t.status === 'In Progress').length;
  const completedTasks = todos.filter(t => t.status === 'Completed').length;

  // Filter, Search, and Sort Logic
  const filteredAndSortedTodos = useMemo(() => {
    let result = todos;

    // Search (title and description)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(t => 
        t.title.toLowerCase().includes(query) || 
        (t.description && t.description.toLowerCase().includes(query))
      );
    }

    // Filter
    if (filter !== 'All') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (filter === 'High Priority') {
        result = result.filter(t => t.priority === 'High');
      } else if (filter === 'Completed') {
        result = result.filter(t => t.status === 'Completed');
      } else if (filter === 'Pending') {
        result = result.filter(t => t.status === 'Pending');
      } else if (filter === 'In Progress') {
        result = result.filter(t => t.status === 'In Progress');
      } else if (filter === 'Today') {
        result = result.filter(t => {
          if (!t.dueDate) return false;
          const due = new Date(t.dueDate);
          due.setHours(0,0,0,0);
          return due.getTime() === today.getTime();
        });
      } else if (filter === 'Upcoming') {
        result = result.filter(t => {
          if (!t.dueDate) return false;
          const due = new Date(t.dueDate);
          due.setHours(0,0,0,0);
          return due.getTime() > today.getTime() && t.status !== 'Completed';
        });
      }
    }

    // Default dashboard: if no specific route filter, maybe limit to recent tasks or show all
    // Let's just show all on dashboard for now, but sort by recent.

    // Sort
    result = [...result].sort((a, b) => {
      if (sortBy === 'recentlyCreated') {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      } else if (sortBy === 'priorityDesc') {
        const priorityScore = { 'High': 3, 'Medium': 2, 'Low': 1 };
        return (priorityScore[b.priority] || 0) - (priorityScore[a.priority] || 0);
      } else if (sortBy === 'priorityAsc') {
        const priorityScore = { 'High': 3, 'Medium': 2, 'Low': 1 };
        return (priorityScore[a.priority] || 0) - (priorityScore[b.priority] || 0);
      } else if (sortBy === 'dueDateAsc') {
        const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
        const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
        return dateA - dateB;
      } else if (sortBy === 'dueDateDesc') {
        const dateA = a.dueDate ? new Date(a.dueDate).getTime() : -Infinity;
        const dateB = b.dueDate ? new Date(b.dueDate).getTime() : -Infinity;
        return dateB - dateA;
      }
      return 0;
    });

    return result;
  }, [todos, searchQuery, filter, sortBy]);

  const getEmptyStateMessage = () => {
    if (searchQuery) return { title: 'No results found', message: `No tasks match "${searchQuery}"`, action: null };
    if (filter === 'Today') return { title: 'Clear schedule', message: 'You have no tasks due today.', action: 'Add Task' };
    if (filter === 'Completed') return { title: 'No completed tasks', message: 'Completed tasks will appear here.', action: null };
    if (filter === 'Upcoming') return { title: 'No upcoming tasks', message: 'You have no upcoming deadlines.', action: 'Add Task' };
    if (filter === 'High Priority') return { title: 'No high priority tasks', message: 'Take a break, no urgent tasks.', action: null };
    return { title: 'No tasks yet', message: 'Create your first task to get started.', action: 'Create Task' };
  };

  const emptyState = getEmptyStateMessage();

  return (
    <>
      {location.pathname === '/dashboard' && (
        <div className="stat-grid">
          <div className="stat-card">
            <div style={{ padding: '1rem', borderRadius: '50%', backgroundColor: 'rgba(79, 70, 229, 0.1)', color: 'var(--primary-color)' }}>
              <ListTodo size={24} />
            </div>
            <div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: '500' }}>Total Tasks</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>{totalTasks}</div>
            </div>
          </div>
          <div className="stat-card">
            <div style={{ padding: '1rem', borderRadius: '50%', backgroundColor: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning-color)' }}>
              <Clock size={24} />
            </div>
            <div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: '500' }}>Pending</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>{pendingTasks}</div>
            </div>
          </div>
          <div className="stat-card">
            <div style={{ padding: '1rem', borderRadius: '50%', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success-color)' }}>
              <CheckCircle2 size={24} />
            </div>
            <div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: '500' }}>Completed</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>{completedTasks}</div>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ position: 'relative', flex: '1 1 300px', maxWidth: '400px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input 
            type="text" 
            placeholder="Search tasks..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-control"
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {location.pathname === '/tasks' && (
             <select className="form-control" style={{ width: 'auto' }} value={filter} onChange={(e) => setFilter(e.target.value)}>
               <option value="All">All Status</option>
               <option value="Pending">Pending</option>
               <option value="In Progress">In Progress</option>
               <option value="Completed">Completed</option>
             </select>
          )}

          <select className="form-control" style={{ width: 'auto' }} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="recentlyCreated">Recently Created</option>
            <option value="dueDateAsc">Due Date (Earliest First)</option>
            <option value="dueDateDesc">Due Date (Latest First)</option>
            <option value="priorityDesc">Priority (High to Low)</option>
            <option value="priorityAsc">Priority (Low to High)</option>
          </select>

          <button className="btn btn-primary" onClick={() => { setEditingTodo(null); setIsModalOpen(true); }}>
            <Plus size={20} /> Add Task
          </button>
        </div>
      </div>

      <div className="task-list">
        {filteredAndSortedTodos.length === 0 ? (
          <EmptyState 
            title={emptyState.title} 
            message={emptyState.message} 
            actionText={emptyState.action}
            onAction={() => { setEditingTodo(null); setIsModalOpen(true); }}
          />
        ) : (
          filteredAndSortedTodos.map(todo => (
            <TodoItem 
              key={todo.id} 
              todo={todo} 
              onEdit={openEditModal} 
              onDelete={confirmDelete}
              onStatusChange={handleStatusChange}
            />
          ))
        )}
      </div>

      <TaskModal 
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingTodo(null); }}
        onSubmit={handleAddOrUpdateTodo}
        initialData={editingTodo}
      />

      <ConfirmDialog 
        isOpen={deleteConfirmOpen}
        title="Delete Task"
        message={`Are you sure you want to delete "${todoToDelete?.title}"? This action cannot be undone.`}
        onConfirm={handleDeleteTodo}
        onCancel={() => { setDeleteConfirmOpen(false); setTodoToDelete(null); }}
      />
    </>
  );
};

export default Dashboard;
