'use client'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import FormHelperText from '@mui/material/FormHelperText';
import { Dispatch, SetStateAction } from 'react';

interface IProps {
    isPlaylistError: boolean;
    playListId: string;
    clearForm: () => void;
    setPlayListId: Dispatch<SetStateAction<string>>;
    playLists: IPlayListInfo[] | undefined;
    errorPlaylistMessage: string;
}

const FormSelectPlayList = (props: IProps) => {
    const { isPlaylistError, playListId, setPlayListId, clearForm, playLists, errorPlaylistMessage } = props;
    return (
        <>
            <FormControl fullWidth sx={{ my: 1 }} error={isPlaylistError ?? false}>
                <InputLabel id="playlist-select-label">Playlist</InputLabel>
                <Select
                    labelId="playlist-select-label"
                    id="playlist-select"
                    label="Playlist"
                    value={playListId}
                    onChange={e => {
                        setPlayListId(e.target.value);
                        clearForm();
                    }}
                >
                    {playLists && playLists.map((playList) => {
                        return (
                            <MenuItem key={playList._id} value={playList._id}>{playList.title}</MenuItem>
                        )
                    })}
                </Select>
                {isPlaylistError ? <FormHelperText>{errorPlaylistMessage}</FormHelperText> : ""}
            </FormControl>
        </>
    )
}

export default FormSelectPlayList;