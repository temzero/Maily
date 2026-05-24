import openComposeSound from "~/assets/sounds/page.mp3";
import sentMailSound from "~/assets/sounds/whoosh.mp3";
import newMailSound from "~/assets/sounds/bell-ring.mp3";
import markAsReadMailSound from "~/assets/sounds/paper-tear.mp3";
import viewMailSound from "~/assets/sounds/paper.mp3";
import deleteMailSound from "~/assets/sounds/card.mp3";

const SOUNDS = {
  openCompose: openComposeSound,
  sentMail: sentMailSound,
  newMail: newMailSound,
  markAsReadMail: markAsReadMailSound,
  viewMail: viewMailSound,
  deleteMail: deleteMailSound,
} as const;

type SoundKey = keyof typeof SOUNDS;

class AudioManager {
  private muted = false;
  private isTabActive = true;

  constructor() {
    if (typeof document !== "undefined") {
      document.addEventListener("visibilitychange", () => {
        this.isTabActive = document.visibilityState === "visible";
      });
    }
  }

  play(sound: SoundKey, volume = 1) {
    // Simply don't play if muted or tab not active
    if (this.muted || !this.isTabActive) return;

    // Just create and play - if it fails, it fails
    const audio = new Audio(SOUNDS[sound]);
    audio.volume = volume;
    audio.play().catch(() => {
      // Silently fail - browser blocked it or can't play
    });
  }

  mute() {
    this.muted = true;
  }

  unmute() {
    this.muted = false;
  }

  toggleMute() {
    this.muted = !this.muted;
  }

  isMuted() {
    return this.muted;
  }
}

export const audioManager = new AudioManager();
