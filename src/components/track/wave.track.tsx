'use client'
import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { useSearchParams } from 'next/navigation';
import { useWavesurfer } from "@/utils/customHook";
import { WaveSurferOptions } from "wavesurfer.js";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import "./wave.scss"
import { Tooltip } from "@mui/material";
import { useTrackContext } from "@/lib/track.wrapper";

interface IProps {
    track: ITrackTop | undefined;
}

const WaveTrack = (props: IProps) => {
    const { track } = props;
    const [isPlaying, setIsPlaying] = useState<boolean>(true);
    const searchParams = useSearchParams()
    const fileName = searchParams.get('audio');
    const containerRef = useRef<HTMLDivElement>(null);
    const timeRef = useRef<HTMLDivElement>(null);
    const durationRef = useRef<HTMLDivElement>(null);
    const hoverRef = useRef<HTMLDivElement>(null);

    const { currentTrack, setCurrentTrack } = useTrackContext() as ITrackContext;

    const optionsMemo = useMemo((): Omit<WaveSurferOptions, "container"> => {
        let gradient, progressGradient;

        if (typeof window !== "undefined") {

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d')!;

            // Define the waveform gradient
            gradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 1.35)
            gradient.addColorStop(0, '#656666') // Top color
            gradient.addColorStop((canvas.height * 0.7) / canvas.height, '#656666') // Top color
            gradient.addColorStop((canvas.height * 0.7 + 1) / canvas.height, '#ffffff') // White line
            gradient.addColorStop((canvas.height * 0.7 + 2) / canvas.height, '#ffffff') // White line
            gradient.addColorStop((canvas.height * 0.7 + 3) / canvas.height, '#B1B1B1') // Bottom color
            gradient.addColorStop(1, '#B1B1B1') // Bottom color

            // Define the progress gradient
            progressGradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 1.35)
            progressGradient.addColorStop(0, '#EE772F') // Top color
            progressGradient.addColorStop((canvas.height * 0.7) / canvas.height, '#EB4926') // Top color
            progressGradient.addColorStop((canvas.height * 0.7 + 1) / canvas.height, '#ffffff') // White line
            progressGradient.addColorStop((canvas.height * 0.7 + 2) / canvas.height, '#ffffff') // White line
            progressGradient.addColorStop((canvas.height * 0.7 + 3) / canvas.height, '#F6B094') // Bottom color
            progressGradient.addColorStop(1, '#F6B094') // Bottom color
        }
        return {
            waveColor: gradient,
            progressColor: progressGradient,
            height: 100,
            barWidth: 3,
            url: `/api?audio=${fileName}`,
        }
    }, []);
    const wavesurfer = useWavesurfer(containerRef, optionsMemo);

    useEffect(() => {
        if (currentTrack.isPlaying == true) {
            setIsPlaying(false);
            if (wavesurfer) {
                wavesurfer.pause();
            }
        }
        if (currentTrack._id === "" && track) {
            setCurrentTrack({ ...track, isPlaying: true })
        }
    }, [currentTrack])

    useEffect(() => {
        if (!wavesurfer) return;
        setIsPlaying(false);
        const timeEl = timeRef.current!;
        const durationEl = durationRef.current!;

        const hover = hoverRef.current!;
        const waveform = containerRef.current!;

        waveform.addEventListener('pointermove', (e) => (hover.style.width = `${e.offsetX}px`))

        const subscriptions = [
            wavesurfer.on('play', () => setIsPlaying(true)),
            wavesurfer.on('pause', () => setIsPlaying(false)),
            wavesurfer.on('decode', (duration) => (durationEl.textContent = formatTime(duration))),
            wavesurfer.on('timeupdate', (currentTime) => (timeEl.textContent = formatTime(currentTime))),
            wavesurfer.on('interaction', () => {
                wavesurfer.play();
                setCurrentTrack({ ...currentTrack, isPlaying: false });
            })
        ]

        return () => {
            subscriptions.forEach((unsub) => unsub())
        }
    }, [wavesurfer])

    const onPlayClick = useCallback(() => {
        if (wavesurfer) {
            if (wavesurfer.isPlaying() === true) {
                wavesurfer.pause();
                // setCurrentTrack({ ...currentTrack, isPlaying: true });
            } else {
                wavesurfer.play();
                setCurrentTrack({ ...currentTrack, isPlaying: false });
            }
        }
    }, [wavesurfer]);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60)
        const secondsRemainder = Math.round(seconds) % 60
        const paddedSeconds = `0${secondsRemainder}`.slice(-2)
        return `${minutes}:${paddedSeconds}`
    }
    const arrComments = [
        {
            id: 1,
            avatar: "http://localhost:8000/images/chill1.png",
            moment: 10,
            user: "username 1",
            content: "just a comment1"
        },
        {
            id: 2,
            avatar: "http://localhost:8000/images/chill1.png",
            moment: 30,
            user: "username 2",
            content: "just a comment3"
        },
        {
            id: 3,
            avatar: "http://localhost:8000/images/chill1.png",
            moment: 50,
            user: "username 3",
            content: "just a comment3"
        },
    ]
    const countLeft = (moment: number) => {
        const left = (moment / 199) * 100
        return `${left}%`;
    }
    return (
        <div style={{ marginTop: 20 }}>
            <div
                style={{
                    display: "flex",
                    gap: 15,
                    padding: 20,
                    height: 400,
                    background: "linear-gradient(135deg, rgb(106, 112, 67) 0%, rgb(11, 15, 20) 100%)"
                }}
            >
                <div className="left"
                    style={{
                        width: "75%",
                        height: "calc(100% - 10px)",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between"
                    }}
                >
                    <div className="info" style={{ display: "flex" }}>
                        <div>
                            <div
                                onClick={() => {
                                    onPlayClick()
                                }}
                                style={{
                                    borderRadius: "50%",
                                    background: "#f50",
                                    height: "50px",
                                    width: "50px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    cursor: "pointer"
                                }}
                            >
                                {isPlaying === true ?
                                    <PauseIcon
                                        sx={{ fontSize: 30, color: "white" }}
                                    />
                                    :
                                    <PlayArrowIcon
                                        sx={{ fontSize: 30, color: "white" }}
                                    />
                                }
                            </div>
                        </div>
                        <div style={{ marginLeft: 20 }}>
                            <div style={{
                                padding: "0 5px",
                                background: "#333",
                                fontSize: 30,
                                width: "fit-content",
                                color: "white"
                            }}>
                                {track?.title}
                            </div>
                            <div style={{
                                padding: "0 5px",
                                marginTop: 10,
                                background: "#333",
                                fontSize: 20,
                                width: "fit-content",
                                color: "white"
                            }}
                            >
                                {track?.description}
                            </div>
                        </div>
                    </div>
                    <div ref={containerRef} className="waveform-content">
                        <div className="time" ref={timeRef}>0:00</div>
                        <div className="duration" ref={durationRef}>0:00</div>
                        <div className="hover" ref={hoverRef}></div>
                        <div className="overlay"
                            style={{
                                position: "absolute",
                                height: "30px",
                                width: "100%",
                                bottom: "0",
                                // background: "#ccc"
                                backdropFilter: "brightness(0.5)"
                            }}
                        >
                        </div>
                        <div
                            className="comments"
                            style={{ position: "relative" }}
                        >
                            {arrComments.map((iteam) => {
                                return (
                                    <Tooltip
                                        key={iteam.id}
                                        title={iteam.content}
                                        arrow
                                    >
                                        <img
                                            onPointerMove={(e) => {
                                                const hover = hoverRef.current!;
                                                hover.style.width = countLeft(iteam.moment + 3);
                                            }}

                                            style={{
                                                width: 20,
                                                height: 20,
                                                position: "absolute",
                                                left: countLeft(iteam.moment),
                                                zIndex: 20,
                                                top: 71,
                                            }}
                                            src={`http://localhost:8000/images/chill1.png`}
                                        />
                                    </Tooltip>
                                )
                            })}

                        </div>
                    </div>
                </div>
                <div className="right"
                    style={{
                        width: "25%",
                        padding: 15,
                        display: "flex",
                        alignItems: "center"
                    }}
                >
                    <div style={{
                        background: "#ccc",
                        width: 250,
                        height: 250
                    }}>
                        <img
                            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${currentTrack.imgUrl} `}
                            style={{ display: "block", height: "100%", width: "100%" }}
                        />
                    </div>
                </div>
            </div>
        </div>

    )
}

export default WaveTrack;