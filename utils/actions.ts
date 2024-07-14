"use server";

import db from "@/utils/db";
import { currentUser, getAuth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { imageSchema, productSchema, validateWithZodSchema } from "./schemas";
import { deleteImage, uploadImage } from "./supabase";
import { revalidatePath } from "next/cache";

const getAuthUser = async () => {
    const user = await currentUser();
    if (!user) redirect("/");
    return user;
};

const getAdminUser = async () => {
    const user = await getAuthUser();

    if (user.id !== process.env.ADMIN_USER_ID) redirect("/");
    return user;
};

const renderError = (error: unknown): { message: string } => {
    console.log(error);
    return {
        message: error instanceof Error ? error.message : "there was an error",
    };
};

// Approach 1 - with async*await, no need to handling a Promise
export const fetchFeaturedProducts = async () => {
    const products = await db.product.findMany({
        where: {
            featured: true,
        },
    });

    return products;
};

// Approach 2 - without async/await, Promise needs to be handled
export const fetchAllProducts = ({ search = "" }: { search: string }) => {
    return db.product.findMany({
        where: {
            OR: [
                { name: { contains: search, mode: "insensitive" } },
                { company: { contains: search, mode: "insensitive" } },
            ],
        },
        orderBy: {
            createdAt: "desc",
        },
    });
};

// Approach 1 - with async*await, no need to handling a Promise
export const fetchSingleProduct = async (productId: string) => {
    const product = await db.product.findUnique({
        where: {
            id: productId,
        },
    });
    if (!product) {
        redirect("/products");
    }

    return product;
};

export const createProductAction = async (
    prevState: any,
    formData: FormData
): Promise<{ message: string }> => {
    const user = await getAuthUser();

    try {
        const rawData = Object.fromEntries(formData);
        const file = formData.get("image") as File;
        const validatedFields = validateWithZodSchema(productSchema, rawData);
        const validatedFile = validateWithZodSchema(imageSchema, {
            image: file,
        });
        const fullPath = await uploadImage(validatedFile.image);

        await db.product.create({
            data: {
                ...validatedFields,
                image: fullPath,
                clerkId: user.id,
            },
        });

        // return {
        //     message: `Product "${validatedFields.name}" has been created`,
        // };
    } catch (error) {
        return renderError(error);
    }
    redirect(`/admin/products`);
};

export const fetchAdminProducts = async () => {
    await getAdminUser();

    const products = await db.product.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });

    return products;
};

export const deleteProductAction = async (prevState: { productId: string }) => {
    const { productId } = prevState;

    await getAdminUser();
    try {
        const product = await db.product.delete({
            where: { id: productId },
        });
        await deleteImage(product.image);
        revalidatePath("/admin/products");
        return { message: "product removed" };
    } catch (error) {
        return renderError(error);
    }
};

export const fetchAdminProductDetails = async (productId: string) => {
    await getAdminUser();
    const product = await db.product.findUnique({ where: { id: productId } });
    if (!product) redirect("/admin/products");

    return product;
};

export const updateProductAction = async (
    prevState: any,
    formData: FormData
) => {
    await getAdminUser();
    const productId = formData.get("id") as string;
    const rawData = Object.fromEntries(formData);
    const validatedFields = validateWithZodSchema(productSchema, rawData);

    try {
        await db.product.update({
            where: { id: productId },
            data: { ...validatedFields },
        });
        revalidatePath(`/admin/products/${productId}/edit`);
        return { message: "Product updated succesfully" };
    } catch (error) {
        return renderError(error);
    }
};

export const updateProductImageAction = async (
    prevState: any,
    formData: FormData
) => {
    // tohle je asi blbe a ma tady byt admin user
    await getAuthUser();

    try {
        const image = formData.get("image") as File;
        const productId = formData.get("id") as string;
        const oldImageUrl = formData.get("url") as string;

        const validatedFile = validateWithZodSchema(imageSchema, { image });
        const fullPath = await uploadImage(validatedFile.image);
        await deleteImage(oldImageUrl);
        await db.product.update({
            where: { id: productId },
            data: { image: fullPath },
        });

        revalidatePath(`/admin/products/${productId}/edit`);
        return { message: "Product Image updated succesfully" };
    } catch (error) {
        renderError(error);
    }

    return { message: "Product Image updated succesfully" };
};
