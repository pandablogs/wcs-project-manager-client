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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  IconButton,
  Chip,
  Stack,
  Divider,
} from "@mui/material";
import * as XLSX from "xlsx";
import Loading from "react-fullscreen-loading";
import { toast } from "react-toastify";
import materialService from "../../services/materialServices";
import { FiUpload, FiChevronDown, FiChevronUp } from "react-icons/fi";

const ROW_BG = {
  room: "#f3f6fb",
  material: "#fafafa",
  sub: "#ffffff",
};

const INDENT = {
  material: 4,
  sub: 8,
};

const FIELD_LABELS = {
  roomName: "Room",
  materialName: "Material",
  subMaterialName: "Sub-Material",
  price: "Price",
  supplier: "Supplier",
};

const MaterialList = () => {
  const [rooms, setRooms] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [subMaterials, setSubMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [importFile, setImportFile] = useState(null);

  const [parsedData, setParsedData] = useState({ headers: [], rows: [] });

  const [columnMapping, setColumnMapping] = useState({
    roomName: "",
    materialName: "",
    subMaterialName: "",
    price: "",
    supplier: "",
  });

  const [importing, setImporting] = useState(false);
  const [expandedRooms, setExpandedRooms] = useState({});
  const [expandedMaterials, setExpandedMaterials] = useState({});

  const toggleRoom = (roomId) => {
    setExpandedRooms((prev) => ({ ...prev, [roomId]: !prev[roomId] }));
  };

  const toggleMaterial = (matId) => {
    setExpandedMaterials((prev) => ({ ...prev, [matId]: !prev[matId] }));
  };

  const isRoomExpanded = (roomId) => expandedRooms[roomId] !== false;
  const isMaterialExpanded = (matId) => expandedMaterials[matId] !== false;

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [roomsRes, materialsRes, subRes] = await Promise.all([
        materialService.getMaterialRoomAll(),
        materialService.getMaterialAll({}),
        materialService.getSubMaterialAll({}),
      ]);

      setRooms(roomsRes.data || []);
      setMaterials(materialsRes.data || []);
      setSubMaterials(subRes.data || []);
    } catch {
      toast.error("Failed to load material list");
    } finally {
      setLoading(false);
    }
  };

  const getMaterialsByRoom = (roomId) =>
    materials.filter((m) => m.roomId?._id === roomId);

  const getSubMaterialsByRoomAndMaterial = (roomId, materialId) =>
    subMaterials.filter(
      (s) => s.roomId?._id === roomId && s.materialId?._id === materialId
    );

  const handleImportClick = () => {
    setImportFile(null);
    setParsedData({ headers: [], rows: [] });
    setImportDialogOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportFile(file);

    const reader = new FileReader();

    reader.onload = (ev) => {
      const data = new Uint8Array(ev.target.result);
      const wb = XLSX.read(data, { type: "array" });
      const sheet = wb.Sheets[wb.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      const headers = json[0].map((h) => String(h || "").trim());

      const rows = json.slice(1).filter((r) =>
        r.some((c) => c != null && String(c).trim() !== "")
      );

      setParsedData({ headers, rows });
    };

    reader.readAsArrayBuffer(file);
  };

  const buildImportRows = () => {
    const { rows } = parsedData;
    const map = columnMapping;

    return rows
      .map((row) => {
        const get = (key) => {
          const idx = map[key];
          if (idx === "" || idx == null) return "";
          const val = row[idx];
          return val != null ? String(val).trim() : "";
        };

        return {
          roomName: get("roomName"),
          materialName: get("materialName"),
          subMaterialName: get("subMaterialName"),
          price: parseFloat(get("price")) || 0,
          supplier: get("supplier"),
        };
      })
      .filter((r) => r.roomName || r.materialName || r.subMaterialName);
  };

  const handleImportSubmit = async () => {
    const rows = buildImportRows();

    if (!rows.length) {
      toast.warning("No valid rows");
      return;
    }

    setImporting(true);

    try {
      const res = await materialService.importMaterialList(rows);

      if (res.status) {
        toast.success("Import completed");
        setImportDialogOpen(false);
        fetchAll();
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error("Import failed");
    } finally {
      setImporting(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>

      {loading && (
        <Loading
          loading={true}
          background="rgba(0,0,0,0.5)"
          loaderColor="#fff"
        />
      )}

      {/* HEADER */}

      <Paper
        elevation={3}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight={700}>
            Material List
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage rooms, materials and suppliers
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<FiUpload />}
          onClick={handleImportClick}
          sx={{
            borderRadius: 2,
            px: 3,
            textTransform: "none",
          }}
        >
          Import Spreadsheet
        </Button>
      </Paper>

      {/* TABLE */}

      <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 3 }}>
        <Table>

          <TableHead>
            <TableRow
              sx={{
                "& th": {
                  fontWeight: 700,
                  background: "#1f2937",
                  color: "#fff",
                },
              }}
            >
              <TableCell width={50} />
              <TableCell width={50} />
              <TableCell>Name</TableCell>
              <TableCell align="right" width={120}>
                Price
              </TableCell>
              <TableCell width={200}>Supplier</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>

            {rooms.map((room) => {

              const mats = getMaterialsByRoom(room._id);
              const roomOpen = isRoomExpanded(room._id);

              return (
                <React.Fragment key={room._id}>

                  {/* ROOM */}

                  <TableRow
                    onClick={() => toggleRoom(room._id)}
                    sx={{
                      bgcolor: ROW_BG.room,
                      cursor: "pointer",
                      "& td": { fontWeight: 700 },
                    }}
                  >
                    <TableCell>
                      <IconButton size="small">
                        {roomOpen ? <FiChevronUp /> : <FiChevronDown />}
                      </IconButton>
                    </TableCell>

                    <TableCell />

                    <TableCell>{room.name}</TableCell>

                    <TableCell />

                    <TableCell />
                  </TableRow>

                  {roomOpen &&
                    mats.map((mat) => {

                      const subs = getSubMaterialsByRoomAndMaterial(
                        room._id,
                        mat._id
                      );

                      const matOpen = isMaterialExpanded(mat._id);

                      return (
                        <React.Fragment key={mat._id}>

                          {/* MATERIAL */}

                          <TableRow
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleMaterial(mat._id);
                            }}
                            sx={{ bgcolor: ROW_BG.material }}
                          >
                            <TableCell />

                            <TableCell>
                              <IconButton size="small">
                                {matOpen ? (
                                  <FiChevronUp />
                                ) : (
                                  <FiChevronDown />
                                )}
                              </IconButton>
                            </TableCell>

                            <TableCell sx={{ pl: INDENT.material }}>
                              {mat.name}
                            </TableCell>

                            <TableCell />

                            <TableCell />
                          </TableRow>

                          {matOpen &&
                            subs.map((sub) => (
                              <TableRow key={sub._id} hover>

                                <TableCell />
                                <TableCell />

                                <TableCell sx={{ pl: INDENT.sub }}>
                                  {sub.name}
                                </TableCell>

                                <TableCell align="right">
                                  <Chip
                                    label={`$${sub.price?.toFixed(2)}`}
                                    sx={{
                                      fontWeight: 600,
                                      borderRadius: 2,
                                      bgcolor: "#2563eb",
                                      color: "#fff",
                                    }}
                                  />
                                </TableCell>

                                <TableCell>
                                  {sub.supplier || "—"}
                                </TableCell>

                              </TableRow>
                            ))}
                        </React.Fragment>
                      );
                    })}
                </React.Fragment>
              );
            })}

          </TableBody>
        </Table>

        {rooms.length === 0 && !loading && (
          <Box sx={{ p: 6, textAlign: "center", color: "gray" }}>
            No materials found
          </Box>
        )}
      </TableContainer>

      {/* IMPORT DIALOG */}

      <Dialog
        open={importDialogOpen}
        onClose={() => !importing && setImportDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>
          Import Materials
        </DialogTitle>

        <Divider />

        <DialogContent sx={{ py: 3 }}>

          <Stack spacing={2}>

            <Button variant="outlined" component="label">
              Choose Spreadsheet
              <input
                hidden
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileChange}
              />
            </Button>

            {importFile && (
              <Typography color="text.secondary">
                Selected file: {importFile.name}
              </Typography>
            )}

            {parsedData.headers.length > 0 && (
              <>
                <Typography fontWeight={600}>
                  Map Spreadsheet Columns
                </Typography>

                <Stack direction="row" spacing={2} flexWrap="wrap">

                  {Object.keys(FIELD_LABELS).map((key) => (
                    <FormControl key={key} size="small" sx={{ minWidth: 160 }}>

                      <InputLabel>
                        {FIELD_LABELS[key]}
                      </InputLabel>

                      <Select
                        value={columnMapping[key] ?? ""}
                        label={FIELD_LABELS[key]}
                        onChange={(e) =>
                          setColumnMapping((prev) => ({
                            ...prev,
                            [key]:
                              e.target.value === ""
                                ? ""
                                : Number(e.target.value),
                          }))
                        }
                      >
                        <MenuItem value="">—</MenuItem>

                        {parsedData.headers.map((h, i) => (
                          <MenuItem key={i} value={i}>
                            {h}
                          </MenuItem>
                        ))}
                      </Select>

                    </FormControl>
                  ))}

                </Stack>
              </>
            )}

          </Stack>

        </DialogContent>

        <Divider />

        <DialogActions sx={{ p: 2 }}>

          <Button
            onClick={() => setImportDialogOpen(false)}
            disabled={importing}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleImportSubmit}
            disabled={importing || !parsedData.rows.length}
          >
            {importing ? "Importing..." : "Import"}
          </Button>

        </DialogActions>
      </Dialog>

    </Container>
  );
};

export default MaterialList;