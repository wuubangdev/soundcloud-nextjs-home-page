'use client'
import { Box, Chip } from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import { useSession } from "next-auth/react";
import { sendRequest } from "@/utils/api";
import { useEffect, useState } from "react";

const LikeTrack = ({ track }: {
    track: ITrackTop | undefined;
}) => {
    const { data: session } = useSession();
    const [listTrackLikeByUser, setListTrackLikeByUser] = useState<(ITrackLikedByUser[] | undefined)>()

    useEffect(() => {
        fetchLike();
    }, [])

    const fetchLike = async () => {
        const res = await sendRequest<IModelPaginate<ITrackLikedByUser>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/likes`,
            method: "GET",
            headers: { 'Authorization': `Bearer ${session?.access_token}`, },
            queryParams: {
                current: 1,
                pageSize: 100
            }
        })
        if (res?.data?.result) {
            setListTrackLikeByUser(res.data.result);
        }
    }

    const handleClickLike = async () => {
        if (session && track) {
            const res = await sendRequest<IBackendRes<ICommentCreate>>({
                url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/likes`,
                method: "POST",
                headers: { 'Authorization': `Bearer ${session?.access_token}` },
                body: {
                    track: track._id ?? "",
                    quantity: listTrackLikeByUser?.some(t => t._id === track._id) ? -1 : 1,
                }
            })
            if (res.statusCode === 201) {
                fetchLike();
            }
        }
    };

    return (
        <div>
            <Box
                sx={{
                    mt: "20px",
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}
            >
                <Box>
                    <Chip
                        onClick={() => handleClickLike()}
                        label="Like"
                        color={listTrackLikeByUser?.some(t => t._id === track?._id) ? "error" : "default"}
                        icon={<FavoriteIcon />}
                        clickable
                        variant="outlined"
                        sx={{
                            p: "2px 5px",
                            cursor: 'pointer',
                            fontSize: "15px"
                        }}
                        size="medium"
                    />
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        color: "#868686",
                    }}
                >
                    <PlayCircleOutlineIcon />&nbsp; {track?.countPlay}&nbsp; &nbsp;
                    <FavoriteIcon />&nbsp; {track?.countLike}
                </Box>
            </Box>
        </div>
    )
}

export default LikeTrack;