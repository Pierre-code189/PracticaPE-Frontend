import { useCallback } from 'react';

export function useToast() {
  const toast = useCallback((msg, kind = '') => {
    let t = document.querySelector('.pp-toast');
    if (!t) {
      t = document.createElement('div');
      t.className = 'pp-toast';
      t.setAttribute('role', 'status');
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.dataset.kind = kind;
    requestAnimationFrame(() => t.classList.add('pp-show'));
    clearTimeout(t._t);
    t._t = setTimeout(() => t.classList.remove('pp-show'), 3200);
  }, []);
  return toast;
}
