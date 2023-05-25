type QueryStruct = Partial<{ [key: string]: string | Array<string> }>;

type SessionStruct = { [key: string]: any };

type ValidationResult = Omit<DataItemValidationResult, "type" | "key" | "name"> & Partial<Pick<DataItemValidationResult, "type" | "key" | "name">>;