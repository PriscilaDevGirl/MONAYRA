import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Building2, User } from "lucide-react";

const CTASection = () => {
  return (
    <section id="candidatas" className="py-24 relative">
      <div className="container relative z-10 mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Candidatas */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative rounded-2xl overflow-hidden p-8 md:p-12"
            style={{ background: "var(--gradient-primary)" }}
          >
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-background/10 blur-3xl" />
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-xl bg-background/20 flex items-center justify-center mb-6">
                <User className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="text-3xl font-display font-bold text-primary-foreground mb-4">
                Para Candidatas
              </h3>
              <p className="text-primary-foreground/80 mb-8 leading-relaxed">
                Crie seu perfil com respeito à sua identidade, mostre seu potencial real 
                e encontre vagas em empresas que valorizam quem você é.
              </p>
              <Button variant="glass" size="lg" className="border-primary-foreground/20 text-primary-foreground hover:bg-background/20">
                Criar meu perfil
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </motion.div>

          {/* Empresas */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            id="empresas"
            className="glass rounded-2xl p-8 md:p-12 relative overflow-hidden"
          >
            <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-accent/5 blur-3xl" />
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6">
                <Building2 className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-3xl font-display font-bold mb-4">
                Para Empresas
              </h3>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Contrate talentos diversos com processo rápido e justo. 
                Receba o selo de empresa inclusiva e construa times mais fortes.
              </p>
              <Button variant="hero" size="lg">
                Publicar vagas
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
