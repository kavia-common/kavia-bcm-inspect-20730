import { useState } from "react";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import { ChevronDown, ChevronRight, Folder, FileText } from "lucide-react";
import { ShimmerBox } from "utils/ShimmerBox";
import { objectToQueryString } from "components/common/helper";
import CreateCapability from "pages/capability/create-capability";
import {
  createSubdomain,
  fetchSubdomainByDomain,
  fetchTemplateSubdomainByDomain,
} from "apis";
import CustomMenu from "components/common/CustomMenu";
import { DEFAULT_CONFIG } from "config/defaultConfig";
import MoreVertIcon from "@mui/icons-material/MoreVert";

// Utility: lighten color
const lightenColor = (color: string, percent: number) => {
  const num = parseInt(color.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = ((num >> 8) & 0x00ff) + amt;
  const B = (num & 0x0000ff) + amt;
  return (
    "#" +
    (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1)
  );
};

const DomainCard = ({ id, name, isEditable, capabilityColor = "#008C8C" }: any) => {
  const [subDomainList, setSubDomainList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);

  // Domain menu anchor
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Subdomain menu anchors
  const [subMenuAnchors, setSubMenuAnchors] = useState<{ [key: string]: HTMLElement | null }>({});

  /** Fetch subdomains when expanded */
  const handleExpand = async (_: any, isExpanded: boolean) => {
    setExpanded(isExpanded);
    if (!isExpanded) return;

    setLoading(true);
    const params = { domain_id: id };
    const queryString = objectToQueryString(params);

    try {
      const data = isEditable
        ? await fetchSubdomainByDomain(queryString)
        : await fetchTemplateSubdomainByDomain(queryString);
      setSubDomainList(data);
    } catch (error) {
      console.error("Error fetching subdomains:", error);
    } finally {
      setLoading(false);
    }
  };

  /** Create Subdomain */
  const handleCreateSubdomain = async (obj: object, callback: any) => {
    try {
      await createSubdomain(JSON.stringify({ ...obj, domain_id: id }));
      callback?.();
      await handleExpand(null, true);
      setOpen(false);
    } catch (error) {
      console.error("Error creating subdomain:", error);
    }
  };

  return (
    <Accordion
      disableGutters
      expanded={expanded}
      onChange={handleExpand}
      sx={{
        backgroundColor: "transparent",
        borderRadius: "12px",
        boxShadow: "none",
        mb: 1,
        width: "100%",
        ml: 0,
        overflow: "visible",
        "&:before": { display: "none" },
      }}
    >
      {/* ===== Domain Header ===== */}
      <AccordionSummary
        sx={{
          background: `linear-gradient(90deg, ${lightenColor(capabilityColor, 20)}, ${lightenColor(
            capabilityColor,
            35
          )})`,
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
          minHeight: "64px",
          "& .MuiAccordionSummary-content": {
            margin: 0,
            display: "flex",
            alignItems: "center",
            width: "100%",
            justifyContent: "space-between",
          },
          "& .MuiAccordionSummary-expandIconWrapper": {
            display: "none",
          },
        }}
      >
        {/* Left: Expand Icon + Folder + Name */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, flex: 1, minWidth: 0 }}>
          {expanded ? (
            <ChevronDown size={22} color="white" style={{ flexShrink: 0 }} />
          ) : (
            <ChevronRight size={22} color="white" style={{ flexShrink: 0 }} />
          )}
          <Folder size={22} color="white" style={{ flexShrink: 0 }} />
          
          {/* Text container with ellipsis */}
          <Box sx={{ flex: 1, minWidth: 0, overflow: "hidden" }}>
            <Typography
              sx={{
                color: "white",
                fontWeight: 700,
                fontSize: { xs: "0.9rem", sm: "1rem" },
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                lineHeight: 1.4,
              }}
            >
              {name}
            </Typography>
            <Typography
              sx={{
                color: "rgba(255,255,255,0.85)",
                fontSize: { xs: "11px", sm: "13px" },
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {subDomainList.length} subdomains mapped
            </Typography>
          </Box>
        </Box>

        {/* Right: Add + Domain Menu */}
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
              onEdit={() => console.log("Edit domain:", name)}
              onDelete={() => console.log("Delete domain:", name)}
              capabilityName={name}
              label="Domain"
              color="white"
              onSave={(newName) => console.log("Saved new domain name:", newName)}
              editEndpoint={`${DEFAULT_CONFIG.server.rest.baseURL}domain/${id}`}
              deleteEndpointCall={`${DEFAULT_CONFIG.server.rest.baseURL}domain/${id}`}
              menuStyle={{ top: "23px", right: "6px", color: "white" }}
            />
          </Box>
        )}
      </AccordionSummary>

      {/* ===== Subdomains List ===== */}
      <AccordionDetails
        sx={{
          backgroundColor: "transparent",
          p: 0,
          pt: 1.5,
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        {loading ? (
          <>
            <ShimmerBox sx={{ height: 70 }} />
            <ShimmerBox sx={{ height: 70 }} />
          </>
        ) : subDomainList.length > 0 ? (
          subDomainList.map((subDomain) => {
            const subAnchorEl = subMenuAnchors[subDomain.id] || null;

            return (
              <Box
                key={subDomain.id}
                sx={{
                  backgroundColor: lightenColor(capabilityColor, 60),
                  borderRadius: "14px",
                  px: 2,
                  py: 1.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  minHeight: "56px",
                  gap: 1.5,
                  ml: { xs: 3, sm: 4 },
                }}
              >
                {/* Left: File icon + subdomain name - SINGLE LINE */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, flex: 1, minWidth: 0 }}>
                  <FileText size={18} color="#1F2937" style={{ flexShrink: 0 }} />
                  <Typography
                    sx={{
                      color: "#1F2937",
                      fontWeight: 600,
                      fontSize: { xs: "13px", sm: "14px" },
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {subDomain.name}
                  </Typography>
                </Box>

                {/* Right: Subdomain Custom Menu */}
                {isEditable && (
                  <Box sx={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
                    <IconButton
                      size="small"
                      onClick={(e) =>
                        setSubMenuAnchors((prev) => ({ ...prev, [subDomain.id]: e.currentTarget }))
                      }
                      sx={{
                        color: "#1F2937",
                        transform: "translateX(7px)",
                        "&:hover": { 
                          color: "#111827",
                          backgroundColor: "rgba(0,0,0,0.04)",
                        },
                      }}
                    >
                      <MoreVertIcon sx={{ fontSize: 20 }} />
                    </IconButton>

                    <CustomMenu
                      anchorEl={subMenuAnchors[subDomain.id]}
                      onOpen={(e) =>
                        setSubMenuAnchors((prev) => ({ ...prev, [subDomain.id]: e.currentTarget }))
                      }
                      onClose={() =>
                        setSubMenuAnchors((prev) => ({ ...prev, [subDomain.id]: null }))
                      }
                      onEdit={() => console.log("Edit subdomain:", subDomain.name)}
                      onDelete={() => console.log("Delete subdomain:", subDomain.name)}
                      capabilityName={subDomain.name}
                      label="Subdomain"
                      color="white"
                      onSave={() => handleExpand(null, true)}
                      editEndpoint={`${DEFAULT_CONFIG.server.rest.baseURL}subdomain/${subDomain.id}`}
                      deleteEndpointCall={`${DEFAULT_CONFIG.server.rest.baseURL}subdomain/${subDomain.id}`}
                      menuStyle={{ top: "23px", right: "6px" }}
                    />
                  </Box>
                )}
              </Box>
            );
          })
        ) : (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              textAlign: "center",
              py: 1,
              ml: { xs: 3, sm: 4 },
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            No subdomains available.
          </Typography>
        )}
      </AccordionDetails>

      {/* Add Subdomain Modal */}
      <CreateCapability
        open={open}
        onClose={() => setOpen(false)}
        label="Subdomain"
        clickHandler={handleCreateSubdomain}
      />
    </Accordion>
  );
};

export default DomainCard;