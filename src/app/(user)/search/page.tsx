
import Container from '@mui/material/Container';
import SearchResult from '@/components/search/search.result';
import { Metadata } from 'next';

export const metadata: Metadata = {
    description: 'Description',
}

const SearchPage = async () => {

    return (
        <Container>
            <SearchResult />
        </Container>
    )
}

export default SearchPage;