import { useCallback, useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import BoxSelector from './components/BoxSelector'
import StorySection from './components/StorySection'
import FAQ from './components/FAQ'
import Footer from './components/Footer'
import WaitlistModal from './components/WaitlistModal'
import LegalModal, { type LegalDoc } from './components/LegalModal'
import AgeGate from './components/AgeGate'

export type BoxId = 1 | 2 | 3
export type PurchaseType = 'subscribe' | 'oneTime'

export interface ModalState {
  open: boolean
  boxId: BoxId | null
  purchaseType: PurchaseType
}

// Pre-sale site: no checkout yet. Every call to action joins the waitlist.
function App() {
  const [waitlistSource, setWaitlistSource] = useState<string | null>(null)
  const [legalDoc, setLegalDoc] = useState<LegalDoc | null>(null)

  const closeWaitlist = useCallback(() => setWaitlistSource(null), [])
  const closeLegal = useCallback(() => setLegalDoc(null), [])

  return (
    <div className="app">
      <Navbar onSubscribeClick={() => setWaitlistSource('navbar')} />
      <Hero />
      <BoxSelector onJoin={source => setWaitlistSource(source)} />
      <StorySection />
      <FAQ />
      <Footer onOpenLegal={setLegalDoc} />
      {waitlistSource && <WaitlistModal source={waitlistSource} onClose={closeWaitlist} />}
      {legalDoc && <LegalModal doc={legalDoc} onClose={closeLegal} />}
      <AgeGate />
    </div>
  )
}

export default App
