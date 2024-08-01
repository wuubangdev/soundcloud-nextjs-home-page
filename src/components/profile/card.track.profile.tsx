'use client'
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import { Grid } from '@mui/material';
import { useTrackContext } from '@/lib/track.wrapper';
import PauseIcon from '@mui/icons-material/Pause';
import Link from 'next/link';

interface IProps {
    tracks: ITrackTop[] | undefined;
}
const CardTrackProfile = (props: IProps) => {
    const theme = useTheme();
    const { tracks } = props;

    const { currentTrack, setCurrentTrack } = useTrackContext() as ITrackContext;

    return (
        <Grid container rowSpacing={2} columnSpacing={{ xs: 2, sm: 2, md: 3 }}>
            {tracks && tracks.map((track, i) => {
                return (
                    <Grid key={track._id} item xs={12} md={6}>
                        <Card sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                <CardContent sx={{ flex: '1 0 auto' }}>
                                    <Link
                                        style={{
                                            textDecoration: "none",
                                            color: "unset",
                                            cursor: "pointer",
                                        }}
                                        href={`/track/${track._id}?audio=${track.trackUrl}`}
                                    >
                                        <Typography component="div" variant="h6">
                                            {track.title}
                                        </Typography>
                                    </Link>
                                    <Typography variant="subtitle1" color="text.secondary" component="div">
                                        {track.description}
                                    </Typography>
                                </CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
                                    <IconButton aria-label="previous">
                                        {theme.direction === 'rtl' ? <SkipNextIcon /> : <SkipPreviousIcon />}
                                    </IconButton>
                                    {
                                        (track._id === currentTrack._id && currentTrack.isPlaying === true)
                                        &&
                                        <IconButton aria-label="play/pause"
                                            onClick={(e) => setCurrentTrack({ ...track, isPlaying: false })}
                                        >
                                            <PauseIcon sx={{ height: 38, width: 38 }} />
                                            {/* <PlayArrowIcon sx={{ height: 38, width: 38 }} /> */}
                                        </IconButton>
                                    }
                                    {
                                        (track._id !== currentTrack._id || track._id === currentTrack._id && currentTrack.isPlaying === false)
                                        &&
                                        <IconButton aria-label="play/pause"
                                            onClick={(e) => setCurrentTrack({ ...track, isPlaying: true })}
                                        >
                                            {/* <PauseIcon sx={{ height: 38, width: 38 }} /> */}
                                            <PlayArrowIcon sx={{ height: 38, width: 38 }} />
                                        </IconButton>
                                    }

                                    <IconButton aria-label="next">
                                        {theme.direction === 'rtl' ? <SkipPreviousIcon /> : <SkipNextIcon />}
                                    </IconButton>
                                </Box>
                            </Box>
                            <CardMedia
                                component="img"
                                sx={{ width: 151 }}
                                image={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${track.imgUrl}`}
                                alt="Live from space album cover"
                            />
                        </Card>
                    </Grid>
                )
            })

            }

        </Grid>

    );
}

export default CardTrackProfile;