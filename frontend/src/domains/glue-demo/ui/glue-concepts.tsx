import { Card } from '@ui/card';
import { MascotBubble } from '@ui/mascot-bubble';

const conceptItems = [
  {
    emoji: '\u{1F36A}',
    title: 'Token = Cookie Coupon',
    text: 'Each token is one coupon — your ticket to cookies from the jar.',
    accent: 'text-brand'
  },
  {
    emoji: '\u{1FAD9}',
    title: 'Glue = Magic Cookie Jar',
    text: 'ETH in the Glue vault is like cookies baked into the shared jar.',
    accent: 'text-pink'
  },
  {
    emoji: '\u{1FAF0}',
    title: 'Crumble = Get Cookies',
    text: 'When you crumble a coupon, the jar opens and gives you your share.',
    accent: 'text-blue'
  }
] as const;

export function GlueConcepts() {
  return (
    <section className="space-y-3">
      <MascotBubble title="Glue Mascot" message="Three quick ideas before you click buttons." />
      <div className="grid gap-3 sm:grid-cols-3">
        {conceptItems.map((item) => (
          <Card key={item.title} className="group transition-colors duration-150 hover:bg-surface-hover">
            <p className="mb-1 text-2xl">{item.emoji}</p>
            <h3 className={`text-sm font-black ${item.accent}`}>{item.title}</h3>
            <p className="mt-2 text-sm text-text-secondary">{item.text}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
