import { useCallback, useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import BoxSelector from './components/BoxSelector'
import Testimonials from './components/Testimonials'
import FAQ from './components/FAQ'
import Footer from './components/Footer'
import Modal from './components/Modal'
import LegalModal, { type LegalDoc } from './components/LegalModal'
import AgeGate from './components/AgeGate'

export type BoxId = 1 | 2 | 3
export type PurchaseType = 'subscribe' | 'oneTime'

export interface ModalState {
  open: boolean
  boxId: BoxId | null
  purchaseType: PurchaseType
}

function App() {
  const [modal, setModal] = useState<ModalState>({
    open: false,
    boxId: null,
    purchaseType: 'subscribe',
  })
  const [legalDoc, setLegalDoc] = useState<LegalDoc | null>(null)
  // Hero buttons send visitors to the boxes with every card preset to their choice
  const [boxPreset, setBoxPreset] = useState<{ type: PurchaseType; at: number } | null>(null)

  const goToBoxes = (type: PurchaseType) => {
    setBoxPreset({ type, at: Date.now() })
    document.getElementById('boxes')?.scrollIntoView({ behavior: 'smooth' })
  }

  const openModal = (boxId: BoxId, purchaseType: PurchaseType) => {
    setModal({ open: true, boxId, purchaseType })
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
      <Testimonials />
      <FAQ />
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
