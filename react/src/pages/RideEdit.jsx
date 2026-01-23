import {useContext, useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router";
import {AppContext} from "../Contexts.js.jsx";

function RideEdit() {
    const {getRides, areas} = useContext(AppContext);
    const {id} = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        category: "",
        description: "",
        area: ""
    });

    const getRide = async () => {
        try {
            const response = await fetch(`http://145.24.237.153:8000/rides/${id}`, {
                headers: {
                    Accept: "application/json"
                }
            });

            const data = await response.json();

            setForm({
                name: data.name ?? "",
                category: data.category ?? "",
                description: data.description ?? "",
                area: data.area?.id ?? ""
            });
        } catch (e) {
            console.log(e.message);
        }
    };

    const handleInputChange = (e) => {
        const {name, value} = e.target;

        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`http://145.24.237.153:8000/rides/${id}`, {
                method: "PUT",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(form)
            });

            await getRides();

            navigate(`/rides/${id}`);
        } catch (e) {
            console.log(e.message);
        }
    };

    useEffect(() => {
        getRide();
    }, [id]);

    return (
        <section className={"flex flex-col text-center py-10"}>
            <h1 className={"text-5xl font-bold"}>Edit {form.name}</h1>
            <p className={"text-xl"}>Made a mistake? Correct it here!</p>

            <form onSubmit={handleSubmit} className={"flex flex-col gap-4 mt-8"}>
                <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleInputChange}
                    placeholder="Attraction name"
                    className={"border rounded px-3 py-2"}
                    required
                />

                <input
                    type="text"
                    name="category"
                    value={form.category}
                    onChange={handleInputChange}
                    placeholder="Category"
                    className={"border rounded px-3 py-2"}
                />

                <textarea
                    name="description"
                    value={form.description}
                    onChange={handleInputChange}
                    placeholder="Description"
                    className={"border rounded px-3 py-2"}
                    rows={5}
                />

                <select
                    name="area"
                    value={form.area}
                    onChange={handleInputChange}
                    className="border rounded px-3 py-2"
                >
                    <option value="">Unknown / No area</option>
                    {areas.map(area => (
                        <option key={area.id} value={area.id}>
                            {area.name}
                        </option>
                    ))}
                </select>

                <button
                    type="submit"
                    className={"bg-(--color-primary) text-white rounded cursor-pointer px-4 py-2 mt-3"}
                >
                    Save
                </button>
            </form>
        </section>
    );
}

export default RideEdit;