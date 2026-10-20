import { Composition } from "remotion";
import { AdVideo, AdProps, FORMATS } from "./AdVideo";
import brand from "../brand.json";

const FPS = 30;

const defaultProps: AdProps = {
  format: "vertical",
  durationSec: 15,
  hook: "Need 500 local leads by Friday?",
  benefits: ["Names, phones, websites", "Ratings & reviews", "Export to CSV in minutes"],
  proof: "10,000+ leads pulled daily",
  cta: "Get the kit today",
  url: "yoursite.com",
  brand,
};

export const RemotionRoot: React.FC = () => (
  <Composition
    id="AdVideo"
    component={AdVideo}
    fps={FPS}
    width={1080}
    height={1920}
    durationInFrames={15 * FPS}
    defaultProps={defaultProps}
    calculateMetadata={({ props }) => ({
      ...FORMATS[props.format],
      durationInFrames: Math.round(props.durationSec * FPS),
      props: { ...props, brand: { ...brand, ...props.brand } },
    })}
  />
);
