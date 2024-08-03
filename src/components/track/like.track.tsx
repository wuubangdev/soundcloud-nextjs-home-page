import { Box, Chip } from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import { useSession } from "next-auth/react";
import { sendRequest } from "@/utils/api";
import { useRouter } from "next/navigation";

const LikeTrack = ({ track, listTrackLikeByUser }: {
    track: ITrackTop | undefined;
    listTrackLikeByUser: ITrackLikedByUser[] | undefined
}) => {

    const { data: session } = useSession();
    const route = useRouter();

    const handleClickLike = async () => {
        if (session && track) {
            const res = await sendRequest<IBackendRes<ICommentCreate>>({
                url: `http://localhost:8000/api/v1/likes`,
                method: "POST",
                headers: { 'Authorization': `Bearer ${session?.access_token}` },
                body: {
                    track: track._id ?? "",
                    quantity: listTrackLikeByUser?.some(t => t._id === track._id) ? -1 : 1,
                }
            })
            if (res.statusCode === 201) {
                route.refresh();
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