import { GlueDemoPanel } from '@d/glue-demo/widgets/glue-demo-panel';

export function DemoPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-4xl px-4 py-10">
      <header className="mb-10 text-center">
        <p className="mb-3 inline-block rounded-full border border-border bg-surface px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-brand">
          Baby Glue School
        </p>
        <h1 className="bg-gradient-to-r from-brand to-pink bg-clip-text text-3xl font-black text-transparent sm:text-4xl">
          Baby Glue Demo
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base text-text-secondary">
          Learn by clicking: add ETH to the piggy bank, then burn tokens to claim your share.
        </p>
      </header>
      <GlueDemoPanel />
    </main>
  );
}
