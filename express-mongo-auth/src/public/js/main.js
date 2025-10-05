// src/public/js/main.js
document.addEventListener('DOMContentLoaded', () => {
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      sessionStorage.removeItem('jwt');
      window.location = '/signIn';
    });
  }

  // Comprobar token al cargar cualquier página protegida por cliente:
  const token = sessionStorage.getItem('jwt');
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < now) {
        // token expirado
        sessionStorage.removeItem('jwt');
        if (window.location.pathname !== '/signIn') window.location = '/signIn';
      }
    } catch (e) {
      sessionStorage.removeItem('jwt');
      if (window.location.pathname !== '/signIn') window.location = '/signIn';
    }
  } else {
    // Si la ruta actual necesita autenticación (dashboard/profile), redirigir
    const protectedPaths = ['/dashboard', '/profile'];
    if (protectedPaths.some(p => window.location.pathname.startsWith(p))) {
      window.location = '/signIn';
    }
  }
});
