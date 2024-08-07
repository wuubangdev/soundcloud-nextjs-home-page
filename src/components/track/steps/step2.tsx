import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Dispatch, SetStateAction, useState } from 'react';
import { AlertColor, Button, Grid } from '@mui/material';
import TextField from '@mui/material/TextField';
import InputFileUpload from '@/components/input/input.file.upload';
import { useSession } from 'next-auth/react';
import { sendRequest } from '@/utils/api';
import Image from 'next/image';

const LinearProgressWithLabel = (props: LinearProgressProps & { value: number }) => {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: '100%', mr: 1 }}>
                <LinearProgress variant="determinate" {...props} />
            </Box>
            <Box sx={{ minWidth: 35 }}>
                <Typography variant="body2" color="text.secondary">
                    {`${Math.round(props.value)}%`}
                </Typography>
            </Box>
        </Box>
    );
}

interface IProps {
    percentCompleted: number;
    trackName: string;
    trackNameUrl: string;
    setValue: Dispatch<SetStateAction<number>>;
    setTrackName: Dispatch<SetStateAction<string>>;
    setOpen: Dispatch<SetStateAction<boolean>>;
    setSeverity: Dispatch<SetStateAction<AlertColor | undefined>>;
    setMessageSnackbar: Dispatch<SetStateAction<string>>
}

const Step2 = (props: IProps) => {

    const { percentCompleted, trackName, trackNameUrl,
        setValue, setTrackName, setSeverity, setMessageSnackbar, setOpen
    } = props;

    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [category, setCategory] = useState<string>("");
    const [imageFile, setImageFile] = useState<string>("");
    const [imageUrl, setImageUrl] = useState<string>("");
    const { data: session } = useSession();



    const [isTitleError, setIsTitleError] = useState<boolean>(false);
    const [isDescriptionError, setIsDescriptionError] = useState<boolean>(false);
    const [isCategoryError, setIsCategoryError] = useState<boolean>(false);

    const [messageTitleError, setMessageTitleError] = useState<string>("");
    const [messageDescriptionError, setMessageDescriptionError] = useState<string>("");
    const [messageCategoryError, setMessageCategoryError] = useState<string>("");

    const handleSubmit = async () => {
        setIsTitleError(false);
        setIsDescriptionError(false);
        setIsCategoryError(false);

        setMessageTitleError("");
        setMessageDescriptionError("");
        setMessageCategoryError("");

        if (!title) {
            setIsTitleError(true);
            setMessageTitleError("Title is not empty");
            return;
        }
        if (!description) {
            setIsDescriptionError(true);
            setMessageDescriptionError("Description is not empty");
            return;
        }
        if (category == "default") {
            setIsCategoryError(true);
            setMessageCategoryError("Choose value difference default value");
            return;
        }

        const res = await sendRequest<IBackendRes<any>>({
            url: "http://localhost:8000/api/v1/tracks",
            method: "POST",
            headers: { 'Authorization': `Bearer ${session?.access_token}`, },
            body: {
                title,
                description,
                category,
                trackUrl: trackNameUrl,
                imgUrl: imageUrl,
            },

        })
        if (res && res.statusCode === 201) {
            setSeverity("success");
            setMessageSnackbar("Create track success!");
            setOpen(true);
            setValue(0);
            setTrackName("");

        } else {
            setSeverity("error");
            setMessageSnackbar(res.message.toString());
            setOpen(true);
        }

    }

    const categories = [
        {
            value: 'default',
            label: 'Please choose category!',
        },
        {
            value: 'CHILL',
            label: 'CHILL',
        },
        {
            value: 'WORKOUT',
            label: 'WORKOUT',
        },
        {
            value: 'PARTY',
            label: 'PARTY',
        },
    ];

    return (
        <Box>
            <Box sx={{ width: '100%' }}>
                <Typography>Your uploading track: {trackName ?? ""}</Typography>
                <LinearProgressWithLabel value={percentCompleted} />
            </Box>
            <Grid container spacing={3} sx={{ marginTop: "20px" }}>
                <Grid
                    item
                    xs={12}
                    sm={4}
                >
                    <Grid
                        container
                        direction="column"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <Image
                            style={{ height: "100%", width: "100%" }}
                            src={imageUrl ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${imageUrl}` : ""}
                            alt="image track upload"
                            width={250}
                            height={250}
                        />
                        <div style={{ padding: "10px" }}>
                            <InputFileUpload
                                isHandle={true}
                                setImageUrl={setImageUrl}
                                setImageFile={setImageFile}
                            />
                        </div>
                    </Grid>
                </Grid>
                <Grid
                    item
                    xs={12}
                    sm={8}
                >
                    <Box>
                        <TextField
                            onChange={(event) => setTitle(event.target.value)}
                            value={title}
                            fullWidth
                            label="Title"
                            name='title'
                            type="search"
                            variant="standard"
                            margin='dense'
                            required
                            error={isTitleError}
                            helperText={messageTitleError}
                        />
                        <TextField
                            onChange={(event) => setDescription(event.target.value)}
                            value={description}
                            fullWidth
                            label="Description"
                            name='description'
                            type="search"
                            variant="standard"
                            margin='dense'
                            required
                            error={isDescriptionError}
                            helperText={messageDescriptionError}
                        />
                        <TextField
                            onChange={(event) => { setCategory(event.target.value) }}
                            select
                            fullWidth
                            label="Category"
                            defaultValue="default"
                            required
                            error={isCategoryError}
                            helperText={messageCategoryError}
                            SelectProps={{
                                native: true,
                            }}
                            sx={{ marginTop: 5 }}
                        >
                            {categories.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </TextField>
                        <div style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}>
                            <Button variant="outlined" onClick={() => handleSubmit()} disabled={imageFile ? false : true}>Save</Button>
                        </div>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    )
}

export default Step2;