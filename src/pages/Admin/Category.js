import React, { useEffect, useState } from "react";
import {
    Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TablePagination, TableSortLabel, TextField, Button, Dialog, DialogActions,
    DialogContent, DialogTitle, FormControlLabel, Switch
} from "@mui/material";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { AiOutlinePlus } from 'react-icons/ai';
import Loading from "react-fullscreen-loading";
import { toast } from "react-toastify";
import { Modal } from "react-bootstrap";
import materialService from "../../services/materialServices";
import { RiShareForward2Fill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

const Category = () => {
    const [roomTypes, setRoomTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [localLoading, setLocalLoading] = useState(false);
    const [error, setError] = useState('');
    const [totalPages, setTotalPages] = useState(1);
    const [totalDocs, setTotalDocs] = useState(0);
    const navigate = useNavigate();
    const [queryParams, setQueryParams] = useState({
        page: 1,
        limit: 5,
        sortField: "",
        sortOrder: 0,
        search: ""
    });

    const [openRoomFormDialog, setOpenRoomFormDialog] = useState(false);
    const [roomFormData, setRoomFormData] = useState({ name: "", percentageType: false });
    const [editingRoomId, setEditingRoomId] = useState(null);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => {
        fetchRooms();
    }, [queryParams]);

    const fetchRooms = async () => {
        setLoading(true);
        try {
            const res = await materialService.getMaterialRoom(queryParams); // Must support pagination server-side
            const data = res.data || {};
            setRoomTypes(data.rooms || []);
            setTotalPages(data.totalPages || 1);
            setTotalDocs(data.totalRecords || 0);
        } catch (err) {
            console.error(err);
            setError("Failed to fetch rooms");
        } finally {
            setLoading(false);
        }
    };

    const handleSort = (field) => {
        setQueryParams(prev => {
            const isSameField = prev.sortField === field;
            const nextSortOrder = isSameField
                ? (prev.sortOrder === -1 ? 1 : prev.sortOrder === 1 ? 0 : -1)
                : -1;

            return {
                ...prev,
                sortField: nextSortOrder === 0 ? "" : field,
                sortOrder: nextSortOrder
            };
        });
    };

    const handleSearchChange = (e) => {
        setQueryParams(prev => ({ ...prev, search: e.target.value, page: 1 }));
    };

    const handleChangePage = (_, newPage) => {
        setQueryParams(prev => ({ ...prev, page: newPage + 1 }));
    };

    const handleChangeRowsPerPage = (e) => {
        setQueryParams(prev => ({ ...prev, limit: parseInt(e.target.value, 10), page: 1 }));
    };

    const confirmDelete = (id) => {
        setShowDeleteModal(true);
        setDeleteTargetId(id);
    };

    const handleDelete = async () => {
        setDeletingId(deleteTargetId);
        try {
            await materialService.deleteMaterialRoom(deleteTargetId);
            toast.success("Room deleted successfully");
            fetchRooms();
        } catch (err) {
            toast.error("Failed to delete room");
        } finally {
            setDeletingId(null);
            setDeleteTargetId(null);
            setShowDeleteModal(false);
        }
    };

    const handleRoomEdit = (room) => {
        setRoomFormData({ name: room.name, percentageType: room.percentageType || false });
        setEditingRoomId(room._id);
        setOpenRoomFormDialog(true);
    };

    const handleRoomAddOrEdit = async () => {
        setLocalLoading(true);
        try {
            if (editingRoomId) {
                await materialService.updateMaterialRoom(editingRoomId, roomFormData);
                toast.success("Room updated successfully");
            } else {
                await materialService.addMaterialRoom(roomFormData);
                toast.success("Room added successfully");
            }
            setRoomFormData({ name: "", percentageType: false });
            setEditingRoomId(null);
            fetchRooms();
            setOpenRoomFormDialog(false);
        } catch (err) {
            toast.error("Failed to save room");
        } finally {
            setLocalLoading(false);
        }
    };

    const categoryDetails = (room) => {
        navigate(`/material/${room?._id}`);
    }

    return (
        <Paper sx={{ padding: 2, boxShadow: 'none' }}>
            {localLoading && (
                <Loading loading={true} background="rgba(0,0,0,0.5)" loaderColor="#fff" />
            )}

            <div className="text-center d-flex justify-content-between mb-4">
                <h3 className="fw-bold text-warning">Room Categories</h3>
                <div>
                    <TextField
                        label="Search"
                        variant="outlined"
                        size="small"
                        value={queryParams.search}
                        onChange={handleSearchChange}
                        style={{ marginInline: '10px' }}
                    />
                    <Button
                        variant="contained"
                        color="warning"
                        onClick={() => {
                            setRoomFormData({ name: "", percentageType: false });
                            setEditingRoomId(null);
                            setOpenRoomFormDialog(true);
                        }}
                        startIcon={<AiOutlinePlus />}
                    >
                        Add
                    </Button>
                </div>
            </div>

            {loading ? (
                <Loading loading={true} loaderColor="#f18271" />
            ) : error ? (
                <div className="text-danger">{error}</div>
            ) : (
                <>
                    <TableContainer component={Paper} style={{ boxShadow: 'none', border: '1px solid #80808075' }}>
                        <Table>
                            <TableHead>
                                <TableRow style={{ backgroundColor: "#f3f4f6" }}>
                                    <TableCell>
                                        <TableSortLabel
                                            active={queryParams.sortField === "name" && queryParams.sortOrder !== 0}
                                            direction={queryParams.sortOrder === 1 ? "asc" : "desc"}
                                            onClick={() => handleSort("name")}
                                        >
                                            Name
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell>Type</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {roomTypes.map((room) => (
                                    <TableRow key={room._id}>
                                        <TableCell>{room.name}</TableCell>
                                        <TableCell>{room.percentageType ? "Percentage(%)" : "Price($)"}</TableCell>
                                        <TableCell>
                                            <FiEdit
                                                className="me-3"
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => handleRoomEdit(room)}
                                            />
                                            <FiTrash2
                                                className="me-3"
                                                style={{ cursor: 'pointer', opacity: deletingId === room._id ? 0.5 : 1 }}
                                                onClick={() => confirmDelete(room._id)}
                                            />
                                            <RiShareForward2Fill
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => categoryDetails(room)}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <TablePagination
                        component="div"
                        count={totalDocs}
                        page={queryParams.page - 1}
                        onPageChange={handleChangePage}
                        rowsPerPage={queryParams.limit}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        rowsPerPageOptions={[5, 10, 25, 50]}
                    />
                </>
            )}

            {/* Delete Modal */}
            <Dialog open={showDeleteModal} onClose={() => setShowDeleteModal(false)} fullWidth maxWidth="xs">
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>Are you sure you want to delete this room?</DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowDeleteModal(false)} color="secondary">Cancel</Button>
                    <Button onClick={handleDelete} color="error" disabled={deletingId === deleteTargetId}>
                        {deletingId === deleteTargetId ? "Deleting..." : "Delete"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Add/Edit Room Dialog */}
            <Dialog open={openRoomFormDialog} onClose={() => setOpenRoomFormDialog(false)} fullWidth>
                <DialogTitle>{editingRoomId ? "Edit Room" : "Add Room"}</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Room Name"
                        variant="outlined"
                        margin="dense"
                        value={roomFormData.name}
                        onChange={(e) => setRoomFormData(prev => ({ ...prev, name: e.target.value }))}
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                checked={roomFormData.percentageType}
                                onChange={(e) => setRoomFormData(prev => ({
                                    ...prev,
                                    percentageType: e.target.checked,
                                }))}
                                color="primary"
                            />
                        }
                        label="Enable Percentage Type"
                        className="mt-2"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenRoomFormDialog(false)} color="secondary">Cancel</Button>
                    <Button onClick={handleRoomAddOrEdit} variant="contained" color="primary">
                        {editingRoomId ? "Update" : "Add"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
};

export default Category;
