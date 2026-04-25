function shuffle(array) {
    const arr = [...array]; // copy to avoid mutating original

    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    return arr;
}

function initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        alert("Speech Recognition not supported in this browser.");
        return null;
    } else {
        const recognition = new SpeechRecognition();
        recognition.lang = "en-US";
        recognition.continuous = false;
        recognition.interimResults = false;
        return recognition;
    }
}

function readOut(sentence, accent) {
    let utterance = new SpeechSynthesisUtterance(sentence);
    utterance.lang = `en-${accent}`;
    window.speechSynthesis.speak(utterance);
}

function readOutFallback(sentence) {
 const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(sentence)}&tl=en&client=tw-ob`;

  const audio = new Audio(url);
  audio.play().catch(err => {
    console.error("Playback failed:", err);
  });
}

export { shuffle, initSpeechRecognition, readOut, readOutFallback };
