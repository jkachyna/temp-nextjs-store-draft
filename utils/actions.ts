import db from "@/utils/db";
import { redirect } from "next/navigation";

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
