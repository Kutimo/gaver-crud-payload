import { CollectionConfig } from "payload";

export const Julegaver: CollectionConfig = {
    slug: "julegaver",
    labels: {
        singular: "Julegave",
        plural: "Julegaver",
    },
    access: {
        create: () => true,
        read: () => true,
        update: () => true,
        delete: () => true,
    },
    fields: [
        {
            name: "betegnelse",
            type: "text",
            label: "Hva er julegaven",
            required: true,
        },
        {
            name: "mottaker",
            type: "text",
            label: "Hvem skal få denne gaven",
            required: true,
        },
        {
            name: "pris",
            type: "number",
            label: "Hva koster gaven",
            defaultValue: 150,
        },
        {
            name: "kjopt",
            type: "checkbox",
            label: "Er gaven kjøpt inn",
            defaultValue: false,
        },
    ],
};