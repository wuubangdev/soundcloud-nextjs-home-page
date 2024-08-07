"use client"
import { AppBar, CircularProgress, Container } from "@mui/material";
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { useHasMounted } from "@/utils/customHook";
import { useTrackContext } from "@/lib/track.wrapper";
import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
const AppFooter = () => {
    const playerRef = useRef<any>();
    const { currentTrack, setCurrentTrack } = useTrackContext() as ITrackContext;

    useEffect(() => {
        if (playerRef?.current && currentTrack?.isPlaying === false) {
            //@ts-ignore
            playerRef?.current?.audio?.current?.pause();
        }
        if (playerRef?.current && currentTrack?.isPlaying === true) {
            //@ts-ignore
            playerRef?.current?.audio?.current?.play();
        }
    }, [currentTrack.isPlaying])

    const hasMounted = useHasMounted();
    if (!hasMounted) return (<></>)

    return (
        <div style={{ marginTop: 80 }}>
            <AppBar
                position="fixed"
                sx={{
                    top: 'auto',
                    bottom: 0,
                    backgroundColor: "#f2f2f2"
                }}
            >
                <Container
                    disableGutters
                    sx={{
                        display: "flex",
                        gap: 5,
                        alignItems: "center",
                        ".rhap_main": {
                            gap: "30px"
                        }
                    }}
                >
                    {currentTrack._id &&
                        <>
                            <AudioPlayer
                                ref={playerRef}
                                layout="horizontal-reverse"
                                src={currentTrack.trackUrl ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/tracks/${currentTrack.trackUrl}` : ""}
                                volume={1}
                                style={{
                                    boxShadow: "unset",
                                    backgroundColor: "#f2f2f2",
                                }}
                                autoPlayAfterSrcChange
                                onPlay={() => {
                                    setCurrentTrack({ ...currentTrack, isPlaying: true })
                                }}
                                onPause={() => {
                                    setCurrentTrack({ ...currentTrack, isPlaying: false })
                                }}
                            />
                            {currentTrack.imgUrl !== "" && currentTrack.title !== "" && currentTrack.description !== "" ?
                                <Link
                                    href={`/track/${currentTrack._id}?audio=${currentTrack.trackUrl}`}
                                    style={{
                                        display: 'flex',
                                        textDecoration: 'unset',
                                        gap: 25
                                    }}
                                >
                                    <div
                                        style={{
                                            position: "relative",
                                            height: "50px",
                                            width: "50px"
                                        }}
                                    >
                                        <Image
                                            alt="track image"
                                            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${currentTrack.imgUrl}`}
                                            fill
                                            sizes={"100%"}
                                            style={{
                                                objectFit: 'contain',
                                            }}
                                        />
                                    </div>
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "start",
                                            justifyContent: "center",
                                            minWidth: 250
                                        }}

                                    >
                                        <div
                                            style={{
                                                color: "#ccc",
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}>
                                            {currentTrack.description}
                                        </div>
                                        <div
                                            style={{
                                                color: "black",
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}>
                                            <b>{currentTrack.title}</b>
                                        </div>
                                    </div>
                                </Link>
                                :
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        minWidth: 350
                                    }}
                                >
                                    <CircularProgress />
                                </div>
                            }
                        </>
                    }
                </Container>
            </AppBar>
        </div>
    )

}

export default AppFooter;