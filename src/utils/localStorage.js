export const getUsers = () => {
  const users = localStorage.getItem('users');
  return users ? JSON.parse(users) : [];
};

export const saveUser = (user) => {
  const users = getUsers();
  users.push(user);
  localStorage.setItem('users', JSON.stringify(users));
};

export const getTodos = (userId) => {
  const todos = localStorage.getItem(`todos_${userId}`);
  return todos ? JSON.parse(todos) : [];
};

export const saveTodos = (userId, todos) => {
  localStorage.setItem(`todos_${userId}`, JSON.stringify(todos));
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
};

export const setCurrentUser = (user) => {
  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  } else {
    localStorage.removeItem('currentUser');
  }
};
