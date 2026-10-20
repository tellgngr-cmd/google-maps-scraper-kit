import {
  AbsoluteFill,
  Img,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const FORMATS = {
  vertical: { width: 1080, height: 1920 }, // TikTok, Reels, Shorts, Stories
  square: { width: 1080, height: 1080 }, // Feed posts
  portrait: { width: 1080, height: 1350 }, // Instagram / Facebook feed 4:5
  landscape: { width: 1920, height: 1080 }, // YouTube, LinkedIn, website
} as const;

export type Brand = {
  name: string;
  primary: string;
  accent: string;
  background: string;
  text: string;
  font: string;
  logo?: string;
};

export type AdProps = {
  format: keyof typeof FORMATS;
  durationSec: number;
  hook: string;
  benefits: string[];
  proof?: string;
  cta: string;
  url?: string;
  brand: Brand;
};

const useEnter = (delay = 0) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 14 } });
  return { opacity: s, transform: `translateY(${interpolate(s, [0, 1], [60, 0])}px)` };
};

const Center: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "8%", textAlign: "center" }}>
    {children}
  </AbsoluteFill>
);

const Hook: React.FC<{ text: string; brand: Brand; size: number }> = ({ text, brand, size }) => {
  const style = useEnter();
  return (
    <Center>
      <h1 style={{ ...style, fontSize: size * 1.25, lineHeight: 1.1, margin: 0, fontWeight: 900 }}>
        {text}
      </h1>
      <div style={{ ...useEnter(10), height: 14, width: "30%", background: brand.accent, marginTop: 40, borderRadius: 7 }} />
    </Center>
  );
};

const Benefits: React.FC<{ items: string[]; brand: Brand; size: number; step: number }> = ({ items, brand, size, step }) => (
  <Center>
    <div style={{ display: "flex", flexDirection: "column", gap: size * 0.6, alignItems: "flex-start", textAlign: "left" }}>
      {items.map((item, i) => (
        <BenefitRow key={item} text={item} delay={i * step} brand={brand} size={size} />
      ))}
    </div>
  </Center>
);

const BenefitRow: React.FC<{ text: string; delay: number; brand: Brand; size: number }> = ({ text, delay, brand, size }) => (
  <div style={{ ...useEnter(delay), display: "flex", alignItems: "center", gap: size * 0.5, fontSize: size, fontWeight: 700 }}>
    <span style={{ background: brand.accent, color: brand.background, borderRadius: "50%", width: size * 1.2, height: size * 1.2, display: "flex", justifyContent: "center", alignItems: "center", flexShrink: 0 }}>
      ✓
    </span>
    {text}
  </div>
);

const Proof: React.FC<{ text: string; brand: Brand; size: number }> = ({ text, brand, size }) => (
  <Center>
    <div style={{ ...useEnter(), fontSize: size * 1.1, fontWeight: 800, color: brand.accent }}>{text}</div>
  </Center>
);

const Cta: React.FC<{ cta: string; url?: string; brand: Brand; size: number }> = ({ cta, url, brand, size }) => {
  const frame = useCurrentFrame();
  const pulse = 1 + 0.04 * Math.sin(frame / 5);
  return (
    <Center>
      {brand.logo ? <Img src={brand.logo} style={{ ...useEnter(), height: size * 2.5, marginBottom: size }} /> : (
        <div style={{ ...useEnter(), fontSize: size * 0.9, fontWeight: 700, opacity: 0.85, marginBottom: size }}>{brand.name}</div>
      )}
      <div style={{ ...useEnter(6), transform: `scale(${pulse})`, background: brand.accent, color: brand.background, fontSize: size * 1.1, fontWeight: 900, padding: `${size * 0.5}px ${size}px`, borderRadius: size }}>
        {cta}
      </div>
      {url ? <div style={{ ...useEnter(12), fontSize: size * 0.8, marginTop: size * 0.8 }}>{url}</div> : null}
    </Center>
  );
};

export const AdVideo: React.FC<AdProps> = ({ hook, benefits, proof, cta, url, brand }) => {
  const { durationInFrames, width, height } = useVideoConfig();
  const size = Math.min(width, height) * 0.075;

  // Scene timing as share of total length: hook 20%, benefits 40%, proof 15%, CTA 25%.
  const hasProof = Boolean(proof);
  const shares = hasProof ? [0.2, 0.4, 0.15, 0.25] : [0.2, 0.5, 0, 0.3];
  const lengths = shares.map((s) => Math.round(s * durationInFrames));
  const starts = lengths.map((_, i) => lengths.slice(0, i).reduce((a, b) => a + b, 0));
  lengths[3] = durationInFrames - starts[3];

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 30% 20%, ${brand.primary}, ${brand.background} 70%)`,
        color: brand.text,
        fontFamily: brand.font,
      }}
    >
      <Sequence from={starts[0]} durationInFrames={lengths[0]}>
        <Hook text={hook} brand={brand} size={size} />
      </Sequence>
      <Sequence from={starts[1]} durationInFrames={lengths[1]}>
        <Benefits items={benefits} brand={brand} size={size} step={Math.round(lengths[1] / (benefits.length + 1))} />
      </Sequence>
      {hasProof ? (
        <Sequence from={starts[2]} durationInFrames={lengths[2]}>
          <Proof text={proof!} brand={brand} size={size} />
        </Sequence>
      ) : null}
      <Sequence from={starts[3]} durationInFrames={lengths[3]}>
        <Cta cta={cta} url={url} brand={brand} size={size} />
      </Sequence>
    </AbsoluteFill>
  );
};
