import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Building2, User } from "lucide-react";

const CTASection = () => {
  return (
    <section id="candidatas" className="relative py-24">
      <div className="container relative z-10 mx-auto px-4">
        <div className="grid gap-6 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-2xl p-8 md:p-12"
            style={{ background: "var(--gradient-primary)" }}
          >
            <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-background/10 blur-3xl" />
            <div className="relative z-10">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-background/20">
                <User className="h-7 w-7 text-primary-foreground" />
              </div>
              <h3 className="mb-4 text-3xl font-bold text-primary-foreground font-display">Para Candidatas</h3>
              <p className="mb-8 leading-relaxed text-primary-foreground/80">
                Crie seu perfil com respeito a sua identidade, mostre seu potencial real e encontre vagas em empresas que valorizam quem voce e.
              </p>
              <Button variant="glass" size="lg" className="border-primary-foreground/20 text-primary-foreground hover:bg-background/20" asChild>
                <Link to="/plataforma">
                  Criar meu perfil
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            id="empresas"
            className="glass relative overflow-hidden rounded-2xl p-8 md:p-12"
          >
            <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-accent/5 blur-3xl" />
            <div className="relative z-10">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-accent/10">
                <Building2 className="h-7 w-7 text-accent" />
              </div>
              <h3 className="mb-4 text-3xl font-bold font-display">Para Empresas</h3>
              <p className="mb-8 leading-relaxed text-muted-foreground">
                Contrate talentos diversos com processo rapido e justo. Receba o selo de empresa inclusiva e construa times mais fortes.
              </p>
              <Button variant="hero" size="lg" asChild>
                <Link to="/plataforma">
                  Publicar vagas
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
