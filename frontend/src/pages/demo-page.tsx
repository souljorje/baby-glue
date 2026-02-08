import { GlueDemoPanel } from '@d/glue-demo/widgets/glue-demo-panel';
import mascotImg from '../public/ChatGPTImage.png';

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
          Learn by clicking: bake cookies into the jar, then crumble coupons to grab your share.
        </p>
      </header>
      <GlueDemoPanel />
      <img
        src={mascotImg}
        alt="Glue Mascot"
        className="mascot-glow pointer-events-none fixed bottom-4 left-4 z-50 h-56 w-56 rotate-12 object-contain opacity-80 sm:h-72 sm:w-72"
      />
    </main>
  );
}
