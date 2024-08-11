'use client'
import { Box, Grid } from "@mui/material";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import { useTrackContext } from '@/lib/track.wrapper';
import IconButton from '@mui/material/IconButton';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import Link from "next/link";
import { toSlugify } from "@/utils/api";

interface IProps {
    listTracks: ITrackTop[] | undefined;
}

const ListTrackLiked = (props: IProps) => {
    const { listTracks } = props;
    const { currentTrack, setCurrentTrack } = useTrackContext() as ITrackContext;

    return (
        <Grid container spacing={{ xs: 2, md: 3 }}>
            {listTracks && listTracks.map((track) => {
                return (
                    <Grid item xs={12} md={3} key={track._id} position={"relative"}>
                        <Card sx={{ width: "100%", padding: "0 5px" }}>
                            <CardActionArea>
                                <Link href={`/track/${toSlugify(track.title)}-${track._id}.html?audio=${track.trackUrl}`}>
                                    <CardMedia
                                        component="img"
                                        height="250px"
                                        image={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${track.imgUrl}`}
                                        alt="image-track-liked"
                                        style={{ objectFit: 'contain' }}
                                    />
                                </Link>
                                <Box sx={{ display: "flex", alignItems: 'center', justifyContent: 'space-between' }}>
                                    <CardContent sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        <Typography gutterBottom component="div"
                                            sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                                        >
                                            {track.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} >
                                            {track.description}
                                        </Typography>
                                    </CardContent>
                                </Box>
                            </CardActionArea>
                        </Card>
                        <Box
                            sx={{
                                position: "absolute",
                                zIndex: 10,
                                top: 15,
                                backgroundColor: "#FE4B4B",
                                borderRadius: "50%",
                                border: "1px solid #90D6F1",
                                transition: "1s",
                                opacity: 0.7,
                                ":hover": {
                                    backgroundColor: "#FE4B4B",
                                    border: "0.5px solid #90D6F1",
                                    opacity: 1,
                                }
                            }}
                        >
                            {
                                (track._id === currentTrack._id && currentTrack.isPlaying === true)
                                &&
                                <IconButton aria-label="pause"
                                    onClick={(e) => setCurrentTrack({ ...track, isPlaying: false })}
                                >
                                    <PauseIcon sx={{ height: 20, width: 20 }} color="primary" />
                                </IconButton>
                            }
                            {
                                (track._id !== currentTrack._id || track._id === currentTrack._id && currentTrack.isPlaying === false)
                                &&
                                <IconButton aria-label="play"
                                    onClick={(e) => setCurrentTrack({ ...track, isPlaying: true })}
                                >
                                    <PlayArrowIcon sx={{ height: 20, width: 20 }} color="info" />
                                </IconButton>
                            }
                        </Box>
                    </Grid>
                )
            })}

        </Grid>
    )
}

export default ListTrackLiked;