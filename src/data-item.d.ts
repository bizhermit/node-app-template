type DataItem_Base = {
  name: string;
};

type DataItem_String = DataItem_Base & {
  type?: "string" | undefined | null;
  validations?: Array<(v: Nullable<string>) => string>;
  length?: number;
  minLength?: number;
  maxLength?: number;
  // styles
  width?: number | string;
};

type DataItem_Number = DataItem_Base & {
  type: "number";
  validations?: Array<(v: Nullable<number>) => string>;
  min?: number;
  max?: number;
  // styles
  width?: number;
};

type DataItem_Boolean = DataItem_Base & {
  type: "boolean";
  validations?: Array<(v: Nullable<boolean>) => string>;
  min?: string;
  max?: string;
  // styles
  width?: number;
};

type DataItem_Date = DataItem_Base & {
  type: "date" | "month";
  validations?: Array<(v: Nullable<string>) => string>;
  min?: string;
  max?: string;
  rangePair?: {
    name: string;
    position: "before" | "after";
    disallowSame?: boolean;
  };
};

type DataItem_Array = DataItem_Base & {
  type: "array";
  validations?: Array<(v: Nullable<Array<any>>) => string>;
  items: DataItem | Array<DataItem>;
  length?: number;
  minLength?: number;
  maxLength?: number;
};

type DataItem = DataItem_String | DataItem_Number | DataItem_Boolean | DataItem_Date | DataItem_Array;