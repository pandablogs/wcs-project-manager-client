import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjectManager, deleteProjectManager, updateProjectManager, addProjectManager } from "../../redux/slices/projectManagerSlice";
import {
    Button, Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Paper, Dialog, DialogActions, DialogContent,
    DialogTitle, TextField, TablePagination, TableSortLabel
} from "@mui/material";
import { AiOutlinePlus } from "react-icons/ai";
import Loading from "react-fullscreen-loading";
import { toast } from "react-toastify";
import { FiEdit, FiTrash2 } from "react-icons/fi";

const ProjectManagerList = () => {
    const dispatch = useDispatch();
    const { project_managerList, loading } = useSelector((state) => state.project_manager);

    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [openAdd, setOpenAdd] = useState(false);
    const [selectedProjectManager, setSelectedProjectManager] = useState(null);
    const [localLoading, setLocalLoading] = useState(false); // Loader state

    const [formData, setFormData] = useState({ firstName: "", lastName: "", phone: "", email: "", password: "", confirmPassword: "" });
    const [queryParams, setQueryParams] = useState({
        page: 1,
        limit: 10,
        sortField: "firstName",
        sortOrder: -1,
        search: ""
    });

    useEffect(() => {
        setLocalLoading(true);
        dispatch(fetchProjectManager(queryParams));
        setTimeout(() => {
            setLocalLoading(false);
        }, 1000);
        console.log("--------calll", queryParams)
    }, [dispatch, queryParams]);

    const handleSearchChange = (e) => {
        setQueryParams(prev => ({ ...prev, search: e.target.value, page: 1 }));
    };

    const handleSort = (field) => {
        setQueryParams(prev => ({
            ...prev,
            sortField: field,
            sortOrder: prev.sortField === field
                ? (prev.sortOrder === -1 ? 1 : prev.sortOrder === 1 ? 0 : -1)
                : -1
        }));
    };


    const handleChangePage = (event, newPage) => {
        setQueryParams(prev => ({ ...prev, page: newPage + 1 }));
    };

    const handleChangeRowsPerPage = (event) => {
        setQueryParams(prev => ({ ...prev, limit: parseInt(event.target.value, 10), page: 1 }));
    };

    // Open Add Dialog
    const handleAdd = () => {
        setFormData({ firstName: "", lastName: "", phone: "", email: "", password: "", confirmPassword: "" });
        setOpenAdd(true);
    };

    // Close Add Dialog
    const handleCloseAdd = () => {
        setOpenAdd(false);
    };

    // Handle Add Save
    const handleSaveAdd = async () => {
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        const payload = {
            role_type: "project_manager",
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.phone,
            email: formData.email,
            password: formData.password
        };
        await dispatch(addProjectManager(payload));
        setOpenAdd(false);
    };

    // Open Edit Dialog
    const handleEdit = (project_manager) => {
        setSelectedProjectManager(project_manager);
        setFormData({ firstName: project_manager.firstName, lastName: project_manager.lastName, phone: project_manager.phone, email: project_manager.email });
        setOpenEdit(true);
    };

    // Close Edit Dialog
    const handleCloseEdit = () => {
        setOpenEdit(false);
    };

    // Handle Edit Save
    const handleSaveEdit = async () => {
        setLocalLoading(true);
        await dispatch(updateProjectManager({ id: selectedProjectManager._id, projectManagerData: formData }));
        setOpenEdit(false);

        setTimeout(() => {
            setLocalLoading(false);
            toast.success("ProjectManager details updated successfully!");
        }, 1000);
    };

    // Confirm Delete Action with Loader & Toast
    const handleDelete = () => {
        setLocalLoading(true);
        dispatch(deleteProjectManager(selectedProjectManager._id));
        setOpenDelete(false);

        setTimeout(() => {
            setLocalLoading(false);
            toast.success("ProjectManager deleted successfully!");
        }, 1000);
    };

    // Open Delete Confirmation
    const handleDeleteConfirm = (project_manager) => {
        setSelectedProjectManager(project_manager);
        setOpenDelete(true);
    };

    // Confirm Delete Action


    return (
        <div className=" container-fluid " style={{ padding: '20px' }}>
            <div className="text-center d-flex justify-content-between">
                <h3 className="fw-bold text-warning text-center mb-4">Project Manager LIST</h3>
                <div>

                    <TextField
                        label="Search"
                        variant="outlined"
                        size="small"
                        value={queryParams.search}
                        onChange={handleSearchChange}
                        style={{ marginBottom: '24px', marginInline: '10px' }}
                    />
                    <Button variant="contained" color="warning" onClick={handleAdd} style={{ boxShadow: 'none', padding: '7px 20px', float: 'right', marginBottom: '24px' }}>
                        <AiOutlinePlus /> 	&nbsp;  Add
                    </Button>
                </div>
            </div>

            {localLoading && <Loading loading={true} loaderColor="#f18271" />}

            {!loading && (
                <TableContainer component={Paper} style={{ boxShadow: 'none', border: '1px solid #80808075' }}>
                    <Table>
                        <TableHead>
                            <TableRow style={{ backgroundColor: "#f3f4f6" }}>
                                <TableCell className="py-2">#</TableCell>
                                <TableCell className="py-2"> <TableSortLabel
                                    active={queryParams.sortOrder !== 0 && queryParams.sortField === "firstName"}
                                    direction={queryParams.sortOrder === -1 ? "desc" : queryParams.sortOrder === 1 ? "asc" : undefined}
                                    onClick={() => handleSort("firstName")}
                                >
                                    First Name
                                </TableSortLabel></TableCell>
                                <TableCell className="py-2">  <TableSortLabel
                                    active={queryParams.sortOrder !== 0 && queryParams.sortField === "lastName"}
                                    direction={queryParams.sortOrder === -1 ? "desc" : queryParams.sortOrder === 1 ? "asc" : undefined}
                                    onClick={() => handleSort("lastName")}
                                >
                                    Last Name
                                </TableSortLabel></TableCell>
                                <TableCell className="py-2">  <TableSortLabel
                                    active={queryParams.sortOrder !== 0 && queryParams.sortField === "phone"}
                                    direction={queryParams.sortOrder === -1 ? "desc" : queryParams.sortOrder === 1 ? "asc" : undefined}
                                    onClick={() => handleSort("phone")}
                                >
                                    Phone
                                </TableSortLabel></TableCell>
                                <TableCell className="py-2">  <TableSortLabel
                                    active={queryParams.sortOrder !== 0 && queryParams.sortField === "email"}
                                    direction={queryParams.sortOrder === -1 ? "desc" : queryParams.sortOrder === 1 ? "asc" : undefined}
                                    onClick={() => handleSort("email")}
                                >
                                    Email
                                </TableSortLabel></TableCell>
                                <TableCell className="py-2">Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {project_managerList.map((project_manager, index) => (
                                <TableRow key={project_manager._id} hover>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{project_manager.firstName}</TableCell>
                                    <TableCell>{project_manager.lastName}</TableCell>
                                    <TableCell>{project_manager.phone}</TableCell>
                                    <TableCell>{project_manager.email}</TableCell>
                                    {/* <TableCell >
                                        <button className=" border-0 bg-transparent" onClick={() => handleEdit(project_manager)}>
                                            <i className="fa fa-edit mr-1 fa-iconclredit mx-2 edit-btn"></i>
                                        </button>

                                        <button className=" border-0 bg-transparent" onClick={() => handleDeleteConfirm(project_manager)}>
                                            <i className="fa fa-trash fa-iconclrtrace mx-2 delate-btn"></i>
                                        </button>
                                    </TableCell> */}
                                    <TableCell>
                                        <FiEdit
                                            className="icon edit me-2"
                                            onClick={() => handleEdit(project_manager)}
                                            style={{ cursor: 'pointer', marginRight: 8 }}
                                        />
                                        <FiTrash2
                                            className="icon delete"
                                            onClick={() => handleDeleteConfirm(project_manager)}
                                            style={{
                                                cursor: 'pointer'
                                            }}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
            <TablePagination
                component="div"
                count={project_managerList.length}
                page={queryParams.page - 1}
                rowsPerPage={queryParams.limit}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25, 50]}
                sx={{
                    "& .MuiTablePagination-toolbar": {
                        backgroundColor: "#f3f4f6",
                        borderRadius: "8px",
                        padding: "8px 16px",
                        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                    },
                    "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
                        fontSize: "14px",
                        fontWeight: "500",
                        color: "#333",
                    },
                    "& .MuiTablePagination-actions button": {
                        color: "#f18271",
                    },
                }}
            />

            {/* Add Dialog */}
            <Dialog open={openAdd} onClose={handleCloseAdd} maxWidth="sm" fullWidth>
                <DialogTitle>Add New Project Manager</DialogTitle>
                <DialogContent>
                    <TextField
                        label="First Name"
                        fullWidth
                        margin="dense"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    />
                    <TextField
                        label="Last Name"
                        fullWidth
                        margin="dense"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    />
                    <TextField
                        label="Phone"
                        fullWidth
                        margin="dense"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                    <TextField
                        label="Email"
                        fullWidth
                        margin="dense"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    <TextField
                        label="Password"
                        type="password"
                        fullWidth
                        margin="dense"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                    <TextField
                        label="Confirm Password"
                        type="password"
                        fullWidth
                        margin="dense"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAdd} color="secondary" variant="outlined">Cancel</Button>
                    <Button onClick={handleSaveAdd} color="primary" variant="contained">Add</Button>
                </DialogActions>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={openEdit} onClose={handleCloseEdit} maxWidth="sm" fullWidth>
                <DialogTitle>Edit ProjectManager</DialogTitle>
                <DialogContent>
                    <TextField
                        label="First Name"
                        fullWidth
                        margin="dense"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    />
                    <TextField
                        label="Last Name"
                        fullWidth
                        margin="dense"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    />
                    <TextField
                        label="Phone"
                        fullWidth
                        margin="dense"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                    <TextField
                        label="Email"
                        fullWidth
                        margin="dense"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseEdit} color="secondary" variant="outlined">Cancel</Button>
                    <Button onClick={handleSaveEdit} color="primary" variant="contained">Save</Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={openDelete} onClose={() => setOpenDelete(false)} maxWidth="xs" fullWidth>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>Are you sure you want to delete {selectedProjectManager?.firstName}?</DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDelete(false)} color="secondary" variant="outlined">Cancel</Button>
                    <Button onClick={handleDelete} color="error" variant="contained">Delete</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default ProjectManagerList;