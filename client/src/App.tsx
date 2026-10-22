import { useCallback, useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import BoxSelector from './components/BoxSelector'
import StorySection from './components/StorySection'
// Reviews are hidden for now; restore this import and <Testimonials /> below to bring them back
// import Testimonials from './components/Testimonials'
import Contact from './components/Contact'
import FAQ from './components/FAQ'
import Footer from './components/Footer'
import Modal from './components/Modal'
import LegalModal, { type LegalDoc } from './components/LegalModal'
import AgeGate from './components/AgeGate'

import type { BoxId, Pairing } from './data/products'
export type { BoxId } from './data/products'
export type PurchaseType = 'subscribe' | 'oneTime'

export interface ModalState {
  open: boolean
  boxId: BoxId | null
  purchaseType: PurchaseType
  /** Wine and bath bomb chosen on the card (recommended unless customized) */
  pairing: Pairing | null
}

function App() {
  const [modal, setModal] = useState<ModalState>({
    open: false,
    boxId: null,
    purchaseType: 'subscribe',
    pairing: null,
  })
  const [legalDoc, setLegalDoc] = useState<LegalDoc | null>(null)
  // Hero buttons send visitors to the boxes with every card preset to their choice
  const [boxPreset, setBoxPreset] = useState<{ type: PurchaseType; at: number } | null>(null)

  const goToBoxes = (type: PurchaseType) => {
    setBoxPreset({ type, at: Date.now() })
    document.getElementById('boxes')?.scrollIntoView({ behavior: 'smooth' })
  }

  const openModal = (boxId: BoxId, purchaseType: PurchaseType, pairing: Pairing) => {
    setModal({ open: true, boxId, purchaseType, pairing })
  }

  const closeModal = () => {
    setModal(prev => ({ ...prev, open: false }))
  }

  const closeLegal = useCallback(() => setLegalDoc(null), [])

  return (
    <div className="app">
      <Navbar onSubscribeClick={() => {
        document.getElementById('boxes')?.scrollIntoView({ behavior: 'smooth' })
      }} />
      <Hero onSubscribe={() => goToBoxes('subscribe')} onOneTime={() => goToBoxes('oneTime')} />
      <BoxSelector onSelect={openModal} preset={boxPreset} />
      <StorySection />
      {/* <Testimonials /> hidden for now (placeholder reviews) */}
      <FAQ />
      <Contact />
      <Footer onOpenLegal={setLegalDoc} />
      {modal.open && (
        <Modal modal={modal} onClose={closeModal} />
      )}
      {legalDoc && <LegalModal doc={legalDoc} onClose={closeLegal} />}
      <AgeGate />
    </div>
  )
}

export default App
