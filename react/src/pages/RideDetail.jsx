import {useContext, useEffect, useState} from "react";
import {Link, useNavigate, useParams} from "react-router";
import {AppContext} from "../Contexts.js.jsx";

function RideDetail() {
    const {getRides} = useContext(AppContext);
    const params = useParams();
    const navigate = useNavigate();

    const [ride, setRide] = useState({});

    const getRide = async () => {
        try {
            const response = await fetch(`http://145.24.237.153:8000/rides/${params.id}`, {
                method: "GET",
                headers: {
                    "Accept": "application/json"
                }
            });

            if (!response.ok) {
                navigate("/404", {replace: true});
                return;
            }

            const data = await response.json();
            console.log(data);
            setRide(data);
        } catch (e) {
            console.log(e.message);
        }
    }

    const deleteRide = async () => {
        if (!confirm(`Are you sure you want to delete the attraction ${ride.name}?`)) return;
        try {
            await fetch(`http://145.24.237.153:8000/rides/${params.id}`, {
                method: "DELETE",
                headers: {
                    "Accept": "application/json"
                }
            });

            await getRides();

            navigate('/rides');
        } catch (e) {
            console.log(e.message);
        }
    }

    useEffect(() => {
        getRide();
    }, [params.id]);

    return (
        <>
            <section className={"flex flex-col text-center py-10"}>
                <h1 className={"text-5xl font-bold"}>{ride.name}</h1>
                <p className={"text-xl capitalize"}>{ride.category} in {ride.area?.name || "Unknown"}</p>
            </section>
            <section className={"flex flex-col text-center pb-10"}>
                <p>{ride.description}</p>
                <div className={"flex justify-end gap-3 pt-5"}>
                    <Link to={`/rides/${ride.id}/edit`}
                          className={"text-white bg-(--color-primary) rounded px-3 py-1.5"}>Edit</Link>
                    <button onClick={deleteRide} className={"text-white bg-red-600 rounded cursor-pointer px-3 py-1.5"}>
                        Delete
                    </button>
                </div>
            </section>
        </>
    );
}

export default RideDetail