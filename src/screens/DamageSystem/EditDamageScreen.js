import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { getDamageByIdAPI, editDamageByIdAPI } from "../../axios/damage";
import { getAllObjectsAPI, getObjectByIdAPI, getObjectAdressesByObjectIdAPI } from "../../axios/object";

import "../../css/general.css";
import "../../css/form.css";

export const EditDamageScreen= ({ isLoggedIn, isAdmin }) => {
    const navigate = useNavigate();
    const { damageId } = useParams();

    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/login");
        }
    }, [isLoggedIn, navigate]);

    useEffect(() => {
        if (!isAdmin) {
            navigate("/");
        }
    }, [isAdmin, navigate]);

    const [page, setPage] = useState(1);
    const [formData, setFormData] = useState({
        title: '',
        object: {
            _id: '',
            objectname: ''
        },
        adress: {
            _id: '',
            adress: ''
        },
        floorOrElevator: '',
        remarks: '',
        damageStatus: ''
    });

    const [objects, setObjects] = useState([]);
    const [objectAdresses, setObjectAdresses] = useState([]);
    const [floors, setFloors] = useState([]);

    useEffect(() => {
        const fetchObjects = async () => {
            try {
                const objectsData = await getAllObjectsAPI();
                setObjects(objectsData.data.data.objects);
            } catch (error) {
                console.error('Failed to fetch objects:', error);
            }
        };
        fetchObjects();
    }, []);

    useEffect(() => {
        const fetchDamageDetails = async () => {
            if (damageId) {
                try {
                    const damageData = await getDamageByIdAPI(damageId);
                    const addressesData = await getObjectAdressesByObjectIdAPI(damageData.data.data.damage.object.id);
                    setObjectAdresses(addressesData.data.data.adresses);
                    const selectedAddress = addressesData.data.data.adresses.filter(adress => adress._id === damageData.data.data.damage.adress.id);
                    setFloors(selectedAddress[0].floors);

                    setFormData(currentFormData => ({
                        ...currentFormData,
                        damageId: damageId,
                        title: damageData.data.data.damage.title,
                        object: {
                            id: damageData.data.data.damage.object.id,
                            objectname: damageData.data.data.damage.object.objectname
                        },
                        adress: {
                            id: damageData.data.data.damage.adress.id,
                            adress: damageData.data.data.damage.adress.adress
                        },
                        floorOrElevator: damageData.data.data.damage.floor,
                        remarks: damageData.data.data.damage.remarks,
                        damageStatus: damageData.data.data.damage.damageStatus,
                    }));
                } catch (error) {
                    console.error('Failed to fetch damage details:', error);
                }
            }
        };
        fetchDamageDetails();
    }, [damageId]);

    const [error, setError] = useState('');

    const nextPage = () => setPage(page + 1);
    const prevPage = () => setPage(page - 1);

    const handleChange = (e) => {
            const { name, value } = e.target;
            setFormData({ ...formData, [name]: value })
    };

    const handleEditDamage = async (e) => {
        e.preventDefault();

        if (formData) {
            if (!formData.title) {
                setError('The title can not be left empty!');
                return;
            }

            if (!formData.remarks) {
                setError('The remarks can not be left empty!');
                return;
            }

            if (!formData.damageStatus) {
                setError('The damage status can not be left empty!');
                return;
            }

            const response = await editDamageByIdAPI(damageId, formData.title, formData.remarks, formData.damageStatus);
            if (response.status === 200) {
                navigate(`/damages/${damageId}`);
            }
        }
    };

    return (
        <>
            <h1>Edit Damage</h1>
            {page === 1 && (
                <form>
                    <h2>Title</h2><br />
                    <input type="text" name="title" placeholder="Title ..." value={formData.title} onChange={handleChange} /><br />
                    <button type="button" onClick={nextPage}>Next</button>
                    {error && (<p>{error}</p>)}
                </form>
            )}
            {page === 2 && (
                <form>
                    <h2>Where are you located?</h2><br />
                    <select
                        name="object"
                        value={JSON.stringify(formData.object)}
                        onChange={ (e) => setFormData({...formData, object: JSON.parse(e.target.value) }) }
                        disabled={true}
                    >
                        <option value="">Select Object</option>
                        {objects.length > 0 ? (
                            objects.map((object) => (
                                <option key={object._id} value={JSON.stringify({ id: object._id, objectname: object.objectname })}>{object.objectname}</option>
                            ))
                        ) : (<option disabled>No Objects available</option>)}
                    </select><br />
                    <select name="adress"
                        value={JSON.stringify(formData.adress)}
                        onChange={ (e) => setFormData({...formData, adress: JSON.parse(e.target.value) }) }
                        disabled={true}
                    >
                        <option value="">Select Address</option>
                        {objectAdresses.length > 0 ? (
                            objectAdresses.map((objectAdress) => (
                                <option key={objectAdress._id} value={JSON.stringify({ id: objectAdress._id, adress: objectAdress.adress })}>{objectAdress.adress}</option>
                            ))
                        ) : (
                            <option disabled>No object adresses exist ...</option>
                        )}
                    </select><br />
                    <select name="floorOrElevator" value={formData.floorOrElevator} onChange={handleChange} disabled={true}>
                        <option value="">Stockwerk oder Aufzug</option>
                        {floors.length > 0 ? (
                            floors.map((floor, index) => (
                                <option key={index} value={floor}>{floor}</option>
                            ))
                        ) : (
                            <option disabled>No floors exist ...</option>
                        )}
                    </select><br />
                    <div className={`button_div`}>
                        <button type="button" onClick={prevPage}>Back</button>
                        <button type="button" onClick={nextPage}>Next</button>
                    </div>

                    {error && (<p>{error}</p>)}
                </form>
            )}
            {page === 3 && (
                <form>
                    <h2>Remarks</h2><br />
                    <textarea
                        name="remarks"
                        placeholder="Remarks ..."
                        value={formData.remarks}
                        onChange={handleChange}
                    ></textarea><br />
                    <div className={`button_div`}>
                        <button type="button" onClick={prevPage}>Back</button>
                        <button type="button" onClick={nextPage}>Next</button>
                    </div>
                    {error && (<p>{error}</p>)}
                </form>
            )}
            {page === 4 && (
                <form>
                    <h1>Damage Status</h1><br />
                    <select
                        name="damageStatus"
                        value={formData.damageStatus}
                        onChange={handleChange}
                    >
                        <option value="">Damage Status</option>
                        <option value="received">Received</option>
                        <option value="inProgress">In Progress ...</option>
                        <option value="finished">Finished</option>
                    </select><br />
                    <div className={`button_div`}>
                        <button type="button" onClick={prevPage}>Back</button>
                        <button type="button" onClick={nextPage}>Next</button>
                    </div>
                    {error && (<p>{error}</p>)}
                </form>
            )}
            {page === 5 && (
                <form onSubmit={handleEditDamage}>
                <h2>Summary</h2><br />
                <p>Title: {formData.title}</p><br />
                <p>Object: {formData.object.objectname}</p><br />
                <p>Address: {formData.adress.adress}</p><br />
                <p>Floor or Elevator: {formData.floorOrElevator}</p><br />
                <p>Remarks: {formData.remarks}</p><br />
                <p>Remarks: {formData.damageStatus}</p><br />
                <div className={`button_div`}>
                    <button type="button" onClick={prevPage}>Back</button>
                    <input type="submit" value="Save" />
                </div>
                {error && (<p>{error}</p>)}
            </form>
            )}
        </>
    );
};
