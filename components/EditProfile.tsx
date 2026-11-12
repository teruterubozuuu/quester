"use client";
import { ProfileSchema } from '@/lib/schemas/user.schema';
import { UserProps } from '@/utils/types/profile-page';
import { PixelButton, PixelInput, PixelModal, PixelTextarea, useToast } from '@pxlkit/ui-kit'
import React, { ChangeEvent, SubmitEvent, useState } from 'react'

type ProfileProps = {
    user: UserProps;
}

export default function EditProfile({ user }: ProfileProps) {
    const { toast } = useToast();
    const [open, setOpen] = useState(false);

    const handleEditProfile = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const formData = new FormData(e.currentTarget);
            const displayName = formData.get("displayName") as string;
            const bio = formData.get("bio") as string;

            const result = ProfileSchema.parse({ displayName, bio });

            const res = await fetch("/api/edit-profile", {
                method: "PATCH",
                body: JSON.stringify({
                    displayName: result.displayName,
                    bio: result.bio
                })
            });

            if (!res.ok) {
                throw new Error("Failed to edit quest");
            }

            toast.success("Profile has been updated");
        } catch (error) {
            console.error("Failed to update Profile:", error);
            toast.error("Failed to update profile");
        }
    }

    return (
        <>
            <PixelButton onClick={() => setOpen(true)} tone='cyan' className='cursor-pointer'>Edit Profile</PixelButton>
            <PixelModal open={open} onClose={() => setOpen(false)} title='Edit Profile'>
                <form onSubmit={handleEditProfile} className='space-y-2'>
                    <PixelInput
                        label="Display Name"
                        name="displayName"
                        defaultValue={user.display_name}
                    />

                    <PixelTextarea
                        label="Bio"
                        name="bio"
                        placeholder="YOW WHAT'S UP!!!!!!"
                        defaultValue={user.bio}
                        showCount={{max: 160}}
                        className='min-h-50'
                    />
                    <PixelButton className='w-full' type="submit">Submit</PixelButton>
                </form>
            </PixelModal>
        </>
    )
}
