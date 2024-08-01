'use client'
import { useDropzone, FileWithPath } from "react-dropzone";
import "./theme.css";
import { Dispatch, SetStateAction, useCallback, useState } from "react";
import InputFileUpload from "@/components/input/input.file.upload";
import { useSession } from "next-auth/react";
import axios from "axios";
import SnackbarProvider from "@/utils/custom.snackbar";
import { Box, CircularProgress } from "@mui/material";

interface IProps {
    setValue: (v: number) => void;
    setPercentCompleted: Dispatch<SetStateAction<number>>;
    setTrackName: Dispatch<SetStateAction<string>>;
    setTrackNameUrl: Dispatch<SetStateAction<string>>;
}

const Step1 = (props: IProps) => {
    const [open, setOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const { data: session } = useSession();
    const onDrop = useCallback(async (acceptedFiles: FileWithPath[]) => {
        if (acceptedFiles && acceptedFiles[0]) {
            props.setValue(1);
            const audio = acceptedFiles[0];
            const formData = new FormData()
            formData.append("fileUpload", audio)
            try {
                const res = await axios.post("http://localhost:8000/api/v1/files/upload",
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${session?.access_token}`,
                            target_type: `tracks`,
                            // delay: 2000
                        },
                        onUploadProgress: progressEvent => {
                            //@ts-ignore
                            let percentCompleted = Math.floor((progressEvent.loaded * 100) / progressEvent.total);
                            props.setTrackName(acceptedFiles[0].name);
                            props.setPercentCompleted(percentCompleted);
                        }
                    }
                )
                props.setTrackNameUrl(res.data.data.fileName);
            } catch (error) {
                //@ts-ignore
                setOpen(true);
                //@ts-ignore
                setErrorMessage(error?.response?.data?.message)
            }
        }
    }, [session])



    const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            'audio/mpeg': [".mp3"],
            'audio/wav': [".wav"]
        }
    });

    const files = acceptedFiles.map((file: FileWithPath) => (
        <li key={file.path}>
            {file.path} - {file.size} bytes
        </li>
    ));



    return (
        <>
            <section className="container" >
                {session ?
                    <>
                        <div {...getRootProps({ className: 'dropzone' })}>
                            <input {...getInputProps()} />
                            <InputFileUpload
                                isHandle={false}
                            />
                            <p>Drag/drop or click to select files</p>
                        </div>
                        <aside>
                            <h4>Files</h4>
                            <ul>{files}</ul>
                        </aside>
                    </> :
                    <Box sx={{ display: 'flex', justifyContent: "center" }}>
                        <CircularProgress />
                    </Box>
                }
            </section>
            <SnackbarProvider
                messageSnackbar={errorMessage}
                open={open}
                setOpen={setOpen}
                severity={"error"}
            />
        </>
    );
}


export default Step1;