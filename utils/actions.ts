"use server";

import db from "@/utils/db";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { productSchema, validateWithZodSchema } from "./schemas";

const getAuthUser = async () => {
    const user = await currentUser();
    if (!user) redirect("/");
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
        const validatedFields = validateWithZodSchema(productSchema, rawData);

        await db.product.create({
            data: {
                ...validatedFields,
                image: "/images/product2.jpg",
                clerkId: user.id,
            },
        });
        // await db.product.create({
        //     data: {
        //         name,
        //         company,
        //         price,
        //         image: "/images/product1.jpg",
        //         description,
        //         featured,
        //         clerkId: user.id,
        //     },
        // });

        return { message: "product created" };
    } catch (error) {
        return renderError(error);
    }
};
