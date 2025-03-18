import React, { useState, useEffect } from "react";
import materialService from "../../services/materialServices";
import userServices from "../../services/userServices";
import Loading from "react-fullscreen-loading";
import { toast } from "react-toastify";
import { Table, Container, Form } from "react-bootstrap";
import { AiOutlineDollarCircle } from "react-icons/ai";
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


    useEffect(() => {
        fetchRooms();
        fetchMaterials();
        fetchSubMaterials();
        fetchProfile();
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
            const response = await materialService.getMaterialRoom();
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
            const response = await materialService.getMaterial({});
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
            const response = await materialService.getSubMaterial({});
            setSubMaterials(response.data);
        } catch (err) {
            console.error("Error fetching sub-materials", err);
            toast.error("Failed to fetch sub-materials");
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

    const calculateTotal = () => {
        return subMaterials.reduce((total, sub) => {
            const qty = quantities[sub._id] || 0;
            return total + qty * sub.price;
        }, 0);
    };

    const saveProject = async () => {
        const projectData = {
            name: projectName,
            rooms: rooms.map((room) => ({
                roomId: room._id,
                materials: materials
                    .filter((mat) => mat.roomId?._id === room._id)
                    .map((mat) => ({
                        materialId: mat._id,
                        subMaterials: subMaterials
                            .filter((sub) => sub.materialId?._id === mat._id)
                            .map((sub) => ({
                                subMaterialId: sub._id,
                                quantity: quantities[sub._id] || 0,
                                price: sub.price,
                            }))
                    }))
            })),
            totalBudget: calculateTotal(),
            createdBy: createdBy || {}
        };

        try {
            const response = await materialService.addProject(projectData);
            if (response?.status) {
                toast.success("Project saved successfully!");
            }
        } catch (error) {
            console.error("Error saving project", error);
            toast.error("Failed to save project");
        }
    };


    const handleExportToExcel = () => {
        const sheetData = [];

        rooms.forEach((room) => {
            sheetData.push([room.name]); // Room Name
            sheetData.push(["Material", "Sub-Material", "Price", "Quantity", "Amount"]); // Header

            materials
                .filter((mat) => mat.roomId?._id === room._id)
                .forEach((mat) => {
                    subMaterials
                        .filter((sub) => sub.materialId?._id === mat._id)
                        .forEach((sub) => {
                            const qty = quantities[sub._id] || 0;
                            sheetData.push([
                                mat.name,
                                sub.name,
                                `$${sub.price.toFixed(2)}`,
                                qty,
                                `$${(qty * sub.price).toFixed(2)}`,
                            ]);
                        });
                });

            sheetData.push([]); // Empty row for spacing
        });

        sheetData.push(["Total Budget", "", "", "", `$${calculateTotal().toFixed(2)}`]);

        const ws = XLSX.utils.aoa_to_sheet(sheetData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Estimate");

        // Save the file
        XLSX.writeFile(wb, "Estimate.xlsx");
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
                    <div key={room._id} className="mb-4 p-3 border rounded bg-light">
                        <h3 className="text-dark" style={{ color: "#d9b451" }}>{room.name}</h3>
                        <Table striped bordered hover responsive>
                            <thead>
                                <tr className="bg-dark text-white">
                                    <th>Material</th>
                                    <th>Sub-Material</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th style={{ width: "120px" }}>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {materials
                                    .filter((mat) => mat.roomId?._id === room._id)
                                    .flatMap((mat) =>
                                        subMaterials
                                            .filter((sub) => sub.materialId?._id === mat._id)
                                            .map((sub) => (
                                                <tr key={sub._id}>
                                                    <td>{mat.name}</td>
                                                    <td>{sub.name}</td>
                                                    <td>${sub.price.toFixed(2)}</td>
                                                    <td>
                                                        <Form.Control
                                                            type="number"
                                                            min="0"
                                                            value={quantities[sub._id] || ""}
                                                            onChange={(e) =>
                                                                handleQuantityChange(sub._id, parseInt(e.target.value) || 0)
                                                            }
                                                            className="w-75"
                                                        />
                                                    </td>
                                                    <td className="fw-bold text-end" style={{ width: "120px" }}>
                                                        ${(quantities[sub._id] || 0) * sub.price}
                                                    </td>
                                                </tr>
                                            ))
                                    )}
                            </tbody>
                        </Table>
                    </div>
                ))}
                <h3 className="d-flex justify-content-between fw-bold mt-4 text-dark">
                    <button className="btn btn-primary mt-3 ms-2" onClick={handleExportToExcel}>
                        Print to Excel
                    </button>

                    <div>
                        <AiOutlineDollarCircle className="me-2" color="#d9b451" size={24} />
                        Total Budget: ${calculateTotal().toFixed(2)}

                    </div>

                </h3>
                <h3 className="text-end">
                    <button className="btn btn-success mt-3" onClick={saveProject}>
                        Save Project
                    </button>
                </h3>
            </Card>
        </Container>
    );
};

export default Estimater;
