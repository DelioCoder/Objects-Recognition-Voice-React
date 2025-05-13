import { useRef, useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import Webcam from 'react-webcam';
import { classTranslations } from '../../assets/translation/TensorFlowTranslation';
import { PiCameraRotate } from 'react-icons/pi';

const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
};

export default function Screen() {
    const webcamRef = useRef<any>(null);
    const canvasRef = useRef<any>(null);
    const animationRef = useRef<number>(0);
    const lastSpokenRef = useRef<string[]>([]);
    const [facingMode, setFacingMode] = useState<any>("user");
    const [isLoading, setIsLoading] = useState(true); // nuevo estado

    const drawRect = (predictions: any, ctx: any) => {
        predictions.forEach((prediction: any) => {
            const [x, y, width, height] = prediction.bbox;
            const text = classTranslations[prediction.class] || prediction.class;

            ctx.strokeStyle = "#00FF00";
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y, width, height);

            ctx.fillStyle = "#00FF00";
            ctx.font = "18px Arial";
            ctx.fillText(text, x, y > 10 ? y - 5 : 10);
        });
    };

    const detectObjects = async (net: cocoSsd.ObjectDetection) => {
        if (
            webcamRef.current &&
            webcamRef.current.video &&
            webcamRef.current.video.readyState === 4
        ) {
            const video = webcamRef.current.video;
            const videoWidth = video.videoWidth;
            const videoHeight = video.videoHeight;

            webcamRef.current.video.width = videoWidth;
            webcamRef.current.video.height = videoHeight;
            canvasRef.current.width = videoWidth;
            canvasRef.current.height = videoHeight;

            const predictions = await net.detect(video);
            const detectedLabels = predictions.map((p: any) => classTranslations[p.class] || p.class);
            const newDetections = detectedLabels.filter(label => !lastSpokenRef.current.includes(label));

            if (newDetections.length > 0) {
                speak(`Detectado: ${newDetections.join(', ')}`);
                lastSpokenRef.current = detectedLabels;
            }

            const ctx = canvasRef.current.getContext("2d");
            ctx.clearRect(0, 0, videoWidth, videoHeight);
            drawRect(predictions, ctx);
        }

        animationRef.current = requestAnimationFrame(() => detectObjects(net));
    };

    const runModel = async () => {
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
        }

        const net = await cocoSsd.load();
        console.log("Modelo cargado");

        detectObjects(net);
        setIsLoading(false); // ocultar spinner
    };

    useEffect(() => {
        setIsLoading(true); // mostrar spinner cada vez que cambia la cámara

        const interval = setInterval(() => {
            const video = webcamRef.current?.video;
            if (video && video.readyState === 4) {
                clearInterval(interval);
                runModel();
            }
        }, 500);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [facingMode]);

    const toggleCamera = () => {
        setFacingMode((prev: any) => prev === "user" ? { exact: "environment" } : "user");
    };

    return (
        <>
            <div className='shadow-md relative w-full h-[80vh]'>
                <Webcam
                    ref={webcamRef}
                    className='rounded-md'
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        zIndex: 8,
                    }}
                    videoConstraints={{ facingMode }}
                />
                <canvas
                    ref={canvasRef}
                    style={{
                        width: '100%',
                        height: '100%',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        zIndex: 9,
                    }}
                />
                {isLoading && (
                    <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-10">
                        <div className="w-12 h-12 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
                    </div>
                )}
            </div>
            <div className='h-full p-2 flex justify-center items-center'>
                <button
                    type='button'
                    className='shadow-md w-fit rounded-full bg-gray-600 p-3 cursor-pointer'
                    onClick={toggleCamera}
                >
                    <PiCameraRotate size={28} className='text-stone-300' />
                </button>
            </div>
        </>
    );
}