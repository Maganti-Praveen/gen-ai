import { useState } from 'react';

/**
 * Custom hook for Web Speech API voice input
 * @returns {{ isListening, transcript, startListening, stopListening, setTranscript, supported }}
 */
const useVoiceInput = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const supported = !!SpeechRecognition;

  let recognition = null;

  const startListening = () => {
    if (!supported) {
      alert('Voice input is not supported in your browser. Please use Chrome.');
      return;
    }

    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        setTranscript((prev) => prev + ' ' + finalTranscript);
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
    setIsListening(true);

    // Store reference for stopping
    window.__s2sRecognition = recognition;
  };

  const stopListening = () => {
    if (window.__s2sRecognition) {
      window.__s2sRecognition.stop();
      window.__s2sRecognition = null;
    }
    setIsListening(false);
  };

  return { isListening, transcript, startListening, stopListening, setTranscript, supported };
};

export default useVoiceInput;
