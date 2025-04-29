import { SignedOut, SignedIn, SignOutButton } from '@clerk/clerk-react';
import { LayoutDashboardIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import SignInAuthButtons from '../SignInAuthButtons'

const Topbar = () => {

    const isAdmin = false
  return (
    <div className='flex items-center justify-between p-4 text-white sticky top-0 bg-zinc-900/75
    backdrop-blur-md z-10'>

        <div className="flex gap-2 items-center text-white">
            Melofy 
        </div>
        <div className="flex items-center gap-4">
            {isAdmin && 
            (
                <Link to={"/admin"}>
                    <LayoutDashboardIcon className='size-4 mr-2'/>
                    Admin Dashboard
                </Link>
            )}

            <SignedIn >
                <SignOutButton />
            </SignedIn>

            <SignedOut>

                <SignInAuthButtons/>

            </SignedOut>
        </div>
    
    </div>

  )
}

export default Topbar