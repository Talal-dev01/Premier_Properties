export interface Property {
    id: string;
    fieldData:  Record<string, unknown>;  // Since it's type: Object in schema
    cmsLocaleId: string;
    lastPublished?: string;
    lastUpdated?: string;
    createdOn?: string;
    isArchived?: boolean;
    isDraft?: boolean;
  }