import './Bookings.css'
import {Link, useNavigate} from "react-router-dom";
import React, {useContext, useEffect, useState} from "react";
import {AuthContext} from "../../context/AuthContext.jsx";
import {Controller, useForm} from "react-hook-form";
import Button from "../../components/button/Button.jsx";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {useFetchPets} from "../../hooks/useFetchPets.jsx";
import axios from "axios";
import makeAnimated from "react-select/animated";
import Select from "react-select";
import mice from "../../assets/mice-photo-booking.png";

function Bookings() {

    const {
        handleSubmit,
        control,
        formState: {errors},
        register,
        watch,
    } = useForm({mode: 'onBlur'});

    const {isAuth} = useContext(AuthContext);
    const jwtToken = localStorage.getItem('token');
    const navigate = useNavigate();
    const [unavailableDates, setUnavailableDates] = useState([]);
    const {pets, loading, error} = useFetchPets(jwtToken);
    const [bookingError, setBookingError] = useState('');

    useEffect(() => {
        const fetchUnavailableDates = async () => {
            try {
                const response = await axios.get('http://localhost:8080/bookings/unavailable-dates', {
                    headers: {
                        'Authorization': `Bearer ${jwtToken}`
                    }
                });
                setUnavailableDates(response.data.map(dateStr => new Date(dateStr)));
            } catch (error) {
                console.error('Error fetching unavailable dates:', error);
            }
        };

        if (isAuth) {
            fetchUnavailableDates();
        }
    }, [isAuth, jwtToken]);

    const petOptions = pets.map(pet => ({value: pet.id, label: pet.name}));

    async function handleFormSubmit(data) {
        try {
            await axios.post('http://localhost:8080/bookings', {
                startDate: data.dateRange[0],
                endDate: data.dateRange[1],
                additionalInfo: data.info,
                petIds: data.petIDs
            }, {
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                    'Content-Type': 'application/json'
                }
            });
            navigate('/successfullbooking');
            console.log(data)
        } catch (error) {
            console.error('Booking error:', error);
            setBookingError('Failed to make the booking. Please try again later.');
        }
    }

    const animatedComponents = makeAnimated();


    return (
        <>

            <div className="outer-bookings-container outer-container">
                <div className="booking-inner-container">

                    <div className="booking-content-container">
                        <div className="booking-input-fields-container">
                            <form onSubmit={handleSubmit(handleFormSubmit)}>
                                <h3>Bookings</h3>
                                <p>Making a reservation at Rodents & Rabbits is a breeze! Ensure a cozy retreat for your
                                    furry friends by securing their spot with us. Simply follow our user-friendly
                                    reservation process,
                                    where you can choose dates, customize their stay, and agree to our pet-loving terms
                                    and conditions. Your
                                    pets are in good hands at Rodents & Rabbits—where comfort meets care.</p>
                                <div className="form-squiggle-image"></div>

                                <label htmlFor="choose-pet">
                                    <p>Pet</p>
                                </label>
 <Controller
                                    name="petIDs"
                                    control={control}
                                    render={({field}) => (
                                        <Select
                                            {...field}
                                            closeMenuOnSelect={false}
                                            components={animatedComponents}
                                            isMulti
                                            options={petOptions}
                                            onChange={(val) => field.onChange(val.map(item => item.value))}
                                            value={petOptions.filter(option => field.value ? field.value.includes(option.value) : false)}
                                            styles={{
                                                control: (base) => ({
                                                    ...base,
                                                    backgroundColor: 'var(--color-light-yellow)',
                                                    color: 'var(--color-green)',
                                                    borderRadius: '20px',
                                                    padding: '8px',
                                                    transition: 'all 0.2s ease',
                                                }),
                                                menu: (base) => ({
                                                    ...base,
                                                    boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                                                }),
                                                option: (base, state) => ({
                                                    ...base,
                                                    backgroundColor: state.isFocused ? 'var(--color-purple)' : 'var(--color-white)',
                                                    color: state.isSelected ? 'var(--color-purple)' : 'var(--color-green)',
                                                    padding: '10px 20px',
                                                    transition: 'background-color 0.2s ease',
                                                }),
                                                multiValue: (base) => ({
                                                    ...base,
                                                    backgroundColor: 'var(--color-purple)',
                                                }),
                                                multiValueLabel: (base) => ({
                                                    ...base,
                                                    color: 'var(--color-white)',
                                                }),
                                                multiValueRemove: (base) => ({
                                                    ...base,
                                                    ':hover': {
                                                        backgroundColor: 'var(--color-secondary)',
                                                        color: 'white',
                                                    }
                                                }),

                                            }}
                                        />
                                    )}
                                />


                                <p>can't find your pet? please register your pet <Link to="/registerpet">here</Link></p>


                                <label htmlFor="choose-date">
                                    <p>date</p></label>
                                <Controller
                                    control={control}
                                    name="dateRange"
                                    rules={{required: "Date range is required"}}
                                    render={({field}) => (
                                        <DatePicker
                                            selectsRange
                                            startDate={field.value?.[0]}
                                            endDate={field.value?.[1]}
                                            onChange={(date) => field.onChange(date)}
                                            dateFormat="MM/dd/yyyy"
                                            excludeDates={unavailableDates}
                                        />
                                    )}
                                />
                                {errors.dateRange && <p className="error-text">{errors.dateRange.message}</p>}


                                <label htmlFor="info-field">
                                    <p>additional information</p>
                                    <textarea
                                        id="info-field"
                                        rows="4"
                                        cols="40"
                                        {...register("info")}>
                        </textarea>
                                </label>

                                <Button type="submit" color="quaternary">book</Button>

                                <p>By completing this reservation, you acknowledge
                                    and agree to abide by our terms and conditions.
                                </p>
                            </form>
                        </div>

                    </div>
                </div>

            </div>
        </>
    )
}

export default Bookings;
