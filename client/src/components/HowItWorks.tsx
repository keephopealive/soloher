import { useScrollReveal } from '../hooks/useScrollReveal'

const STEPS = [
  {
    num: '01',
    title: 'Choose Your Mood',
    desc: 'Select from our three curated rituals — each one built around a different kind of evening.',
  },
  {
    num: '02',
    title: 'We Handle the Rest',
    desc: 'Your box is packed with care and shipped in plain, discreet packaging. Nobody knows but you.',
  },
  {
    num: '03',
    title: 'Your Evening Awaits',
    desc: 'Uncork your wine. Draw your bath. Open your story. The rest is entirely yours.',
  },
]

export default function HowItWorks() {
  const headerRef = useScrollReveal<HTMLDivElement>()
  const gridRef = useScrollReveal<HTMLDivElement>(100)

  return (
    <section className="how" id="how">
      <div className="how-header reveal" ref={headerRef}>
        <span className="gold-label">Simple by design</span>
        <h2>How It Works</h2>
      </div>

      <div className="how-grid" ref={gridRef}>
        {STEPS.map((step, i) => (
          <div key={i} className={`how-step reveal reveal-d${i + 1}`}>
            <div className="how-num">{step.num}</div>
            <h3>{step.title}</h3>
            <p>{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
