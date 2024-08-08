import { Container } from "@mui/material";
import MainSlider from "../../components/main/main.slider";
import { sendRequest } from "@/utils/api";

export default async function HomePage() {
  const chills = await sendRequest<IBackendRes<ITrackTop[]>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/top`,
    method: "POST",
    body: { category: "CHILL", limit: 20 },
  })
  const workouts = await sendRequest<IBackendRes<ITrackTop[]>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/top`,
    method: "POST",
    body: { category: "WORKOUT", limit: 20 },
  })
  const party = await sendRequest<IBackendRes<ITrackTop[]>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/top`,
    method: "POST",
    body: { category: "PARTY", limit: 20 },
  })
  return (
    <Container>
      <MainSlider
        title="Top Chill"
        data={chills?.data ?? []}
      />
      <MainSlider
        title="Top Workout"
        data={workouts?.data ?? []}
      />
      <MainSlider
        title="Top Party"
        data={party?.data ?? []}
      />
    </Container>
  );
}
