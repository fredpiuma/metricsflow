import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full py-6 mt-auto border-t border-slate-200/60 text-center text-sm text-slate-500">
      <p>
        &copy; {new Date().getFullYear()}{" "}
        <a 
          href="https://www.fredericodecastro.com.br" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-blue-600 hover:text-blue-800 transition-colors font-medium hover:underline"
        >
          Frederico de Castro
        </a>
        . Todos os direitos reservados.
      </p>
    </footer>
  );
};

export default Footer;