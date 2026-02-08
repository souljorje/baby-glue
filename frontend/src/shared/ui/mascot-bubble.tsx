import { Card } from './card';
import mascotImg from '../../public/ChatGPTImage.png';

type MascotBubbleProps = {
  title: string;
  message: string;
  tone?: 'normal' | 'success' | 'warning';
};

const toneBorderMap = {
  normal: 'border-border',
  success: 'border-brand',
  warning: 'border-yellow'
} as const;

const toneGlowMap = {
  normal: '',
  success: 'shadow-glow-lime',
  warning: ''
} as const;

export function MascotBubble({ title, message, tone = 'normal' }: MascotBubbleProps) {
  return (
    <Card className={`flex items-start gap-4 border ${toneBorderMap[tone]} ${toneGlowMap[tone]} bg-surface`}>
      <img
        src={mascotImg}
        alt="Glue Mascot"
        className="h-12 w-12 shrink-0 object-contain drop-shadow-[0_0_8px_rgba(124,255,91,0.3)]"
      />
      <div className="min-w-0">
        <p className="text-sm font-black text-brand">{title}</p>
        <p className="mt-0.5 text-sm text-text-secondary">{message}</p>
      </div>
    </Card>
  );
}
