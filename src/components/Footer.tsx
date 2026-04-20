import React from 'react';

export default function Footer() {
  const footerLinks = [
    {
      title: 'Tienda',
      links: [
        { label: 'Catálogo', href: '#products' },
        { label: 'Novedades', href: '#products' },
        { label: 'Ofertas', href: '#products' },
        { label: 'Administrar', href: '#admin' },
      ],
    },
    {
      title: 'Empresa',
      links: [
        { label: 'Sobre Oruel', href: '#about' },
        { label: 'Nuestra Historia', href: '#about' },
        { label: 'Contacto', href: '#contact' },
        { label: 'Trabaja con Nosotros', href: '#' },
      ],
    },
    {
      title: 'Ayuda',
      links: [
        { label: 'Preguntas Frecuentes', href: '#' },
        { label: 'Envíos y Devoluciones', href: '#' },
        { label: 'Política de Privacidad', href: '#' },
        { label: 'Términos y Condiciones', href: '#' },
      ],
    },
  ];

  return (
    <footer className="bg-zinc-950 text-white pt-20 pb-0">
      <div className="max-w-7xl mx-auto px-[5%]">

        {/* Top */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-16 pb-12 border-b border-white/10">

          {/* Brand */}
          <div>
            <span className="font-serif text-[1.8rem] font-bold tracking-[0.15em] text-white">ORUEL</span>
            <p className="text-sm text-zinc-500 leading-relaxed mt-4 mb-6 max-w-[280px]">
              Productos de calidad premium para cada estilo de vida. Diseño, elegancia y excelencia en cada detalle.
            </p>
            <div className="flex gap-3">
              {[
                { label: 'Instagram', path: 'M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zM17.5 6.5h.01' },
                { label: 'Facebook', path: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z' },
              ].map(({ label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-9 h-9 border border-white/15 rounded-full flex items-center justify-center text-zinc-500 hover:border-white hover:text-white hover:bg-white/8 transition-all duration-200"
                >
                  {label === 'Instagram' && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                      <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                    </svg>
                  )}
                  {label === 'Facebook' && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                    </svg>
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
            {footerLinks.map(col => (
              <div key={col.title}>
                <h4 className="text-[11px] font-bold tracking-[0.18em] uppercase text-white mb-5">
                  {col.title}
                </h4>
                <ul className="flex flex-col gap-3 list-none m-0 p-0">
                  {col.links.map(link => (
                    <li key={link.label}>
                      <a href={link.href} className="text-sm text-zinc-500 no-underline hover:text-white transition-colors duration-200">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-wrap justify-between items-center gap-4 py-6">
          <p className="text-xs text-zinc-600 m-0">
            &copy; {new Date().getFullYear()} Oruel. Todos los derechos reservados.
          </p>
          <p className="text-xs text-zinc-700 italic m-0">
            Diseñado con ♦ para los que aprecian la calidad
          </p>
        </div>
      </div>
    </footer>
  );
}
