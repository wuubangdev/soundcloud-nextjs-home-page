'use client'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { useState } from 'react';
import Step1 from '@/components/track/steps/step1';
import Step2 from '@/components/track/steps/step2';
import { AlertColor } from '@mui/material';
import SnackbarProvider from '@/utils/custom.snackbar';


interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

const UploadTab = () => {
    const [value, setValue] = useState(0);
    const [percentCompleted, setPercentCompleted] = useState<number>(0);
    const [trackName, setTrackName] = useState<string>("");
    const [trackNameUrl, setTrackNameUrl] = useState<string>("");

    const [open, setOpen] = useState(false);
    const [messageSnackbar, setMessageSnackbar] = useState<string>("");
    const [severity, setSeverity] = useState<AlertColor | undefined>(undefined);


    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%', border: "1px solid #ccc", mt: 5 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="basic tabs example"
                >
                    <Tab label="Tracks" disabled={value !== 0} />
                    <Tab label="Basic information" disabled={value !== 1} />
                </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
                <Step1
                    setValue={setValue}
                    setTrackName={setTrackName}
                    setPercentCompleted={setPercentCompleted}
                    setTrackNameUrl={setTrackNameUrl}
                />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                <Step2
                    trackName={trackName}
                    percentCompleted={percentCompleted}
                    trackNameUrl={trackNameUrl}
                    setTrackName={setTrackName}
                    setValue={setValue}
                    setMessageSnackbar={setMessageSnackbar}
                    setOpen={setOpen}
                    setSeverity={setSeverity}
                />
            </CustomTabPanel>
            <SnackbarProvider
                messageSnackbar={messageSnackbar}
                open={open}
                setOpen={setOpen}
                severity={severity}
            />
        </Box>
    );
}

export default UploadTab;