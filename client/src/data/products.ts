// Single source of truth for the box catalog: wines, bath bombs and the three boxes.
// The box cards, the pairing customizer and the order modal all read from here.
// Notes are general style descriptions, not the wineries' own tasting notes.

export type BoxId = 1 | 2 | 3

export interface Wine {
  id: string
  type: 'Red' | 'White' | 'Rosé'
  name: string
  origin?: string
  note: string
}

export interface BathBomb {
  id: string
  name: string
  note: string
}

export interface Box {
  id: BoxId
  mood: string
  name: string
  tagline: string
  storyTheme: string
  /** Curated pairing shown by default; visitors can swap either item */
  recommendedWine: string
  recommendedBathBomb: string
}

export interface Pairing {
  wineId: string
  bathBombId: string
}

export const WINES: Wine[] = [
  { id: 'king-estate-pinot', type: 'Red', name: 'King Estate Pinot Noir', origin: 'Willamette Valley · 2023', note: 'Silky red cherry, raspberry and soft spice.' },
  { id: 'justin-cabernet', type: 'Red', name: 'Justin Cabernet Sauvignon', origin: 'Paso Robles · 2022', note: 'Full-bodied blackberry and dark cherry with vanilla.' },
  { id: 'chalk-hill-chardonnay', type: 'White', name: 'Chalk Hill Chardonnay', note: 'Ripe pear and golden apple with creamy vanilla.' },
  { id: 'silverado-sauvignon-blanc', type: 'White', name: 'Silverado Sauvignon Blanc', origin: 'Miller Ranch, Yountville · 2025', note: 'Crisp and bright, with citrus and green apple.' },
  { id: 'whispering-angel', type: 'Rosé', name: 'Whispering Angel Rosé', origin: "Château d'Esclans · Côtes de Provence · 2025", note: 'Dry and bright, with strawberry and white peach.' },
  { id: 'hampton-water', type: 'Rosé', name: 'Hampton Water Rosé', origin: '2025', note: 'Fresh and dry, with red berries and citrus.' },
]

export const BATH_BOMBS: BathBomb[] = [
  { id: 'lavender-rosemary', name: 'Lavender Rosemary', note: 'Calming lavender with fresh, herbal rosemary.' },
  { id: 'oatmeal-milk-honey', name: 'Oatmeal Milk & Honey', note: 'Creamy oat and golden honey, soft and comforting.' },
  { id: 'honeysuckle', name: 'Honeysuckle', note: 'Sweet, sunlit honeysuckle blossom.' },
  { id: 'cherry-almond', name: 'Cherry Almond', note: 'Dark cherry warmed with sweet almond.' },
]

export const BOXES: Box[] = [
  {
    id: 1,
    mood: 'Tender · Romantic',
    name: 'The Velvet Hour',
    tagline: 'For the woman who craves tenderness.',
    storyTheme: 'A slow-burn story of longing and surrender',
    recommendedWine: 'king-estate-pinot',
    recommendedBathBomb: 'lavender-rosemary',
  },
  {
    id: 2,
    mood: 'Bold · Confident',
    name: 'The Midnight Bloom',
    tagline: 'For the woman who knows exactly what she wants.',
    storyTheme: 'A story where desire meets its match',
    recommendedWine: 'chalk-hill-chardonnay',
    recommendedBathBomb: 'oatmeal-milk-honey',
  },
  {
    id: 3,
    mood: 'Deep · Adventurous',
    name: 'The Crimson Reverie',
    tagline: 'For the woman ready to go somewhere deeper.',
    storyTheme: 'A tale of complete surrender and discovery',
    recommendedWine: 'whispering-angel',
    recommendedBathBomb: 'honeysuckle',
  },
]

export const wineById = (id: string) => WINES.find(w => w.id === id) ?? WINES[0]
export const bathBombById = (id: string) => BATH_BOMBS.find(b => b.id === id) ?? BATH_BOMBS[0]
export const boxById = (id: BoxId) => BOXES.find(b => b.id === id) ?? BOXES[0]

export const recommendedPairing = (box: Box): Pairing => ({
  wineId: box.recommendedWine,
  bathBombId: box.recommendedBathBomb,
})

export const isCustomized = (box: Box, pairing: Pairing) =>
  pairing.wineId !== box.recommendedWine || pairing.bathBombId !== box.recommendedBathBomb
