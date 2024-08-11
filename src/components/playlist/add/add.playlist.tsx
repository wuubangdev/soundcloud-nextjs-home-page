'use client'

import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from 'react';
import Switch from '@mui/material/Switch';
import { sendRequest } from '@/utils/api';
import { useSession } from 'next-auth/react';
import { useToastContext } from '@/lib/toast.info.wrapper';
import { useRouter } from 'next/navigation';


const AddPlayList = () => {
    const { data: session } = useSession();
    const [open, setOpen] = useState(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [playListName, setPlayListName] = useState<string>("");
    const { setCurrentToast, setOpenToast } = useToastContext() as IToastContext;
    const route = useRouter();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setIsError(false);
        setErrorMessage("");
    };

    const handleSubmit = async () => {
        if (playListName === "") {
            setIsError(true);
            setErrorMessage("Play list name must be not empty!");
            return;

        }
        const res = await sendRequest<IBackendRes<IPlayListInfo>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/playlists/empty`,
            method: "POST",
            headers: { 'Authorization': `Bearer ${session?.access_token}` },
            body: { title: playListName, isPublic: true },
        })
        if (res.statusCode === 201) {
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
                messageSnackbar: "Create playlist success",
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
    return (
        <div>
            <Button variant="outlined" startIcon={<AddIcon />} onClick={handleClickOpen}>
                PLAYLIST
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}

            >
                <DialogTitle
                    sx={{
                        paddingY: 2
                    }}
                >
                    Add new playlist:
                </DialogTitle>
                <DialogContent
                    sx={{
                        minWidth: "600px"
                    }}
                >
                    <TextField
                        onChange={(e) => setPlayListName(e.target.value)}
                        error={isError ?? false}
                        helperText={errorMessage}
                        autoFocus
                        required
                        margin="dense"
                        label="Play list name"
                        fullWidth
                        variant="standard"
                    />
                </DialogContent>
                <DialogContent sx={{ paddingY: 0 }}>
                    Public: <Switch defaultChecked />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={() => handleSubmit()}>Submit</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default AddPlayList;