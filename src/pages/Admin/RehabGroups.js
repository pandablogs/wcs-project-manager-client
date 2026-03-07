import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  IconButton,
} from "@mui/material";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { AiOutlinePlus } from "react-icons/ai";
import Loading from "react-fullscreen-loading";
import { toast } from "react-toastify";
import materialService from "../../services/materialServices";
import rehabGroupService from "../../services/rehabGroupServices";

const RehabGroups = () => {
  const [groups, setGroups] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [subMaterials, setSubMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: "", description: "", items: [] });
  const [addRoomId, setAddRoomId] = useState("");
  const [addMaterialId, setAddMaterialId] = useState("");
  const [addSubId, setAddSubId] = useState("");
  const [addQty, setAddQty] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null });

  useEffect(() => {
    fetchGroups();
    fetchCatalog();
  }, []);

  const fetchCatalog = async () => {
    try {
      const [rRes, mRes, sRes] = await Promise.all([
        materialService.getMaterialRoomAll(),
        materialService.getMaterialAll({}),
        materialService.getSubMaterialAll({}),
      ]);
      setRooms(rRes.data || []);
      setMaterials(mRes.data || []);
      setSubMaterials(sRes.data || []);
    } catch (err) {
      toast.error("Failed to load rooms/materials");
    }
  };

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const res = await rehabGroupService.getAll();
      setGroups(res.data || []);
    } catch (err) {
      toast.error("Failed to load rehab groups");
    } finally {
      setLoading(false);
    }
  };

  const materialsInRoom = (roomId) => materials.filter((m) => m.roomId?._id === roomId);
  const subMaterialsInMaterial = (materialId) =>
    subMaterials.filter((s) => s.materialId?._id === materialId);

  const openCreate = () => {
    setEditingId(null);
    setForm({ name: "", description: "", items: [] });
    setAddRoomId("");
    setAddMaterialId("");
    setAddSubId("");
    setAddQty(1);
    setDialogOpen(true);
  };

  const openEdit = (group) => {
    setEditingId(group._id);
    setForm({
      name: group.name || "",
      description: group.description || "",
      items: (group.items || []).map((i) => ({
        roomId: i.roomId?._id || i.roomId,
        materialId: i.materialId?._id || i.materialId,
        subMaterialId: i.subMaterialId?._id || i.subMaterialId,
        defaultQuantity: i.defaultQuantity ?? 1,
      })),
    });
    setAddRoomId("");
    setAddMaterialId("");
    setAddSubId("");
    setAddQty(1);
    setDialogOpen(true);
  };

  const addItem = () => {
    if (!addRoomId || !addMaterialId || !addSubId) {
      toast.warning("Select room, material, and sub-material");
      return;
    }
    const exists = form.items.some(
      (i) =>
        i.roomId === addRoomId &&
        i.materialId === addMaterialId &&
        i.subMaterialId === addSubId
    );
    if (exists) {
      toast.info("Already in group");
      return;
    }
    setForm((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          roomId: addRoomId,
          materialId: addMaterialId,
          subMaterialId: addSubId,
          defaultQuantity: addQty >= 0 ? addQty : 1,
        },
      ],
    }));
    setAddSubId("");
    setAddQty(1);
  };

  const removeItem = (index) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const getItemLabel = (item) => {
    const room = rooms.find((r) => r._id === item.roomId);
    const mat = materials.find((m) => m._id === item.materialId);
    const sub = subMaterials.find((s) => s._id === item.subMaterialId);
    return `${room?.name || "?"} → ${mat?.name || "?"} → ${sub?.name || "?"}`;
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.warning("Enter a group name");
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        await rehabGroupService.update(editingId, form);
        toast.success("Rehab group updated");
      } else {
        await rehabGroupService.create(form);
        toast.success("Rehab group created");
      }
      setDialogOpen(false);
      fetchGroups();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm.id) return;
    try {
      await rehabGroupService.delete(deleteConfirm.id);
      toast.success("Rehab group deleted");
      setDeleteConfirm({ open: false, id: null });
      fetchGroups();
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  return (
    <Container className="py-4">
      {loading && (
        <Loading loading={true} background="rgba(0,0,0,0.5)" loaderColor="#fff" />
      )}

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
          mb: 2,
          p: 2,
          background: "#d9b451",
          color: "white",
          borderRadius: 1,
        }}
      >
        <Typography variant="h5" fontWeight={700}>
          Rehab Groups
        </Typography>
        <Button
          variant="contained"
          startIcon={<AiOutlinePlus />}
          onClick={openCreate}
          sx={{ bgcolor: "white", color: "#d9b451", "&:hover": { bgcolor: "#f5f5f5" } }}
        >
          Add Rehab Group
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={1}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: "#333", "& th": { color: "#fff" } }}>
              <TableCell component="th">Name</TableCell>
              <TableCell component="th">Description</TableCell>
              <TableCell component="th" align="right">Materials</TableCell>
              <TableCell component="th" align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {groups.map((g) => (
              <TableRow key={g._id}>
                <TableCell sx={{ fontWeight: 600 }}>{g.name}</TableCell>
                <TableCell sx={{ color: "text.secondary" }}>{g.description || "—"}</TableCell>
                <TableCell align="right">{g.items?.length || 0}</TableCell>
                <TableCell align="center">
                  <IconButton size="small" onClick={() => openEdit(g)} title="Edit">
                    <FiEdit />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => setDeleteConfirm({ open: true, id: g._id })}
                    title="Delete"
                  >
                    <FiTrash2 />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {groups.length === 0 && !loading && (
          <Box sx={{ p: 3, textAlign: "center", color: "text.secondary" }}>
            No rehab groups yet. Create one to add preset material lists (e.g. Kitchen) to your
            project estimates.
          </Box>
        )}
      </TableContainer>

      <Dialog open={dialogOpen} onClose={() => !saving && setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingId ? "Edit" : "New"} Rehab Group</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Group name"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Description (optional)"
            value={form.description}
            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            margin="normal"
          />
          <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
            Add materials to this group
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, alignItems: "center" }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Room</InputLabel>
              <Select
                value={addRoomId}
                label="Room"
                onChange={(e) => {
                  setAddRoomId(e.target.value);
                  setAddMaterialId("");
                  setAddSubId("");
                }}
              >
                <MenuItem value="">—</MenuItem>
                {rooms.map((r) => (
                  <MenuItem key={r._id} value={r._id}>{r.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Material</InputLabel>
              <Select
                value={addMaterialId}
                label="Material"
                onChange={(e) => {
                  setAddMaterialId(e.target.value);
                  setAddSubId("");
                }}
                disabled={!addRoomId}
              >
                <MenuItem value="">—</MenuItem>
                {materialsInRoom(addRoomId).map((m) => (
                  <MenuItem key={m._id} value={m._id}>{m.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel>Sub-Material</InputLabel>
              <Select
                value={addSubId}
                label="Sub-Material"
                onChange={(e) => setAddSubId(e.target.value)}
                disabled={!addMaterialId}
              >
                <MenuItem value="">—</MenuItem>
                {subMaterialsInMaterial(addMaterialId).map((s) => (
                  <MenuItem key={s._id} value={s._id}>
                    {s.name} — ${s.price?.toFixed(2)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              type="number"
              size="small"
              label="Qty"
              value={addQty}
              onChange={(e) => setAddQty(parseInt(e.target.value, 10) || 1)}
              inputProps={{ min: 0 }}
              sx={{ width: 70 }}
            />
            <Button variant="outlined" size="small" onClick={addItem}>
              Add
            </Button>
          </Box>
          {form.items.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="caption" color="text.secondary">
                In this group ({form.items.length})
              </Typography>
              <Box component="ul" sx={{ m: 0, pl: 2.5, maxHeight: 200, overflow: "auto" }}>
                {form.items.map((item, idx) => (
                  <li key={idx} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span>{getItemLabel(item)}</span>
                    <span style={{ color: "#666" }}>×{item.defaultQuantity}</span>
                    <IconButton size="small" onClick={() => removeItem(idx)} sx={{ p: 0 }}>
                      <FiTrash2 size={14} />
                    </IconButton>
                  </li>
                ))}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} disabled={saving}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteConfirm.open} onClose={() => setDeleteConfirm({ open: false, id: null })}>
        <DialogTitle>Delete rehab group?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm({ open: false, id: null })}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default RehabGroups;
