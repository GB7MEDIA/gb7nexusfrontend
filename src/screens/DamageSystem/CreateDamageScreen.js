import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { getTenantByIdAPI, getTenantByUserIdAPI } from "../../axios/tenant";
import { getAllObjectsAPI, getObjectByIdAPI, getObjectAdressesByObjectIdAPI } from "../../axios/object";
import { createDamageAPI } from "../../axios/damage";
import { uploadOneFile } from "../../axios/upload";

import "../../css/general.css";
import "../../css/form.css";

export const CreateDamageScreen = ({ isLoggedIn, currentUserId, currentUser }) => {
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/login");
        }
    }, [isLoggedIn, navigate]);

    const [objects, setObjects] = useState([]);
    const [object, setObject] = useState([]);
    const [isTenantObjectId, setIsTenantObjectId] = useState(false);

    useEffect(() => {
        (async () => {
            if (currentUserId) {
                try {
                    const tenantIdData = await getTenantByUserIdAPI(currentUserId);
                    if (tenantIdData.data.data.tenantId.tenantId) {
                        const tenantData = await getTenantByIdAPI(tenantIdData.data.data.tenantId.tenantId);
                        const objectData = await getObjectByIdAPI(tenantData.data.data.tenant.objectId);
                        setObject(objectData.data.data.object);
                        setIsTenantObjectId(true);
                    }
                } catch (error) {
                    console.error("Error fetching tenant data:", error);
                }
            }
        })();
    }, [currentUserId]);

    useEffect(() => {
        (async () => {
            try {
                const objectsData = await getAllObjectsAPI();
                setObjects(objectsData.data.data.objects);
            } catch (error) {
                console.error('Failed to fetch objects:', error);
            }
        })();
    }, [setObjects]);

    const [objectAdresses, setObjectAdresses] = useState([]);
    const [floors, setFloors] = useState([]);

    const [page, setPage] = useState(1);
    const [formData, setFormData] = useState({
        title: '',
        file: [],
        object: {
            _id: '',
            objectname: ''
        },
        adress: {
            _id: '',
            adress: ''
        },
        floorOrElevator: '',
        remarks: ''
    });

    useEffect(() => {
        (async () => {
            if (formData.object._id) {
                const adressesData = await getObjectAdressesByObjectIdAPI(formData.object._id);
                let adresses = adressesData.data.data.adresses;
                if (!Array.isArray(adresses)) {
                    adresses = [adresses];
                }
                setObjectAdresses(adresses);
            }
        })()
    }, [formData.object, setObjectAdresses]);

    useEffect(() => {
        setFormData(formData => ({
            ...formData, 
            object: {
                _id: object._id,
                objectname: object.objectname
            }
        }));
    }, [object]);
    

    useEffect(() => {
        if (formData.adress) {
            const matchingAdresses = objectAdresses.filter(adress => adress._id === formData.adress._id);
            if (matchingAdresses.length > 0) {
                setFloors(matchingAdresses[0].floors);
            } else {
                console.log("No matching address found");
            }
        }
    }, [formData.adress, objectAdresses, setFloors]);

    const [error, setError] = useState('');

    const nextPage = () => setPage(page + 1);
    const prevPage = () => setPage(page - 1);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "file") {
            setFormData({ ...formData, "file": e.target.files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleCreateDamage = async (e) => {
        e.preventDefault();

        if (formData) {
            if (!formData.title) {
                setError('The title can not be left empty!');
                return;
            }
            if (!formData.object) {
                if (!formData.object._id) {
                    setError('The object id can not be left empty!');
                    return;
                }
            }

            if (!formData.adress) {
                if (!formData.adress._id) {
                    setError('The adress id can not be left empty!');
                    return;
                }
            }

            if (!formData.floorOrElevator) {
                setError('The floor or elevator can not be left empty!');
                return;
            }

            if (!formData.remarks) {
                setError('The remarks can not be left empty!');
                return;
            }

            const newFormData = new FormData();

            newFormData.append("file", formData.file);

            const uploadResponse = await uploadOneFile(newFormData);
            const mediaUrl = uploadResponse.data.data.mediaUrl;

            const response = await createDamageAPI(formData.title, mediaUrl, formData.object._id, formData.adress._id, formData.floorOrElevator, formData.remarks);
            if (response) {
                navigate(`/damages`);
            }
        }
    };

    return (
        <>
            <h1>Report Damage</h1>
            {page === 1 && (
                <form>
                    <h2>Title</h2><br />
                    <input
                        type="text"
                        name="title"
                        placeholder="Title ..."
                        onChange={handleChange}
                    /><br />
                    <button type="button" onClick={nextPage}>Next</button>
                    {error && (<p>{error}</p>)}
                </form>
            )}
            {page === 2 && (
                <form>
                    <h2>Image</h2><br />
                    <input
                        type="file"
                        name="file"
                        onChange={handleChange}
                    /><br />
                    <button type="button" onClick={nextPage}>Next</button>
                    {error && (<p>{error}</p>)}
                </form>
            )}
            {page === 3 && (
                <form>
                    <h2>Where are you located?</h2><br />
                    <select
                        name="object"
                        value={JSON.stringify(formData.object)}
                        onChange={ (e) => setFormData({...formData, object: JSON.parse(e.target.value) }) }
                        disabled={isTenantObjectId}
                    >
                        <option value="">Select Object</option>
                        {objects.length > 0 ? (
                            objects.map((object) => (
                                <option key={object._id} value={JSON.stringify({ _id: object._id, objectname: object.objectname })}>{object.objectname}</option>
                            ))
                        ) : (<option disabled>No Objects available</option>)}
                    </select><br />
                    <select name="adress"
                        value={JSON.stringify(formData.adress)}
                        onChange={ (e) => setFormData({...formData, adress: JSON.parse(e.target.value) }) }
                    >
                        <option value="">Select Address</option>
                        {objectAdresses.length > 0 ? (
                            objectAdresses.map((objectAdress) => (
                                <option key={objectAdress._id} value={JSON.stringify({ _id: objectAdress._id, adress: objectAdress.adress })}>{objectAdress.adress}</option>
                            ))
                        ) : (
                            <option disabled>No object adresses exist ...</option>
                        )}
                    </select><br />
                    <select name="floorOrElevator" value={formData.floorOrElevator} onChange={handleChange}>
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
            {page === 4 && (
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
            {page === 5 && (
                <form onSubmit={handleCreateDamage}>
                    <h2>Summary</h2><br />
                    <p>Title: {formData.title}</p><br />
                    <p>Object: {formData.object.objectname}</p><br />
                    <p>Address: {formData.adress.adress}</p><br />
                    <p>Floor or Elevator: {formData.floorOrElevator}</p><br />
                    <p>Remarks: {formData.remarks}</p><br />
                    <div className={`button_div`}>
                        <button type="button" onClick={prevPage}>Back</button>
                        <input type="submit" value="Report" />
                    </div>
                    {error && (<p>{error}</p>)}
                </form>
            )}
        </>
    );
};
