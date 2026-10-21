// Real clinical media. Videos: Pexels (free license, commercial use OK).
// Stills: Unsplash (free license). Swap any of these for your own footage later:
// drop files in /public and use e.g. "/video/hero.mp4".

const u = (id: string, w = 2000) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;
const pv = (id: string, file: string) => `https://videos.pexels.com/video-files/${id}/${file}`;
const pp = (id: string, name: string) =>
  `https://images.pexels.com/videos/${id}/${name}?auto=compress&cs=tinysrgb&w=1920`;

export const VIDEOS = {
  // Clinician reviewing a chest X-ray on a tablet while taking notes
  hero: {
    src: pv("5406015", "5406015-uhd_2560_1440_25fps.mp4"),
    poster: pp("5406015", "pexels-photo-5406015.jpeg"),
  },
  // Physician writing notes in a modern office
  practice: {
    src: pv("5998380", "5998380-hd_1920_1080_30fps.mp4"),
    poster: pp("5998380", "child-computer-covid-covid-19-5998380.jpeg"),
  },
  // Clinician working on a laptop
  laptop: {
    src: pv("5998385", "5998385-hd_1920_1080_30fps.mp4"),
    poster: pp("5998385", "child-computer-covid-covid-19-5998385.jpeg"),
  },
  // Hospital corridor with nurse station
  hallway: {
    src: pv("5203510", "5203510-hd_1920_1080_30fps.mp4"),
    poster: pp("5203510", "camilla-covid-covid-19-covid-19-5203510.jpeg"),
  },
  // ECG monitor, live vitals
  ecg: {
    src: pv("6130551", "6130551-hd_1920_1080_30fps.mp4"),
    poster: pp("6130551", "pexels-photo-6130551.jpeg"),
  },
  // Hospital waiting area, where every claim starts
  waiting: {
    src: pv("3197799", "3197799-hd_1920_1080_25fps.mp4"),
    poster: pp("3197799", "free-video-3197799.jpg"),
  },
};

export const IMAGES = {
  hero: u("photo-1666214280250-41f16ba24a26", 2400),
  practice: u("photo-1758691462860-b1b9532c7394", 1400),
  coder: u("photo-1691934310598-27528df21f9c", 1400),
  audit: u("photo-1576669801775-ff43c5ab079d", 2400),
  workspace: u("photo-1576091160550-2173dba999ef", 2400),
  closing: u("photo-1691934286085-c88039d93dae", 2400),
};
