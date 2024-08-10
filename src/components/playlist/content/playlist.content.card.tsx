'use client'
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import { Box, Grid } from '@mui/material';
import Link from 'next/link';
import Image from "next/image";
import { toSlugify } from '@/utils/api';
import { useTrackContext } from '@/lib/track.wrapper';
import IconButton from '@mui/material/IconButton';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';


interface IProps {
    track: ITrackTop;
}

const PlaylistContentCard = (props: IProps) => {
    const { track } = props;
    const { currentTrack, setCurrentTrack } = useTrackContext() as ITrackContext;
    return (
        <Grid
            item
            xs={12}
            md={6}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderLeft: "3px solid #ff5500",
                    padding: 2,
                    boxShadow: " 0 0px 1px 1px #eee",
                    borderRadius: 2,
                    ":hover": {
                        boxShadow: " 0 0px 10px 0.5px #ccc"
                    }
                }}
            >
                <Link
                    href={`/track/${toSlugify(track.title)}-${track._id}.html?audio=${track.trackUrl}`}
                    style={{ cursor: "pointer", textDecoration: "unset" }}
                >
                    <Box
                        sx={{
                            display: "flex", gap: 2, alignItems: "center"
                        }}>
                        <Avatar sx={{ position: "relative" }}>
                            <Image
                                alt="track image"
                                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${track.imgUrl}`}
                                fill
                                sizes={"100%"}
                                style={{
                                    objectFit: 'contain',
                                }}
                            />
                        </Avatar>
                        <ListItemText primary={track.title} secondary={track.description} />
                    </Box>
                </Link>
                <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
                    {
                        (track._id === currentTrack._id && currentTrack.isPlaying === true)
                        &&
                        <IconButton aria-label="pause"
                            onClick={(e) => setCurrentTrack({ ...track, isPlaying: false })}
                        >
                            <PauseIcon sx={{ height: 30, width: 30 }} />
                        </IconButton>
                    }
                    {
                        (track._id !== currentTrack._id || track._id === currentTrack._id && currentTrack.isPlaying === false)
                        &&
                        <IconButton aria-label="play"
                            onClick={(e) => setCurrentTrack({ ...track, isPlaying: true })}
                        >
                            <PlayArrowIcon sx={{ height: 30, width: 30 }} />
                        </IconButton>
                    }
                </Box>
            </Box>
        </Grid>
    )
}

export default PlaylistContentCard;