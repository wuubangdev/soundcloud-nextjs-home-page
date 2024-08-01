
import WaveTrack from "@/components/track/wave.track";
import { sendRequest } from "@/utils/api";
import { Container } from "@mui/material";

const DetailTrackPage = async ({ params }: { params: { slug: string } }) => {

    const track = await sendRequest<IBackendRes<ITrackTop>>({
        url: `http://localhost:8000/api/v1/tracks/${params.slug}`,
        method: "GET",
    })

    return (
        <Container>
            <div>
                <WaveTrack
                    track={track.data}
                />
            </div>
        </Container>
    )
}
export default DetailTrackPage;