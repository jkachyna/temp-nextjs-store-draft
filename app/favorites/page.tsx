import SectionTitle from "@/components/global/SectionTitle";
import ProductsGrid from "@/components/products/ProductsGrid";
import { fetchUserFavorites } from "@/utils/actions";
import React from "react";

async function FavouritesPage() {
    const favorites = await fetchUserFavorites();
    if (favorites.length === 0)
        return <SectionTitle text="you have no favorites yet" />;
    return (
        <div>
            <SectionTitle text="favorites" />
            <ProductsGrid
                products={favorites.map((favorite) => favorite.product)}
            />
        </div>
    );
}

export default FavouritesPage;
