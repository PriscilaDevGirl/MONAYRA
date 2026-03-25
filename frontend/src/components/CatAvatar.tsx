import { Crown, Headphones, Leaf, Shield, Sparkles, Star } from "lucide-react";

type CatAvatarProps = {
  style: string;
  palette: string;
  accessory: string;
  mood: string;
  size?: "sm" | "md" | "lg";
};

const paletteMap: Record<string, { fur: string; ear: string; accent: string; outline: string; eye: string }> = {
  sunrise: { fur: "#F59E0B", ear: "#FCD34D", accent: "#EC4899", outline: "#2E1065", eye: "#1F2937" },
  aurora: { fur: "#10B981", ear: "#6EE7B7", accent: "#38BDF8", outline: "#022C22", eye: "#052E16" },
  midnight: { fur: "#334155", ear: "#94A3B8", accent: "#A855F7", outline: "#020617", eye: "#F8FAFC" },
  blossom: { fur: "#FB7185", ear: "#FDA4AF", accent: "#8B5CF6", outline: "#4C1D95", eye: "#3B0764" },
};

const sizeMap = {
  sm: "h-24 w-24",
  md: "h-40 w-40",
  lg: "h-56 w-56",
};

function AccessoryIcon({ accessory, color }: { accessory: string; color: string }) {
  const className = "h-6 w-6";

  if (accessory === "crown") {
    return <Crown className={className} color={color} />;
  }
  if (accessory === "headset") {
    return <Headphones className={className} color={color} />;
  }
  if (accessory === "leaf-tag") {
    return <Leaf className={className} color={color} />;
  }
  if (accessory === "shield-badge") {
    return <Shield className={className} color={color} />;
  }

  return <Star className={className} color={color} />;
}

function moodFace(mood: string) {
  if (mood === "playful") {
    return { leftEye: "scaleY(0.85)", rightEye: "scaleY(0.3)", mouth: "M 84 108 Q 96 118 108 108" };
  }
  if (mood === "focused") {
    return { leftEye: "scaleY(0.4)", rightEye: "scaleY(0.4)", mouth: "M 84 108 Q 96 110 108 108" };
  }
  if (mood === "calm") {
    return { leftEye: "scaleY(0.5)", rightEye: "scaleY(0.5)", mouth: "M 84 110 Q 96 116 108 110" };
  }

  return { leftEye: "scaleY(1)", rightEye: "scaleY(1)", mouth: "M 84 108 Q 96 122 108 108" };
}

export function CatAvatar({ style, palette, accessory, mood, size = "md" }: CatAvatarProps) {
  const colors = paletteMap[palette] || paletteMap.sunrise;
  const face = moodFace(mood);
  const stripes = style === "cyber-cat" || style === "guardian-cat";
  const cheeks = style === "soft-cat" || style === "moon-cat";

  return (
    <div
      className={`${sizeMap[size]} rounded-[2rem] border border-white/10 bg-white/5 p-4 shadow-[0_0_40px_rgba(168,85,247,0.18)] backdrop-blur`}
      style={{ backgroundImage: "linear-gradient(135deg, rgba(255,255,255,0.09), rgba(255,255,255,0.03))" }}
    >
      <div className="relative h-full w-full overflow-hidden rounded-[1.5rem] bg-black/10">
        <div className="absolute inset-x-0 top-3 flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-white/80">
            <Sparkles className="h-3 w-3" />
            avatar protegido
          </span>
        </div>

        <div className="absolute left-1/2 top-10 -translate-x-1/2">
          <svg viewBox="0 0 192 192" className="h-40 w-40 overflow-visible">
            <path d="M 48 60 L 68 30 L 82 66 Z" fill={colors.ear} stroke={colors.outline} strokeWidth="6" />
            <path d="M 144 60 L 124 30 L 110 66 Z" fill={colors.ear} stroke={colors.outline} strokeWidth="6" />
            <circle cx="96" cy="96" r="50" fill={colors.fur} stroke={colors.outline} strokeWidth="6" />
            {stripes ? (
              <>
                <path d="M 74 72 Q 84 64 94 72" stroke={colors.outline} strokeWidth="4" fill="none" opacity="0.7" />
                <path d="M 118 72 Q 108 64 98 72" stroke={colors.outline} strokeWidth="4" fill="none" opacity="0.7" />
                <path d="M 96 56 Q 100 64 96 72" stroke={colors.outline} strokeWidth="4" fill="none" opacity="0.7" />
              </>
            ) : null}
            {cheeks ? (
              <>
                <circle cx="66" cy="104" r="8" fill="white" opacity="0.18" />
                <circle cx="126" cy="104" r="8" fill="white" opacity="0.18" />
              </>
            ) : null}
            <ellipse cx="78" cy="88" rx="8" ry="10" fill={colors.eye} transform={face.leftEye} style={{ transformOrigin: "78px 88px" }} />
            <ellipse cx="114" cy="88" rx="8" ry="10" fill={colors.eye} transform={face.rightEye} style={{ transformOrigin: "114px 88px" }} />
            <circle cx="96" cy="98" r="6" fill={colors.accent} />
            <path d={face.mouth} stroke={colors.outline} strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d="M 96 104 L 96 111" stroke={colors.outline} strokeWidth="3" strokeLinecap="round" />
            <path d="M 72 102 L 44 98" stroke={colors.outline} strokeWidth="3" strokeLinecap="round" opacity="0.7" />
            <path d="M 72 110 L 44 114" stroke={colors.outline} strokeWidth="3" strokeLinecap="round" opacity="0.7" />
            <path d="M 120 102 L 148 98" stroke={colors.outline} strokeWidth="3" strokeLinecap="round" opacity="0.7" />
            <path d="M 120 110 L 148 114" stroke={colors.outline} strokeWidth="3" strokeLinecap="round" opacity="0.7" />
          </svg>
        </div>

        <div className="absolute bottom-4 left-4 rounded-full bg-black/25 p-2">
          <AccessoryIcon accessory={accessory} color={colors.accent} />
        </div>
      </div>
    </div>
  );
}
