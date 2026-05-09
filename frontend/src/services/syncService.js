/**
 * Service for portfolio sync operations.
 */

// Get CSRF token from cookie
function getCsrfToken() {
  const name = 'csrftoken';
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

// Get base API URL
function getApiUrl() {
  return process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
}

/**
 * Bootstrap CSRF cookie
 */
export async function getCsrf() {
  const response = await fetch(`${getApiUrl()}/sync/csrf/`, {
    method: 'GET',
    credentials: 'include',
  });
  
  if (!response.ok) {
    throw new Error(`CSRF bootstrap failed: ${response.status}`);
  }
  
  return response.json();
}

/**
 * Preview diff for uploaded portfolio.json
 */
export async function previewDiff(file) {
  // First ensure CSRF token is available
  await getCsrf();
  
  const formData = new FormData();
  formData.append('file', file);
  
  const csrfToken = getCsrfToken();
  const headers = {};
  
  if (csrfToken) {
    headers['X-CSRFToken'] = csrfToken;
  }
  
  const response = await fetch(`${getApiUrl()}/sync/preview/`, {
    method: 'POST',
    credentials: 'include',
    headers: headers,
    body: formData,
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || `Preview failed: ${response.status}`);
  }
  
  return data;
}

/**
 * Apply diff changes to database
 */
export async function applyDiff(file, deletions = {}) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('deletions', JSON.stringify(deletions));
  
  const csrfToken = getCsrfToken();
  const headers = {};
  
  if (csrfToken) {
    headers['X-CSRFToken'] = csrfToken;
  }
  
  const response = await fetch(`${getApiUrl()}/sync/apply/`, {
    method: 'POST',
    credentials: 'include',
    headers: headers,
    body: formData,
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || `Apply failed: ${response.status}`);
  }
  
  return data;
}