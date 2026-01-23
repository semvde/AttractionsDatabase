import {Link} from "react-router";

function Home() {
    return (
        <>
            <section className={"flex flex-col justify-center items-center text-center h-125 p-10"}>
                <h1 className={"text-5xl font-bold"}>All theme park attractions, one place!</h1>
                <p className={"text-3xl"}>Find information on attractions from all around the world!</p>
                <p className={"text-[10px] italic mt-1"}>(Only a few Efteling attractions right now)</p>
                <div className={"flex gap-5 mt-5"}>
                    <Link to={"/rides"} className={"text-white bg-(--color-primary) rounded px-3 py-1.5"}>Find a
                        ride</Link>
                    <Link to={"/areas"} className={"text-white bg-(--color-secondary) rounded px-3 py-1.5"}>Explore
                        areas</Link>
                </div>
            </section>
            <section>
                <h2 className={"text-3xl"}></h2>
            </section>
        </>
    );
}

export default Home