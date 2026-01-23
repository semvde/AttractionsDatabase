import {Link} from "react-router";
import {useContext} from "react";
import {AppContext} from "../Contexts.js.jsx";
import Ride from "../components/Ride.jsx";

function Rides() {
    const {rides, page, setPage, pagination} = useContext(AppContext);

    const previousPage = () => {
        if (page > 1) {
            setPage(x => x - 1);
        }
    }

    const nextPage = () => {
        if (page < pagination.totalPages) {
            setPage(x => x + 1);
        }
    }

    return (
        <>
            <section className={"flex flex-col text-center py-10"}>
                <h1 className={"text-5xl font-bold"}>Rides</h1>
                <div className={"grid grid-cols-3 gap-5 mt-5 max-xl:grid-cols-2 max-md:grid-cols-1"}>
                    {
                        rides.map((ride) => <Ride ride={ride} key={ride.id}/>)
                    }
                </div>
            </section>
            <section className={"flex flex-1 justify-between pb-10"}>
                <button onClick={previousPage} disabled={page === 1}
                        className={"text-white bg-(--color-primary) rounded cursor-pointer px-3 py-1.5 disabled:text-(--color-text) disabled:bg-transparent disabled:border disabled:cursor-not-allowed"}>«
                    Previous
                </button>
                <span>Page {page} of {pagination.totalPages}</span>
                <button onClick={nextPage} disabled={page === pagination.totalPages}
                        className={"text-white bg-(--color-primary) rounded cursor-pointer px-3 py-1.5 disabled:text-(--color-text) disabled:bg-transparent disabled:border disabled:cursor-not-allowed"}>Next
                    »
                </button>
            </section>
        </>
    );
}

export default Rides