"use client"
import { useRef, useState, useEffect } from "react"
import { Play, Pause, Volume2, VolumeX } from "lucide-react"

export default function CustomVideoPlayer({ src }: { src: string }) {
    const videoRef = useRef<HTMLVideoElement | null>(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [isMuted, setIsMuted] = useState(false)
    const [progress, setProgress] = useState(0)

    const togglePlay = () => {
        if (!videoRef.current) return
        if (videoRef.current.paused) {
            videoRef.current.play()
            setIsPlaying(true)
        } else {
            videoRef.current.pause()
            setIsPlaying(false)
        }
    }

    const toggleMute = () => {
        if (!videoRef.current) return
        videoRef.current.muted = !videoRef.current.muted
        setIsMuted(videoRef.current.muted)
    }

    useEffect(() => {
        const video = videoRef.current
        if (!video) return

        const handleTimeUpdate = () => {
            const percent = (video.currentTime / video.duration) * 100
            setProgress(percent)
        }

        const handleEnded = () => {
            video.currentTime = 0
            video.play()
        }

        video.currentTime = 0
        video.muted = false
        video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false))

        video.addEventListener("timeupdate", handleTimeUpdate)
        video.addEventListener("ended", handleEnded)

        return () => {
            video.removeEventListener("timeupdate", handleTimeUpdate)
            video.removeEventListener("ended", handleEnded)
        }
    }, [src])

    return (
        <div className="relative w-full max-w-lg mx-auto rounded-3xl overflow-hidden shadow-2xl border border-blue-200 bg-gradient-to-br from-blue-100 to-white group">
            <video
                ref={videoRef}
                src={src}
                className="w-full h-full rounded-3xl object-cover"
                playsInline
            />

            {/* Центр. кнопка Паузы/Плей при паузе */}
            {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <button
                        onClick={togglePlay}
                        className="bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-4 shadow-lg backdrop-blur-md transition-all"
                    >
                        <Play className="w-10 h-10 text-blue-600" />
                    </button>
                </div>
            )}

            {/* Нижние контролы показываются при наведении */}
            <div className="absolute bottom-0 left-0 right-0 bg-black/40 px-4 py-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button onClick={togglePlay} className="text-white">
                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                </button>

                <div className="flex-1 mx-4">
                    <div className="w-full h-1 bg-white/30 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-blue-400"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                <button onClick={toggleMute} className="text-white">
                    {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                </button>
            </div>
        </div>
    )
}
