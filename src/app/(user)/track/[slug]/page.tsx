
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import WaveTrack from "@/components/track/wave.track";
import { sendRequest } from "@/utils/api";
import { Container } from "@mui/material";
import { getServerSession } from "next-auth";

const DetailTrackPage = async ({ params }: { params: { slug: string } }) => {

    const session = await getServerSession(authOptions);

    const track = await sendRequest<IBackendRes<ITrackTop>>({
        url: `http://localhost:8000/api/v1/tracks/${params.slug}`,
        method: "GET",
    })
    let comment;
    let listTrackLikeByUser;
    if (session) {
        comment = await sendRequest<IModelPaginate<IComment>>({
            url: `http://localhost:8000/api/v1/tracks/comments`,
            method: "POST",
            headers: { 'Authorization': `Bearer ${session?.access_token}`, },
            queryParams: {
                current: 1,
                pageSize: 100,
                trackId: params.slug,
                sort: "-createdAt"
            }
        })
        listTrackLikeByUser = await sendRequest<IModelPaginate<ITrackLikedByUser>>({
            url: `http://localhost:8000/api/v1/likes`,
            method: "GET",
            headers: { 'Authorization': `Bearer ${session?.access_token}`, },
            queryParams: {
                current: 1,
                pageSize: 100
            }
        })
    }
    return (
        <Container>
            <div>
                <WaveTrack
                    track={track.data}
                    listComment={comment?.data?.result}
                    listTrackLikeByUser={listTrackLikeByUser?.data?.result}
                />
            </div>
        </Container>
    )
}
export default DetailTrackPage;