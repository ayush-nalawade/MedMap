// Utility to clear old tokens from localStorage
export const clearAllTokens = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('authToken');
  console.log('All tokens cleared from localStorage');
};

// Check if there are any tokens stored
export const checkStoredTokens = () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  const authToken = localStorage.getItem('authToken');
  
  console.log('Stored tokens:');
  console.log('token:', token ? 'Present' : 'Not found');
  console.log('user:', user ? 'Present' : 'Not found');
  console.log('authToken:', authToken ? 'Present' : 'Not found');
  
  return { token, user, authToken };
};

// Clear tokens and redirect to login
export const clearTokensAndRedirect = () => {
  clearAllTokens();
  window.location.href = '/login-screen';
}; 