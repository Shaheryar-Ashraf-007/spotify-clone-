import { useSignIn } from "@clerk/clerk-react";
import { Button } from "./ui/button";

const SignInOAuthButtons = () => {
    const { signIn, isLoaded } = useSignIn();

    if (!isLoaded) {
        return null;
    }

    const signInWithGoogle = async () => {
        try {
            await signIn.authenticateWithRedirect({
                strategy: "oauth_google",
                redirectUrl: "/sso-callback",
                redirectUrlComplete: "/auth-callback",
            });
        } catch (error) {
            console.error("Sign-in error:", error);
        }
    };

    return (
        <Button onClick={signInWithGoogle} variant={"secondary"} className='w-full text-white  bg-zinc-800 hover:bg-zinc-800 h-11'>
            <img src='/google.png' alt='Google' className='size-5' />
            Continue with Google
        </Button>
    );
};

export default SignInOAuthButtons;