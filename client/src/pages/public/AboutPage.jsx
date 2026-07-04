import { motion } from 'framer-motion';
import MetaTags from '../../SEO/MetaTags.jsx';

export default function AboutPage() {
  return (
    <>
      <MetaTags title="About | Cosmo Home" path="/about" description="Learn about Cosmo Home, our mission, vision, and trusted at-home salon standards." />
      <section className="section-shell py-14">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-[#b76d86]">About Cosmo Home</p>
            <h1 className="mt-3 text-4xl font-black leading-tight md:text-6xl">A salon experience shaped around your home.</h1>
          </div>
          <div className="glass-panel rounded-[2rem] p-8">
            <p className="text-lg leading-8 text-[#6f5364]">
              Cosmo Home was created for customers who want professional beauty care without rushed travel, crowded waiting areas, or uncertain hygiene standards. We combine trained beauticians, reliable appointment handling, and carefully prepared service kits so every booking feels personal and polished.
            </p>
          </div>
        </div>
      </section>

      <section className="section-shell grid gap-6 py-10 md:grid-cols-2">
        {[
          ['Mission', 'To make premium salon care accessible at home through trusted professionals, clear pricing, and consistently graceful service.'],
          ['Vision', 'To become the most loved home beauty brand for customers and the most empowering platform for skilled beauticians.'],
        ].map(([title, text]) => (
          <motion.article className="premium-card rounded-3xl p-8" key={title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl font-black text-[#352633]">{title}</h2>
            <p className="mt-4 leading-7 text-[#6f5364]">{text}</p>
          </motion.article>
        ))}
      </section>

      <section className="bg-white/60 py-16">
        <div className="section-shell">
          <h2 className="max-w-2xl text-3xl font-black md:text-5xl">Why customers trust Cosmo Home</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {['Background-aware onboarding', 'Sanitized tools and service kits', 'Transparent service information', 'Responsive customer support'].map((item) => (
              <div className="premium-card rounded-3xl p-6" key={item}>
                <h3 className="text-xl font-black">{item}</h3>
                <p className="mt-3 text-sm leading-6 text-[#6f5364]">Our process is built to make beauty care feel calm, accountable, and easy to repeat.</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
