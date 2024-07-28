import AuthSignInPage from "@/components/auth/auth.signin";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

const SignInPage = async () => {
    const session = await getServerSession(authOptions);
    if (session) {
        redirect('/');
    }
    return (
        <AuthSignInPage />
    )
}

export default SignInPage;