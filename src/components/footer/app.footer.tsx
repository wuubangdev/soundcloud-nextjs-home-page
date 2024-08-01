"use client"
import { AppBar, CircularProgress, Container } from "@mui/material";
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { useHasMounted } from "@/utils/customHook";
import { useTrackContext } from "@/lib/track.wrapper";
import { useEffect, useRef } from "react";
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
                                <>
                                    <div>
                                        <img
                                            style={{ height: "50px" }}
                                            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${currentTrack.imgUrl} `}
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
                                        <div style={{ color: "black" }}><b>{currentTrack.title}</b></div>
                                        <div style={{ color: "#ccc" }}>{currentTrack.description}</div>
                                    </div>
                                </>
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