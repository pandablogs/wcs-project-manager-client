import { useNavigate, useParams } from "react-router-dom";
import materialService from "../../services/materialServices";
import { useEffect, useState } from "react";
import Loading from "react-fullscreen-loading";
import {
    Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TablePagination, TableSortLabel, TextField, Button, Dialog, DialogActions,
    DialogContent, DialogTitle, FormControlLabel, Switch
} from "@mui/material";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { RiShareForward2Fill } from "react-icons/ri";
import { AiOutlinePlus } from 'react-icons/ai';
import { toast } from "react-toastify";

const MaterialDetails = () => {

    const { id } = useParams();
    const [categoryTypes, setcategoryTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [totalPages, setTotalPages] = useState(1);
    const [totalDocs, setTotalDocs] = useState(0);
    const [localLoading, setLocalLoading] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const [queryParams, setQueryParams] = useState({
        roomId: id,
        page: 1,
        limit: 5,
        sortField: "",
        sortOrder: 0,
        search: ""
    });
    const [openMertialFormDialog, setopenMertialFormDialog] = useState(false);
    const [editingmaterialId, seteditingmaterialId] = useState(null);
    const [materialFormData, setmaterialFormData] = useState({ name: "" });
    const [selectedRoom, setselectedRoom] = useState({})

    const navigate = useNavigate();

    const fetchMaterial = async () => {
        setLoading(true);
        try {
            const res = await materialService.getMaterial(queryParams); // Must support pagination server-side
            const data = res.data || {};
            setcategoryTypes(data?.materials || []);
            setTotalPages(data?.totalPages || 1);
            setTotalDocs(data?.totalRecords || 0);
        } catch (err) {
            console.error(err);
            setError("Failed to fetch material");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMaterial();
        fetchRoomById(id);
    }, [queryParams]);

    const fetchRoomById = async (id) => {
        setLoading(true);
        try {
            const res = await materialService.getMaterialRoomById(id); // Must support pagination server-side
            const data = res.data || {};
            setselectedRoom(data);
        } catch (err) {
            console.error(err);
            setError("Failed to fetch Room Data");
        } finally {
            setLoading(false);
        }
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
            await materialService.deleteMaterial(deleteTargetId);
            toast.success("Material deleted successfully");
            fetchMaterial();
        } catch (err) {
            toast.error("Failed to delete Material");
        } finally {
            setDeletingId(null);
            setDeleteTargetId(null);
            setShowDeleteModal(false);
        }
    };

    const handleMaterialEdit = (material) => {
        setmaterialFormData({ name: material.name });
        seteditingmaterialId(material._id);
        setopenMertialFormDialog(true);
    };

    const handleSearchChange = (e) => {
        setQueryParams(prev => ({ ...prev, search: e.target.value, page: 1 }));
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

    const handleMaterialAddOrEdit = async () => {
        setLocalLoading(true);
        try {
            const payload = {
                ...materialFormData,
                roomId: id
            }
            if (editingmaterialId) {
                await materialService.updateMaterial(editingmaterialId, materialFormData);
                toast.success("Material updated successfully");
            } else {
                await materialService.addMaterial(payload);
                toast.success("Material added successfully");
            }
            setmaterialFormData({ name: "" });
            seteditingmaterialId(null);
            fetchMaterial();
            setopenMertialFormDialog(false);
        } catch (err) {
            toast.error("Failed to save Material");
        } finally {
            setLocalLoading(false);
        }
    };

    const subMaterialDetails = (data) => {
        navigate(`/material/${id}/${data?._id}`);
    }

    return (
        <>
            <Paper sx={{ padding: 2, boxShadow: 'none' }}>
                {localLoading && (
                    <Loading loading={true} background="rgba(0,0,0,0.5)" loaderColor="#fff" />
                )}

                <div className="text-center d-flex justify-content-between mb-4">
                    <h3 className="fw-bold text-warning">Material Categories</h3>

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
                                setmaterialFormData({ name: "" });
                                seteditingmaterialId(null);
                                setopenMertialFormDialog(true);
                            }}
                            startIcon={<AiOutlinePlus />}
                        >
                            Add
                        </Button>
                    </div>
                </div>
                <h5 className="fw-bolder text-muted">Room: {selectedRoom?.name || '-'}</h5>
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
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {categoryTypes.map((data) => (
                                        <TableRow key={data._id}>
                                            <TableCell>{data.name}</TableCell>
                                            <TableCell>
                                                <FiEdit
                                                    className="me-3"
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={() => handleMaterialEdit(data)}
                                                />
                                                <FiTrash2
                                                    className="me-3"
                                                    style={{ cursor: 'pointer', opacity: deletingId === data._id ? 0.5 : 1 }}
                                                    onClick={() => confirmDelete(data._id)}
                                                />
                                                <RiShareForward2Fill
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={() => subMaterialDetails(data)}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {
                            categoryTypes?.length === 0 ?
                                <div>
                                    No Data Found
                                </div>
                                : ''
                        }

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
                    <DialogContent>Are you sure you want to delete this Material?</DialogContent>
                    <DialogActions>
                        <Button onClick={() => setShowDeleteModal(false)} color="secondary">Cancel</Button>
                        <Button onClick={handleDelete} color="error" disabled={deletingId === deleteTargetId}>
                            {deletingId === deleteTargetId ? "Deleting..." : "Delete"}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Add/Edit Room Dialog */}
                <Dialog open={openMertialFormDialog} onClose={() => setopenMertialFormDialog(false)} fullWidth>
                    <DialogTitle>{editingmaterialId ? "Edit Material" : "Add Material"}</DialogTitle>
                    <DialogContent>
                        <TextField
                            fullWidth
                            label="Material Name"
                            variant="outlined"
                            margin="dense"
                            value={materialFormData.name}
                            onChange={(e) => setmaterialFormData(prev => ({ ...prev, name: e.target.value }))}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setopenMertialFormDialog(false)} color="secondary">Cancel</Button>
                        <Button onClick={handleMaterialAddOrEdit} variant="contained" color="primary">
                            {editingmaterialId ? "Update" : "Add"}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Paper>
        </>
    )
}

export default MaterialDetails;