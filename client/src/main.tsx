import React, { lazy, Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

// /listen/<slug> shows a story's audio page (what the QR code on the story card opens); everything else is the main site.
// Each is loaded on its own, so a phone scanning the QR code doesn't download the whole site.
const App = lazy(() => import('./App.tsx'))
const ListenPage = lazy(() => import('./components/ListenPage.tsx'))
// /admin: switch audio stories on and off
const AdminPage = lazy(() => import('./components/AdminPage.tsx'))

const path = window.location.pathname.slice(import.meta.env.BASE_URL.length)
const listenSlug = path.match(/^listen\/([a-z0-9-]+)\/?$/)?.[1]
const isAdmin = /^admin\/?$/.test(path)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Suspense fallback={null}>
      {isAdmin ? <AdminPage /> : listenSlug ? <ListenPage slug={listenSlug} /> : <App />}
    </Suspense>
  </React.StrictMode>,
)
