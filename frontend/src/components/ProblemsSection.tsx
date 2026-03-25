import { motion } from "framer-motion";
import { ShieldX, Baby, Eye, MessageSquareX, HeartCrack, Briefcase, Clock } from "lucide-react";

const problems = [
  { icon: ShieldX, title: "Discriminação de gênero", desc: "Processos que excluem por identidade de gênero" },
  { icon: Baby, title: "Exclusão por maternidade", desc: "Mulheres penalizadas por pausas na carreira" },
  { icon: Eye, title: "Invisibilidade trans", desc: "Mulheres trans e travestis invisibilizadas" },
  { icon: MessageSquareX, title: "Sem feedback", desc: "Candidatas sem retorno nos processos" },
  { icon: HeartCrack, title: "Baixa autoestima", desc: "Rejeições constantes minam a confiança" },
  { icon: Briefcase, title: "Experiência formal", desc: "Vivências reais não são valorizadas" },
  { icon: Clock, title: "Processos longos", desc: "Etapas desnecessárias que excluem" },
];

const ProblemsSection = () => {
  return (
    <section id="sobre" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />
      <div className="container relative z-10 mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
            Problemas que <span className="text-gradient">resolvemos</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            O mercado de trabalho foi construído com barreiras invisíveis. Nós estamos derrubando cada uma delas.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {problems.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass rounded-xl p-6 hover:border-secondary/40 transition-colors group"
            >
              <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center mb-4 group-hover:bg-secondary/20 transition-colors">
                <p.icon className="w-5 h-5 text-secondary" />
              </div>
              <h3 className="font-display font-semibold mb-2">{p.title}</h3>
              <p className="text-sm text-muted-foreground">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemsSection;
