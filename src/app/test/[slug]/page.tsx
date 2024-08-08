import { Container } from "@mui/material"

export async function generateStaticParams() {

    return [
        { slug: "1" },
        { slug: "2" },
        { slug: "3" },
    ]
}
const TestSlug = (params: any) => {
    const slug = params.slug;
    return (
        <Container
            sx={{
                mt: 5
            }}
        >
            Slug is : {slug}
        </Container>
    )
}

export default TestSlug;