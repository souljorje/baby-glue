import { Card } from '@ui/card';
import { MascotBubble } from '@ui/mascot-bubble';

const conceptItems = [
  {
    emoji: '\u{1F355}',
    title: 'Token = Pizza Slice',
    text: 'Each token is one tiny slice of the whole pizza.',
    accent: 'text-brand'
  },
  {
    emoji: '\u{1F4B0}',
    title: 'Glue = Piggy Bank',
    text: 'ETH in the Glue vault is money inside the shared piggy bank.',
    accent: 'text-pink'
  },
  {
    emoji: '\u{1F525}',
    title: 'Burn = Trade Back',
    text: 'When you burn tokens, you trade slices back for matching ETH.',
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
