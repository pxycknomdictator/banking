"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Cropper, { type Area, type Point } from "react-easy-crop";
import { Camera, Check, Loader2, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { createCroppedImage, fileToDataUrl } from "@/lib/utils";

const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

type ProfileImageProps = {
    name: string;
    image: string | null | undefined;
};

export function ProfileImage({ name, image }: ProfileImageProps) {
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState(image ?? "");
    const [cropSource, setCropSource] = useState("");
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(
        null
    );
    const [isSaving, setIsSaving] = useState(false);
    const initials = name
        .trim()
        .split(/\s+/)
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    function resetCrop() {
        setCropSource("");
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setRotation(0);
        setCroppedAreaPixels(null);
    }

    async function handleImageChange(
        event: React.ChangeEvent<HTMLInputElement>
    ) {
        const file = event.target.files?.[0];
        event.target.value = "";
        if (!file) return;
        if (!ACCEPTED_TYPES.includes(file.type)) {
            toast.error("Choose a JPEG, PNG, WebP, or GIF image.");
            return;
        }
        if (file.size > MAX_FILE_SIZE) {
            toast.error("Profile images must be 2 MB or smaller.");
            return;
        }

        try {
            setCropSource(await fileToDataUrl(file));
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "The selected image could not be read."
            );
        }
    }

    async function saveCroppedImage() {
        if (!croppedAreaPixels) {
            toast.error("Move the image into the square crop area first.");
            return;
        }

        setIsSaving(true);
        try {
            const croppedImage = await createCroppedImage(
                cropSource,
                croppedAreaPixels,
                rotation
            );
            const { error } = await authClient.updateUser({
                image: croppedImage
            });
            if (error) {
                toast.error(
                    error.message || "Could not update your profile image."
                );
                return;
            }

            setPreview(croppedImage);
            resetCrop();
            toast.success("Profile image updated.");
            router.refresh();
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Could not update your profile image."
            );
        } finally {
            setIsSaving(false);
        }
    }

    async function deleteProfileImage() {
        setIsSaving(true);
        try {
            const { error } = await authClient.updateUser({ image: null });
            if (error) {
                toast.error(
                    error.message || "Could not delete your profile image."
                );
                return;
            }

            setPreview("");
            resetCrop();
            toast.success("Profile image deleted.");
            router.refresh();
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Could not delete your profile image."
            );
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <div className="space-y-5">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 relative">
                    <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted text-xl font-medium text-muted-foreground">
                        {preview ? (
                            <Image
                                src={preview}
                                alt={`${name}'s profile image`}
                                width={80}
                                height={80}
                                unoptimized
                                className="size-full object-cover"
                            />
                        ) : (
                            initials || "?"
                        )}
                    </div>
                    {preview && (
                        <Button
                            type="button"
                            variant="secondary"
                            size="icon"
                            onClick={deleteProfileImage}
                            disabled={isSaving}
                            aria-label="Delete profile image"
                            title="Delete profile image"
                            className="cursor-pointer rounded-full disabled:cursor-not-allowed disabled:opacity-45 absolute -top-2 -right-2"
                        >
                            {isSaving ? (
                                <Loader2 className="animate-spin size-4" />
                            ) : (
                                <Trash2 className="size-4 text-destructive" />
                            )}
                        </Button>
                    )}
                </div>
                <div>
                    <p className="font-medium">Profile image</p>
                    <p className="text-sm text-muted-foreground">
                        JPEG, PNG, WebP, or GIF up to 2 MB
                    </p>
                </div>
            </div>

            {cropSource ? (
                <div className="space-y-4 rounded-lg border bg-card p-4">
                    <div>
                        <p className="font-medium">Preview and crop</p>
                        <p className="text-sm text-muted-foreground">
                            Drag the image and use the sliders to frame and
                            rotate your avatar.
                        </p>
                    </div>
                    <div className="relative mx-auto size-70 overflow-hidden rounded-lg bg-black">
                        <Cropper
                            image={cropSource}
                            crop={crop}
                            zoom={zoom}
                            rotation={rotation}
                            aspect={1}
                            cropShape="rect"
                            showGrid
                            objectFit="contain"
                            onCropChange={setCrop}
                            onCropComplete={(_, croppedPixels) =>
                                setCroppedAreaPixels(croppedPixels)
                            }
                            onZoomChange={setZoom}
                        />
                    </div>
                    <div className="space-y-2">
                        <label
                            htmlFor="profile-image-zoom"
                            className="text-sm font-medium"
                        >
                            Zoom
                        </label>
                        <input
                            id="profile-image-zoom"
                            type="range"
                            min={1}
                            max={3}
                            step={0.01}
                            value={zoom}
                            onChange={(event) =>
                                setZoom(Number(event.target.value))
                            }
                            className="w-full accent-primary"
                        />
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label
                                htmlFor="profile-image-rotation"
                                className="text-sm font-medium"
                            >
                                Rotation
                            </label>
                            <span className="text-sm text-muted-foreground">
                                {rotation}°
                            </span>
                        </div>
                        <input
                            id="profile-image-rotation"
                            type="range"
                            min={-180}
                            max={180}
                            step={1}
                            value={rotation}
                            onChange={(event) =>
                                setRotation(Number(event.target.value))
                            }
                            disabled={isSaving}
                            className="w-full accent-primary disabled:opacity-45"
                        />
                    </div>
                    <div className="md:flex md:justify-end">
                        <div className="grid grid-cols-2 md:flex gap-x-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={resetCrop}
                                disabled={isSaving}
                                className="py-7 px-6 font-semibold gap-x-2 cursor-pointer disabled:cursor-not-allowed disabled:opacity-45"
                            >
                                <X />
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                onClick={saveCroppedImage}
                                disabled={isSaving}
                                className="py-7 px-6 font-semibold gap-x-2 cursor-pointer disabled:cursor-not-allowed disabled:opacity-45"
                            >
                                {isSaving ? (
                                    <Loader2 className="animate-spin" />
                                ) : (
                                    <Check />
                                )}
                                {isSaving ? "Saving..." : "Save image"}
                            </Button>
                        </div>
                    </div>
                </div>
            ) : (
                <div>
                    <input
                        ref={inputRef}
                        type="file"
                        accept={ACCEPTED_TYPES.join(",")}
                        className="sr-only"
                        onChange={handleImageChange}
                        disabled={isSaving}
                    />
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => inputRef.current?.click()}
                        disabled={isSaving}
                        className="py-7 px-6 font-semibold gap-x-2 cursor-pointer disabled:cursor-not-allowed disabled:opacity-45"
                    >
                        <Camera />
                        Change image
                    </Button>
                </div>
            )}
        </div>
    );
}
