const ListItem = ({ href, children }) => {
  return (
    <li>
      <a
        className='icon-link mb-1'
        href={href}
        rel='noopener'
        target='_blank'
      >
        <svg className='bi' width='16' height='16' aria-hidden='true'>
          <use xlinkHref='#arrow-right-circle'></use>
        </svg>
        {children}
      </a>
    </li>
  );
}

export default ListItem;
