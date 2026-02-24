import React, { useState, useEffect, useRef } from 'react';
const avatarVideo = '/assets/avatar_1.mp4';
const avatarImage = '/assets/avatar.jpeg';

const Avatar = ({ audioBase64, isEmergency = false }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [mouthHeight, setMouthHeight] = useState(2); // Restored
    const audioRef = useRef(null);
    const videoRef = useRef(null);
    const audioContextRef = useRef(null); // Restored
    const analyserRef = useRef(null);     // Restored
    const animationFrameRef = useRef(null); // Restored

    // ... (AudioContext logic kept for isPlaying state, but visualization removed)
    // Actually, we can simplify if we just trust audio.onplay/onended?
    // But existing logic handles base64 well. Let's keep it but remove visualizer.

    // ... Keep imports and init ...
    const userInteractedRef = useRef(false);

    // Sync Video with Audio State
    useEffect(() => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.play().catch(e => console.warn("Video play error", e));
            } else {
                videoRef.current.pause();
                videoRef.current.currentTime = 0; // Reset to start (neutral face) or keep paused? 
                // Usually reset to 0 is better for "start talking again".
                // But if video is long looping, maybe just pause.
                // "replace avatar.jpeg with avatar_1.mp4" implies a talking loop.
                // Let's loop it.
            }
        }
    }, [isPlaying]);

    // Handle user interaction to enable autoplay
    useEffect(() => {
        const enableAudio = () => {
            userInteractedRef.current = true;
            console.log('🎵 Avatar: User interaction detected');
        };

        // Listen for any user interaction
        document.addEventListener('click', enableAudio, { once: true });
        document.addEventListener('keydown', enableAudio, { once: true });

        return () => {
            document.removeEventListener('click', enableAudio);
            document.removeEventListener('keydown', enableAudio);
        };
    }, []);

    useEffect(() => {
        console.log('🎵 Avatar: audioBase64 changed', audioBase64 ? 'Audio received' : 'No audio');
        if (!audioBase64) return;

        const playAudio = async () => {
            try {
                console.log('🎵 Avatar: Starting audio playback...');

                // Stop any existing audio
                if (audioRef.current) {
                    audioRef.current.pause();
                    audioRef.current = null;
                }

                // Create new audio element
                const audio = new Audio(`data:audio/mp3;base64,${audioBase64}`);
                audioRef.current = audio;
                console.log('🎵 Avatar: Audio element created');

                // Setup audio context for lip sync
                if (!audioContextRef.current) {
                    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
                    console.log('🎵 Avatar: Audio context created');
                }

                const audioContext = audioContextRef.current;

                // Resume context if suspended
                if (audioContext.state === 'suspended') {
                    console.log('🎵 Avatar: AudioContext suspended, resuming...');
                    await audioContext.resume();
                    console.log('🎵 Avatar: AudioContext resumed');
                }

                const source = audioContext.createMediaElementSource(audio);
                const analyser = audioContext.createAnalyser();
                analyser.fftSize = 256;

                source.connect(analyser);
                analyser.connect(audioContext.destination);
                analyserRef.current = analyser;
                console.log('🎵 Avatar: Audio pipeline connected');

                // Attempt to play audio
                setIsPlaying(true);

                try {
                    await audio.play();
                    console.log('🎵 Avatar: Audio playing!');

                    // Start lip sync animation
                    visualize();
                } catch (playError) {
                    console.warn('⚠️ Avatar: Autoplay blocked, will play on next click');

                    // Wait for user interaction
                    const playOnClick = async () => {
                        try {
                            await audio.play();
                            console.log('🎵 Avatar: Audio playing after click!');
                            visualize();
                            document.removeEventListener('click', playOnClick);
                        } catch (e) {
                            console.error('Failed to play after click:', e);
                        }
                    };

                    document.addEventListener('click', playOnClick, { once: true });
                }

                // Handle audio end
                audio.onended = () => {
                    console.log('🎵 Avatar: Audio ended');
                    setIsPlaying(false);
                    setMouthHeight(2);
                    if (animationFrameRef.current) {
                        cancelAnimationFrame(animationFrameRef.current);
                    }
                };

            } catch (error) {
                console.error('❌ Avatar: Audio playback error:', error);
                setIsPlaying(false);
            }
        };

        playAudio();

        // Cleanup
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [audioBase64]);

    // Simplified Cleanup
    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    const visualize = () => {
        if (!analyserRef.current) return;

        const analyser = analyserRef.current;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        analyser.getByteFrequencyData(dataArray);

        // Calculate average volume
        const average = dataArray.reduce((a, b) => a + b) / bufferLength;

        // Map volume to mouth height (2-20px range)
        const targetHeight = Math.max(2, Math.min(20, (average / 255) * 20));

        setMouthHeight(targetHeight);
        animationFrameRef.current = requestAnimationFrame(visualize);
    };

    return (
        <div className="relative w-full h-full flex flex-col items-center">
            {/* Avatar Frame - Video with Poster Fallback */}
            <div
                className={`
                    relative w-full flex-1 rounded-2xl overflow-hidden
                    transition-all duration-300
                    ${isPlaying ? 'shadow-[0_0_30px_rgba(45,108,223,0.6)]' : 'shadow-md'}
                    bg-gray-900
                `}
            >
                <video
                    ref={videoRef}
                    src={avatarVideo}
                    poster={avatarImage} // Shows this image if video fails or while loading
                    className="w-full h-full object-cover"
                    muted
                    loop
                    playsInline
                    onError={(e) => console.error("Video Load Error:", e)}
                />

                {/* Status Indicators */}
                <div className="absolute bottom-3 right-3 flex gap-2">
                    {isPlaying && (
                        <div className="flex gap-1 bg-black/30 px-2 py-1 rounded-full">
                            <div className="w-1 h-3 bg-white rounded-full animate-pulse"></div>
                            <div className="w-1 h-4 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-1 h-3 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                    )}
                </div>
            </div>

            {/* Replay Button */}
            {audioBase64 && !isPlaying && (
                <button
                    onClick={() => {
                        if (audioRef.current) {
                            audioRef.current.currentTime = 0;
                            audioRef.current.play();
                        }
                    }}
                    className="mt-3 text-blue-600 font-semibold text-sm flex items-center gap-1 hover:text-blue-800 transition-colors"
                >
                    🔊 Replay Audio
                </button>
            )}
        </div>
    );
};

export default Avatar;
