import FormContainer from "@/components/form/FormContainer";
import FormInput from "@/components/form/FormInput";
import PriceInput from "@/components/form/PriceInput";
import ImageInput from "@/components/form/ImageInput";
import { SubmitButton } from "@/components/form/Buttons";
import { createProductAction } from "@/utils/actions";
import { faker } from "@faker-js/faker";
import TextAreaInput from "@/components/form/TextAreaInput";
import CheckboxInput from "@/components/form/CheckboxInput";

// const createProductAction = async (formData: FormData) => {
//     "use server";
//     const name = formData.get("name") as string;
//     console.log(name);
// };

function CreateProductPage() {
    const name = faker.commerce.productName();
    const company = faker.company.name();
    const description = faker.lorem.paragraph({ min: 10, max: 12 });
    const price = faker.number.int({ min: 5, max: 1000 });

    return (
        <section>
            <h1 className="text-2xl mb-8 capitalize">
                <div className="border p-8 rounded">
                    {/* <form action={createProductAction}>
                        <FormInput
                            type="text"
                            name="name"
                            label="product name"
                            defaultValue={name}
                        />
                        <Button type="submit" size="lg">
                            Submit
                        </Button>
                    </form> */}
                    <FormContainer action={createProductAction}>
                        <div className="grid gap-4 md:grid-cols-2 my-4">
                            <FormInput
                                type="text"
                                name="name"
                                label="product name"
                                defaultValue={name}
                            />
                            <FormInput
                                type="text"
                                name="company"
                                label="company"
                                defaultValue={company}
                            />
                            <PriceInput defaultValue={price} />
                            <ImageInput />
                        </div>

                        <TextAreaInput
                            name="description"
                            labelText="product description"
                            defaultValue={description}
                        />
                        <div className="mt-6">
                            <CheckboxInput name="featured" label="featured" />
                        </div>
                        <SubmitButton text="create product" className="mt-8" />
                    </FormContainer>
                </div>
            </h1>
        </section>
    );
}

export default CreateProductPage;
