function waitForVoices(timeoutMs = 1200) {
  const existing = window.speechSynthesis.getVoices();
  if (existing.length) return Promise.resolve(existing);
  return new Promise((resolve) => {
    const done = () => {
      window.speechSynthesis.removeEventListener('voiceschanged', done);
      resolve(window.speechSynthesis.getVoices());
    };
    window.speechSynthesis.addEventListener('voiceschanged', done);
    setTimeout(done, timeoutMs);
  });
}

// Speaks text via the browser's Web Speech API. Resolves 'spoken', 'no-voices',
// or 'error' — callers use this to show honest feedback instead of assuming success.
export async function speak(text) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return 'unsupported';

  const voices = await waitForVoices();
  if (!voices.length) return 'no-voices';

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1;
  utterance.pitch = 1;
  const enVoice = voices.find((v) => v.lang && v.lang.startsWith('en'));
  if (enVoice) utterance.voice = enVoice;
  utterance.lang = enVoice ? enVoice.lang : 'en-US';

  return new Promise((resolve) => {
    utterance.onstart = () => resolve('spoken');
    utterance.onerror = () => resolve('error');
    window.speechSynthesis.speak(utterance);
  });
}
