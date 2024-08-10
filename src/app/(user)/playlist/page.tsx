import Container from "@mui/material/Container";
import ContentPlaylist from "@/components/playlist/playlist.content";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import LibraryMusicOutlinedIcon from '@mui/icons-material/LibraryMusicOutlined';
import AddPlayList from "@/components/playlist/add/add.playlist";
import AddTrackToPlayList from "@/components/playlist/add/add.track";
import { sendRequest } from "@/utils/api";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import next from "next";

const PlayList = async () => {

    const session = await getServerSession(authOptions);

    const resAllPlayList = await sendRequest<IModelPaginate<IPlayListInfo>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/playlists`,
        method: "GET",
        headers: { 'Authorization': `Bearer ${session?.access_token}` },
        queryParams: {
            current: 1,
            pageSize: 100
        },
        nextOption: {
            next: { tag: ['playlist-by-user'] }
        }

    })

    const resAllTrack = await sendRequest<IModelPaginate<ITrackTop>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks`,
        method: "GET",
        headers: { 'Authorization': `Bearer ${session?.access_token}` },
        queryParams: {
            current: 1,
            pageSize: 100
        },
    })

    return (
        <Container>
            <Box
                sx={{
                    mt: 3,
                    padding: 3,
                    backgroundColor: "#ddd",
                    borderRadius: 1
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        paddingY: 2,
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <LibraryMusicOutlinedIcon sx={{ color: "#3990FF" }} />
                        <Typography variant="h6">My Playlist</Typography>
                    </Box>
                    <Box sx={{ display: "flex", gap: 2 }}>
                        <AddPlayList />
                        <AddTrackToPlayList
                            playLists={resAllPlayList.data?.result}
                            listTracks={resAllTrack.data?.result}
                        />
                    </Box>

                </Box>
                <Divider sx={{ mb: 2 }} />
                <ContentPlaylist
                    playLists={resAllPlayList.data?.result}
                />
            </Box>
        </Container>
    )
}

export default PlayList;