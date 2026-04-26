let currentAudio: HTMLAudioElement | null = null;

export function speak(text: string) {
  // Stop any currently playing audio
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }

  // Primary: Use Youdao Dictionary TTS (reliable, works on all mobile browsers)
  // type=1 = British English, type=2 = American English
  const url = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(text)}&type=1`;
  const audio = new Audio(url);
  currentAudio = audio;

  audio.play().catch(() => {
    // Fallback: try SpeechSynthesis API
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-GB";
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  });
}
