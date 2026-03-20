
import { Link } from 'react-router-dom';
import { Home, Users, Building } from 'lucide-react';

export default function Questionario() {
  return (
    <div className="p-6 max-w-4xl mx-auto bg-background">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-bold text-text-primary">Iniciar Nova Avaliação</h1>
        <p className="text-lg text-text-secondary mt-2">Selecione o tipo de unidade que você deseja avaliar.</p>
      </header>

      <div className="grid md:grid-cols-2 gap-8 text-center">
        {/* Card para Avaliar Creche */}
        <div className="bg-card p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <Building className="mx-auto h-16 w-16 text-primary" />
          <h2 className="text-2xl font-semibold text-text-primary mt-4">Creche</h2>
          <p className="text-text-secondary mt-2">Avaliar uma unidade de educação infantil (berçário e maternal).</p>
          <Link 
            to="/formulario/creche"
            className="mt-6 inline-block bg-primary text-white font-semibold px-8 py-3 rounded-lg shadow-md hover:brightness-90 transition-colors"
          >
            Avaliar Creche
          </Link>
        </div>

        {/* Card para Avaliar Escola */}
        <div className="bg-card p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <Users className="mx-auto h-16 w-16 text-primary" />
          <h2 className="text-2xl font-semibold text-text-primary mt-4">Escola</h2>
          <p className="text-text-secondary mt-2">Avaliar uma unidade de ensino fundamental.</p>
          <Link 
            to="/formulario/escola"
            className="mt-6 inline-block bg-primary text-white font-semibold px-8 py-3 rounded-lg shadow-md hover:brightness-90 transition-colors"
          >
            Avaliar Escola
          </Link>
        </div>
      </div>

      <div className="text-center mt-12">
        <Link to="/" className="text-text-secondary hover:text-text-primary transition-colors flex items-center justify-center">
          <Home className="h-5 w-5 mr-2" />
          Voltar para a Página Inicial
        </Link>
      </div>
    </div>
  );
}
