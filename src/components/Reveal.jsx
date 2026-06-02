import { useEffect, useRef, useState } from 'react';

// Envolve o conteúdo e adiciona a classe `in` quando entra na viewport.
export default function Reveal({ as: Tag = 'div', className = '', children, ...rest }) {
  const ref = useRef(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) { setShow(true); return; }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => {
        if (en.isIntersecting) { setShow(true); io.unobserve(en.target); }
      }),
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag ref={ref} className={`reveal ${show ? 'in' : ''} ${className}`.trim()} {...rest}>
      {children}
    </Tag>
  );
}
