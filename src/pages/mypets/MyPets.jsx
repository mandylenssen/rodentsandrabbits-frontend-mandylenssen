import './MyPets.css'
import {NavLink, useNavigate} from "react-router-dom";
import Button from "../../components/button/Button.jsx";
import {useEffect, useState} from "react";
import PetCard from "../../components/petcard/PetCard.jsx";
import {useFetchPets} from "../../hooks/useFetchPets.jsx";


function MyPets() {


    const jwtToken = localStorage.getItem('token');
    const [updateTrigger, setUpdateTrigger] = useState(0);
    const { pets, loading, error } = useFetchPets(jwtToken, updateTrigger);
    const navigate = useNavigate();

    const navigateToPetDetails = (petId) => {
        navigate(`/petdetails/${petId}`);
    };


    return (
        <>
            <section className="mypets-outer-container outer-container">
                <div className="inner-container">
                    {loading ? (<p>Loading...</p>) : pets.length === 0 ? (

                        <div>
                            <h3>You haven't registered a pet yet</h3>

                            <NavLink to="/registerpet">
                                <Button type="button" color="secondary">Register Pet</Button>
                            </NavLink></div>
                    ) : error ? (

                            <p className="error-message">{error}</p>

                        ) : (

                        <div>
                            <h3>My Pets</h3>
                            <div className="mypets-gallery">
                                {pets.map((pet, index) => (
                                    <div key={index} onClick={() => navigateToPetDetails(pet.id)} style={{cursor: 'pointer'}}>
                                        <img src={`http://localhost:8080/pets/${pet.id}/profileImage`} alt={pet.name}/>
                                    </div>
                                ))}
                                <NavLink to="/registerpet">
                                    <Button type="button" color="quaternary">Register new Pet</Button>
                                </NavLink>
                                <NavLink to="/logbook">
                                    <Button type="button" color="secondary">logbook</Button>
                                </NavLink>
                            </div>
                            {pets.map((pet, index) => (
                                <PetCard key={index} pet={pet} updateTrigger={setUpdateTrigger} />
                            ))}

                        </div>

                    )}
                </div>
            </section>
        </>
    );
}

export default MyPets;
