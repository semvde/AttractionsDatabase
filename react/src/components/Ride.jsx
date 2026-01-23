import {Link} from "react-router";

function Ride({ride}) {
    return (
        <Link to={`/rides/${ride.id}`}>
            <article className={"bg-white shadow rounded p-5 duration-250 hover:scale-105"}>
                <h2 className={"text-3xl truncate"}>{ride.name}</h2>
                <p><span className={"capitalize"}>{ride.category}</span></p>
                <p><i className={"fa-solid fa-location-dot"}></i> {ride.area.name}</p>
            </article>
        </Link>
    );
}

export default Ride