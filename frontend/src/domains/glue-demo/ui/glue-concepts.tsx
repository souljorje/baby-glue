import { Card } from '@ui/card';
import { MascotBubble } from '@ui/mascot-bubble';

const conceptItems = [
  {
    title: 'Token = Pizza Slice',
    text: 'Each token is one tiny slice of the whole pizza.'
  },
  {
    title: 'Glue = Piggy Bank',
    text: 'ETH in the Glue vault is money inside the shared piggy bank.'
  },
  {
    title: 'Burn = Trade Back',
    text: 'When you burn tokens, you trade slices back for matching ETH.'
  }
] as const;

export function GlueConcepts() {
  return (
    <section className="space-y-3">
      <MascotBubble title="Glue Mascot" message="Three quick ideas before you click buttons." />
      <div className="grid gap-3 sm:grid-cols-3">
        {conceptItems.map((item) => (
          <Card key={item.title} className="bg-surface">
            <h3 className="text-sm font-black text-foreground">{item.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{item.text}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
