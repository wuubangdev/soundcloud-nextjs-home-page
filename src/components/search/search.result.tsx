'use client'
import { sendRequest } from "@/utils/api";
import { useSearchParams } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Typography from '@mui/material/Typography';
import Image from "next/image";

const SearchResult = () => {
    const searchParams = useSearchParams();
    const query = searchParams.get('q');
    const [tracks, setTracks] = useState<ITrackTop[]>([]);

    useEffect(() => {
        document.title = `Search tracks "${query}"`;
        if (query) {
            fetchData();
        }
    }, [query])

    const fetchData = async () => {
        const res = await sendRequest<IModelPaginate<ITrackTop>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/search`,
            method: "POST",
            body: {
                current: 1,
                pageSize: 10,
                title: query
            }
        })
        if (res?.data && res.statusCode === 201) {
            setTracks(res?.data?.result);

        }
    }
    return (
        <>
            <Box mt={1} pt={2} sx={{ display: "flex", justifyContent: "center" }}>
                <Typography variant="subtitle1" fontWeight={500} mb={1} >Result of keyword: "{query}"</Typography>
            </Box>
            <Divider />
            <Box>
                <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                    {(!tracks || tracks.length === 0) && <Typography>Result is empty!</Typography>}
                    {tracks.map((track) => {
                        return (
                            <Fragment key={`track-search-${track._id}`}>
                                <ListItem>
                                    <ListItemAvatar sx={{ mr: 2 }}>
                                        <Image
                                            alt="track image"
                                            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${track.imgUrl}`}
                                            width={50}
                                            height={50}
                                        />
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={track.title}
                                        secondary={
                                            <>
                                                <Typography
                                                    sx={{ display: 'inline' }}
                                                    component="span"
                                                    variant="body2"
                                                    color="text.primary"
                                                >
                                                    {track.description}
                                                </Typography>
                                            </>
                                        }
                                    />
                                </ListItem>
                                <Divider />
                            </Fragment>
                        )
                    })}

                </List>
            </Box>
        </>
    )
}

export default SearchResult;