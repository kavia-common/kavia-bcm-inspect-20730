import { DEFAULT_CONFIG } from "../config/defaultConfig";

export const baseUrl = DEFAULT_CONFIG.server.rest.baseURL;
export const baseHeader = {
  "Content-Type": "application/json",
};

export const fetchDashboardTableData = async () => {
  const response = await fetch(baseUrl + "getDashboardTableData");
  const result = await response.json();
  return result;
};

export const getDashBoardCounts = async () => {
  const response = await fetch(baseUrl + "dashBoardCounts");
  const result = await response.json();
  return result;
};

const defaultSort = JSON.stringify({ name: "ASC" });

export const fetchCorecapability = async (sort = defaultSort) => {
  const response = await fetch(baseUrl + "corecapability" + `?sort=${sort}`);
  const result = await response.json();
  console.log("fetch corecapability :", result);
  return result;
};

export const createCorecapability = async (body: string) => {
  const response = await fetch(baseUrl + "coreCapability", {
    method: "POST",
    headers: baseHeader,
    body: body,
  });
  const result = await response.json();
  return result;
};

export const patchCorecapability = async (id: string, body: string) => {
  const response = await fetch(baseUrl + `coreCapability/${id}`, {
    method: "PATCH",
    headers: baseHeader,
    body: body,
  });
  const result = await response.json();
  return result;
};

export const deleteCorecapability = async (id: string) => {
  const response = await fetch(baseUrl + "coreCapability/" + id, {
    method: "DELETE",
    headers: baseHeader,
  });
  const result = await response.json();

  return result;
};

export const fetchE2EBusinessProcess = async (sort = defaultSort) => {
  const response = await fetch(baseUrl + "E2EBusinessProcess" + `?sort=${sort}`);
  const result = await response.json();
  console.log("fetch E2EBusinessProcess :", result);
  return result;
};

export const createE2EBusinessProcess = async (body: string) => {
  const response = await fetch(baseUrl + "E2EBusinessProcess", {
    method: "POST",
    headers: baseHeader,
    body: body,
  });
  const result = await response.json();
  return result;
};

export const patchE2EBusinessProcess = async (id: string, body: string) => {
  const response = await fetch(baseUrl + `E2EBusinessProcess/${id}`, {
    method: "PATCH",
    headers: baseHeader,
    body: body,
  });
  const result = await response.json();
  return result;
};

export const deleteE2EBusinessProcess = async (id: string) => {
  const response = await fetch(baseUrl + "E2EBusinessProcess/" + id, {
    method: "DELETE",
    headers: baseHeader,
  });
  const result = await response.json();

  return result;
};

export const fetchDomain = async (sort = defaultSort) => {
  const response = await fetch(baseUrl + "domain" + `?sort=${sort}`);
  const result = await response.json();
  return result;
};

export const createDomain = async (body: string) => {
  const response = await fetch(baseUrl + "domain", {
    method: "POST",
    headers: baseHeader,
    body: body,
  });
  const result = await response.json();
  return result;
};

export const fetchDomainByCapability = async (queryString: string) => {
  const response = await fetch(baseUrl + "domainByCapability?" + queryString);
  const result = await response.json();
  return result;
}; // changed the format

export const fetchSubdomain = async (sort = defaultSort) => {
  const response = await fetch(baseUrl + "subdomain" + `?sort=${sort}`);
  const result = await response.json();
  return result;
};

export const fetchSubdomainByDomain = async (queryString: string) => {
  const response = await fetch(baseUrl + "subdomainBydomain?" + queryString);
  const result = await response.json();
  return result;
};

export const createSubdomain = async (body: string) => {
  const response = await fetch(baseUrl + "subdomain", {
    method: "POST",
    headers: baseHeader,
    body: body,
  });
  const result = await response.json();

  return result;
};

export const patchEndpoint = async (path: string, body: string) => {
  const response = await fetch(path, {
    method: "PATCH",
    headers: baseHeader,
    body: body,
  });
  // const result = await response.json();

  return response;
};

export const deleteEndpoint = async (path: string) => {
  const response = await fetch(path, {
    method: "DELETE",
    headers: baseHeader,
  });

  // const result = await response.json();

  return response;
};

export const createApplication = async (body: string) => {
  const response = await fetch(baseUrl + "application", {
    method: "POST",
    headers: baseHeader,
    body: body,
  });
  const result = await response.json();

  return result;
};

export const patchApplication = async (id: string, body: string) => {
  const response = await fetch(baseUrl + "application/" + id, {
    method: "PATCH",
    headers: baseHeader,
    body: body,
  });
  // const result = await response.json();

  return response;
};

export const deleteApplication = async (id: string) => {
  const response = await fetch(baseUrl + "application/" + id, {
    method: "DELETE",
    headers: baseHeader,
  });
  // const result = await response.json();

  return response;
};

export const getMappedApplications = async (queryString: string) => {
  const response = await fetch(
    baseUrl + "getMappedApplications?" + queryString
  );
  const result = await response.json();
  console.log(result);

  return result;
};

export const getOrphans = async (queryString: string) => {
  const response = await fetch(baseUrl + "getOrphans?" + queryString);
  console.log(response);
  const result = await response.json();

  return result;
};

export const uploadFile = async (formData: any) => {
  const response = await fetch(baseUrl + "upload", {
    method: "POST",
    body: formData,
  });
  const result = await response.json();

  return result;
};

export const fetchTemplateCorecapability = async () => {
  const response = await fetch(baseUrl + "template/coreCapability");
  const result = await response.json();
  return result;
};

export const fetchTemplateDomainByCapability = async (queryString: string) => {
  const response = await fetch(
    baseUrl + "template/domainByCapability?" + queryString
  );
  const result = await response.json();
  return result;
};

export const fetchTemplateSubdomainByDomain = async (queryString: string) => {
  const response = await fetch(
    baseUrl + "template/subdomainBydomain?" + queryString
  );
  const result = await response.json();
  return result;
};

export const callRemap = async () => {
  const response = await fetch(baseUrl + "remap", {
    method: "POST",
    headers: baseHeader,
  });
  const result = await response.json();

  return result;
};

export const getReportData = async (body: string) => {
  const response = await fetch(baseUrl + "getReport", {
    method: "POST",
    headers: baseHeader,
    body: body,
  });
  const result = await response.json();

  return result;
};

export const getRegions = async () => {
  const response = await fetch(baseUrl + "getRegions", {
    method: "POST",
    headers: baseHeader,
  });
  const result = await response.json();
  return result;
};

export const getCountrys = async () => {
  const response = await fetch(baseUrl + "getCountries", {
    method: "POST",
    headers: baseHeader,
  });
  const result = await response.json();
  return result;
};

export const getStatuses = async () => {
  const response = await fetch(baseUrl + "getStatuses", {});
  const result = await response.json();
  return result;
};

export const getStatusCounts = async () => {
  const response = await fetch(baseUrl + "getStatusCounts", {
    headers: baseHeader,
  });
  if (!response.ok) {
    throw new Error("Failed to fetch status counts");
  }
  const result = await response.json();
  return result;
};


export const getReportExport = async (body: string) => {
  const response = await fetch(baseUrl + "getCSVreport", {
    method: "POST",
    headers: baseHeader,
    body: body,
  });
  const result = await response.json();

  return result;
};
