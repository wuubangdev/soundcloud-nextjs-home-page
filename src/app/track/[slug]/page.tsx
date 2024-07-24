'use client'

import WaveTrack from "@/components/track/wave.track";
import { Container } from "@mui/material";
import { useSearchParams } from 'next/navigation'


const DetailTrackPage = (props: any) => {
    const { params } = props;

    const audioParams = useSearchParams();
    const audio = audioParams.get('audio');


    return (
        <Container>
            DetailTrackPage
            <div>
                <WaveTrack />
            </div>
        </Container>
    )
}
export default DetailTrackPage;