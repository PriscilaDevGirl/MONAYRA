import { motion } from "framer-motion";
import { Shield, Eye, Scale, Clock } from "lucide-react";

const principles = [
  { icon: Shield, title: "LGPD Obrigatória", desc: "Dados sensíveis protegidos. Empresas só acessam informações pessoais após contratação." },
  { icon: Eye, title: "Zero Viés de Bairro e Cor", desc: "Localização e aparência são ocultados do processo. Seu talento fala por você." },
  { icon: Scale, title: "Prioridade para Quem Mais Precisa", desc: "Mulheres desempregadas há mais tempo são priorizadas pelo algoritmo de matching." },
  { icon: Clock, title: "Transparência Total", desc: "Critérios de seleção abertos. Auditoria constante de vieses na IA." },
];

const ImpactSection = () => {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
      <div className="container relative z-10 mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
            Ética e <span className="text-gradient">proteção</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Construída sobre princípios de justiça, privacidade e inclusão real.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {principles.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-xl p-6 flex gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <p.icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-display font-semibold mb-1">{p.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImpactSection;
