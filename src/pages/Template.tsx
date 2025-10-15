import React, { useEffect, useState } from "react";
import CapabilityCard from "./capability/card-capability";
import Box from "@mui/material/Box";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Building2, Folder, FileText, Info, ChevronUp, ChevronDown } from "lucide-react";
import Button from "@mui/material/Button";
import { fetchTemplateCorecapability, fetchTemplateDomainByCapability } from "apis";
import { motion, AnimatePresence } from "framer-motion";

const Template = () => {
  const [capabilityList, setCapabilityList] = useState<any[]>([]);
  const [expandedCapabilities, setExpandedCapabilities] = useState<Record<string, boolean>>({});
  const [showInstructions, setShowInstructions] = useState(false);

  const fetchCapabilities = async () => {
    try {
      const data = await fetchTemplateCorecapability();
      setCapabilityList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching capabilities:", error);
    }
  };

  // New: fetch capabilities and enrich each capability with totalDomainCount (domains mapped)
  const fetchCapabilitiesWithDomainCounts = async () => {
    try {
      const coreCapabilities: any[] = (await fetchTemplateCorecapability()) || [];

      // Fetch domain lists for each capability in parallel (use same query shape as other parts)
      const domainResults = await Promise.all(
        coreCapabilities.map((core: any) =>
          fetchTemplateDomainByCapability ? fetchTemplateDomainByCapability(`core_id=${core.id}`) : Promise.resolve([])
        )
      );

      // Map capabilities to include totalDomainCount (number of domains mapped)
      const capabilitiesWithCounts = coreCapabilities.map((core: any, idx: number) => {
        const domains = Array.isArray(domainResults[idx]) ? domainResults[idx] : [];
        return {
          ...core,
          color: core.color || "#008C8C",
          // store count on the capability so the parent can pass it to the card
          totalDomainCount: domains.length,
        };
      });

      setCapabilityList(capabilitiesWithCounts);
    } catch (error) {
      console.error("Error fetching capabilities with domain counts:", error);
    }
  };

  useEffect(() => {
    // Call both to preserve existing behaviour and ensure counts are populated
    fetchCapabilities();
    fetchCapabilitiesWithDomainCounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleExpandAll = () => {
    const allExpanded = capabilityList.reduce((acc, cap) => {
      acc[cap.id] = true;
      return acc;
    }, {} as Record<string, boolean>);
    setExpandedCapabilities(allExpanded);
  };

  const handleCollapseAll = () => setExpandedCapabilities({});

  if (capabilityList.length === 0) return null;

  return (
    <div className="p-8 space-y-8" style={{ backgroundColor: '#F9FAFB', minHeight: '100vh' }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold" style={{ color: '#1F2937', letterSpacing: '-0.02em' }}>
            Capability Structure Template
          </h1>
          <p style={{ color: '#6B7280', fontSize: '15px' }}>
            Learn how to structure your business capabilities, domains, and subdomains
          </p>
        </div>

        {/* Toggle Button */}
        <Button
          variant="contained"
          onClick={() => setShowInstructions(!showInstructions)}
          startIcon={showInstructions ? <ChevronUp /> : <ChevronDown />}
          sx={{
            borderRadius: "10px",
            textTransform: "none",
            backgroundColor: "#008C8C",
            color: "#FFFFFF",
            fontWeight: 600,
            paddingX: 3,
            paddingY: 1.2,
            boxShadow: '0 2px 8px rgba(0, 140, 140, 0.15)',
            transition: 'all 0.2s ease',
            ":hover": {
              backgroundColor: "#007070",
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 12px rgba(0, 140, 140, 0.25)',
            },
          }}
        >
          {showInstructions ? "Hide Instructions" : "Show Instructions"}
        </Button>
      </div>

      {/* Instructions Section */}
      <AnimatePresence>
        {showInstructions && (
          <motion.div
            key="instructions"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden space-y-8"
          >
            {/* Info Card */}
            <Card className="p-6" style={{ backgroundColor: 'rgba(0, 140, 140, 0.06)', border: '1px solid rgba(0, 140, 140, 0.2)', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)' }}>
              <div className="flex gap-4">
                <Info className="flex-shrink-0 w-6 h-6 mt-1" style={{ color: '#008C8C' }} />
                <div>
                  <h3 className="mb-2 text-lg font-semibold" style={{ color: '#1F2937' }}>
                    Understanding the Hierarchy
                  </h3>
                  <p style={{ color: '#4B5563', fontSize: '14px', lineHeight: '1.6' }}>
                    The capability management system uses a three-level hierarchy to organize your products:
                    <strong style={{ color: '#008C8C' }}> L1 (Capabilities)</strong> → <strong style={{ color: '#008C8C' }}>L2 (Domains)</strong> → <strong style={{ color: '#008C8C' }}>L3 (Sub-domains)</strong>
                  </p>
                </div>
              </div>
            </Card>

            {/* Level Explanation Cards */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <Card className="p-6" style={{ borderLeft: '4px solid #008C8C', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)', backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderLeftColor: '#008C8C' }}>
                <div className="flex items-start gap-3 mb-4">
                  <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(0, 140, 140, 0.12)' }}>
                    <Building2 className="w-6 h-6" style={{ color: '#008C8C' }} />
                  </div>
                  <div className="flex-1">
                    <Badge className="mb-2" style={{ backgroundColor: '#008C8C', color: '#FFFFFF', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 600 }}>L1</Badge>
                    <h3 className="text-xl font-semibold" style={{ color: '#1F2937' }}>Capability</h3>
                  </div>
                </div>
                <p className="mb-4" style={{ color: '#6B7280', fontSize: '14px', lineHeight: '1.6' }}>
                  Top-level business capabilities representing major functional areas of your organization.
                </p>
                <ul className="space-y-1 text-sm list-disc list-inside" style={{ color: '#4B5563' }}>
                  <li>Finance</li>
                  <li>Human Resources</li>
                  <li>IT Operations</li>
                  <li>Sales & Marketing</li>
                  <li>Supply Chain</li>
                </ul>
              </Card>

              <Card className="p-6" style={{ borderLeft: '4px solid #A3E635', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)', backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderLeftColor: '#A3E635' }}>
                <div className="flex items-start gap-3 mb-4">
                  <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(163, 230, 53, 0.12)' }}>
                    <Folder className="w-6 h-6" style={{ color: '#A3E635' }} />
                  </div>
                  <div className="flex-1">
                    <Badge className="mb-2" style={{ backgroundColor: '#A3E635', color: '#1F2937', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 600 }}>L2</Badge>
                    <h3 className="text-xl font-semibold" style={{ color: '#1F2937' }}>Domain</h3>
                  </div>
                </div>
                <p className="mb-4" style={{ color: '#6B7280', fontSize: '14px', lineHeight: '1.6' }}>
                  Mid-level domains that break down capabilities into specific functional domains.
                </p>
                <ul className="space-y-1 text-sm list-disc list-inside" style={{ color: '#4B5563' }}>
                  <li>Cost Management</li>
                  <li>Financial Reporting</li>
                  <li>Accounts Payable</li>
                  <li>Revenue Management</li>
                  <li>Treasury Operations</li>
                </ul>
              </Card>

              <Card className="p-6" style={{ borderLeft: '4px solid #1F2937', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)', backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderLeftColor: '#1F2937' }}>
                <div className="flex items-start gap-3 mb-4">
                  <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(31, 41, 55, 0.12)' }}>
                    <FileText className="w-6 h-6" style={{ color: '#1F2937' }} />
                  </div>
                  <div className="flex-1">
                    <Badge className="mb-2" style={{ backgroundColor: '#1F2937', color: '#FFFFFF', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 600 }}>L3</Badge>
                    <h3 className="text-xl font-semibold" style={{ color: '#1F2937' }}>Subdomain</h3>
                  </div>
                </div>
                <p className="mb-4" style={{ color: '#6B7280', fontSize: '14px', lineHeight: '1.6' }}>
                  Detailed subdomains representing specific processes or activities within a domain.
                </p>
                <ul className="space-y-1 text-sm list-disc list-inside" style={{ color: '#4B5563' }}>
                  <li>Budget Planning</li>
                  <li>Expense Tracking</li>
                  <li>Cost Allocation</li>
                  <li>Forecasting</li>
                  <li>Variance Analysis</li>
                </ul>
              </Card>
            </div>

            {/* Example Hierarchy */}
            <Card className="p-6" style={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)', backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB' }}>
              <h2 className="mb-6 text-2xl font-semibold" style={{ color: '#1F2937', letterSpacing: '-0.01em' }}>
                Complete Example Hierarchy
              </h2>
              <div className="space-y-4">
                {/* Finance */}
                <div className="overflow-hidden border rounded-lg" style={{ borderColor: '#E5E7EB', borderRadius: '10px' }}>
                  <div className="p-4 border-b" style={{ backgroundColor: 'rgba(0, 140, 140, 0.08)', borderBottomColor: '#E5E7EB' }}>
                    <div className="flex items-center gap-3">
                      <Building2 className="w-5 h-5" style={{ color: '#008C8C' }} />
                      <Badge style={{ backgroundColor: '#008C8C', color: '#FFFFFF', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 600 }}>L1</Badge>
                      <span className="font-semibold" style={{ color: '#1F2937' }}>Finance</span>
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    <div className="pl-4 ml-8" style={{ borderLeft: '2px solid #A3E635' }}>
                      <div className="flex items-center gap-3 mb-3">
                        <Folder className="w-4 h-4" style={{ color: '#A3E635' }} />
                        <Badge variant="outline" style={{ backgroundColor: 'rgba(163, 230, 53, 0.12)', color: '#65A30D', borderColor: '#A3E635', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 600 }}>L2</Badge>
                        <span className="font-medium" style={{ color: '#1F2937' }}>Cost Management</span>
                      </div>
                      <div className="ml-8 space-y-2">
                        <div className="flex items-center gap-3 text-sm">
                          <FileText className="w-4 h-4" style={{ color: '#1F2937' }} />
                          <Badge variant="outline" style={{ backgroundColor: 'rgba(31, 41, 55, 0.08)', color: '#1F2937', borderColor: '#6B7280', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 600 }}>L3</Badge>
                          <span style={{ color: '#6B7280' }}>Budget Planning</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <FileText className="w-4 h-4" style={{ color: '#1F2937' }} />
                          <Badge variant="outline" style={{ backgroundColor: 'rgba(31, 41, 55, 0.08)', color: '#1F2937', borderColor: '#6B7280', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 600 }}>L3</Badge>
                          <span style={{ color: '#6B7280' }}>Expense Tracking</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Best Practices */}
            <Card className="p-6" style={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)', backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB' }}>
              <h2 className="mb-4 text-2xl font-semibold" style={{ color: '#1F2937', letterSpacing: '-0.01em' }}>Best Practices</h2>
              <ul className="space-y-3" style={{ color: '#4B5563', fontSize: '14px', lineHeight: '1.6' }}>
                <li className="flex gap-3">
                  <span className="font-bold" style={{ color: '#008C8C', fontSize: '18px' }}>•</span>
                  Keep L1 capabilities broad and aligned with major business functions
                </li>
                <li className="flex gap-3">
                  <span className="font-bold" style={{ color: '#008C8C', fontSize: '18px' }}>•</span>
                  L2 domains should represent distinct functional areas within a capability
                </li>
                <li className="flex gap-3">
                  <span className="font-bold" style={{ color: '#008C8C', fontSize: '18px' }}>•</span>
                  L3 subdomains should be specific enough to clearly categorize products
                </li>
                <li className="flex gap-3">
                  <span className="font-bold" style={{ color: '#008C8C', fontSize: '18px' }}>•</span>
                  Maintain consistency in naming conventions across all levels
                </li>
              </ul>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expand / Collapse Buttons for Capability Cards */}
      <div className="flex justify-end gap-4 mt-4">
        <Button
          variant="contained"
          onClick={handleExpandAll}
          sx={{
            backgroundColor: "#008C8C",
            color: "#FFFFFF",
            fontWeight: 600,
            textTransform: 'none',
            paddingX: 3,
            paddingY: 1.2,
            borderRadius: '10px',
            boxShadow: '0 2px 8px rgba(0, 140, 140, 0.15)',
            transition: 'all 0.2s ease',
            ":hover": {
              backgroundColor: "#007070",
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 12px rgba(0, 140, 140, 0.25)',
            },
          }}
        >
          Expand All
        </Button>
        <Button
          variant="outlined"
          onClick={handleCollapseAll}
          sx={{
            borderColor: '#008C8C',
            color: '#008C8C',
            fontWeight: 600,
            textTransform: 'none',
            paddingX: 3,
            paddingY: 1.2,
            borderRadius: '10px',
            borderWidth: '1.5px',
            transition: 'all 0.2s ease',
            ":hover": {
              backgroundColor: '#008C8C',
              color: '#FFFFFF',
              borderColor: '#008C8C',
              transform: 'translateY(-1px)',
            },
          }}
        >
          Collapse All
        </Button>
      </div>
      {/* Capability Cards Grid */}
        <Box
        className="template-dropdown"
        sx={{
          display: "grid",
          // responsive columns: 1 on xs, 2 on sm, 3 on md and up
          gridTemplateColumns: {
            xs: "1fr",         // mobile — single column
            sm: "repeat(2, 1fr)", // small screens — 2 columns
            md: "repeat(3, 1fr)", // medium and larger — exactly 3 columns
          },
          gap: "24px",
          width: "100%",
          maxWidth: "1600px",
          margin: "0 auto",
        }}
      >
        {capabilityList.map((capability) => (
          <CapabilityCard
            key={capability.id}
            name={capability.name}
            id={capability.id}
            onUpdate={fetchCapabilities}
            isEditable={false}
            isExpanded={expandedCapabilities[capability.id] || false}
            onToggle={() => {
              setExpandedCapabilities((prev) => ({
                ...prev,
                [capability.id]: !prev[capability.id],
              }));
            }}
            totalDomains={capability.totalDomainCount ?? 0}
          />
        ))}
      </Box>
    </div>
  );
};

export default Template;
