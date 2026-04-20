import React from 'react';

export default function Hero() {
  return (
    <section id="hero" className="relative min-h-screen grid md:grid-cols-2 items-center gap-12 px-[5%] pt-[100px] pb-16 bg-zinc-50 overflow-hidden">

      {/* Grid background */}
      <div className="absolute inset-0 bg-grid pointer-events-none" />

      {/* Content */}
      <div className="relative max-w-xl animate-fade-up">
        <span className="inline-block px-3.5 py-1.5 bg-zinc-950 text-white text-[11px] font-bold tracking-[0.15em] uppercase rounded-sm mb-6">
          Nueva Colección 2025
        </span>

        <h1 className="font-serif text-[clamp(2.8rem,5vw,4.2rem)] font-bold text-zinc-950 leading-[1.1] tracking-tight mb-5">
          Estilo que<br /><em className="not-italic text-zinc-500">define</em> momentos.
        </h1>

        <p className="text-[1.05rem] text-zinc-500 leading-[1.7] mb-10 max-w-[440px]">
          Descubre nuestra selección curada de productos premium. Calidad, diseño y elegancia en cada detalle.
        </p>

        <div className="flex flex-wrap gap-4 mb-12">
          <a
            href="#products"
            className="inline-block px-8 py-3.5 bg-zinc-950 text-white text-xs font-semibold tracking-widest uppercase rounded hover:bg-zinc-700 hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200"
          >
            Ver Colección
          </a>
          <a
            href="#about"
            className="inline-block px-8 py-3.5 border-[1.5px] border-zinc-950 text-zinc-950 text-xs font-semibold tracking-widest uppercase rounded hover:bg-zinc-950 hover:text-white hover:-translate-y-0.5 transition-all duration-200"
          >
            Nuestra Historia
          </a>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6">
          {[
            { number: '500+', label: 'Productos' },
            { number: '12K', label: 'Clientes' },
            { number: '4.9★', label: 'Valoración' },
          ].map((stat, i) => (
            <React.Fragment key={stat.label}>
              {i > 0 && <div className="w-px h-9 bg-zinc-200" />}
              <div className="flex flex-col gap-0.5">
                <span className="font-serif text-2xl font-bold text-zinc-950">{stat.number}</span>
                <span className="text-[11px] text-zinc-400 tracking-[0.08em] uppercase">{stat.label}</span>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Visual */}
      <div className="hidden md:block relative h-[520px] animate-fade-up-delay">
        {/* Main card */}
        <div className="absolute top-0 right-0 w-[65%] h-[420px] rounded-xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80"
            alt="Oruel collection"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-4 left-4 bg-white/95 px-3.5 py-2 rounded-md text-[11px] font-semibold tracking-[0.08em] text-zinc-950">
            Colección Signature
          </div>
        </div>

        {/* Side card 1 */}
        <div className="absolute bottom-5 left-0 w-[42%] h-[200px] rounded-xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.12)] z-10">
          <img
            src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80"
            alt="Accessory"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Side card 2 */}
        <div className="absolute top-[70px] left-[-20px] w-[42%] h-[160px] rounded-xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
          <img
            src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80"
            alt="Product"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Floating badge */}
        <div className="animate-float absolute bottom-[50px] right-0 bg-zinc-950 text-white px-4 py-2.5 rounded-full flex items-center gap-2 text-xs font-semibold shadow-xl">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          Envío gratis +$50
        </div>
      </div>
    </section>
  );
}
