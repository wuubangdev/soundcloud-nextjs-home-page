'use client'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import FormHelperText from '@mui/material/FormHelperText';
import { Box, Chip, OutlinedInput } from '@mui/material';
import { Theme, useTheme } from '@mui/material/styles';

function getStyles(track: string, playListTracks: readonly string[], theme: Theme) {
    return {
        fontWeight:
            playListTracks.indexOf(track) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}

interface IProps {
    isPlaylistTrackError: boolean;
    playListTracks: string[];
    handleChange: (event: SelectChangeEvent<string[]>) => void
    covertIdToTitle: (id: string, arr: any) => any;
    listTracks: ITrackTop[];
    errorPlaylistTrackMessage: string;
}

const FormSelectTrack = (props: IProps) => {
    const { isPlaylistTrackError, playListTracks, handleChange, covertIdToTitle, listTracks, errorPlaylistTrackMessage } = props;
    const theme = useTheme();
    return (
        <>
            <FormControl fullWidth sx={{ my: 1 }} error={isPlaylistTrackError ?? false}>
                <InputLabel id="choose-tracks-chip-label" sx={{ backgroundColor: "white", paddingX: "4px" }}>Choose tracks</InputLabel>
                <Select
                    labelId="choose-tracks-chip-label"
                    id="choose-tracks-chip"
                    multiple
                    value={playListTracks}
                    onChange={handleChange}
                    input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                    renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((value) => {
                                return (<Chip key={value} label={covertIdToTitle(value, listTracks)} />)
                            }
                            )}
                        </Box>
                    )}
                >
                    {listTracks.map((track) => (
                        <MenuItem
                            key={track._id}
                            value={track._id}
                            style={getStyles(track.title, listTracks?.map(t => t.title), theme)}
                        >
                            {track.title}
                        </MenuItem>
                    ))}
                </Select>
                {isPlaylistTrackError ? <FormHelperText>{errorPlaylistTrackMessage}</FormHelperText> : ""}
            </FormControl>
        </>
    )
}

export default FormSelectTrack;