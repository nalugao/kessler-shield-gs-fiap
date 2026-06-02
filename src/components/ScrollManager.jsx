import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Rola para o topo ao trocar de rota, ou para uma âncora (#secao) quando presente.
export default function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        // espera o layout pintar antes de medir
        requestAnimationFrame(() => {
          const y = el.getBoundingClientRect().top + window.scrollY - 70;
          window.scrollTo({ top: y, behavior: 'smooth' });
        });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}
