import { Button } from "@/components/ui/button";

function HomePage() {
    return (
        <div>
            <h1>HomePage</h1>
            <Button
                variant="outline"
                size="lg"
                className="capitalize bg-yellow-500"
            >
                click me
            </Button>
        </div>
    );
}

export default HomePage;
