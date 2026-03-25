import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border/50 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <span className="text-2xl font-display font-bold text-gradient">MONAYRA</span>
            <p className="text-sm text-muted-foreground mt-3 max-w-sm leading-relaxed">
              Reduzindo a desigualdade no acesso ao emprego com processos seletivos mais rápidos, justos, humanizados e inclusivos.
            </p>
          </div>
          <div>
            <h4 className="font-display font-semibold mb-3 text-sm">Plataforma</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Para Candidatas</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Para Empresas</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Funcionalidades</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display font-semibold mb-3 text-sm">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Privacidade (LGPD)</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Termos de Uso</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Ética e Transparência</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border/50 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2026 Monayra. Todos os direitos reservados.
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Feito com <Heart className="w-4 h-4 text-secondary fill-secondary" /> para todas as mulheres
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
