import { useEffect, useState } from "react";
import {
    Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TablePagination, TableSortLabel, TextField, Button, Dialog, DialogActions,
    DialogContent, DialogTitle, FormControlLabel, Switch
} from "@mui/material";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { AiOutlinePlus } from 'react-icons/ai';
import Loading from "react-fullscreen-loading";
import { toast } from "react-toastify";
import { RiShareForward2Fill } from "react-icons/ri";
import { useNavigate, useParams } from "react-router-dom";
import materialService from "../../services/materialServices";

const SubMaterialDetails = () => {

    const { matId, id } = useParams();
    const [subMaterialTypes, setsubMaterialTypes] = useState([]);
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
        search: "",
        roomId: id,
        materialId: matId,
    });

    const [openSubMaterialFormDialog, setopenSubMaterialFormDialog] = useState(false);
    const [subMaterialFormData, setsubMaterialFormData] = useState({
        id: null,
        name: "",
        price: "",
        supplier: "",
    });
    const [editingSubMaterialId, seteditingSubMaterialId] = useState(null);
    const [selectedRoom, setselectedRoom] = useState({})
    const [selectedMaterial, setselectedMaterial] = useState({})
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => {
        fetchSubMaterial();
        fetchRoomById(id)
        fetchMaterialById(matId)
    }, [queryParams, id, matId]);

    const fetchSubMaterial = async () => {
        setLoading(true);
        try {
            const res = await materialService.getSubMaterial(queryParams); // Must support pagination server-side
            const data = res.data || {};
            setsubMaterialTypes(data?.subMaterials || []);
            setTotalPages(data.totalPages || 1);
            setTotalDocs(data.totalRecords || 0);
        } catch (err) {
            console.error(err);
            setError("Failed to fetch SubMaterials");
        } finally {
            setLoading(false);
        }
    };

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

    const fetchMaterialById = async (id) => {
        setLoading(true);
        try {
            const res = await materialService.getMaterialById(id); // Must support pagination server-side
            const data = res.data || {};
            setselectedMaterial(data);
        } catch (err) {
            console.error(err);
            setError("Failed to fetch Room Data");
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
            await materialService.deleteSubMaterial(deleteTargetId);
            toast.success("SubMaterials deleted successfully");
            fetchSubMaterial();
        } catch (err) {
            toast.error("Failed to delete SubMaterials");
        } finally {
            setDeletingId(null);
            setDeleteTargetId(null);
            setShowDeleteModal(false);
        }
    };

    const handlesubMaterialsEdit = (data) => {
        setsubMaterialFormData({ name: data.name, supplier: data?.supplier, price: data?.price });
        seteditingSubMaterialId(data._id);
        setopenSubMaterialFormDialog(true);
    };

    const handlesubMaterialsAddOrEdit = async () => {
        setLocalLoading(true);
        try {
            const payload = {
                ...subMaterialFormData,
                roomId: id,
                materialId: matId
            }
            if (editingSubMaterialId) {
                await materialService.updateSubMaterial(editingSubMaterialId, subMaterialFormData);
                toast.success("SubMaterials updated successfully");
            } else {
                await materialService.addSubMaterial(payload);
                toast.success("SubMaterials added successfully");
            }
            setsubMaterialFormData({ name: "", supplier: '', price: '' });
            seteditingSubMaterialId(null);
            fetchSubMaterial();
            setopenSubMaterialFormDialog(false);
        } catch (err) {
            toast.error("Failed to save SubMaterials");
        } finally {
            setLocalLoading(false);
        }
    };

    return (
        <>
            <Paper sx={{ padding: 2, boxShadow: 'none' }}>
                {localLoading && (
                    <Loading loading={true} background="rgba(0,0,0,0.5)" loaderColor="#fff" />
                )}

                <div className="text-center d-flex justify-content-between mb-4">
                    <h3 className="fw-bold text-warning">SubMaterial Categories</h3>


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
                                setsubMaterialFormData({ name: "", supplier: '', price: '' });
                                seteditingSubMaterialId(null);
                                setopenSubMaterialFormDialog(true);
                            }}
                            startIcon={<AiOutlinePlus />}
                        >
                            Add
                        </Button>
                    </div>
                </div>
                <div>
                    <h5 className="fw-bolder text-muted">Room: {selectedRoom?.name || '-'}</h5>
                    <h5 className="fw-bolder text-muted">Material: {selectedMaterial?.name || '-'}</h5>
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
                                        <TableCell>Supplier</TableCell>
                                        <TableCell>Value</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {subMaterialTypes.map((data) => (
                                        <TableRow key={data._id}>
                                            <TableCell>{data.name ? data.name : '-'}</TableCell>
                                            <TableCell>{data.supplier ? data.supplier : '-'}</TableCell>
                                            <TableCell>{data.price ? data.price : '-'}</TableCell>
                                            <TableCell>
                                                <FiEdit
                                                    className="me-3"
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={() => handlesubMaterialsEdit(data)}
                                                />
                                                <FiTrash2
                                                    className="me-3"
                                                    style={{ cursor: 'pointer', opacity: deletingId === data._id ? 0.5 : 1 }}
                                                    onClick={() => confirmDelete(data._id)}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>


                        {
                            subMaterialTypes?.length === 0 ?
                                <div className="text-center">
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
                    <DialogContent>Are you sure you want to delete this SubMaterials?</DialogContent>
                    <DialogActions>
                        <Button onClick={() => setShowDeleteModal(false)} color="secondary">Cancel</Button>
                        <Button onClick={handleDelete} color="error" disabled={deletingId === deleteTargetId}>
                            {deletingId === deleteTargetId ? "Deleting..." : "Delete"}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Add/Edit Room Dialog */}
                <Dialog open={openSubMaterialFormDialog} onClose={() => setopenSubMaterialFormDialog(false)} fullWidth>
                    <DialogTitle>{editingSubMaterialId ? "Edit SubMaterials" : "Add SubMaterials"}</DialogTitle>
                    <DialogContent>
                        <TextField
                            fullWidth
                            label="SubMaterials Name"
                            variant="outlined"
                            margin="dense"
                            value={subMaterialFormData.name}
                            onChange={(e) => setsubMaterialFormData(prev => ({ ...prev, name: e.target.value }))}
                        />
                        <TextField
                            fullWidth
                            label="SubMaterials Supplier"
                            variant="outlined"
                            margin="dense"
                            value={subMaterialFormData.supplier}
                            onChange={(e) => setsubMaterialFormData(prev => ({ ...prev, supplier: e.target.value }))}
                        />
                        <TextField
                            type="number"
                            fullWidth
                            label={`SubMaterials ${selectedRoom?.percentageType ? 'Percentage' : 'Price'}`}
                            variant="outlined"
                            margin="dense"
                            value={subMaterialFormData.price}
                            onChange={(e) => setsubMaterialFormData(prev => ({ ...prev, price: e.target.value }))}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setopenSubMaterialFormDialog(false)} color="secondary">Cancel</Button>
                        <Button onClick={handlesubMaterialsAddOrEdit} variant="contained" color="primary">
                            {editingSubMaterialId ? "Update" : "Add"}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Paper>
        </>
    )
}

export default SubMaterialDetails;