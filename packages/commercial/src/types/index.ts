// Commercial module types
export interface OpportunityFilters {
  stage?: string;
  ownerId?: string;
  companyId?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface ContactFilters {
  companyId?: string;
  search?: string;
}

export interface CompanyFilters {
  industry?: string;
  search?: string;
}


