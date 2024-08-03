import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Dispatch, SetStateAction, useState } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { Alert, Snackbar } from '@mui/material';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

interface IProps {
    isHandle?: boolean;
    setImageUrl?: Dispatch<SetStateAction<string>>;
    setImageFile?: Dispatch<SetStateAction<string>>;
}

const InputFileUpload = (props: IProps) => {
    const { isHandle, setImageUrl, setImageFile } = props;
    const { data: session } = useSession();

    const [open, setOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>("");

    const handleUploadImage = async (image: any) => {
        if (image) {
            const formData = new FormData()
            formData.append("fileUpload", image)
            try {
                const res = await axios.post("http://localhost:8000/api/v1/files/upload",
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${session?.access_token}`,
                            target_type: `images`,
                            delay: 2000
                        },
                    }
                )
                if (res.data.data.fileName && setImageUrl) {
                    setImageUrl(res.data.data.fileName);
                    setImageFile && setImageFile(image);
                }
            } catch (error) {
                //@ts-ignore
                setOpen(true);
                //@ts-ignore
                setErrorMessage(error?.response?.data?.message)
            }
        }
    }
    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };
    return (
        <>
            <Button
                onClick={(e) => {
                    !isHandle && e.preventDefault()
                }}
                onChange={(e) => {
                    !isHandle && e.preventDefault();
                    const event = e.target as HTMLInputElement;
                    if (event.files) {
                        handleUploadImage(event.files[0]);
                    }
                }}
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
            >
                Upload file
                <VisuallyHiddenInput
                    type="file"
                    accept='image/*'
                />
            </Button>
            <Snackbar
                open={open}
                autoHideDuration={3000}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleClose}
                    severity="error"
                    // variant="filled"
                    sx={{ width: '100%' }}
                >
                    {errorMessage}
                </Alert>
            </Snackbar>
        </>
    );
}

export default InputFileUpload;