import React, { useState, useEffect } from "react";
import {
    Container,
    Typography,
    Select,
    MenuItem,
    Button,
    Card,
    CardHeader,
    CardContent,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    IconButton,
    Collapse,
    Box,
    Tabs,
    Tab,
    List,
    ListItem,
    ListItemText,
} from "@mui/material";

import materialService from "../../services/materialServices";
import { AiOutlinePlus, AiFillSetting } from "react-icons/ai";
import {
    FaChevronDown,
    FaChevronUp,
    FaEdit,
    FaTrash,
    FaBars,
} from "react-icons/fa";
import Loading from "react-fullscreen-loading";
import { toast } from "react-toastify";

import "./MaterialPage.scss";
import { Badge } from "react-bootstrap";

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

const MaterialPage = () => {
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
    const [roomFormData, setRoomFormData] = useState({ name: "" });
    const [editingRoomId, setEditingRoomId] = useState(null);
    const [localLoading, setLocalLoading] = useState(false); // Loader state

    const toggleExpand = (materialId) => {
        setExpandedRows((prev) => ({
            ...prev,
            [materialId]: !prev[materialId],
        }));
    };
    useEffect(() => {
        fetchRooms();
        // toast.success("Materials fetched successfully");
    }, []);

    useEffect(() => {
        if (selectedRoom) {
            fetchMaterials();
            fetchSubMaterials();
        }
    }, [selectedRoom]); // Runs when selectedRoom is updated

    const fetchRooms = async () => {
        setLocalLoading(true);
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

    const handleOpenMaterialForm = (item = null) => {
        setEditMode(!!item);
        setMaterialForm(item ? { ...item } : { name: "", room: "" });
        setShowMaterialForm(true);
    };

    const handleOpenSubMaterialForm = (materialId, item = null) => {
        setEditMode(!!item);
        setSubMaterialForm(
            item ? { ...item } : { name: "", price: "", supplier: "", materialId }
        );
        setShowSubMaterialForm(true);
    };

    const handleSaveMaterial = async () => {
        setLocalLoading(true);
        try {
            if (editMode) {
                await materialService.updateMaterial(materialForm._id, materialForm);
                toast.success("Material updated successfully");
            } else {
                let payload = {
                    ...materialForm,
                    roomId: selectedRoom._id,
                };
                await materialService.addMaterial(payload);
                toast.success("Material added successfully");
            }
            fetchMaterials();
            setShowMaterialForm(false);
        } catch (err) {
            console.error("Error saving material", err);
            setLocalLoading(false);
            toast.error("Failed to save material");
        } finally {
            setLocalLoading(false);
        }
    };
    const handleSaveSubMaterial = async () => {
        setLocalLoading(true);
        try {
            if (editMode) {
                let payload = {
                    ...subMaterialForm,
                    roomId: selectedRoom._id,
                };
                await materialService.updateSubMaterial(subMaterialForm._id, payload);
                toast.success("Sub-Material updated successfully");
            } else {
                let payload = {
                    ...subMaterialForm,
                    roomId: selectedRoom._id,
                };
                await materialService.addSubMaterial(payload);
                toast.success("Sub-Material added successfully");
            }
            fetchSubMaterials();
            setEditMode(false);
            setShowSubMaterialForm(false);
            setSubMaterialForm({
                id: null,
                name: "",
                price: "",
                supplier: "",
                materialId: null,
            });
        } catch (err) {
            console.error("Error saving sub-material", err);
            toast.error("Failed to save sub-material");
            setLocalLoading(false);
        } finally {
            setLocalLoading(false);
        }
    };

    const handleRoomAddOrEdit = async (e) => {
        setLocalLoading(true);
        try {
            if (editingRoomId) {
                await materialService.updateMaterialRoom(editingRoomId, {
                    name: roomFormData.name,
                });
                toast.success("Room updated successfully");
            } else {
                await materialService.addMaterialRoom({ name: roomFormData.name });
                toast.success("Room added successfully");
            }
            setRoomFormData({ name: "" });
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

    const handleDelete = async (type, materialId, subMaterialId, roomId) => {
        setLocalLoading(true);
        try {
            if (type === "material") {
                await materialService.deleteMaterial(materialId);
                fetchMaterials();
                toast.success("Material deleted successfully");
            } else if (type === "subMaterial") {
                await materialService.deleteSubMaterial(subMaterialId);
                fetchSubMaterials();
                toast.success("Sub-material deleted successfully");
            } else if (type === "Room") {
                await materialService.deleteMaterialRoom(roomId);
                fetchRooms();
                toast.success("Room deleted successfully");
            }
        } catch (err) {
            console.error("Error deleting", err);
            toast.error("Failed to delete");
        } finally {
            setLocalLoading(false);
        }
    };

    const handleRoomEdit = (room) => {
        setRoomFormData({ name: room.name });
        setEditingRoomId(room._id);
        setOpenRoomFormDialog(true);
    };
    const handleOpenAddRoomDialog = () => {
        setRoomFormData({ name: "" });
        setEditingRoomId(null);
        setOpenRoomFormDialog(true);
    };

    return (
        <Box className="material-page">
            {localLoading && (
                <Loading
                    loading={true}
                    background="rgba(0,0,0,0.5)"
                    loaderColor="#fff"
                />
            )}
            {/* 
            <Typography variant="h5" className="header text-start  main-title">
                Material Management
            </Typography> */}
            {/* <hr className="mb-0" /> */}
            <div
                className="header-container text-white p-2"
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: "#d9b451",
                }}
            >
                {/* Left: Title */}
                <Typography variant="h5" fontWeight={700}>
                    Material Management
                </Typography>

                {/* Center: Tabs */}
                {/* <Tabs
          value={roomTypes.indexOf(selectedRoom)}
          onChange={(event, newValue) => {
            setSelectedRoom(roomTypes[newValue]);
          }}
          variant="scrollable"
          scrollButtons="auto"
          className="tabs-container"
          style={{ flexGrow: 1, display: "flex", justifyContent: "center" }}
        >
          {roomTypes.map((room, index) => (
            <Tab key={index} label={room.name} className="custom-tab" />
          ))}
        </Tabs> */}

                {/* Right: Button */}
                {/* <div className="" style={{ paddingLeft: "215px" }}>
          <Button
            style={{
              boxShadow: "none",
              padding: "7px 20px",
              border: "none",
              color: "white",
            }}
            variant="outlined"
            onClick={() => setOpenRoomListDialog(true)}
            startIcon={<AiFillSetting />}
          />
        </div> */}
            </div>

            {/* badge section here */}

            <div
                style={{
                    margin: "40px",
                    padding: "20px",
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    border: "1px solid #e0e0e0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                {/* Tabs */}
                <Tabs
                    value={roomTypes.indexOf(selectedRoom)}
                    onChange={(event, newValue) => {
                        setSelectedRoom(roomTypes[newValue]);
                    }}
                    variant="scrollable"
                    scrollButtons="auto"
                    style={{
                        height: "50px", // Adjust tab container height
                        flexGrow: 1,
                        backgroundColor: "#fff",
                        borderRadius: "6px",
                        padding: "5px", // Adjust padding for smaller height
                    }}
                >
                    {roomTypes.map((room, index) => (
                        <Tab
                            className="new_custom_tabs"
                            key={index}
                            label={room.name}
                            style={{
                                color: "#333",
                                backgroundColor: "#fff",
                                border: "1px solid black",
                                borderRadius: "4px",
                                margin: "0 5px",
                                fontWeight: "bold",
                                height: "30px", // Reduce individual tab height
                                minHeight: "unset", // Override Material-UI's default minHeight
                                lineHeight: "1.5", // Adjust text alignment
                                padding: "0 10px", // Reduce padding inside the tab
                            }}
                        />
                    ))}
                </Tabs>

                {/* Button */}
                <Button
                    variant="contained"
                    style={{
                        marginLeft: "20px",
                        padding: "7px",
                        minWidth: "auto",
                        backgroundColor: "white",
                        color: "rgb(217, 180, 81)",
                        boxShadow: "none",
                    }}
                    onClick={() => setOpenRoomListDialog(true)}
                >
                    <AiFillSetting size={24} />
                </Button>
            </div>


            <div style={{
                margin: "40px", borderRadius: "8px",
                border: "1px solid #e0e0e0"
            }}>
                <div
                    className=" container-fluid "
                    style={{ padding: "20px", marginBottom: "30px" }}
                >
                    <Box sx={{ paddingLeft: "30px" }}>
                        <div className="text-center d-flex justify-content-between">
                            <h3 className="fw-bold text-warning text-center mb-4">
                                Material List
                            </h3>
                            <div style={{ paddingRight: "30px" }}>
                                <Button
                                    variant="contained"
                                    color="warning"
                                    onClick={() => handleOpenMaterialForm()}
                                    style={{
                                        boxShadow: "none",
                                        padding: "7px 20px",
                                        float: "right",
                                        marginBottom: "24px",
                                    }}
                                >
                                    <AiOutlinePlus />
                                    &nbsp;Add
                                </Button>
                            </div>
                        </div>
                    </Box>

                    <Box sx={{ padding: "30px" }}>
                        <Table className="material-table overflow-auto">
                            <TableHead>
                                <TableRow>
                                    <TableCell style={{ width: "10%" }}>Expanded</TableCell>
                                    <TableCell style={{ width: "65%" }}>Name</TableCell>
                                    <TableCell style={{ width: "25%" }}>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {materials.filter((material) => material.roomId?._id === selectedRoom?._id).length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={3} style={{ textAlign: "center", padding: "20px" }}>
                                            No data available
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    materials
                                        .filter((material) => material.roomId?._id === selectedRoom?._id)
                                        .map((material) => (
                                            <React.Fragment key={material?._id}>
                                                {/* Material Row */}
                                                <TableRow>
                                                    <TableCell>
                                                        <IconButton
                                                            className="icon-btn"
                                                            onClick={() => toggleExpand(material._id)}
                                                        >
                                                            {expandedRows[material._id] ? <FaChevronUp /> : <FaChevronDown />}
                                                        </IconButton>
                                                    </TableCell>
                                                    <TableCell>{material.name}</TableCell>
                                                    <TableCell>
                                                        <IconButton
                                                            className="icon-btn"
                                                            color="primary"
                                                            onClick={() => handleOpenMaterialForm(material)}
                                                        >
                                                            <FaEdit />
                                                        </IconButton>
                                                        <IconButton
                                                            className="icon-btn"
                                                            color="error"
                                                            onClick={() => handleDelete("material", material._id)}
                                                        >
                                                            <FaTrash />
                                                        </IconButton>
                                                        <IconButton
                                                            className="icon-btn"
                                                            title="Add Sub-Material"
                                                            color="warning"
                                                            onClick={() => handleOpenSubMaterialForm(material._id)}
                                                        >
                                                            <AiOutlinePlus />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>

                                                {/* Sub-Material Rows (Hidden until expanded) */}
                                                <TableRow>
                                                    <TableCell colSpan={5} style={{ padding: 0 }}>
                                                        <Collapse
                                                            in={expandedRows[material._id]}
                                                            timeout="auto"
                                                            unmountOnExit
                                                        >
                                                            <Table size="small" className="sub-material-table">
                                                                <TableHead>
                                                                    <TableRow>
                                                                        <TableCell style={{ width: "25%" }}>Name</TableCell>
                                                                        <TableCell style={{ width: "25%" }}>Price ($)</TableCell>
                                                                        <TableCell style={{ width: "25%" }}>Supplier</TableCell>
                                                                        <TableCell style={{ width: "25%" }}>Actions</TableCell>
                                                                    </TableRow>
                                                                </TableHead>
                                                                <TableBody>
                                                                    {subMaterials
                                                                        .filter(
                                                                            (sub) =>
                                                                                sub.materialId?._id === material?._id &&
                                                                                sub.roomId?._id === selectedRoom?._id
                                                                        )
                                                                        .map((sub) => (
                                                                            <TableRow key={sub._id}>
                                                                                <TableCell>{sub.name}</TableCell>
                                                                                <TableCell>{sub.price}</TableCell>
                                                                                <TableCell>{sub.supplier}</TableCell>
                                                                                <TableCell>
                                                                                    <IconButton
                                                                                        className="icon-btn"
                                                                                        color="primary"
                                                                                        onClick={() =>
                                                                                            handleOpenSubMaterialForm(material._id, sub)
                                                                                        }
                                                                                    >
                                                                                        <FaEdit />
                                                                                    </IconButton>
                                                                                    <IconButton
                                                                                        className="icon-btn"
                                                                                        color="error"
                                                                                        onClick={() =>
                                                                                            handleDelete("subMaterial", null, sub._id, null)
                                                                                        }
                                                                                    >
                                                                                        <FaTrash />
                                                                                    </IconButton>
                                                                                </TableCell>
                                                                            </TableRow>
                                                                        ))}
                                                                </TableBody>
                                                            </Table>
                                                        </Collapse>
                                                    </TableCell>
                                                </TableRow>
                                            </React.Fragment>
                                        ))
                                )}
                            </TableBody>
                        </Table>

                    </Box>
                </div>
            </div>

            {/* Material Dialog */}
            <Dialog
                open={showMaterialForm}
                onClose={() => setShowMaterialForm(false)}
            >
                <DialogTitle>{editMode ? "Edit Material" : "Add Material"}</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Name"
                        margin="normal"
                        value={materialForm.name}
                        onChange={(e) =>
                            setMaterialForm({ ...materialForm, name: e.target.value })
                        }
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowMaterialForm(false)}>Cancel</Button>
                    <Button
                        onClick={handleSaveMaterial}
                        variant="contained"
                        color="primary"
                    >
                        {editMode ? "Update" : "Add"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* SubMaterial Dialog */}
            <Dialog
                open={showSubMaterialForm}
                onClose={() => setShowSubMaterialForm(false)}
            >
                <DialogTitle>
                    {editMode ? "Edit Sub-Material" : "Add Sub-Material"}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        margin="normal"
                        fullWidth
                        label="Name"
                        value={subMaterialForm.name}
                        onChange={(e) =>
                            setSubMaterialForm({ ...subMaterialForm, name: e.target.value })
                        }
                    />
                    <TextField
                        fullWidth
                        label="Price"
                        type="number"
                        margin="normal"
                        value={subMaterialForm.price}
                        onChange={(e) =>
                            setSubMaterialForm({ ...subMaterialForm, price: e.target.value })
                        }
                    />
                    <TextField
                        fullWidth
                        label="Supplier"
                        margin="normal"
                        value={subMaterialForm.supplier}
                        onChange={(e) =>
                            setSubMaterialForm({
                                ...subMaterialForm,
                                supplier: e.target.value,
                            })
                        }
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowSubMaterialForm(false)}>Cancel</Button>
                    <Button
                        onClick={handleSaveSubMaterial}
                        variant="contained"
                        color="primary"
                    >
                        {editMode ? "Update" : "Add"}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={openRoomListDialog}
                onClose={() => setOpenRoomListDialog(false)}
                fullWidth
            >
                <DialogTitle>Room List</DialogTitle>
                <DialogContent>
                    <List>
                        {roomTypes.map((room) => (
                            <ListItem
                                key={room._id}
                                secondaryAction={
                                    <>
                                        <IconButton
                                            className="icon-btn"
                                            color="warning"
                                            onClick={() => handleRoomEdit(room)}
                                        >
                                            <FaEdit />
                                        </IconButton>
                                        <IconButton
                                            className="icon-btn"
                                            color="error"
                                            onClick={() => handleDelete("Room", null, null, room._id)}
                                        >
                                            <FaTrash />
                                        </IconButton>
                                    </>
                                }
                                sx={{ borderBottom: "1px solid #ddd" }}
                            >
                                <ListItemText primary={room.name} />
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setOpenRoomListDialog(false)}
                        color="secondary"
                    >
                        Close
                    </Button>
                    <Button
                        onClick={handleOpenAddRoomDialog}
                        variant="contained"
                        color="primary"
                        startIcon={<AiOutlinePlus />}
                    >
                        Add Room
                    </Button>
                </DialogActions>
            </Dialog>
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
                        onChange={(e) => setRoomFormData({ name: e.target.value })}
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
        </Box>
    );
};

export default MaterialPage;
