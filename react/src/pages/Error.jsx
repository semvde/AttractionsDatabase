import {Link, Outlet} from "react-router";

function Error() {
    return (
        <>
            <nav className={"flex bg-white"}>
                <Link to={"/"} className={"p-5 hover:text-white transition hover:bg-(--color-hover)"}>Home</Link>
                <Link to={"/rides"} className={"p-5 hover:text-white transition hover:bg-(--color-hover)"}>Rides</Link>
                <Link to={"/areas"} className={"p-5 hover:text-white transition hover:bg-(--color-hover)"}>Areas</Link>
            </nav>
            <main>
                <section className={"flex flex-col items-center text-center p-10"}>
                    <h1 className={"text-8xl font-bold"}>404</h1>
                    <p>That's an error! We couldn't find what you where looking for!</p>
                    <img src="https://i.makeagif.com/media/10-31-2015/QODJwq.gif" alt="" className={"rounded-2xl"}/>
                    <Link to={"/"} className={"text-white bg-(--color-primary) rounded px-3 mt-5 py-1.5"}>Back to
                        Home</Link>
                </section>
            </main>
            <footer className={"flex justify-center bg-(--color-text) text-white p-5"}>
                &copy; Copyright 2026 Semmetje
            </footer>
        </>
    );
}

export default Error