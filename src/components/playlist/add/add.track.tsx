'use client'
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from 'react';
import { sendRequest } from '@/utils/api';
import { useSession } from 'next-auth/react';
import { SelectChangeEvent } from '@mui/material/Select';
import { useToastContext } from '@/lib/toast.info.wrapper';
import FormSelectPlayList from './add-track/form.select.playlist';
import FormSelectTrack from './add-track/form.select.track';
import { useRouter } from 'next/navigation';

interface IProps {
    playLists: IPlayListInfo[] | undefined;
    listTracks: ITrackTop[] | undefined;
}

const AddTrackToPlayList = (props: IProps) => {
    const { playLists, listTracks } = props;
    const { data: session } = useSession();
    const [open, setOpen] = useState(false);
    const [isPlaylistError, setIsPlaylistError] = useState<boolean>(false);
    const [isPlaylistTrackError, setIsPlaylistTrackError] = useState<boolean>(false);
    const [errorPlaylistMessage, setErrorPlaylistMessage] = useState<string>("");
    const [errorPlaylistTrackMessage, setErrorPlaylistTrackMessage] = useState<string>("");
    const [playListId, setPlayListId] = useState<string>("");
    const [playListTracks, setPlayListTracks] = useState<string[]>([]);
    const { setCurrentToast, setOpenToast } = useToastContext() as IToastContext;
    const route = useRouter();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setPlayListId("");
        setPlayListTracks([]);
        clearForm();
    };

    const clearForm = () => {
        setIsPlaylistError(false);
        setErrorPlaylistMessage("");
        setIsPlaylistTrackError(false);
        setErrorPlaylistTrackMessage("");
    }

    const handleSubmit = async () => {
        if (playListId === "") {
            setIsPlaylistError(true);
            setErrorPlaylistMessage("Play list must be not empty!");
            return;
        }

        if (playListTracks.length === 0) {
            setIsPlaylistTrackError(true);
            setErrorPlaylistTrackMessage("Tracks is must be not empty!");
            return;
        }

        if (!isPlaylistError && !isPlaylistTrackError) {
            const res = await sendRequest<IBackendRes<IPlayListInfo>>({
                url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/playlists`,
                method: "PATCH",
                headers: { 'Authorization': `Bearer ${session?.access_token}` },
                body: {
                    id: playListId,
                    title: covertIdToTitle(playListId, playLists),
                    isPublic: true,
                    tracks: playListTracks,
                },
            })
            if (res.statusCode === 200) {
                await sendRequest<IBackendRes<any>>({
                    url: `/api/revalidate`,
                    method: "POST",
                    queryParams: {
                        tag: "playlist-by-user",
                        secret: "wubangdevRandomString",
                    }
                })
                route.refresh();
                setCurrentToast({
                    messageSnackbar: "Add track success",
                    severity: "success"
                })
                setOpenToast(true);
                handleClose();
            } else {
                setCurrentToast({
                    messageSnackbar: res.message,
                    severity: "error"
                })
                setOpenToast(true);
            }
        }
    }

    const covertIdToTitle = (id: string, arr: any) => {
        if (arr) {
            const item = arr.find((item: any) => (item._id === id))
            return item?.title;
        }
        return "";
    }

    const handleChange = (event: SelectChangeEvent<typeof playListTracks>) => {
        const { target: { value }, } = event;
        setPlayListTracks(typeof value === 'string' ? value.split(',') : value);
        clearForm();
    };

    return (
        <div>
            <Button variant="outlined" startIcon={<AddIcon />} onClick={handleClickOpen}>
                ADD TRACK
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
            >
                <DialogTitle
                    sx={{ paddingY: 2 }}
                >
                    Add tracks to playlist:
                </DialogTitle>
                <DialogContent
                    sx={{ minWidth: "600px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", }}
                >
                    <FormSelectPlayList
                        isPlaylistError={isPlaylistError}
                        playListId={playListId}
                        setPlayListId={setPlayListId}
                        playLists={playLists}
                        clearForm={clearForm}
                        errorPlaylistMessage={errorPlaylistMessage}
                    />
                    {listTracks &&
                        <FormSelectTrack
                            covertIdToTitle={covertIdToTitle}
                            errorPlaylistTrackMessage={errorPlaylistTrackMessage}
                            handleChange={handleChange}
                            isPlaylistTrackError={isPlaylistTrackError}
                            listTracks={listTracks}
                            playListTracks={playListTracks}
                        />
                    }
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={() => handleSubmit()}>Submit</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default AddTrackToPlayList;