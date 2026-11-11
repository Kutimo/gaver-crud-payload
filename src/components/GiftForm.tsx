"use client"

import {useFormStatus} from "react-dom";
import {Julegaver} from "@/payload-types";

import {
    createJulegave,
    updateJulegave,
    deleteJulegave
} from "@/app/(frontend)/actions";
import {ShoppingStatus} from "@/app/(frontend)/ShoppingStatus";
import {useActionState} from "react";


function SendButton({children, ...props}: React.ComponentProps<"button">) {
    const {pending} = useFormStatus()
    return (
        <button type={"submit"}
                disabled={pending} {...props}> {children} </button>
    )
}

function ErrorMessage({status}: { status: ShoppingStatus }) {
    if (!status || status.ok) return null
    return <p>{status.error}</p>
}

function Fields({julegave}: { julegave?: Julegaver }) {
    return (
        <>
            <label>
                <span>Hva er gaven</span>
                <input type="text" name="navn"
                       defaultValue={julegave?.betegnelse} required/>
            </label>

            <label>
                <span>Hvem er gaven til</span>
                <input type="text" name="mottaker"
                       defaultValue={julegave?.mottaker} required/>
            </label>
            <label>
                <span>Pris</span>
                <input type="number" name="pris" min={0} step="any"
                       defaultValue={julegave ? (julegave.pris ?? "") : 100}/>
            </label>
            <label>
                <span>Kjøpt</span>
                <input type="checkbox" name="kjopt"
                       defaultChecked={julegave?.kjopt ?? false}/>
            </label>
        </>
    )
}

export function NewGiftForm() {
    const [status, action] = useActionState(createJulegave, null)
    return (
        <form action={action}>
            <Fields/>
            <SendButton>Legg til julegave</SendButton>
            <ErrorMessage status={status}/>
        </form>
    )
}

export function GiftCard({julegave}: { julegave: Julegaver }) {
    const [updateStatus, updateGift] = useActionState(updateJulegave.bind(null, julegave.id), null)
    const [deleteStatus, deleteGift] = useActionState(deleteJulegave.bind(null, julegave.id), null)

    return(
        <article>
            <form action={updateGift}>
                <Fields julegave={julegave}/>
                <SendButton>Oppdater julegave</SendButton>
                <ErrorMessage status={updateStatus}/>
            </form>
            <form action={deleteGift}>
                <SendButton title="slett denne gaven">X</SendButton>
                <ErrorMessage status={deleteStatus}/>
            </form>
        </article>
    )
}
