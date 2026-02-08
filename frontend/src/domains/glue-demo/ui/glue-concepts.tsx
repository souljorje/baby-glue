import { Card } from '@ui/card';
import { MascotBubble } from '@ui/mascot-bubble';

const conceptItems = [
  {
    emoji: '\u{1F355}',
    title: 'Token = Cookie Coupon',
    text: 'Each coupon is your tiny ticket to the cookie jar.',
    accent: 'text-brand'
  },
  {
    emoji: '\u{1F4B0}',
    title: 'Glue = Magic Cookie Jar',
    text: 'ETH in Glue is the cookie power stored inside the shared jar.',
    accent: 'text-pink'
  },
  {
    emoji: '\u{1F525}',
    title: 'Crumble = Get Cookies',
    text: 'When you crumble coupons, you grab your matching cookie share.',
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
