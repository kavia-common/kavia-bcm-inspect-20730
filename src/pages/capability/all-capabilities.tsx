import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import AddIcon from "@mui/icons-material/Add";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { CustomButton } from "components";
import CapabilityCard from "./card-capability";
import CreateCapability from "./create-capability";
import {
  createCorecapability,
  fetchCorecapability,
  getDashBoardCounts,
  fetchDomainByCapability,
  fetchSubdomainByDomain,
} from "apis";
import { Card, CardContent, Avatar } from "@mui/material";
import { Network, Package, CheckCircle } from "lucide-react";

interface Capability {
  id: string;
  name: string;
  color?: string;
  is_edited?: boolean;
  totalDomainCount?: number;
}

interface DashboardCounts {
  coreCapabilityCount: number;
  domainCount: number;
  subDomainCount: number;
}

interface AllCapabilitiesProps {
  isEditable?: boolean;
}

function AllCapabilities({ isEditable = true }: AllCapabilitiesProps) {
  const [capabilityList, setCapabilityList] = useState<Capability[]>([]);
  const [dashboardCounts, setDashboardCounts] = useState<DashboardCounts | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expandedCapabilities, setExpandedCapabilities] = useState<Record<string, boolean>>({});

  const fetchCapabilities = async () => {
    setLoading(true);
    try {
      const data = await fetchCorecapability();
      setCapabilityList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching capabilities:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardCounts = async () => {
    try {
      const data = await getDashBoardCounts();
      setDashboardCounts({
        coreCapabilityCount: Number(data.coreCapabilityCount),
        domainCount: Number(data.domainCount),
        subDomainCount: Number(data.subDomainCount),
      });
    } catch (error) {
      console.error("Error fetching dashboard counts:", error);
    }
  };

  const fetchCapabilitiesWithDomainCounts = async () => {
    try {
      const coreCapabilities: any[] = await fetchCorecapability();
  
      // Fetch domains per capability
      const domainResults: any[][] = await Promise.all(
        coreCapabilities.map((core) => fetchDomainByCapability(`core_id=${core.id}`))
      );
  
      // Fetch subdomains per domain
      const subdomainPromises: Promise<any[]>[] = [];
      domainResults.forEach((domains) => {
        domains.forEach((domain) => {
          subdomainPromises.push(fetchSubdomainByDomain(`domain_id=${domain.id}`));
        });
      });
  
      const subdomainResults: any[][] = await Promise.all(subdomainPromises);
  
      // Map domain ID → subdomain count
      const subdomainCountMap: Record<string, number> = {};
      subdomainResults.forEach((subdomains, index) => {
        const flatDomains = domainResults.flat();
        const domainId = flatDomains[index]?.id;
        if (domainId) subdomainCountMap[domainId] = subdomains.length;
      });
  
      // Map capabilities with total domain + subdomain count
      const capabilitiesWithCounts: Capability[] = coreCapabilities.map((core, idx) => {
        const domains = domainResults[idx] || [];
        let subdomainCount = 0;
        domains.forEach((domain) => {
          subdomainCount += subdomainCountMap[domain.id] || 0;
        });
  
        return {
          id: core.id,
          name: core.name,
          color: core.color || "#008C8C",
          totalDomainCount: domains.length,
        } as Capability & { totalDomainCount: number };
      });
  
      setCapabilityList(capabilitiesWithCounts);
    } catch (error) {
      console.error("Error fetching capabilities with domain counts:", error);
    }
  };  

  const handleCreateCapability = async (obj: any, callback?: () => void) => {
    try {
      await createCorecapability(JSON.stringify({ name: obj.name, color: obj.color || "#008C8C" }));
      setCapabilityList((prev) => [
        ...prev,
        {
          id: `${Date.now()}`,
          name: obj.name,
          color: obj.color || "#008C8C",
        },
      ]);
      await fetchDashboardCounts();
      callback?.();
      setOpen(false);
    } catch (error) {
      console.error("Error creating capability:", error);
    }
  };

  const handleExpandAll = () => {
    const allExpanded = capabilityList.reduce((acc, cap) => {
      acc[cap.id] = true;
      return acc;
    }, {} as Record<string, boolean>);
    setExpandedCapabilities(allExpanded);
  };

  const handleCollapseAll = () => {
    setExpandedCapabilities({});
  };

  useEffect(() => {
    fetchCapabilities();
    fetchDashboardCounts();
    fetchCapabilitiesWithDomainCounts();
  }, []);
  

  // KPI Card Component
  const KPICard = ({
    title,
    value,
    icon: Icon,
    color,
  }: {
    title: string;
    value: number | string;
    icon: React.ElementType;
    color: string;
  }) => (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        borderRadius: 3,
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        backgroundColor: "#F9FAFB",
        border: "1px solid #E5E7EB",
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
          transform: "translateY(-2px)",
        },
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          alignItems: "center",
          gap: { xs: 1.5, sm: 2 },
          flex: 1,
          p: { xs: 2, sm: 2.5 },
          "&:last-child": { pb: { xs: 2, sm: 2.5 } },
        }}
      >
        <Avatar
          sx={{
            bgcolor: color,
            width: { xs: 48, sm: 56 },
            height: { xs: 48, sm: 56 },
            boxShadow: `0 4px 12px ${color}40`,
            flexShrink: 0,
          }}
        >
          <Icon size={28} color="#fff" />
        </Avatar>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="subtitle2"
            sx={{
              color: "#6B7280",
              mb: 0.5,
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
              fontWeight: 500,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {title}
          </Typography>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "#1F2937",
              lineHeight: 1.2,
              fontSize: { xs: "1.5rem", sm: "1.75rem" },
            }}
          >
            {value ?? 0}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ flexGrow: 1, p: { xs: 2, sm: 3 }, backgroundColor: "#F9FAFB", minHeight: "100vh" }}>
      {/* Header */}
      <Box 
        display="flex" 
        alignItems={{ xs: "flex-start", sm: "center" }}
        justifyContent="space-between" 
        mb={4} 
        flexDirection={{ xs: "column", sm: "row" }}
        gap={2}
      >
        <Box sx={{ width: { xs: "100%", sm: "auto" } }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700, 
              mb: 0.5, 
              color: "#1F2937", 
              fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            Capability Management
          </Typography>
          <Typography 
            sx={{ 
              color: "#6B7280", 
              fontSize: { xs: "0.875rem", sm: "0.95rem" },
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            Organize and manage your business capabilities hierarchy
          </Typography>
        </Box>

        {isEditable && (
          <Box 
            display="flex" 
            alignItems="center" 
            gap={1.5} 
            flexWrap="wrap"
            sx={{ width: { xs: "100%", sm: "auto" } }}
            justifyContent={{ xs: "flex-start", sm: "flex-end" }}
          >
            <Button
              variant="contained"
              onClick={handleExpandAll}
              sx={{
                textTransform: "none",
                backgroundColor: "#008C8C",
                color: "#fff",
                fontWeight: 600,
                px: { xs: 2, sm: 2.5, md: 3 },
                py: { xs: 0.75, sm: 1 },
                borderRadius: 2,
                boxShadow: "0 2px 8px rgba(0,140,140,0.3)",
                "&:hover": { 
                  backgroundColor: "#007070", 
                  boxShadow: "0 4px 12px rgba(0,140,140,0.4)" 
                },
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                minWidth: "fit-content",
              }}
            >
              Expand All
            </Button>

            <Button
              variant="outlined"
              onClick={handleCollapseAll}
              sx={{
                textTransform: "none",
                borderColor: "#008C8C",
                color: "#008C8C",
                fontWeight: 600,
                px: { xs: 2, sm: 2.5, md: 3 },
                py: { xs: 0.75, sm: 1 },
                borderRadius: 2,
                "&:hover": { 
                  borderColor: "#007070", 
                  backgroundColor: "rgba(0,140,140,0.04)" 
                },
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                minWidth: "fit-content",
              }}
            >
              Collapse All
            </Button>

            <CustomButton
              icon={<AddIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />}
              type="button"
              title="Add Capability"
              color="white"
              backgroundColor="#A3E635"
              handleClick={() => setOpen(true)}
              sx={{
                fontWeight: 600,
                px: { xs: 2, sm: 2.5, md: 3 },
                py: { xs: 0.75, sm: 1 },
                borderRadius: 2,
                boxShadow: "0 2px 8px rgba(163,230,53,0.3)",
                "&:hover": { 
                  backgroundColor: "#8FD419", 
                  boxShadow: "0 4px 12px rgba(163,230,53,0.4)" 
                },
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                minWidth: "fit-content",
              }}
            />
          </Box>
        )}
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={{ xs: 2, sm: 3 }} mb={{ xs: 3, sm: 4 }}>
        {[
          { title: "Business Capabilities", value: dashboardCounts?.coreCapabilityCount ?? 0, icon: Network, color: "#1e88e5" },
          { title: "Domains", value: dashboardCounts?.domainCount ?? 0, icon: Package, color: "#8e24aa" },
          { title: "Sub-domains", value: dashboardCounts?.subDomainCount ?? 0, icon: CheckCircle, color: "#43a047" },
        ].map((kpi) => (
          <Grid item xs={12} sm={6} md={4} key={kpi.title}>
            <KPICard title={kpi.title} value={kpi.value} icon={kpi.icon} color={kpi.color} />
          </Grid>
        ))}
      </Grid>

      {/* Capability Cards */}
      <Grid container spacing={{ xs: 2, sm: 3 }}>
        {loading ? (
          <Grid item xs={12}>
            <Box sx={{ width: "100%", textAlign: "center", py: 8 }}>
              <Typography sx={{ color: "#6B7280", fontSize: { xs: "1rem", sm: "1.1rem" } }}>
                Loading...
              </Typography>
            </Box>
          </Grid>
        ) : capabilityList.length === 0 ? (
          <Grid item xs={12}>
            <Box sx={{ width: "100%", textAlign: "center", py: 8 }}>
              <Typography sx={{ color: "#6B7280", fontSize: { xs: "1rem", sm: "1.1rem" } }}>
                No capabilities found.
              </Typography>
            </Box>
          </Grid>
        ) : (
          capabilityList.map((capability, index) => (
            <Grid item xs={12} sm={6} lg={4} key={capability.id}>
              <CapabilityCard
                isEditable={isEditable}
                id={capability.id}
                name={capability.name}
                capabilityColor={capability.color}
                onUpdate={fetchCapabilities}
                isEdited={capability.is_edited}
                totalDomains={capability.totalDomainCount} 
                isExpanded={expandedCapabilities[capability.id] || false}
                onToggle={() => {
                  setExpandedCapabilities((prev) => ({
                    ...prev,
                    [capability.id]: !prev[capability.id],
                  }));
                }}
                index={index}
              />
            </Grid>
          ))
        )}
      </Grid>

      {/* Create Capability Modal */}
      <CreateCapability 
        open={open} 
        onClose={() => setOpen(false)} 
        label="Business Capability" 
        clickHandler={handleCreateCapability} 
      />
    </Box>
  );
}

export default AllCapabilities;