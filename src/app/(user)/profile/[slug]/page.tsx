
import CardTrackProfile from "@/components/profile/card.track.profile";
import { sendRequest } from "@/utils/api";
import { Box, Container, Grid } from "@mui/material";


const Profile = async ({ params }: { params: { slug: string } }) => {

    const tracks = await sendRequest<IModelPaginate<ITrackTop>>({
        url: "http://localhost:8000/api/v1/tracks/users?pageSize=100&current=4",
        method: "POST",
        body: { id: params.slug },
    })
    return (
        <Container>
            <Box sx={{ mt: 5 }}>
                <CardTrackProfile
                    tracks={tracks.data?.result}
                />
            </Box>

        </Container>
    )
}

export default Profile;