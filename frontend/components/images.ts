// Real clinical-setting photography (Unsplash, free license).
// Swap any of these for your own photos later: drop files in /public and use "/your-photo.jpg".
const u = (id: string, w = 2000) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const IMAGES = {
  // Clinician in white coat at two medical monitors
  hero: u("photo-1666214280250-41f16ba24a26", 2400),
  // Doctor typing on keyboard, stethoscope on desk
  practice: u("photo-1758691462860-b1b9532c7394", 1400),
  // Coder at a desk working in a computer system
  coder: u("photo-1691934310598-27528df21f9c", 1400),
  // Reviewing paper charts in front of a computer
  audit: u("photo-1576669801775-ff43c5ab079d", 2400),
  // Laptop and stethoscope, clinical workspace
  workspace: u("photo-1576091160550-2173dba999ef", 2400),
  // Staff member at a workstation looking at a screen
  closing: u("photo-1691934286085-c88039d93dae", 2400),
};
