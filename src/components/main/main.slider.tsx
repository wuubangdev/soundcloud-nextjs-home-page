"use client"
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { Settings } from "react-slick";
import { Box, Button, Divider } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import Link from "next/link";
import { useTrackContext } from "@/lib/track.wrapper";
import { toSlugify } from "@/utils/api";
import Image from "next/image";

interface IProps {
    title: string;
    data: ITrackTop[];
}

const MainSlider = (props: IProps) => {
    const { data, title } = props;

    const { setCurrentTrack } = useTrackContext() as ITrackContext;


    const NextArrow = (props: any) => {
        return (
            <Button
                color="inherit"
                variant="contained"
                onClick={props.onClick}
                sx={{
                    position: 'absolute',
                    left: 0,
                    top: "25%",
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
            <Button
                color="inherit"
                variant="contained"
                onClick={props.onClick}
                sx={{
                    position: 'absolute',
                    right: 0,
                    top: "25%",
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
        slidesToScroll: 2,
        autoplay: true,
        autoplaySpeed: 3000,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    initialSlide: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };

    return (
        <Box
            sx={{
                margin: "0 50px",
                ".track": {
                    padding: "0 10px",
                },
                "img": {
                    width: "100%",
                    height: "100%",
                },
                "h3": {
                    border: "1px solid #ccc",
                    padding: "20px",
                    height: "200px"
                }
            }}
        >
            <h2>{title}</h2>
            <Slider {...settings}>
                {data && data.map((track) => {
                    return (
                        <div
                            key={track._id}
                            className="track"
                        // style={{ height: "100%" }}

                        >
                            <div
                                style={{
                                    position: "relative",
                                    height: "150px",
                                    width: "100%"
                                }}
                            >
                                <Image
                                    alt="track image"
                                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${track.imgUrl}`}
                                    fill
                                    sizes={"100%"}
                                    style={{
                                        objectFit: 'contain',
                                    }}
                                />
                            </div>
                            <Link
                                style={{
                                    textDecoration: "none",
                                    color: "unset",
                                    cursor: "pointer",
                                }}
                                href={`/track/${toSlugify(track.title)}-${track._id}.html?audio=${track.trackUrl}`}
                            >
                                <h4
                                    style={{
                                        marginBottom: "10px",
                                        textAlign: "center",
                                        color: "black",
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}
                                >{track.title}</h4>
                            </Link>
                            <h4
                                style={{
                                    margin: "10px 0",
                                    textAlign: "center",
                                    color: "rgb(111 109 109)",
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }}
                            >{track.category}</h4>
                        </div>
                    )
                })}
            </Slider>
            <Divider />
        </Box>
    );
}

export default MainSlider;