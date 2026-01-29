
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="py-8 px-4 text-center">
      <h1 className="serif text-5xl font-bold text-slate-800 mb-2 tracking-tight">Reunify</h1>
      <p className="text-slate-500 font-light max-w-md mx-auto">
        A bridge through time. See your adult self embrace your childhood self in a single, heartfelt photograph.
      </p>
    </header>
  );
};

export default Header;
