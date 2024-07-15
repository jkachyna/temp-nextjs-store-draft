"use client";

import { useToast } from "../ui/use-toast";
import { SignOutButton } from "@clerk/nextjs";
import Link from "next/link";

function SignOutLink() {
    const { toast } = useToast();
    const handleLogout = () => {
        toast({
            description: "Logout Succesfull",
        });
    };

    return (
        <SignOutButton>
            <Link href="/" className="w-full text-left" onClick={handleLogout}>
                Logout
            </Link>
        </SignOutButton>
    );
}

export default SignOutLink;
