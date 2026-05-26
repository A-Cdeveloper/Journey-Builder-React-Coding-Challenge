export type GlobalField = {
  key: string;
  title: string;
};

export type GlobalNamespace = {
  id: string;
  label: string;
  fields: GlobalField[];
};

export const globalNamespaces: GlobalNamespace[] = [
  {
    id: "actionProperties",
    label: "Action Properties",
    fields: [
      { key: "actionId", title: "Action ID" },
      { key: "startedAt", title: "Started At" },
      { key: "tenantId", title: "Tenant ID" },
    ],
  },
  {
    id: "clientOrganisationProperties",
    label: "Client Organisation Properties",
    fields: [
      { key: "orgId", title: "Organisation ID" },
      { key: "orgName", title: "Organisation Name" },
      { key: "plan", title: "Plan" },
    ],
  },
];
