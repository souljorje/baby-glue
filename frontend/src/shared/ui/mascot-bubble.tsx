import { Card } from './card';
import mascotImg from '../../public/ChatGPTImage.png';

type MascotBubbleProps = {
  title: string;
  message: string;
  tone?: 'normal' | 'success' | 'warning';
};

const toneClassMap = {
  normal: 'border-border',
  success: 'border-success',
  warning: 'border-warning'
} as const;

export function MascotBubble({ title, message, tone = 'normal' }: MascotBubbleProps) {
  return (
    <Card className={`relative flex items-start gap-3 border-2 ${toneClassMap[tone]} bg-muted`}>
      <img
        src={mascotImg}
        alt="Glue Mascot"
        className="h-12 w-12 shrink-0 object-contain drop-shadow-md"
      />
      <div className="relative">
        <div className="absolute -left-5 top-3 h-3 w-3 rotate-45 bg-muted-foreground/10" />
        <div className="rounded-xl bg-muted-foreground/10 px-3 py-2">
          <p className="text-sm font-black text-foreground">{title}</p>
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
      </div>
    </Card>
  );
}
