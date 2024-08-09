
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import WaveTrack from "@/components/track/wave.track";
import { getIdFromSlug, sendRequest } from "@/utils/api";
import { Container } from "@mui/material";
import { getServerSession } from "next-auth";
import type { Metadata, ResolvingMetadata } from 'next'

type Props = {
    params: { slug: string }
    searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
    { params, searchParams }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {

    const track = await sendRequest<IBackendRes<ITrackTop>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/${getIdFromSlug(params.slug)}`,
        method: "GET",
    })

    return {
        title: track.data?.title,
        description: track.data?.description,
        openGraph: {
            title: 'Hỏi Dân IT',
            description: 'Beyond Your Coding Skills',
            type: 'website',
            images: [`https://raw.githubusercontent.com/haryphamdev/sharing-host-files/master/detail-doctors/a2.jpg`],
        },
    }
}

export async function generateStaticParams() {

    return [
        { slug: "luot-song-dap-may-github-66ae2f9739a96cc470152bf1.html" },
    ]
}

const DetailTrackPage = async ({ params }: { params: { slug: string } }) => {

    // const session = await getServerSession(authOptions);

    const track = await sendRequest<IBackendRes<ITrackTop>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/${getIdFromSlug(params.slug)}`,
        method: "GET",
        nextOption: {
            // cache: "no-store",
            next: { tags: ['track-by-id'] }
        },
    })
    const comment = await sendRequest<IModelPaginate<IComment>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/comments`,
        method: "POST",
        queryParams: {
            current: 1,
            pageSize: 100,
            trackId: getIdFromSlug(params.slug),
            sort: "-createdAt"
        }
    })
    // const   listTrackLikeByUser = await sendRequest<IModelPaginate<ITrackLikedByUser>>({
    //     url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/likes`,
    //     method: "GET",
    //     headers: { 'Authorization': `Bearer ${session?.access_token}`, },
    //     queryParams: {
    //         current: 1,
    //         pageSize: 100
    //     }
    // })
    return (
        <Container>
            <div>
                <WaveTrack
                    track={track.data}
                    listComment={comment?.data?.result}
                // listTrackLikeByUser={listTrackLikeByUser?.data?.result}
                />
            </div>
        </Container>
    )
}
export default DetailTrackPage;