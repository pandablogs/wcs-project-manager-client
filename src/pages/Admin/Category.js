import Loading from "react-fullscreen-loading";
import {
    Container, Typography, Select, MenuItem, Button, Card, CardHeader, CardContent, Table, TableHead, TableRow, TableCell, TableBody, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, Collapse, Box, Tabs, Tab, List, ListItem, ListItemText, Switch, FormControlLabel
} from "@mui/material";
import { useEffect, useState } from "react";
import materialService from "../../services/materialServices";
import { toast } from "react-toastify";
import './Category.scss';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { Spinner, Modal } from 'react-bootstrap';

const materialsList = [
    // { "name": "Flooring", "room": "Kitchen" },
    // { "name": "Cabinets", "room": "Kitchen" },
    // { "name": "Flooring", "room": "Bathroom" },
    // { "name": "Wall Paint", "room": "Living Room" },
    // { "name": "Lighting", "room": "Living Room" },
    // { "name": "Flooring", "room": "Bedroom" },
    // { "name": "Furniture", "room": "Bedroom" }
];
const subMaterialsList = [
    // {  "name": "Ceramic Tiles", "price": 25, "supplier": "TileMart", "materialId": 1, "room": "Kitchen" },
    // {  "name": "Vinyl", "price": 18, "supplier": "VinylPro", "materialId": 1, "room": "Kitchen" },
    // {  "name": "Wood Cabinets", "price": 100, "supplier": "CabinetWorks", "materialId": 2, "room": "Kitchen" },
    // {  "name": "Porcelain Tiles", "price": 30, "supplier": "TileHub", "materialId": 1, "room": "Bathroom" },
    // {  "name": "Stone Tiles", "price": 50, "supplier": "LuxuryStone", "materialId": 1, "room": "Bathroom" },
    // {  "name": "Matte Finish", "price": 20, "supplier": "PaintCo", "materialId": 1, "room": "Living Room" },
    // {  "name": "Satin Finish", "price": 25, "supplier": "ColorPros", "materialId": 1, "room": "Living Room" },
    // {  "name": "Chandelier", "price": 150, "supplier": "BrightLights", "materialId": 2, "room": "Living Room" },
    // {  "name": "LED Panel", "price": 40, "supplier": "EcoLights", "materialId": 2, "room": "Living Room" },
    // {  "name": "Carpet", "price": 15, "supplier": "SoftStep", "materialId": 1, "room": "Bedroom" },
    // {  "name": "Hardwood", "price": 80, "supplier": "WoodWorld", "materialId": 1, "room": "Bedroom" },
    // {  "name": "Bed Frame", "price": 200, "supplier": "DreamBeds", "materialId": 2, "room": "Bedroom" },
    // {  "name": "Wardrobe", "price": 350, "supplier": "SpaceSavvy", "materialId": 2, "room": "Bedroom" }
];

const Category = () => {

    const [selectedRoom, setSelectedRoom] = useState();
    const [materials, setMaterials] = useState(materialsList);
    const [subMaterials, setSubMaterials] = useState(subMaterialsList);
    const [materialForm, setMaterialForm] = useState({ id: null, name: "" });
    const [subMaterialForm, setSubMaterialForm] = useState({
        id: null,
        name: "",
        price: "",
        supplier: "",
        materialId: null,
    });
    const [editMode, setEditMode] = useState(false);
    const [roomTypes, setRoomTypes] = useState([]);
    const [expandedRows, setExpandedRows] = useState({});
    const [showMaterialForm, setShowMaterialForm] = useState(false);
    const [showSubMaterialForm, setShowSubMaterialForm] = useState(false);
    const [openRoomListDialog, setOpenRoomListDialog] = useState(false);
    const [openRoomFormDialog, setOpenRoomFormDialog] = useState(false);
    const [roomFormData, setRoomFormData] = useState({ name: "", percentageType: false, });
    const [editingRoomId, setEditingRoomId] = useState(null);
    const [localLoading, setLocalLoading] = useState(false); // Loader state
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    const toggleExpand = (materialId) => {
        setExpandedRows((prev) => ({
            ...prev,
            [materialId]: !prev[materialId],
        }));
    };

    useEffect(() => {
        fetchRooms();
    }, []);

    useEffect(() => {
        if (selectedRoom) {
            fetchMaterials();
            fetchSubMaterials();
        }
    }, [selectedRoom]);

    const fetchRooms = async () => {
        setLocalLoading(true);
        setLoading(true);
        try {
            const response = await materialService.getMaterialRoom();
            let rooms = response.data;
            setRoomTypes(rooms);
            if (rooms.length > 0) {
                setSelectedRoom(rooms[0]);
            }
        } catch (err) {
            console.error("Error fetching rooms", err);
            toast.error("Failed to fetch rooms");
        } finally {
            setLocalLoading(false);
            setLoading(false);
        }
    };

    const fetchMaterials = async () => {
        setLocalLoading(true);
        try {
            if (!selectedRoom || !selectedRoom._id) return;
            let queryParams = { roomId: selectedRoom._id };
            const response = await materialService.getMaterial(queryParams);
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
            if (!selectedRoom || !selectedRoom._id) return;
            let queryParams = { roomId: selectedRoom._id };
            const response = await materialService.getSubMaterial(queryParams);
            setSubMaterials(response.data);
        } catch (err) {
            console.error("Error fetching sub-materials", err);
            toast.error("Failed to fetch sub-materials");
        } finally {
            setLocalLoading(false);
        }
    };

    const handleDelete = async () => {
        setLocalLoading(true);
        try {
            setDeletingId(deleteTargetId);
            await materialService.deleteMaterialRoom(deleteTargetId);
            fetchRooms();
            toast.success("Room deleted successfully");
        } catch (err) {
            console.error("Error deleting", err);
            toast.error("Failed to delete");
        } finally {
            setLocalLoading(false);
            setShowDeleteModal(false);
            setDeleteTargetId(null);
        }
    };

    const confirmDelete = (id) => {
        setShowDeleteModal(true);
        setDeleteTargetId(id);
    };

    const handleRoomEdit = (room) => {
        setRoomFormData({ name: room.name, percentageType: room.percentageType || false, });
        setEditingRoomId(room._id);
        setOpenRoomFormDialog(true);
    };

    const handleRoomAddOrEdit = async (e) => {
        setLocalLoading(true);
        try {
            if (editingRoomId) {
                await materialService.updateMaterialRoom(editingRoomId, {
                    name: roomFormData.name,
                    percentageType: roomFormData.percentageType || false,
                });
                toast.success("Room updated successfully");
            } else {
                await materialService.addMaterialRoom({ name: roomFormData.name, percentageType: roomFormData.percentageType || false });
                toast.success("Room added successfully");
            }
            setRoomFormData({ name: "", percentageType: false, });
            setEditingRoomId(null);
            fetchRooms();
            setOpenRoomFormDialog(false);
        } catch (error) {
            console.error("Error saving room", error);
            toast.error("Failed to save Room");
            setLocalLoading(false);
        } finally {
            setLocalLoading(false);
        }
    };

    return (
        <>
            <div className="material-page">
                {localLoading && (
                    <Loading
                        loading={true}
                        background="rgba(0,0,0,0.5)"
                        loaderColor="#fff"
                    />
                )}

                <div
                    className="header-container text-white p-2"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        background: "#d9b451",
                        marginBottom: "20px",
                    }}
                >
                    <Typography
                        variant="h5"
                        fontWeight={700}
                        sx={{ margin: "0px 0px 0px 60px" }}
                    >
                        Material Management
                    </Typography>

                </div>

                {/* room table  */}
                {loading ? (
                    <div className="text-center py-5">
                        <Spinner animation="border" />
                    </div>
                ) : error ? (
                    <div className="alert alert-danger">{error}</div>
                ) : (
                    <div className="table-responsive">
                        <table className="table-custom">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Type</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {roomTypes?.map((room, index) => (
                                    <tr key={index}>
                                        <td>{room?.name ? room?.name : '-'}</td>
                                        <td> {room?.percentageType === true
                                            ? 'Percentage(%)'
                                            : room?.percentageType === false
                                                ? 'Price($)'
                                                : '-'}</td>
                                        <td className="action-icons ">
                                            <FiEdit
                                                className="icon edit me-2"
                                                onClick={() => handleRoomEdit(room)}
                                                style={{ cursor: 'pointer' }}
                                            // onClick={() => navigate(`/project-estimater/${project._id}`)}
                                            />
                                            <FiTrash2
                                                className="icon delete"
                                                // onClick={() => handleDelete("Room", null, null, room._id)}
                                                // onClick={() => confirmDelete(project._id)}
                                                onClick={() => confirmDelete(room._id)}
                                                style={{ cursor: 'pointer' }}
                                            // style={{ opacity: deletingId === room._id ? 0.5 : 1 }}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

            </div>

            {/* delete popup start */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this project?
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancel
                    </button>
                    <button
                        className="btn btn-danger"
                        onClick={handleDelete}
                        disabled={deletingId === deleteTargetId}
                    >
                        {deletingId === deleteTargetId ? 'Deleting...' : 'Delete'}
                    </button>
                </Modal.Footer>
            </Modal>
            {/* delete popup end */}

            {/* add edit room start */}
            <Dialog
                open={openRoomFormDialog}
                onClose={() => setOpenRoomFormDialog(false)}
                fullWidth
            >
                <DialogTitle>{editingRoomId ? "Edit Room" : "Add Room"}</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Room Name"
                        variant="outlined"
                        margin="dense"
                        value={roomFormData.name}
                        // onChange={(e) => setRoomFormData({ name: e.target.value })}
                        onChange={(e) =>
                            setRoomFormData((prev) => ({
                                ...prev,
                                name: e.target.value
                            }))
                        }
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                checked={roomFormData.percentageType}
                                onChange={(e) =>
                                    setRoomFormData((prev) => ({
                                        ...prev,
                                        percentageType: e.target.checked,
                                    }))
                                }
                                color="primary"
                            />
                        }
                        label="Enable Percentage Type"
                        className="mt-2"
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setOpenRoomFormDialog(false)}
                        color="secondary"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleRoomAddOrEdit}
                        variant="contained"
                        color="primary"
                    >
                        {editingRoomId ? "Update" : "Add"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* add edit room end */}

        </>
    )

}


export default Category;