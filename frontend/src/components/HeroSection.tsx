import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-16">
      <div className="absolute inset-0" style={{ background: "var(--gradient-glow)" }} />
      <div className="absolute top-1/4 -left-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-1/4 -right-32 h-96 w-96 rounded-full bg-secondary/10 blur-3xl animate-pulse-glow" style={{ animationDelay: "1.5s" }} />
      <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/5 blur-3xl" />

      <div className="container relative z-10 mx-auto px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="mx-auto max-w-4xl">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="glass mb-8 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4 text-secondary" />
            Empregabilidade inclusiva e sem viés
          </motion.div>

          <h1 className="mb-6 text-5xl font-bold leading-tight md:text-7xl lg:text-8xl font-display">
            Seu talento <span className="text-gradient">merece</span>
            <br />
            ser visto
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            A plataforma que conecta mulheres cis, trans e travestis a oportunidades reais.
            Sem preconceito. Sem viés. Com respeito a sua identidade.
          </p>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button variant="hero" size="lg" className="px-8 py-6 text-base" asChild>
              <Link to="/plataforma">
                Quero me candidatar
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="glass" size="lg" className="px-8 py-6 text-base" asChild>
              <Link to="/plataforma">Sou empresa</Link>
            </Button>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.6 }} className="mx-auto mt-16 grid max-w-lg grid-cols-3 gap-8">
            {[
              { value: "100%", label: "Inclusiva" },
              { value: "0", label: "Vies" },
              { value: "100%", label: "Potencial" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-bold text-gradient md:text-4xl font-display">{stat.value}</div>
                <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
