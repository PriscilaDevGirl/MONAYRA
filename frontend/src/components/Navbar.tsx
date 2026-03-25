import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { label: "Para Candidatas", href: "#candidatas" },
    { label: "Para Empresas", href: "#empresas" },
    { label: "Funcionalidades", href: "#features" },
    { label: "Sobre", href: "#sobre" },
  ];

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 glass">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="text-2xl font-display font-bold text-gradient">
          MONAYRA
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              {link.label}
            </a>
          ))}
          <Button variant="glass" size="sm" asChild>
            <Link to="/plataforma">Entrar</Link>
          </Button>
          <Button variant="hero" size="sm" asChild>
            <Link to="/plataforma">Criar Conta</Link>
          </Button>
        </div>

        <button className="text-foreground md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="glass border-t border-border/50 md:hidden"
          >
            <div className="container mx-auto flex flex-col gap-3 px-4 py-4">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="py-2 text-sm text-muted-foreground hover:text-foreground"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <Button variant="glass" size="sm" className="w-full" asChild>
                <Link to="/plataforma">Entrar</Link>
              </Button>
              <Button variant="hero" size="sm" className="w-full" asChild>
                <Link to="/plataforma">Criar Conta</Link>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
