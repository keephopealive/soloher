import { useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Experience from './components/Experience'
import BoxSelector from './components/BoxSelector'
import HowItWorks from './components/HowItWorks'
import Testimonials from './components/Testimonials'
import FAQ from './components/FAQ'
import Footer from './components/Footer'
import Modal from './components/Modal'

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

  const openModal = (boxId: BoxId, purchaseType: PurchaseType) => {
    setModal({ open: true, boxId, purchaseType })
  }

  const closeModal = () => {
    setModal(prev => ({ ...prev, open: false }))
  }

  return (
    <div className="app">
      <Navbar onSubscribeClick={() => {
        document.getElementById('boxes')?.scrollIntoView({ behavior: 'smooth' })
      }} />
      <Hero onSubscribe={() => openModal(2, 'subscribe')} onOneTime={() => openModal(2, 'oneTime')} />
      <Experience />
      <BoxSelector onSelect={openModal} />
      <HowItWorks />
      <Testimonials />
      <FAQ />
      <Footer onSubscribeClick={() => openModal(2, 'subscribe')} />
      {modal.open && (
        <Modal modal={modal} onClose={closeModal} />
      )}
    </div>
  )
}

export default App
