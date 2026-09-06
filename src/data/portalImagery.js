/**
 * House photographs used inside the member portal.
 *
 * Every entry here is a real Sundarbans photograph already published through
 * Cloudinary and recorded in `media/manifest.json`; nothing is stock and
 * nothing is generated. Captions are read off the asset path (the region a
 * meetup belongs to, the year the file was dated) rather than written from
 * imagination, so a photograph is never given a story it does not have.
 */

const CDN = 'https://res.cloudinary.com/l59gy0g2/image/upload/f_auto,q_auto:good,w_1400,c_limit';

/** Photographs from House meetups, used as large editorial crops. */
export const houseMoments = [
  {
    id: 'blr-1',
    src: `${CDN}/v1785911324/sundarbans/public/assets/pastevent/bengaluru_meetup_608_1.png`,
    caption: 'Bengaluru meetup',
  },
  {
    id: 'blr-3',
    src: `${CDN}/v1785911327/sundarbans/public/assets/pastevent/bengaluru_meetup_608_3.png`,
    caption: 'Bengaluru meetup',
  },
  {
    id: 'house-2025',
    src: `${CDN}/v1785911322/sundarbans/public/assets/pastevent/2025-05-09_06-25-51_UTC.jpg`,
    caption: 'From the House archive, 2025',
  },
  {
    id: 'house-2024',
    src: `${CDN}/v1785911314/sundarbans/public/assets/pastevent/2024-07-16_11-41-17_UTC.jpg`,
    caption: 'From the House archive, 2024',
  },
];
