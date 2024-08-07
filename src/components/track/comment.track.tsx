
'use client'

import { fetchDefaultImages, sendRequest } from "@/utils/api";
import { Avatar, Box, Divider, Grid, List, ListItem, ListItemAvatar, ListItemText, TextField, Typography } from "@mui/material";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Fragment, useState } from "react";
import SendIcon from '@mui/icons-material/Send';
import { useSession } from "next-auth/react";
import WaveSurfer from "wavesurfer.js";
import { useRouter } from "next/navigation";
import { useHasMounted } from "@/utils/customHook";
import Image from "next/image";
dayjs.extend(relativeTime)

interface IProps {
    comments: IComment[] | undefined;
    track: ITrackTop | undefined;
    wavesurfer: WaveSurfer | null;
}

const CommentTrack = (props: IProps) => {

    const route = useRouter();

    const isHasMounted = useHasMounted();

    const { data: session } = useSession();

    const { track, comments, wavesurfer } = props;

    const [comment, setComment] = useState<string>("");

    const handleSendComment = async () => {
        if (session && track) {
            const commentCreate = await sendRequest<IBackendRes<ICommentCreate>>({
                url: `http://localhost:8000/api/v1/comments`,
                method: "POST",
                headers: { 'Authorization': `Bearer ${session?.access_token}` },
                body: {
                    content: comment ?? "",
                    moment: wavesurfer?.getCurrentTime().toFixed() ?? 0,
                    track: track?._id,
                }
            })
            if (commentCreate.statusCode === 201) {
                route.refresh();
                setComment("");
            }
        }
    }
    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60)
        const secondsRemainder = Math.round(seconds) % 60
        const paddedSeconds = `0${secondsRemainder}`.slice(-2)
        return `${minutes}:${paddedSeconds}`
    }
    const handleJumTrack = (moment: number) => {
        if (wavesurfer) {
            const duration = wavesurfer.getDuration();
            wavesurfer.seekTo(moment / duration);
            wavesurfer.play();
        }
    }
    return (
        <div style={{ marginTop: "20px" }}>
            <Box>
                <div style={{
                    position: 'relative'
                }}>
                    <TextField
                        value={comment}
                        label="Comments"
                        fullWidth
                        variant="standard"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSendComment()
                            }
                        }}
                        onChange={(e) => { setComment(e.target.value) }}
                    />
                    <div style={{
                        position: 'absolute',
                        right: 0,
                        zIndex: 1,
                        cursor: 'pointer',
                        bottom: 0,
                    }}>
                        <SendIcon
                            sx={{ ":hover": { opacity: 0.5 } }}
                            onClick={() => handleSendComment()}
                        />
                    </div>
                </div>

                <Box
                    sx={{
                        mt: "1px"
                    }}
                >
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={3} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                            <Image
                                src={fetchDefaultImages(track?.uploader.type)}
                                alt="avatar comment"
                                width={150}
                                height={150}
                            />
                            <Typography>{track?.uploader.email}</Typography>
                        </Grid>
                        <Grid item xs={12} md={9}>
                            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                                {comments && comments.map((comment) => {
                                    return (
                                        <Fragment key={`${comment._id}`}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <ListItem
                                                    alignItems="flex-start"
                                                    sx={{
                                                        '.time-current': {
                                                            '.moment': {
                                                                ":hover": {
                                                                    cursor: 'pointer',
                                                                    color: 'black'
                                                                }
                                                            }
                                                        },
                                                        cursor: 'default'
                                                    }}
                                                >
                                                    <ListItemAvatar>
                                                        <Avatar src={fetchDefaultImages(comment.user?.type)} />
                                                    </ListItemAvatar>
                                                    <ListItemText
                                                        primary={comment.content}
                                                        secondary={
                                                            <>
                                                                <Typography
                                                                    sx={{ display: 'inline' }}
                                                                    component="span"
                                                                    variant="body2"
                                                                    color="#0F78FF"
                                                                >
                                                                    {comment.user?.email}
                                                                </Typography>
                                                                <Typography
                                                                    className="time-current"
                                                                    sx={{ display: 'inline' }}
                                                                    component="span"
                                                                    variant="body2"
                                                                    color="GrayText"
                                                                    alignItems={'center'}
                                                                    marginLeft={'4px'}
                                                                >
                                                                    <span
                                                                        className="moment"
                                                                        onClick={() => handleJumTrack(comment.moment)}
                                                                    >{`at ${formatTime(comment.moment)}`}</span>
                                                                </Typography>

                                                            </>
                                                        }
                                                    />
                                                </ListItem>
                                                <div style={{ display: 'flex', justifyContent: 'end', alignItems: 'center', minWidth: "300px", color: 'rgba(0,0,0,0.5)' }}>
                                                    <Typography sx={{ fontSize: "14px" }}>{isHasMounted && dayjs(comment.createdAt).fromNow()}</Typography>
                                                </div>
                                            </div>
                                            <Divider variant="inset" component="li" />
                                        </Fragment>
                                    )
                                })}
                            </List>
                        </Grid>
                    </Grid>
                </Box>
            </Box>

        </div>
    )
}


export default CommentTrack;