import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer data-tk-navbar className={`flex bg-[#222530] w-full justify-between px-14 py-4`}>
      <div className='flex items-center gap-8'>
        <img src='img/thy.svg' />
        <span className='text-xs text-[#99A0AE]'>
          © {new Date().getFullYear()} Türk Hava Yolları Tüm hakları saklıdır.
        </span>
      </div>
      <div className='flex gap-4'>
        <button className='text-[#99A0AE]'>Term</button>
        <button className='text-[#99A0AE]'>Privacy</button>
        <button className='text-[#99A0AE]'>Cookies</button>
      </div>
      <div
        className={`border-white border-solid border-1 rounded-lg p-2`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        style={{ cursor: 'pointer' }}
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='none'
        >
          <path
            d='M13.0007 18.7915V7.62148L17.8807 12.5015C18.2707 12.8915 18.9107 12.8915 19.3007 12.5015C19.6907 12.1115 19.6907 11.4815 19.3007 11.0915L12.7107 4.50148C12.3207 4.11148 11.6907 4.11148 11.3007 4.50148L4.7007 11.0815C4.3107 11.4715 4.3107 12.1015 4.7007 12.4915C5.0907 12.8815 5.7207 12.8815 6.1107 12.4915L11.0007 7.62148V18.7915C11.0007 19.3415 11.4507 19.7915 12.0007 19.7915C12.5507 19.7915 13.0007 19.3415 13.0007 18.7915Z'
            fill='white'
          />
        </svg>
      </div>
    </footer>
  );
};

export default Footer;
