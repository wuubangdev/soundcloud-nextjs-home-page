
import CardTrackProfile from "@/components/profile/card.track.profile";
import { sendRequest } from "@/utils/api";
import { Box, Container, Grid } from "@mui/material";


const Profile = async ({ params }: { params: { slug: string } }) => {

    const tracks = await sendRequest<IModelPaginate<ITrackTop>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/users`,
        method: "POST",
        queryParams: {
            current: 1,
            pageSize: 100,
        },
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