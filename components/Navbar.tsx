
import React, { useState, useEffect } from 'react';
import { NavLink } from '../types';

interface NavbarProps {
  links: NavLink[];
  locale: 'en' | 'zh';
  onLocaleChange: (l: 'en' | 'zh') => void;
  brand: string;
}

const Navbar: React.FC<NavbarProps> = ({ links, locale, onLocaleChange, brand }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${scrolled ? 'py-4 glass border-b border-slate-100 shadow-xl shadow-slate-200/20' : 'py-8'}`}>
      <div className="container mx-auto px-6 max-w-6xl flex items-center justify-between">
        <a href="#" className={`text-xl font-black tracking-tighter transition-all duration-300 ${scrolled ? 'text-slate-900' : 'text-white drop-shadow-md'}`}>
          {brand}
        </a>

        <div className="flex items-center gap-2 md:gap-8">
          <div className="hidden md:flex items-center gap-6">
            {links.map((link, idx) => (
              <a 
                key={idx} 
                href={link.anchor} 
                className={`text-xs font-black uppercase tracking-widest transition-all hover:text-blue-500 ${scrolled ? 'text-slate-500' : 'text-white/80'}`}
              >
                {link.label}
              </a>
            ))}
          </div>

          <button 
            onClick={() => onLocaleChange(locale === 'en' ? 'zh' : 'en')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all font-black text-[10px] uppercase tracking-widest ${scrolled ? 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-blue-600 hover:text-white' : 'border-white/20 bg-white/10 text-white hover:bg-white hover:text-slate-900'}`}
          >
            <i className="fa-solid fa-language text-sm"></i>
            {locale === 'en' ? 'CN' : 'EN'}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
