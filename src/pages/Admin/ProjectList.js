import React, { useEffect, useState } from 'react';
import { Table, Spinner, Alert, Button, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import materialService from '../../services/materialServices';
import { toast } from "react-toastify";
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import './ProjectList.scss'

const ProjectList = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deletingId, setDeletingId] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = () => {
        setLoading(true);
        materialService.getProjects()
            .then(res => {
                if (res.status) {
                    setProjects(res.data || []);
                } else {
                    setError("Failed to fetch projects.");
                }
            })
            .catch(() => setError("Something went wrong."))
            .finally(() => setLoading(false));
    };

    const confirmDelete = (id) => {
        setDeleteTargetId(id);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        setDeletingId(deleteTargetId);
        try {
            await materialService.deleteProject(deleteTargetId);
            toast.success("Project deleted successfully.");
            fetchProjects();
        } catch (err) {
            toast.error("Failed to delete project.");
        } finally {
            setDeletingId(null);
            setShowDeleteModal(false);
            setDeleteTargetId(null);
        }
    };


    const countSubMaterials = (rooms) =>
        rooms.reduce((acc, room) =>
            acc + room.materials.reduce((mAcc, material) => mAcc + material.subMaterials.length, 0), 0);

    const countMaterials = (rooms) =>
        rooms.reduce((acc, room) => acc + room.materials.length, 0);

    return (
        <div className="project-list-container">
            <div className="header">
                <h4>Projects</h4>
                <button className="btn-add" onClick={() => navigate('/project-estimater')}>
                    + Add
                </button>
            </div>

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
                                <th>Rooms</th>
                                <th>Materials</th>
                                <th>Sub-Materials</th>
                                <th>Budget</th>
                                {/* <th>Status</th> */}
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projects.map((project) => (
                                <tr key={project._id}>
                                    <td>
                                        <div className="name-block">
                                            <strong>{project.name}</strong>
                                            {/* <div className="text-muted small">
                                                ID: {project._id.slice(0, 8)}
                                            </div> */}
                                        </div>
                                    </td>
                                    <td>{project.rooms.length}</td>
                                    <td>{countMaterials(project.rooms)}</td>
                                    <td>{countSubMaterials(project.rooms)}</td>
                                    <td>${project.totalBudget}</td>
                                    {/* <td>
                                        <span className="status-pill active">Active</span>
                                    </td> */}
                                    <td className="action-icons ">
                                        <FiEdit
                                            className="icon edit me-2"
                                            onClick={() => navigate(`/project-estimater/${project._id}`)}
                                        />
                                        <FiTrash2
                                            className="icon delete"
                                            onClick={() => confirmDelete(project._id)}
                                            style={{ opacity: deletingId === project._id ? 0.5 : 1 }}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
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
                        onClick={handleDeleteConfirm}
                        disabled={deletingId === deleteTargetId}
                    >
                        {deletingId === deleteTargetId ? 'Deleting...' : 'Delete'}
                    </button>
                </Modal.Footer>
            </Modal>

        </div>
    );
};

export default ProjectList;
