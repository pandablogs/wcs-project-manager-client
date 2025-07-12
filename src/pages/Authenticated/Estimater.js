import React, { useState, useEffect } from "react";
import materialService from "../../services/materialServices";
import userServices from "../../services/userServices";
import Loading from "react-fullscreen-loading";
import { toast } from "react-toastify";
import { Table, Container, Form } from "react-bootstrap";
import { AiOutlineDollarCircle } from "react-icons/ai";
import { useParams } from "react-router-dom";

import { Card } from "@mui/material";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const Estimater = () => {
    const [quantities, setQuantities] = useState({});
    const [materials, setMaterials] = useState([]);
    const [subMaterials, setSubMaterials] = useState([]);
    const [rooms, setRoomTypes] = useState([]);
    const [localLoading, setLocalLoading] = useState(false);
    const [projectName, setProjectName] = useState("New Project");
    const [createdBy, setCreatedBy] = useState({})
    const [projectId, setProjectId] = useState(null)
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedSubMaterials, setSelectedSubMaterials] = useState({});
    const [selectedMaterials, setSelectedMaterials] = useState([]);

    const { id } = useParams(); // get :id from URL


    useEffect(() => {
        fetchRooms();
        fetchMaterials();
        fetchSubMaterials();
        fetchProfile();
        if (id) {
            setIsEditMode(true);
            setProjectId(id);
            fetchProjectData(id); // fetch and bind project
        }
    }, []);

    const fetchProfile = async () => {
        try {
            setLocalLoading(true);
            const response = await userServices.getProfile();
            console.log("------->>>", response.user)
            setCreatedBy(response.user)
        } catch (error) {
            toast.error("Failed to fetch profile. Please try again.");
        } finally {
            setLocalLoading(false);
        }
    };



    const fetchRooms = async () => {
        setLocalLoading(true);
        try {
            const response = await materialService.getMaterialRoomAll();
            setRoomTypes(response.data);
        } catch (err) {
            console.error("Error fetching rooms", err);
            toast.error("Failed to fetch rooms");
        } finally {
            setLocalLoading(false);
        }
    };

    const fetchMaterials = async () => {
        setLocalLoading(true);
        try {
            const response = await materialService.getMaterialAll({});
            setMaterials(response.data);
        } catch (err) {
            console.error("Error fetching materials", err);
            toast.error("Failed to fetch materials");
        } finally {
            setLocalLoading(false);
        }
    };

    const fetchSubMaterials = async () => {
        setLocalLoading(true);
        try {
            const response = await materialService.getSubMaterialAll({});
            setSubMaterials(response.data);
        } catch (err) {
            console.error("Error fetching sub-materials", err);
            toast.error("Failed to fetch sub-materials");
        } finally {
            setLocalLoading(false);
        }
    };

    const fetchProjectData = async (projectId) => {
        setLocalLoading(true);
        try {
            const response = await materialService.getProjectById(projectId);
            if (response.status) {
                const project = response.data;
                setProjectName(project.name || '');
                setProjectId(project._id || '');

                const qtyMap = {};
                const selectedSubMap = {};
                const selectedMatMap = {};

                project.rooms.forEach((room) => {
                    const roomId = room.roomId?._id;
                    if (!selectedMatMap[roomId]) selectedMatMap[roomId] = [];

                    room.materials.forEach((material) => {
                        const matId = material.materialId?._id;
                        const subSelected = [];

                        material.subMaterials.forEach((sub) => {
                            const subId = sub.subMaterialId?._id;
                            const qty = sub.quantity || 0;
                            if (qty > 0) {
                                qtyMap[subId] = qty;
                                subSelected.push(subId);
                            }
                        });

                        if (subSelected.length > 0) {
                            selectedSubMap[matId] = subSelected;
                            if (!selectedMatMap[roomId].includes(matId)) {
                                selectedMatMap[roomId].push(matId);
                            }
                        }
                    });
                });

                setQuantities(qtyMap);
                setSelectedSubMaterials(selectedSubMap);
                setSelectedMaterials(selectedMatMap);
            } else {
                toast.error("Failed to load project.");
            }
        } catch (err) {
            toast.error("Error loading project data.");
        } finally {
            setLocalLoading(false);
        }
    };



    const handleQuantityChange = (id, value) => {
        setQuantities((prev) => ({
            ...prev,
            [id]: value >= 0 ? value : 0,
        }));
    };

    // const calculateTotal = () => {
    //     return subMaterials.reduce((total, sub) => {
    //         const qty = quantities[sub._id] || 0;
    //         return total + qty * sub.price;
    //     }, 0);
    // };
    // const calculateTotal = () => {
    //     return rooms.reduce((roomTotal, room) => {
    //         const roomMaterials = materials.filter(mat => mat.roomId?._id === room._id);

    //         const materialTotal = roomMaterials.reduce((matTotal, mat) => {
    //             const subMaterialIds = selectedSubMaterials[mat._id] || [];
    //             const subTotal = subMaterialIds.reduce((subAcc, subId) => {
    //                 const sub = subMaterials.find(s => s._id === subId);
    //                 const qty = quantities[subId] || 0;
    //                 return subAcc + qty * (sub?.price || 0);
    //             }, 0);

    //             return matTotal + subTotal;
    //         }, 0);

    //         return roomTotal + materialTotal;
    //     }, 0);
    // };
    const calculateTotal = () => {
        let actualTotal = 0;
        let percentageMarkup = 0;
        let percentageItems = [];

        rooms.forEach((room) => {
            const roomMaterials = materials.filter((mat) => mat.roomId?._id === room._id);

            roomMaterials.forEach((mat) => {
                const subIds = selectedSubMaterials[mat._id] || [];

                subIds.forEach((subId) => {
                    const sub = subMaterials.find((s) => s._id === subId);
                    const qty = quantities[subId] || 0;

                    if (room.percentageType) {
                        percentageMarkup += sub?.price || 0;
                        if (sub) {
                            percentageItems.push(`${sub.name} (${sub.price}%)`);
                        }
                    } else {
                        actualTotal += qty * (sub?.price || 0);
                    }
                });
            });
        });

        const finalTotal = actualTotal + (actualTotal * percentageMarkup / 100);
        return {
            actualTotal,
            percentageMarkup,
            percentageItems,
            finalTotal
        };
    };


    const getRoomTotal = (roomId) => {
        const roomMaterials = materials.filter(mat => mat.roomId?._id === roomId);

        return roomMaterials.reduce((matTotal, mat) => {
            const subIds = selectedSubMaterials[mat._id] || [];
            const subTotal = subIds.reduce((acc, subId) => {
                const sub = subMaterials.find(s => s._id === subId);
                const qty = quantities[subId] || 0;
                return acc + qty * (sub?.price || 0);
            }, 0);
            return matTotal + subTotal;
        }, 0);
    };

    const saveProject = async () => {
        const totals = calculateTotal();

        const projectData = {
            name: projectName,
            rooms: rooms.map((room) => {
                const selectedMaterialIds = selectedMaterials[room._id] || [];

                const materialsData = selectedMaterialIds.map((matId) => {
                    const selectedSubIds = selectedSubMaterials[matId] || [];

                    const subMaterialsData = selectedSubIds
                        .map((subId) => {
                            const sub = subMaterials.find((s) => s._id === subId);
                            const quantity = room.percentageType ? 1 : (quantities[subId] || 0);

                            if (quantity > 0) {
                                return {
                                    subMaterialId: subId,
                                    quantity,
                                    price: sub?.price || 0,
                                };
                            }

                            return null;
                        })
                        .filter(Boolean); // remove nulls

                    // Only include this material if it has at least one sub-material
                    if (subMaterialsData.length > 0) {
                        return {
                            materialId: matId,
                            subMaterials: subMaterialsData,
                        };
                    }

                    return null;
                }).filter(Boolean); // remove nulls

                return {
                    roomId: room._id,
                    materials: materialsData,
                };
            }),

            totalBudget: totals.finalTotal,
            createdBy: createdBy || {},
        };

        try {
            let response;
            if (isEditMode) {
                response = await materialService.updateProject(projectId, projectData);
                if (response?.status) {
                    toast.success("Project updated successfully!");
                }
            } else {
                response = await materialService.addProject(projectData);
                if (response?.status) {
                    toast.success("Project saved successfully!");
                }
            }
        } catch (error) {
            console.error("Error saving project", error);
            toast.error("Failed to save project");
        }
    };




    // const handleExportToExcel = () => {
    //     const sheetData = [];

    //     rooms.forEach((room) => {
    //         sheetData.push([room.name]); // Room Name
    //         sheetData.push(["Material", "Sub-Material", "Price", "Quantity", "Amount"]); // Header

    //         materials
    //             .filter((mat) => mat.roomId?._id === room._id)
    //             .forEach((mat) => {
    //                 subMaterials
    //                     .filter((sub) => sub.materialId?._id === mat._id)
    //                     .forEach((sub) => {
    //                         const qty = quantities[sub._id] || 0;
    //                         sheetData.push([
    //                             mat.name,
    //                             sub.name,
    //                             `$${sub.price.toFixed(2)}`,
    //                             qty,
    //                             `$${(qty * sub.price).toFixed(2)}`,
    //                         ]);
    //                     });
    //             });

    //         sheetData.push([]); // Empty row for spacing
    //     });

    //     sheetData.push(["Total Budget", "", "", "", `$${calculateTotal().toFixed(2)}`]);

    //     const ws = XLSX.utils.aoa_to_sheet(sheetData);
    //     const wb = XLSX.utils.book_new();
    //     XLSX.utils.book_append_sheet(wb, ws, "Estimate");

    //     // Save the file
    //     XLSX.writeFile(wb, "Estimate.xlsx");
    // };
    const handleExportToExcel = () => {
        const sheetData = [];

        rooms.forEach((room) => {
            const selectedMaterialIds = selectedMaterials[room._id] || [];
            if (selectedMaterialIds.length === 0) return;

            let roomHasData = false;

            const roomRows = [];
            roomRows.push(["Material", "Sub-Material", "Price", "Quantity", "Amount"]);

            selectedMaterialIds.forEach((matId) => {
                const mat = materials.find((m) => m._id === matId);
                const selectedSubIds = selectedSubMaterials[matId] || [];

                selectedSubIds.forEach((subId) => {
                    const sub = subMaterials.find((s) => s._id === subId);
                    const qty = quantities[subId] || 0;

                    if (qty > 0) {
                        const price = sub?.price || 0;
                        const amount = qty * price;
                        roomHasData = true;

                        roomRows.push([
                            mat?.name || "",
                            sub?.name || "",
                            `$${price.toFixed(2)}`,
                            qty,
                            `$${amount.toFixed(2)}`
                        ]);
                    }
                });
            });

            if (roomHasData) {
                sheetData.push([room.name]); // Room Name Header
                sheetData.push(...roomRows);
                sheetData.push([]); // Blank line for spacing
            }
        });

        const totals = calculateTotal();

        // Add totals
        sheetData.push(["Actual Total", "", "", "", `$${totals.actualTotal.toFixed(2)}`]);

        if (totals.percentageMarkup && totals.percentageMarkup > 0) {
            sheetData.push([
                `Added Percentage (${totals.percentageMarkup}%)`,
                "",
                "",
                "",
                `+ $${(totals.finalTotal - totals.actualTotal).toFixed(2)}`
            ]);

            if (totals.percentageItems?.length > 0) {
                sheetData.push([`From: ${totals.percentageItems.join(", ")}`]);
            }
        }

        sheetData.push(["Final Total", "", "", "", `$${totals.finalTotal.toFixed(2)}`]);

        const ws = XLSX.utils.aoa_to_sheet(sheetData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Estimate");

        XLSX.writeFile(wb, "Estimate.xlsx");
    };


    const removeSubMaterial = (materialId, subMaterialId) => {
        setSelectedSubMaterials((prev) => ({
            ...prev,
            [materialId]: prev[materialId].filter((id) => id !== subMaterialId),
        }));
    };


    const removeMaterial = (roomId, materialId) => {
        setSelectedMaterials((prev) => ({
            ...prev,
            [roomId]: prev[roomId].filter((id) => id !== materialId),
        }));
        setSelectedSubMaterials((prev) => {
            const newState = { ...prev };
            delete newState[materialId]; // also remove related sub-materials
            return newState;
        });
    };

    return (

        <Container className="py-4">
            {localLoading && (
                <Loading loading={true} background="rgba(0,0,0,0.5)" loaderColor="#fff" />
            )}

            <Card className="p-4 shadow-lg border" style={{ borderColor: "#d9b451" }}>
                <h2 className="text-center text-dark mb-4">Rehab Rough Budget Estimator</h2>

                <Form.Group>
                    <Form.Label className="text-dark font-weight-bold" style={{ fontSize: "1.2rem" }}>
                        Project Name:
                    </Form.Label>
                    <Form.Control
                        type="text"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        className="font-weight-bold w-auto mb-3"
                    />
                </Form.Group>

                {rooms.map((room) => (


                    <div key={room._id} className="mb-5 p-4 border rounded-3 bg-white shadow">
                        {/* Header */}
                        <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
                            <h4 className="fw-semibold text-primary mb-0">{room.name}</h4>
                            <div className="fs-5 fw-bold text-success">
                                Total: ${getRoomTotal(room._id).toFixed(2)}
                            </div>
                        </div>

                        {/* Material Dropdown */}
                        {materials.filter((m) => m.roomId?._id === room._id).length >
                            (selectedMaterials[room._id]?.length || 0) && (
                                <Form.Select
                                    className="mb-4"
                                    style={{ width: 'fit-content' }}
                                    onChange={(e) => {
                                        const matId = e.target.value;
                                        if (!matId) return;

                                        setSelectedMaterials((prev) => ({
                                            ...prev,
                                            [room._id]: [...(prev[room._id] || []), matId],
                                        }));
                                    }}
                                >
                                    <option value="">➕ Add Material</option>
                                    {materials
                                        .filter((mat) => mat.roomId?._id === room._id)
                                        .filter((mat) => !(selectedMaterials[room._id] || []).includes(mat._id))
                                        .map((mat) => (
                                            <option key={mat._id} value={mat._id}>
                                                {mat.name}
                                            </option>
                                        ))}
                                </Form.Select>
                            )}

                        {/* Selected Materials and Sub-Materials */}
                        {(selectedMaterials[room._id] || []).map((matId) => {
                            const mat = materials.find((m) => m._id === matId);
                            const availableSubs = subMaterials.filter((s) => s.materialId?._id === mat._id);
                            const selectedSubs = selectedSubMaterials[mat._id] || [];

                            return (
                                <div key={mat._id} className="mb-4 border-start ps-4 border-3 border-primary">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h5 className="fw-semibold text-dark mb-0">{mat.name}</h5>
                                        <button
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => removeMaterial(room._id, mat._id)}
                                        >
                                            🗑
                                        </button>
                                    </div>


                                    {/* Sub-Material Dropdown */}
                                    {availableSubs.length > selectedSubs.length && (
                                        <Form.Select
                                            className="mb-3"
                                            style={{ width: 'fit-content' }}
                                            onChange={(e) => {
                                                const subId = e.target.value;
                                                if (!subId) return;

                                                setSelectedSubMaterials((prev) => ({
                                                    ...prev,
                                                    [mat._id]: [...(prev[mat._id] || []), subId],
                                                }));
                                            }}
                                        >
                                            <option value="">➕ Add Sub-Material</option>
                                            {availableSubs
                                                .filter((sub) => !selectedSubs.includes(sub._id))
                                                .map((sub) => (
                                                    <option key={sub._id} value={sub._id}>
                                                        {sub.name} — ${sub.price}
                                                    </option>
                                                ))}
                                        </Form.Select>
                                    )}

                                    {/* Sub-Materials Table */}
                                    {selectedSubs.length > 0 && (
                                        <Table bordered hover responsive size="sm" className="bg-white">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>Sub-Material</th>
                                                    {room?.percentageType ? (
                                                        <>
                                                            <th>Percentage</th>
                                                            <th>Action</th>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <th>Price</th>
                                                            <th>Quantity</th>
                                                            <th className="text-end">Amount</th>
                                                            <th>Action</th>
                                                        </>
                                                    )}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {availableSubs
                                                    .filter((sub) => selectedSubs.includes(sub._id))
                                                    .map((sub) => (
                                                        <tr key={sub._id}>
                                                            <td>{sub.name}</td>

                                                            {room.percentageType ? (
                                                                <>
                                                                    <td>{sub.price}%</td>
                                                                    <td className="text-center">
                                                                        <button
                                                                            className="btn btn-sm btn-danger"
                                                                            onClick={() => removeSubMaterial(mat._id, sub._id)}
                                                                            title="Remove Sub-Material"
                                                                        >
                                                                            🗑
                                                                        </button>
                                                                    </td>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <td>${sub.price.toFixed(2)}</td>
                                                                    <td>
                                                                        <Form.Control
                                                                            type="number"
                                                                            min="0"
                                                                            value={quantities[sub._id] || ""}
                                                                            disabled={room.percentageType}
                                                                            onChange={(e) =>
                                                                                handleQuantityChange(sub._id, parseInt(e.target.value) || 0)
                                                                            }
                                                                            className="w-75"
                                                                        />
                                                                    </td>
                                                                    <td className="fw-bold text-end text-success">
                                                                        ${(quantities[sub._id] || 0) * sub.price}
                                                                    </td>
                                                                    <td className="text-center">
                                                                        <button
                                                                            className="btn btn-sm btn-danger"
                                                                            onClick={() => removeSubMaterial(mat._id, sub._id)}
                                                                            title="Remove Sub-Material"
                                                                        >
                                                                            🗑
                                                                        </button>
                                                                    </td>
                                                                </>
                                                            )}
                                                        </tr>
                                                    ))}
                                            </tbody>
                                        </Table>
                                    )}
                                </div>
                            );
                        })}
                    </div>


                ))}

                <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-4 mt-5 px-3 py-4 bg-white rounded shadow-sm border">

                    {/* Left: Export Button */}
                    <div>
                        <button className="btn btn-outline-primary fw-semibold" onClick={handleExportToExcel}>
                            Print to Excel
                        </button>
                    </div>

                    {/* Center: Total Summary */}
                    <div className="p-3 rounded border shadow-sm bg-light d-flex flex-column gap-2" style={{ minWidth: "300px", maxWidth: "400px" }}>
                        <div className="d-flex align-items-center text-dark">
                            <AiOutlineDollarCircle className="me-2" color="#d9b451" size={24} />
                            <strong className="me-1">Actual Total:</strong>
                            <span className="ms-auto">${calculateTotal().actualTotal.toFixed(2)}</span>
                        </div>

                        {calculateTotal().percentageItems !== 0 && (
                            <div className="text-secondary">
                                <div className="d-flex align-items-center">
                                    <i className="bi bi-plus-circle me-2"></i>
                                    <span>Added Percentage:</span>
                                    <span className="ms-auto">{calculateTotal().percentageMarkup}%</span>
                                </div>
                                {calculateTotal().percentageItems?.length > 0 && (
                                    <small className="text-muted d-block ms-4">
                                        From: {calculateTotal().percentageItems.join(", ")}
                                    </small>
                                )}
                            </div>
                        )}
                        <hr className="my-2" />

                        <div className="d-flex align-items-center fs-5 fw-bold text-success">
                            <i className="bi bi-cash-coin me-2"></i>
                            <span>Final Total:</span>
                            <span className="ms-auto">${calculateTotal().finalTotal.toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Right: Save Button */}


                </div>
                <div className="text-end w-100 w-md-auto">
                    <button className="btn btn-success fw-semibold" onClick={saveProject}>
                        {isEditMode ? " Update Project" : " Save Project"}
                    </button>
                </div>

            </Card >
        </Container >


    );
};

export default Estimater;
