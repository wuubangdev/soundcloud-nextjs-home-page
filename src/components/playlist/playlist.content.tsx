'use client'
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Fragment } from 'react';
import Grid from '@mui/material/Grid';
import PlaylistContentCard from './content/playlist.content.card';
import { Typography } from '@mui/material';

interface IProps {
    playLists: IPlayListInfo[] | undefined;
}

const ContentPlaylist = (props: IProps) => {
    const { playLists } = props
    return (
        <div>
            {playLists && playLists.map((playList) => {
                return (
                    <Fragment key={playList._id}>
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1-content"

                            >
                                {playList.title}
                            </AccordionSummary>
                            <AccordionDetails>
                                <Grid
                                    container
                                    spacing={2}
                                >
                                    {playList?.tracks && playList.tracks.map((track) => {
                                        return (
                                            <Fragment key={track._id}>
                                                <PlaylistContentCard
                                                    track={track as ITrackTop}
                                                />
                                            </Fragment>
                                        )
                                    })}
                                    {playList?.tracks.length === 0 &&
                                        <Typography width="100%" color="orange" textAlign="center">Playlist is empty!</Typography>
                                    }
                                </Grid>

                            </AccordionDetails>
                        </Accordion>
                    </Fragment>
                )
            })}
        </div>
    )
}

export default ContentPlaylist;