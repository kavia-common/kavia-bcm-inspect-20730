export interface Capability {
  id: string;
  name: string;
  capability: string;
}

export interface E2EBusinessProcess {
  id: string;
  name: string;
  e2e: string;
}
export interface Domain {
  id: string;
  name: string;
  core_id: string;
}
export interface SubDomain {
  id: string;
  name: string;
  domain_id: string;
}
