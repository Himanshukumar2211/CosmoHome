import { useEffect } from 'react';

export default function SeoSchema({ data }) {
  useEffect(() => {
    if (!data) return undefined;

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.dataset.schema = 'cosmo-home';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, [data]);

  return null;
}
