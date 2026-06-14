import { Heart } from "lucide-react";

type HiddenHeartProps = {
  className: string;
};

const HiddenHeart = ({ className }: HiddenHeartProps) => (
  <Heart
    aria-hidden="true"
    className={`pointer-events-none absolute h-4 w-4 text-primary/35 ${className}`}
    fill="currentColor"
  />
);

export default HiddenHeart;
