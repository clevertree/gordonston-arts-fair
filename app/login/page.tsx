import LoginForm from "@components/SessionForms/LoginForm";
import {Stack} from "@mui/material";
import Link from "next/link";
import {loginAction} from "@util/sessionActions";

export const metadata = {
    title: 'Artist Login',
}

export default async function ArtistLogin() {
    // const session = await validateSession()

    return (
        <>
            <h2 className='m-auto text-[color:var(--gold-color)] italic'>Artist Login</h2>

            <LoginForm loginAction={loginAction}/>

            <Stack sx={{margin: 'auto'}} direction='column'>
                <Link href='/register'>Click here to register as an Artist</Link>
                <Link href='/password'>Click here to reset your password</Link>
            </Stack>
        </>
    );
}


