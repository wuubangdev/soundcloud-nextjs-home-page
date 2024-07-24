"use client"
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { Settings } from "react-slick";
import { Box, Button, Divider } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
const MainSlider = () => {

    const NextArrow = (props: any) => {
        return (
            <Button variant="outlined" onClick={props.onClick}
                sx={{
                    position: 'absolute',
                    left: 0,
                    top: "40%",
                    zIndex: 2,
                    minWidth: 30,
                    width: 35
                }}
            >
                <ChevronLeft />
            </Button>
        )
    }
    const PrevArrow = (props: any) => {
        return (
            <Button variant="outlined" onClick={props.onClick}
                sx={{
                    position: 'absolute',
                    right: 0,
                    top: "40%",
                    zIndex: 2,
                    minWidth: 30,
                    width: 35
                }}
            >
                <ChevronRight />
            </Button>
        )
    }


    var settings: Settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />
    };

    return (
        <Box
            sx={{
                margin: "0 50px",
                ".abc": {
                    padding: "0 10px"
                },
                "h3": {
                    border: "1px solid #ccc",
                    padding: "20px",
                    height: "200px"
                }
            }}
        >
            <h2>Multiple tracks</h2>
            <Slider {...settings}>
                <div className="abc">
                    <h3>Track 1</h3>
                </div>
                <div className="abc">
                    <h3>Track 2</h3>
                </div>
                <div className="abc">
                    <h3>Track 3</h3>
                </div>
                <div className="abc">
                    <h3>Track 4</h3>
                </div>
                <div className="abc">
                    <h3>Track 5</h3>
                </div>
                <div className="abc">
                    <h3>Track 6</h3>
                </div>
            </Slider>
            <Divider />
        </Box>
    );
}

export default MainSlider;