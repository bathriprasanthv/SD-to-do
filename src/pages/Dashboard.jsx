import React, { useState, useEffect, useContext, useMemo } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getTodos, saveTodos } from '../utils/localStorage';
import TodoForm from '../components/TodoForm';
import TodoItem from '../components/TodoItem';
import { Search, LogOut } from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [todos, setTodos] = useState([]);
  const [editingTodo, setEditingTodo] = useState(null);

  // Filters & Sort
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [sortBy, setSortBy] = useState('dueDateAsc');

  useEffect(() => {
    if (user) {
      const userTodos = getTodos(user.id);
      setTodos(userTodos);
    }
  }, [user]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleAddOrUpdateTodo = (todoData) => {
    let updatedTodos;
    if (editingTodo) {
      updatedTodos = todos.map(t => t.id === editingTodo.id ? { ...t, ...todoData } : t);
      setEditingTodo(null);
    } else {
      const newTodo = {
        ...todoData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      updatedTodos = [...todos, newTodo];
    }
    setTodos(updatedTodos);
    saveTodos(user.id, updatedTodos);
  };

  const handleDeleteTodo = (id) => {
    const updatedTodos = todos.filter(t => t.id !== id);
    setTodos(updatedTodos);
    saveTodos(user.id, updatedTodos);
  };

  const handleStatusChange = (id, newStatus) => {
    const updatedTodos = todos.map(t => t.id === id ? { ...t, status: newStatus } : t);
    setTodos(updatedTodos);
    saveTodos(user.id, updatedTodos);
  };

  const handleEditTodo = (todo) => {
    setEditingTodo(todo);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Compute stats
  const totalTasks = todos.length;
  const pendingTasks = todos.filter(t => t.status === 'Pending').length;
  const inProgressTasks = todos.filter(t => t.status === 'In Progress').length;
  const completedTasks = todos.filter(t => t.status === 'Completed').length;

  // Filter, Search, and Sort Logic
  const filteredAndSortedTodos = useMemo(() => {
    let result = todos;

    // Search
    if (searchQuery) {
      result = result.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    // Filter
    if (filter !== 'All') {
      if (filter === 'High Priority') {
        result = result.filter(t => t.priority === 'High');
      } else {
        result = result.filter(t => t.status === filter);
      }
    }

    // Sort
    result = [...result].sort((a, b) => {
      if (sortBy.startsWith('priority')) {
        const priorityScore = { 'High': 3, 'Medium': 2, 'Low': 1 };
        const scoreA = priorityScore[a.priority] || 0;
        const scoreB = priorityScore[b.priority] || 0;
        return sortBy === 'priorityDesc' ? scoreA - scoreB : scoreB - scoreA;
      } else if (sortBy.startsWith('dueDate')) {
        const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
        const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
        return sortBy === 'dueDateAsc' ? dateA - dateB : dateB - dateA;
      }
      return 0;
    });

    return result;
  }, [todos, searchQuery, filter, sortBy]);

  return (
    <div className="container" style={{ paddingBottom: '3rem' }}>
      <nav className="navbar">
        <div className="container navbar-content">
          <h1>TodoApp</h1>
          <div className="user-info">
            <span>Welcome, {user.name}</span>
            <button onClick={handleLogout} className="btn btn-outline btn-small" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="stats-row">
        <div className="stat-card">
          <h3>Total Tasks</h3>
          <p>{totalTasks}</p>
        </div>
        <div className="stat-card">
          <h3>Pending</h3>
          <p style={{ color: 'var(--text-secondary)' }}>{pendingTasks}</p>
        </div>
        <div className="stat-card">
          <h3>In Progress</h3>
          <p style={{ color: 'var(--primary-color)' }}>{inProgressTasks}</p>
        </div>
        <div className="stat-card">
          <h3>Completed</h3>
          <p style={{ color: 'var(--success-color)' }}>{completedTasks}</p>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="todo-panel">
          <h2 className="panel-header">{editingTodo ? 'Edit Task' : 'Add New Task'}</h2>
          <TodoForm 
            initialData={editingTodo} 
            onSubmit={handleAddOrUpdateTodo} 
            onCancel={editingTodo ? () => setEditingTodo(null) : null}
          />
        </div>

        <div className="list-panel">
          <h2 className="panel-header">Your Tasks</h2>
          
          <div className="toolbar">
            <div className="search-box" style={{ position: 'relative', flex: '1 1 100%' }}>
              <Search size={18} style={{ position: 'absolute', left: '10px', top: '12px', color: 'var(--text-secondary)' }} />
              <input 
                type="text" 
                placeholder="Search tasks..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '100%', padding: '0.6rem 1rem 0.6rem 2.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--border-color)' }}
              />
            </div>
            
            <div className="form-group" style={{ margin: 0 }}>
              <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="High Priority">High Priority</option>
              </select>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="dueDateAsc">Due Date (Earliest First)</option>
                <option value="dueDateDesc">Due Date (Latest First)</option>
                <option value="priorityAsc">Priority (High to Low)</option>
                <option value="priorityDesc">Priority (Low to High)</option>
              </select>
            </div>
          </div>

          <div className="todo-list">
            {filteredAndSortedTodos.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-secondary)' }}>
                <p>No tasks found. Try adjusting your filters or add a new task!</p>
              </div>
            ) : (
              filteredAndSortedTodos.map(todo => (
                <TodoItem 
                  key={todo.id} 
                  todo={todo} 
                  onEdit={handleEditTodo} 
                  onDelete={handleDeleteTodo}
                  onStatusChange={handleStatusChange}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
