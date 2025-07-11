import React, { useEffect, useState } from 'react';
import {
    Button, Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Paper, Dialog, DialogActions, DialogContent,
    DialogTitle, TextField, TablePagination, TableSortLabel, CircularProgress
} from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import materialService from '../../services/materialServices';
import { toast } from "react-toastify";
import { AiOutlinePlus } from 'react-icons/ai';
import Loading from "react-fullscreen-loading";


const ProjectList = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [totalPages, setTotalPages] = useState(1);
    const [totalDocs, setTotalDocs] = useState(0);

    const [deletingId, setDeletingId] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState(null);

    const navigate = useNavigate();

    const [queryParams, setQueryParams] = useState({
        page: 1,
        limit: 10,
        sortField: "",
        sortOrder: 0,
        search: ""
    });

    useEffect(() => {
        fetchProjects();
    }, [queryParams]);

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const res = await materialService.getProjects(queryParams);
            if (res.data) {
                setProjects(res.data.projects || []);
                setTotalPages(res.data.totalPages || 1);
                setTotalDocs(res.data.totalRecords || 0); // ✅ FIXED: use totalRecords
            } else {
                setError("Failed to fetch projects.");
            }
        } catch (err) {
            setError("Something went wrong.");
        } finally {
            setTimeout(() => {
                setLoading(false);
                // toast.success("Project fetch successfully!");
            }, 1000);

        }
    };

    const confirmDelete = (id) => {
        setDeleteTargetId(id);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {

        setDeletingId(deleteTargetId);
        try {
            setLoading(true);
            await materialService.deleteProject(deleteTargetId);
            toast.success("Project deleted successfully.");
            fetchProjects();
        } catch (err) {
            toast.error("Failed to delete project.");
        } finally {
            setTimeout(() => {
                setLoading(false);
                // toast.success("Project fetch successfully!");
            }, 1000);
            setDeletingId(null);
            setShowDeleteModal(false);
            setDeleteTargetId(null);
        }
    };

    const countMaterials = (rooms) =>
        rooms.reduce((acc, room) => acc + room.materials.length, 0);

    const countSubMaterials = (rooms) =>
        rooms.reduce((acc, room) =>
            acc + room.materials.reduce((mAcc, mat) => mAcc + mat.subMaterials.length, 0), 0);

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

    return (
        <Paper sx={{ padding: 2, boxShadow: 'none' }}>

            <div className="text-center d-flex justify-content-between">
                <h3 className="fw-bold text-warning text-center mb-4">Project LIST</h3>
                <div>

                    <TextField
                        label="Search"
                        variant="outlined"
                        size="small"
                        value={queryParams.search}
                        onChange={handleSearchChange}
                        style={{ marginBottom: '24px', marginInline: '10px' }}
                    />
                    <Button variant="contained" color="warning" onClick={() => navigate('/project-estimater')} style={{ boxShadow: 'none', padding: '7px 20px', float: 'right', marginBottom: '24px' }}>
                        <AiOutlinePlus /> 	&nbsp;  Add
                    </Button>
                </div>
            </div>

            {loading ? (
                <Loading loading={true} loaderColor="#f18271" />
            ) : error ? (
                <div style={{ color: 'red' }}>{error}</div>
            ) : (
                <>
                    <TableContainer component={Paper} style={{ boxShadow: 'none', border: '1px solid #80808075' }}>
                        <Table>
                            <TableHead>
                                <TableRow style={{ backgroundColor: "#f3f4f6" }}>
                                    <TableCell className="py-2">
                                        <TableSortLabel
                                            active={queryParams.sortField === "name" && queryParams.sortOrder !== 0}
                                            direction={queryParams.sortOrder === 1 ? "asc" : "desc"}
                                            onClick={() => handleSort("name")}
                                        >
                                            Name
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell className="py-2"> Rooms</TableCell>
                                    <TableCell className="py-2">Materials</TableCell>
                                    <TableCell className="py-2">Sub-Materials</TableCell>
                                    <TableCell className="py-2"> <TableSortLabel
                                        active={queryParams.sortField === "totalBudget" && queryParams.sortOrder !== 0}
                                        direction={queryParams.sortOrder === 1 ? "asc" : "desc"}
                                        onClick={() => handleSort("totalBudget")}
                                    >Budget </TableSortLabel></TableCell>
                                    <TableCell className="py-2">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {projects.map(project => (
                                    <TableRow key={project._id}>
                                        <TableCell>{project.name}</TableCell>
                                        <TableCell>{project.rooms.length}</TableCell>
                                        <TableCell>{countMaterials(project.rooms)}</TableCell>
                                        <TableCell>{countSubMaterials(project.rooms)}</TableCell>
                                        <TableCell>${project.totalBudget}</TableCell>
                                        <TableCell>
                                            <FiEdit
                                                className="icon edit me-2"
                                                onClick={() => navigate(`/project-estimater/${project._id}`)}
                                                style={{ cursor: 'pointer', marginRight: 8 }}
                                            />
                                            <FiTrash2
                                                className="icon delete"
                                                onClick={() => confirmDelete(project._id)}
                                                style={{
                                                    cursor: 'pointer',
                                                    opacity: deletingId === project._id ? 0.5 : 1
                                                }}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <TablePagination
                        component="div"
                        count={totalDocs} // ✅ now correctly mapped from totalRecords
                        page={queryParams.page - 1}
                        onPageChange={handleChangePage}
                        rowsPerPage={queryParams.limit}
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

                </>
            )}

            {/* Delete Modal */}
            <Dialog open={showDeleteModal} onClose={() => setShowDeleteModal(false)} fullWidth maxWidth="xs">
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete this project?
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowDeleteModal(false)} color="secondary">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDeleteConfirm}
                        color="error"
                        disabled={deletingId === deleteTargetId}
                    >
                        {deletingId === deleteTargetId ? "Deleting..." : "Delete"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
};

export default ProjectList;
