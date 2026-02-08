import { Card } from './card';

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
    <Card className={`flex items-start gap-3 border-2 ${toneClassMap[tone]} bg-muted`}>
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand text-lg font-black text-brand-foreground">
        G
      </div>
      <div>
        <p className="text-sm font-black text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </Card>
  );
}
