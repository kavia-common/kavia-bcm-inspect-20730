import { useEffect, useMemo, useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { ChevronDown, ChevronRight, Folder } from "lucide-react";
import DomainCardWithMenu from "pages/domain/domaincardwithmenu";
import CustomMenu from "components/common/CustomMenu";
import CreateCapability from "./create-capability";
import { ShimmerBox } from "utils/ShimmerBox";
import { objectToQueryString } from "components/common/helper";
import {
  createDomain,
  deleteCorecapability,
  fetchDomainByCapability,
  fetchTemplateDomainByCapability,
  patchCorecapability,
} from "apis";
import { DEFAULT_CONFIG } from "config/defaultConfig";

interface CapabilityCardProps {
  id: string;
  name: string;
  isEditable: boolean;
  onUpdate: () => void;
  isEdited?: boolean;
  isExpanded?: boolean;
  onToggle?: () => void;
  index?: number;
  capabilityColor?: string;
  totalDomains?: number;
}

const CapabilityCard = ({
  id,
  name,
  isEditable,
  onUpdate,
  isExpanded = false,
  onToggle,
  capabilityColor,
  totalDomains,
}: CapabilityCardProps) => {
  const [domainList, setDomainList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState(false);

  const bgColor = useMemo(() => {
    if (capabilityColor && capabilityColor.trim() !== "") {
      return capabilityColor.startsWith("#")
        ? capabilityColor
        : `linear-gradient(90deg, ${capabilityColor}, ${capabilityColor})`;
    }
    return "#008C8C";
  }, [capabilityColor]);

  /** Fetch domains when expanded */
  useEffect(() => {
    const fetchDomains = async () => {
      setLoading(true);
      const params = { core_id: id };
      const queryString = objectToQueryString(params);

      try {
        const data = isEditable
          ? await fetchDomainByCapability(queryString)
          : await fetchTemplateDomainByCapability(queryString);
        setDomainList(data);
      } catch (error) {
        console.error("Error fetching domains:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isExpanded && domainList.length === 0) {
      fetchDomains();
    }
  }, [isExpanded, id, isEditable]);

  /** Edit capability name */
  const handleEditCapability = async (newName: string) => {
    try {
      await patchCorecapability(id, JSON.stringify({ name: newName }));
      onUpdate?.();
    } catch (error) {
      console.error("Error updating capability:", error);
    }
  };

  /** Delete capability */
  const handleDeleteCapability = async () => {
    try {
      await deleteCorecapability(id);
      onUpdate?.();
    } catch (error) {
      console.error("Error deleting capability:", error);
    }
  };

  /** Add domain */
  const handleCreateDomain = async (obj: object) => {
    try {
      await createDomain(JSON.stringify({ ...obj, core_id: id }));
      setOpen(false);

      const params = { core_id: id };
      const queryString = objectToQueryString(params);
      const data = isEditable
        ? await fetchDomainByCapability(queryString)
        : await fetchTemplateDomainByCapability(queryString);
      setDomainList(data);
    } catch (error) {
      console.error("Error creating domain:", error);
    }
  };

  return (
    <Box sx={{ marginBottom: "24px" }}>
      {/* ===== Capability Header ===== */}
      <Box
        sx={{
          background: bgColor,
          borderRadius: "14px",
          padding: { xs: "14px 16px", sm: "18px 20px" },
          display: "flex",
          alignItems: "center",
          gap: { xs: "10px", sm: "14px" },
          cursor: "pointer",
          position: "relative",
          transition: "all 0.3s ease",
          boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
          "&:hover": {
            boxShadow: "0 6px 12px rgba(0,0,0,0.15)",
            transform: "translateY(-2px)",
          },
        }}
        onClick={onToggle}
      >
        {isExpanded ? (
          <ChevronDown size={20} color="white" style={{ flexShrink: 0 }} />
        ) : (
          <ChevronRight size={20} color="white" style={{ flexShrink: 0 }} />
        )}

        <Folder size={22} color="white" style={{ flexShrink: 0 }} />

        {/* Text container - single line with ellipsis */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
            overflow: "hidden",
          }}
        >
          {/* Capability Title - SINGLE LINE with ellipsis */}
          <Typography
            sx={{
              color: "white",
              fontWeight: 700,
              fontSize: { xs: "0.95rem", sm: "1rem" },
              lineHeight: 1.4,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {name}
          </Typography>

          {/* Domain count - SINGLE LINE with ellipsis */}
          <Typography
            sx={{
              color: "rgba(255,255,255,0.85)",
              fontSize: { xs: "11px", sm: "13px" },
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {domainList.length || totalDomains} domains mapped
          </Typography>
        </Box>

        {isEditable && (
          <Box sx={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                setOpen(true);
              }}
              sx={{
                color: "white",
                p: { xs: 0.5, sm: 1 },
                transition: "transform 0.2s ease",
                "&:hover": { transform: "scale(1.1)" },
              }}
            >
              <AddCircleIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
            </IconButton>

            <CustomMenu
              anchorEl={anchorEl}
              onOpen={(e) => {
                e.stopPropagation();
                setAnchorEl(e.currentTarget);
              }}
              onClose={() => setAnchorEl(null)}
              onEdit={() => {}}
              onDelete={handleDeleteCapability}
              capabilityName={name}
              label="Business Capability"
              editEndpoint={`${DEFAULT_CONFIG.server.rest.baseURL}coreCapability/${id}`}
              deleteEndpointCall={`${DEFAULT_CONFIG.server.rest.baseURL}coreCapability/${id}`}
              onSave={(newName) => handleEditCapability(newName)}
              color="white"
              menuStyle={{
                top: "23px",
                right: "6px",
                color: "white",
              }}
            />
          </Box>
        )}
      </Box>

      {/* ===== Domains List ===== */}
      {isExpanded && (
        <Box
          sx={{
            mt: 2,
            ml: { xs: 3, sm: 5 },
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
            alignItems: "flex-start",
            backgroundColor: "transparent",
          }}
        >
          {loading ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1, width: "100%" }}>
              <ShimmerBox sx={{ height: "80px" }} />
              <ShimmerBox sx={{ height: "80px" }} />
            </Box>
          ) : domainList.length > 0 ? (
            domainList.map((domain) => (
              <Box key={domain.id} sx={{ width: "100%" }}>
                <DomainCardWithMenu
                  id={domain.id}
                  name={domain.name}
                  isEditable={isEditable}
                  capabilityColor={capabilityColor}
                  onSave={async () => {
                    const params = { core_id: id };
                    const queryString = objectToQueryString(params);
                    const data = await fetchDomainByCapability(queryString);
                    setDomainList(data);
                  }}
                />
              </Box>
            ))
          ) : (
            <Typography
              sx={{
                color: "gray",
                fontSize: { xs: "12px", sm: "14px" },
                textAlign: "center",
                mt: 1,
                width: "100%",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              No domains found
            </Typography>
          )}
        </Box>
      )}

      {/* ===== Create Domain Modal ===== */}
      <CreateCapability
        open={open}
        onClose={() => setOpen(false)}
        label="Domain"
        clickHandler={handleCreateDomain}
      />
    </Box>
  );
};

export default CapabilityCard;