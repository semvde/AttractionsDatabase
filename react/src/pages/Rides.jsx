import {Link} from "react-router";
import {useContext} from "react";
import {AppContext} from "../Contexts.js.jsx";
import Ride from "../components/Ride.jsx";

function Rides() {
    const {rides, page, setPage, pagination} = useContext(AppContext);

    const nextPage = () => {
        
    }

    return (
        <>
            <section className={"flex flex-col items-center text-center p-10"}>
                <h1 className={"text-5xl font-bold"}>Rides</h1>
                <div className={"grid grid-cols-3 gap-5 mt-5 max-xl:grid-cols-2 max-md:grid-cols-1"}>
                    {
                        rides.map((ride) => <Ride ride={ride} key={ride.id}/>)
                    }
                </div>
            </section>
            <section className={"flex flex-1 justify-between"}>
                <button>« Previous</button>
                <span>Page {page} of {pagination.totalPages}</span>
                <button onClick={nextPage}>Next »</button>
            </section>
        </>
    );
}

export default Rides