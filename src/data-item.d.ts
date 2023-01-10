type DataItem_Base = {
  name: string;
  required?: boolean;
};

type DataItem_String = DataItem_Base & {
  type: "string";
  validations?: readonly ((v: Nullable<string>) => string)[];
  length?: number;
  minLength?: number;
  maxLength?: number;
  // styles
  width?: number | string;
};

type DataItem_Number = DataItem_Base & {
  type: "number";
  validations?: readonly ((v: Nullable<number>) => string)[];
  min?: number;
  max?: number;
  // styles
  width?: number;
};

type DataItem_Boolean = DataItem_Base & {
  type: "boolean";
  validations?: readonly ((v: Nullable<boolean>) => string)[];
  min?: string;
  max?: string;
  // styles
  width?: number;
};

type DataItem_Date = DataItem_Base & {
  type: "date" | "month";
  validations?: readonly ((v: Nullable<string>) => string)[];
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
  validations?: readonly ((v: Nullable<Array<any>>) => string)[];
  items: DataItem | Array<DataItem>;
  length?: number;
  minLength?: number;
  maxLength?: number;
};

type DataItem = Readonly<DataItem_String | DataItem_Number | DataItem_Boolean | DataItem_Date | DataItem_Array>;

type DataItemStruct<A extends Readonly<Array<DataItem>>> = {
  [P in A[number]as `${P["name"]}`]: (
    P["type"] extends "string" ? string :
    P["type"] extends "number" ? number :
    P["type"] extends "boolean" ? boolean :
    P["type"] extends "date" ? Date :
    P["type"] extends "array" ? Array<any> :
    any
  )
};