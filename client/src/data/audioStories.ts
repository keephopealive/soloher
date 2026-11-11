import { boxById, type BoxId } from './products'

// Audio versions of the box stories. Each one gets a page at /listen/<slug>, which is what its QR code opens.
// To add a story: put the MP3 in client/public/audio/ (MP3, mono, 64 kbps keeps it under Cloudflare's 25 MB limit)
// and add a line here.
export interface AudioStory {
  slug: string
  boxId: BoxId
  /** File name inside client/public/audio/ */
  file: string
  /** True while the file is a placeholder recording, not the real story */
  sample?: boolean
}

export const AUDIO_STORIES: AudioStory[] = [
  { slug: 'silky-storm', boxId: 1, file: 'silky-storm.mp3', sample: true },
]

export const audioStoryBySlug = (slug: string) => {
  const story = AUDIO_STORIES.find(s => s.slug === slug)
  return story ? { ...story, box: boxById(story.boxId) } : null
}
