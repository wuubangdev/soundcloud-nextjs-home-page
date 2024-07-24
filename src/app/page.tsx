import { Container } from "@mui/material";
import MainSlider from "./components/main/main.slider";
import { sendRequestJS } from "@/utils/old.api";

export default async function HomePage() {

  // const res = await fetch("http://localhost:8000/api/v1/tracks/top", {
  //   method: "POST",
  //   headers: {
  //     'Accept': 'application/json',
  //     'Content-Type': 'application/json'
  //   },
  //   body: JSON.stringify({
  //     category: "CHILL",
  //     limit: 10
  //   })
  // })

  const res = await sendRequestJS({
    url: "http://localhost:8000/api/v1/tracks/top",
    method: "post",
    body: {
      category: "CHILL",
      limit: 10
    },
  })
  console.log("check res>>>>:", res);
  return (
    <Container>
      <MainSlider />
      <MainSlider />
      <MainSlider />
    </Container>
  );
}
