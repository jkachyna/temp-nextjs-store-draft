import { createClient } from "@supabase/supabase-js";

const bucket = "main-bucket";

export const supabase = createClient(
    process.env.SUPABASE_URL as string,
    process.env.SUPABASE_KEY as string
);

export const uploadImage = async (image: File) => {
    const timestamp = Date.now();
    const newFilename = `${timestamp}-${image.name}`;
    const { data } = await supabase.storage
        .from(bucket)
        .upload(newFilename, image, { cacheControl: "3600" });
    if (!data) throw new Error("Image upload faled");

    return supabase.storage.from(bucket).getPublicUrl(newFilename).data
        .publicUrl;
};

export const deleteImage = (url: string) => {
    const imageName = url.split("/").pop();
    if (!imageName) throw new Error(`Invalid url: ${url}`);

    return supabase.storage.from(bucket).remove([imageName]);
};
