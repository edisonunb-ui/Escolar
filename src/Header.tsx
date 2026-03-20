
import { Link } from 'react-router-dom';
import logo from '/logo-camara.png';

const Header = () => {
  return (
    <header className="bg-card text-text-primary p-4 flex flex-col md:flex-row justify-between items-center shadow-md gap-y-4 md:gap-y-0">
      <Link to="/" className="flex items-center gap-4 self-start md:self-center">
        <img src={logo} alt="Brasão da Câmara de Ubatuba" className="h-12 w-auto" />
        <span className="text-xl font-bold whitespace-nowrap">Fiscaliza Ubatuba</span>
      </Link>
      <nav>
        <ul className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2">
          <li>
            <Link to="/" className="hover:text-text-secondary transition-colors whitespace-nowrap">Menu Principal</Link>
          </li>
          <li>
            <Link to="/relatorio" className="hover:text-text-secondary transition-colors">Dashboard</Link>
          </li>
          <li>
            <Link to="/pesquisas-salvas" className="bg-primary hover:brightness-90 text-white font-bold py-2 px-4 rounded-lg transition-colors whitespace-nowrap">
              Avaliações Salvas
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
