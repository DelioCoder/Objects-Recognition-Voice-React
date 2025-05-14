import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const WelcomeVoiceComponent = () => {
    const navigate = useNavigate();
    const [audioUnlocked, setAudioUnlocked] = useState(false);

    useEffect(() => {
        const handleUserInput = () => {
            setAudioUnlocked(true);
        };

        window.addEventListener('keydown', handleUserInput);
        window.addEventListener('click', handleUserInput); // fallback
        return () => {
            window.removeEventListener('keydown', handleUserInput);
            window.removeEventListener('click', handleUserInput);
        };
    }, []);

    useEffect(() => {
        if (!audioUnlocked) return;

        const synth = window.speechSynthesis;

        const speak = (text: string) => {
            if (!synth.speaking) {
                const utter = new SpeechSynthesisUtterance(text);
                utter.lang = 'es-ES';
                synth.speak(utter);
            }
        };

        speak('Bienvenido a la aplicación. Esta aplicación te ayudará a reconocer objetos mediante la cámara. Por favor, di "ingresar para detectar objetos" para comenzar.');

        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert('Tu navegador no soporta reconocimiento de voz.');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.lang = 'es-ES';

        recognition.onresult = (event: any) => {
            const transcript = event.results[event.resultIndex][0].transcript.trim().toLowerCase();
            console.log('🗣️ Comando detectado:', transcript);

            if (transcript.includes('ingresar para detectar objetos')) {
                speak('Redirigiendo a la sección de detección de objetos.');
                recognition.stop();
                navigate('/home');
            }
        };

        recognition.onerror = (event: any) => {
            console.error('🎤 Error:', event.error);
        };

        recognition.start();
    }, [audioUnlocked, navigate]);

    return null;
};
