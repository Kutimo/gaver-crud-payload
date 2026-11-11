"use server";

import config from "@payload-config";
import {revalidatePath} from "next/cache";
import {getPayload, type Payload} from "payload";
import {Julegaver} from "@/payload-types";
import {ShoppingStatus} from "./ShoppingStatus"

type JulegaveData = Pick<Julegaver, "betegnelse" | "mottaker" | "pris" | "kjopt">
type Parsed<T> = { ok: true; data: T } | {
    ok: false;
    error: string
}

function parseJulegaver(formData: FormData): Parsed<JulegaveData> {
    const navn = formData.get("navn")
    const mottaker = formData.get("mottaker")
    const pris = formData.get("pris")

    if (typeof navn !== "string" || !navn.trim()) {
        return {
            ok: false, error: "Gaven må ha et navn"
        }
    }
    if (typeof mottaker !== "string" || !mottaker.trim()) {
        return {
            ok: false, error: "Gaven må ha en mottaker"
        }
    }

    let prisNumber: number | null = null;
    if (typeof pris === "string" && pris.trim() !== "") {
        prisNumber = Number(pris)
        if (!Number.isFinite(prisNumber) || prisNumber < 0) {
            return {
                ok: false,
                error: "Prisen må være et positivt tall."
            }
        }
    }

    return {
        ok: true,
        data: {
            betegnelse: navn.trim(),
            mottaker: mottaker.trim(),
            pris: prisNumber,
            kjopt: formData.get("kjopt") === "on"
        }
    }
}

function isValidId(id: unknown): id is number {
    return typeof id === "number" && Number.isInteger(id) && id > 0;
}

// Fanger feil og oppdaterer siden.
async function utfor(
    error: string,
    handling: (payload: Payload) => Promise<unknown>,
): Promise<ShoppingStatus> {
    const payload = await getPayload({config});

    try {
        await handling(payload);
    } catch (error) {
        payload.logger.error({
            err: error,
            msg: error
        });
        return {
            ok: false,
            error: error instanceof Error ? error.message : String(error)
        };
    }

    revalidatePath("/");
    return {ok: true};
}

export async function createJulegave(_last: ShoppingStatus, formData: FormData): Promise<ShoppingStatus> {
    const parsed = parseJulegaver(formData)
    if (!parsed.ok) return parsed

    return utfor("kunne ikke legge til julegaven", (payload) =>
        payload.create({
            collection: "julegaver",
            data: parsed.data,
            overrideAccess: false,
        }))
}

export async function readJulegaver() {
    const payload = await getPayload({config});

    const queryResult = await payload.find({
        collection: "julegaver",
        sort: "-createdAt",
        limit: 100,
        overrideAccess: false,
    });

    return queryResult.docs;
}

export async function updateJulegave(id: number, _last: ShoppingStatus, formData: FormData): Promise<ShoppingStatus> {
    if (!isValidId(id)) return {ok: false, error: "Ugyldig id"};

    const parsed = parseJulegaver(formData)
    if (!parsed.ok) return parsed

    return utfor("kunne ikke oppdatere julegaven", (payload) =>
        payload.update({
            collection: "julegaver",
            id,
            data: parsed.data,
            overrideAccess: false,
        }))
}

export async function deleteJulegave(id: number, _last: ShoppingStatus, _formData: FormData): Promise<ShoppingStatus> {
    if (!isValidId(id)) return {ok: false, error: "Ugyldig id"};

    return utfor("kunne ikke slette julegaven", (payload) =>
        payload.delete({
            collection: "julegaver",
            id,
            overrideAccess: false,
        }))
}
