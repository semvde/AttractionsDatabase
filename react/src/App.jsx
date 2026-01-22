import {createBrowserRouter, RouterProvider} from "react-router";
import Layout from "./Layout.jsx";
import Error from "./pages/Error.jsx";
import Home from "./pages/Home.jsx";
import Rides from "./pages/Rides.jsx";
import {AppContext} from "./Contexts.js.jsx";
import {useEffect, useState} from "react";

const router = createBrowserRouter([
    {
        element: <Layout/>,
        errorElement: <Error/>,
        children: [
            {
                path: "/",
                element: <Home/>,
            },
            {
                path: "/rides",
                element: <Rides/>,
            }
        ],
    },
]);

function App() {
    const [rides, setRides] = useState([]);

    const [pagination, setPagination] = useState([]);
    const [page, setPage] = useState(1);

    const getRides = async () => {
        try {
            const response = await fetch(`http://145.24.237.153:8000/rides?limit=6&page=${page}`, {
                method: "GET",
                headers: {
                    "Accept": "application/json"
                }
            });

            const data = await response.json();
            console.log(data.items);
            setRides(data.items);
            setPagination(data.pagination);
        } catch (e) {
            console.log(e.message);
        }
    }

    useEffect(() => {
        getRides();
    }, []);

    return (
        <AppContext value={{rides, setRides, page, setPage, pagination, setPagination}}>
            <RouterProvider router={router}/>
        </AppContext>
    );
}

export default App
