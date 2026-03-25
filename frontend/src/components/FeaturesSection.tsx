import { motion } from "framer-motion";
import {
  UserCircle, Palette, FileHeart, Brain, Zap, MessageCircleHeart,
  RotateCcw, Heart, BarChart3, Rocket,
} from "lucide-react";

const features = [
  {
    icon: UserCircle,
    title: "Perfil com Respeito",
    desc: "Nome social obrigatório, gênero autodeclarado, dados sensíveis protegidos e matching anti-discriminação.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: Palette,
    title: "Avatar Personalizado",
    desc: "Escolha avatares humanos ou simbólicos. Representação visual que reduz vieses no processo seletivo.",
    color: "text-secondary",
    bg: "bg-secondary/10",
  },
  {
    icon: FileHeart,
    title: "Currículo Humanizado",
    desc: "Valorize vivência, habilidades informais e histórias reais. Campo 'Minha Trajetória' para além da experiência formal.",
    color: "text-accent",
    bg: "bg-accent/10",
  },
  {
    icon: Brain,
    title: "Match Inteligente sem Viés",
    desc: "IA treinada para evitar discriminação e valorizar potencial, comportamento e evolução.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: Zap,
    title: "Processo Rápido",
    desc: "Aplicação em 1 clique, ranking automático e redução do tempo de contratação.",
    color: "text-secondary",
    bg: "bg-secondary/10",
  },
  {
    icon: MessageCircleHeart,
    title: "Feedback Humanizado",
    desc: "Toda candidata recebe retorno empático com sugestões de melhoria personalizadas.",
    color: "text-accent",
    bg: "bg-accent/10",
  },
  {
    icon: RotateCcw,
    title: "Modo Recomeço",
    desc: "Para mulheres fora do mercado. Algoritmo que prioriza reinserção, cursos e evolução pessoal.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: Heart,
    title: "Suporte à Autoestima",
    desc: "Mensagens motivacionais, simulação de entrevistas e preparação guiada para cada vaga.",
    color: "text-secondary",
    bg: "bg-secondary/10",
  },
  {
    icon: BarChart3,
    title: "Dashboard Empresas",
    desc: "Veja potencial, não só currículo. Alertas sobre vieses inconscientes e selo de empresa inclusiva.",
    color: "text-accent",
    bg: "bg-accent/10",
  },
  {
    icon: Rocket,
    title: "Contratação Rápida",
    desc: "Recomendação imediata, shortlist automática e eliminação de etapas desnecessárias.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 relative">
      <div className="container relative z-10 mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
            Funcionalidades que <span className="text-gradient">transformam</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Cada recurso foi pensado para criar um processo seletivo mais justo, rápido e humano.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="glass rounded-xl p-6 hover:border-primary/30 transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className={`w-12 h-12 rounded-xl ${f.bg} flex items-center justify-center mb-4`}>
                <f.icon className={`w-6 h-6 ${f.color}`} />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
