const Header = () => {
  return (
    <header className='d-flex align-items-center pb-3 mb-5 border-bottom'>
      <a
        href='/'
        className='d-flex align-items-center text-body-emphasis text-decoration-none'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='40'
          height='32'
          fill='currentColor'
          className='bi bi-briefcase-fill me-2'
          viewBox='0 0 16 16'
        >
          <path d='M6.5 1A1.5 1.5 0 0 0 5 2.5V3H1.5A1.5 1.5 0 0 0 0 4.5v1.384l7.614 2.03a1.5 1.5 0 0 0 .772 0L16 5.884V4.5A1.5 1.5 0 0 0 14.5 3H11v-.5A1.5 1.5 0 0 0 9.5 1zm0 1h3a.5.5 0 0 1 .5.5V3H6v-.5a.5.5 0 0 1 .5-.5' />
          <path d='M0 12.5A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5V6.85L8.129 8.947a.5.5 0 0 1-.258 0L0 6.85z' />
        </svg>
        <span className='fs-4'>Intelligent Job Search Tool</span>
      </a>
    </header>
  );
};

export default Header;
