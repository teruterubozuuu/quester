"use client";
import { supabase } from '@/utils/supabase/client'
import { PixelButton } from '@pxlkit/ui-kit'
import { useRouter } from 'next/navigation';
import React from 'react'

export default function DashboardPage() {
    const router = useRouter();
    const handleSignOut = async() => {
        try{
            const { error } = await supabase.auth.signOut();

            if (error) {
                console.error("Failed to sign out", error);
            }

            router.push("/sign-in");
        } catch (error){
            console.error("Failed to sign out", error);
        }    
    };
    
  return (

    <div>
        DashboardPage
        <PixelButton tone="red" onClick={handleSignOut} className='cursor-pointer'>Sign Out</PixelButton>
    </div>
  )
}
