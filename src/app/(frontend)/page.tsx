import {readJulegaver} from "./actions";
import {GiftCard, NewGiftForm} from "@/components/GiftForm";

export default async function HomePage() {
    const julegaver = await readJulegaver();

    return (
        <main>
            <h1>Julegave-lista 2026</h1>
            <NewGiftForm/>
            <hr/>
            <section className="julegaver">
                {
                    julegaver.length === 0 ? (
                        <p>Nissen har nok ikke vært her ennå</p>
                    ) : (
                        <section className="julegave-grid">
                            {julegaver.map(gave => (
                                <GiftCard key={gave.id} julegave={gave}/>
                            ))}
                        </section>
                    )
                }
            </section>
        </main>
    )
}
