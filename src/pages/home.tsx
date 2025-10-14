import { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Network,
  Package,
  CheckCircle,
  AlertTriangle,
  Building2,
  Globe,
  Layers,
  Workflow,
  FolderOpen,
  Bell,
  X,
} from "lucide-react";
import { KPICard } from "components/home/KPICard";
import {
  getDashBoardCounts,
  getStatusCounts,
  fetchCorecapability,
  fetchDomainByCapability,
  fetchSubdomainByDomain,
} from "apis";
import Tooltip from "@mui/material/Tooltip";

type DashboardCounts = {
  coreCapabilityCount: number;
  domainCount: number;
  subDomainCount: number;
  softwareCount: number;
  mappedCount: number;
  orphanCount: number;
  appsMappedToCapsCount: number;
  appsMappedToDomainCount: number;
  appsMappedToSubdomainCount: number;
};

type CapabilityData = {
  name: string;
  count: number;
  level: string;
};

const Home = () => {
  const [dashboardCounts, setDashboardCounts] = useState<DashboardCounts | null>(null);
  const [statusCounts, setStatusCounts] = useState<Record<string, number> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [topCapabilities, setTopCapabilities] = useState<CapabilityData[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashboardData, statusData] = await Promise.all([
          getDashBoardCounts(),
          getStatusCounts(),
        ]);

        setDashboardCounts({
          coreCapabilityCount: Number(dashboardData.coreCapabilityCount),
          domainCount: Number(dashboardData.domainCount),
          subDomainCount: Number(dashboardData.subDomainCount),
          softwareCount: Number(dashboardData.softwareCount),
          mappedCount: Number(dashboardData.mappedCount),
          orphanCount: Number(dashboardData.orphanCount),
          appsMappedToCapsCount: Number(dashboardData.appsMappedToCapsCount),
          appsMappedToDomainCount: Number(dashboardData.appsMappedToDomainCount),
          appsMappedToSubdomainCount: Number(dashboardData.appsMappedToSubdomainCount),
        });

        setStatusCounts(statusData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard/status counts:", error);
        setIsError(true);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // === Fetch Dynamic Capabilities ===
  useEffect(() => {
    const fetchCapabilitiesData = async () => {
      try {
        const coreCapabilities: any[] = await fetchCorecapability();

        // Fetch all domains in parallel for all capabilities
        const domainResults: any[][] = await Promise.all(
          coreCapabilities.map((core: any) =>
            fetchDomainByCapability(`core_id=${core.id}`)
          )
        );

        // Prepare subdomain fetches
        const subdomainPromises: Promise<any[]>[] = [];
        domainResults.forEach((domains: any[]) => {
          domains.forEach((domain: any) => {
            subdomainPromises.push(fetchSubdomainByDomain(`domain_id=${domain.id}`));
          });
        });

        const subdomainResults: any[][] = await Promise.all(subdomainPromises);

        // Count subdomains per domain
        const subdomainCountMap: Record<string, number> = {};
        subdomainResults.forEach((subdomains: any[], index: number) => {
          if (subdomains.length > 0) {
            const flatDomains = domainResults.flat();
            const domainId = flatDomains[index]?.id;
            if (domainId) subdomainCountMap[domainId] = subdomains.length;
          }
        });

        // Combine results by core capability
        const capabilityData: CapabilityData[] = coreCapabilities.map((core: any, index: number) => {
          const domains: any[] = domainResults[index] || [];
          let subdomainCount = 0;

          domains.forEach((domain: any) => {
            subdomainCount += subdomainCountMap[domain.id] || 0;
          });

          const totalCount = domains.length + subdomainCount;

          return {
            name: core.name.replace("(L1)", "").trim(),
            count: totalCount,
            level: "L1",
          };
        });

        // Sort and take top 5 (explicit typing for a, b)
        const sorted = capabilityData
          .sort((a: CapabilityData, b: CapabilityData) => b.count - a.count)
          .slice(0, 5);

        setTopCapabilities(sorted);
      } catch (error) {
        console.error("Error fetching top capabilities:", error);
      }
    };

    fetchCapabilitiesData();
  }, []);

  if (isLoading) return <Typography>Loading...</Typography>;
  if (isError) return <Typography>Something went wrong!</Typography>;

  return (
    <Box sx={{ padding: "24px", backgroundColor: "#F9FAFB", borderRadius: "12px" }}>
      {/* === HEADER WITH NOTIFICATION === */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#1F2937] mb-2">Mission Control</h1>
          <p className="text-[#1F2937]/70">
            Overview of your product capability landscape
          </p>
        </div>

        {/* Notification Bell */}
        {dashboardCounts?.orphanCount !== undefined && (
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-full bg-[#008C8C] hover:bg-[#00b0b0] transition-all"
            >
              <Bell className="w-6 h-6 text-white" />
              {dashboardCounts.orphanCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#A3E635] text-[#1F2937] w-4 h-4 text-xs flex items-center justify-center rounded-full font-bold">
                  {dashboardCounts.orphanCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <Card className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg border border-[#008C8C] z-50 p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-[#008C8C] text-lg">Notifications</h3>
                  <button onClick={() => setShowNotifications(false)}>
                    <X className="w-5 h-5 text-gray-500 hover:text-gray-800" />
                  </button>
                </div>
                <div className="flex items-start gap-3 bg-[#F9FAFB] p-3 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-[#A3E635]" />
                  <div>
                    <p className="font-medium text-[#1F2937]">
                      Unmapped Products Detected
                    </p>
                    <p className="text-sm text-[#1F2937]/80">
                      {dashboardCounts?.orphanCount ?? 0} product
                      {(dashboardCounts?.orphanCount ?? 0) > 1 ? "s" : ""} need to be mapped to
                      capabilities. Review and resolve orphaned apps to maintain accuracy.
                    </p>
                    <Button
                          variant="outline"
                          className="mt-2 border-[#008C8C] text-[#008C8C] hover:bg-[#008C8C]/10"
                          onClick={() => {
                            setShowNotifications(false);
                            navigate("/inventory?tab=orphans");
                          }}
                        >
                          Resolve Now
                        </Button>

                  </div>
                </div>
              </Card>
            )}
          </div>
        )}
      </div>

      {/* === KPI CARDS SECTION === */}
      <div className="grid grid-cols-1 mb-6 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <KPICard
          title="Business Capabilities"
          value={dashboardCounts?.coreCapabilityCount ?? 0}
          icon={Network}
        />
        <KPICard title="Domains" value={dashboardCounts?.domainCount ?? 0} icon={Package} />
        <KPICard
          title="Sub-domains"
          value={dashboardCounts?.subDomainCount ?? 0}
          icon={CheckCircle}
          variant="success"
        />
        <KPICard title="Products" value={dashboardCounts?.softwareCount ?? 0} icon={AlertTriangle} variant="warning" />
        <KPICard title="Products Mapped" value={dashboardCounts?.mappedCount ?? 0} icon={Building2} />
        <KPICard title="Orphan Products" value={dashboardCounts?.orphanCount ?? 0} icon={Globe} />
        <KPICard title="Products Mapped to Capabilities" value={dashboardCounts?.appsMappedToCapsCount ?? 0} icon={Layers} />
        <KPICard title="Products Mapped to Domains" value={dashboardCounts?.appsMappedToDomainCount ?? 0} icon={Workflow} />
        <KPICard title="Products Mapped to Sub-domains" value={dashboardCounts?.appsMappedToSubdomainCount ?? 0} icon={FolderOpen} />
      </div>

      {/* === BOTTOM SECTION === */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* === Top Capabilities by Products === */}
        <Card className="p-6 shadow-card">
          <h3 className="text-lg font-semibold text-[#1F2937] mb-4">
            Top Capabilities by Products
          </h3>
          <div className="space-y-4">
            {topCapabilities.length > 0 ? (
              topCapabilities.map((cap) => (
                <div key={cap.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-2 h-2 rounded-full bg-[#008C8C]" />
                    <span className="text-sm font-medium text-[#1F2937]">{cap.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary">{cap.level}</Badge>
                    <span className="text-sm font-semibold text-[#1F2937]">{cap.count}</span>
                  </div>
                </div>
              ))
            ) : (
              <Typography variant="body2" color="textSecondary">
                Loading capabilities...
              </Typography>
            )}
          </div>
        </Card>

{/* === Digital Product Rationalization === */}
<Card className="p-6 shadow-card">
  <h3 className="text-lg font-semibold text-[#1F2937] mb-4">
    Digital Product Rationalization<span>(TRIM)</span>
  </h3>
  <div className="space-y-4">
    {statusCounts && (
      <>
        {["Terminate", "Retire", "Invest", "Maintain"].map((status) => {
          const count = statusCounts[status] ?? 0;
          const total = Object.values(statusCounts).reduce((sum, n) => sum + n, 0);
          const percentage = total > 0 ? Math.round((count / total) * 100) : 0;

          const colorMap: Record<string, string> = {
            Terminate: "bg-[#008C8C]",
            Retire: "bg-[#EF4444]",
            Invest: "bg-[#A3E635]",
            Maintain: "bg-[#F59E0B]",
          };

          const sampleData: Record<string, string> = {
            Terminate: "Products marked for termination.",
            Retire: "Products scheduled to retire soon.",
            Invest: "Products recommended for investment.",
            Maintain: "Products to maintain as is.",
          };

          return (
            <div key={status} className="space-y-2">
              <div className="flex items-center justify-between">
                <Tooltip title={sampleData[status]} arrow>
                  <span className="text-sm font-medium text-[#1F2937] cursor-pointer">
                    {status}
                  </span>
                </Tooltip>
                <span className="text-sm font-semibold text-[#1F2937]">{count}</span>
              </div>
              <div className="w-full h-2 bg-[#F9FAFB] rounded-full overflow-hidden">
                <div
                  className={`h-full ${colorMap[status]} transition-smooth`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </>
    )}
  </div>
</Card>
      </div>
    </Box>
  );
};

export default Home;
