import { GlueDemoPanel } from '@d/glue-demo/widgets/glue-demo-panel';

export function DemoPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-4xl px-4 py-8">
      <header className="mb-8 text-center">
        <p className="mb-2 inline-block rounded-full bg-muted px-3 py-1 text-sm font-semibold text-muted-foreground">Baby Glue School</p>
        <h1 className="text-3xl font-black text-foreground sm:text-4xl">Baby Glue Demo</h1>
        <p className="mt-3 text-base text-muted-foreground">Learn by clicking: add ETH to the piggy bank, then burn tokens to claim your share.</p>
      </header>
      <GlueDemoPanel />
    </main>
  );
}
