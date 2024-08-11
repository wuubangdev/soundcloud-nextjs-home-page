
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import type { Metadata } from 'next'
import ListTrackLiked from '@/components/like/like.list.track';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { sendRequest } from '@/utils/api';

export const metadata: Metadata = {
    title: 'Liked tracks',
    description: 'Description',
}

const LikePage = async () => {

    const session = await getServerSession(authOptions);

    const res = await sendRequest<IModelPaginate<ITrackTop>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/likes`,
        method: "GET",
        queryParams: { current: 1, pageSize: 100 },
        headers: {
            Authorization: `Bearer ${session?.access_token}`,
        },
        nextOption: {
            next: { tags: ['liked-by-user'] }
        }
    })
    return (
        <Container>
            <Box my={1} py={2}>
                <Typography variant='h6' mb={1} fontWeight={500}>Hear the track you've liked:</Typography>
                <Divider />
            </Box>
            <Box>
                <ListTrackLiked
                    listTracks={res?.data?.result}
                />
            </Box>
        </Container>
    )
}

export default LikePage;