import {Link, Outlet} from "react-router";

function Layout() {
    return (
        <>
            <nav className={"flex bg-white"}>
                <Link to={"/"} className={"p-5 hover:text-white transition hover:bg-(--color-hover)"}>Home</Link>
                <Link to={"/rides"} className={"p-5 hover:text-white transition hover:bg-(--color-hover)"}>Rides</Link>
                <Link to={"/areas"} className={"p-5 hover:text-white transition hover:bg-(--color-hover)"}>Areas</Link>
            </nav>
            <main>
                <Outlet/>
            </main>
            <footer className={"flex justify-center bg-(--color-text) text-white p-5"}>
                &copy; Copyright {new Date().getFullYear()} Semmetje
            </footer>
        </>
    );
}

export default Layout