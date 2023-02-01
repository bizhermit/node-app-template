type DataItemValidationResult = {
  type: "error" | "warning" | "information";
  name: string;
  title?: string;
  body: string;
};

type DataItem_Base = {
  $$: any;
  name?: string;
  label?: string;
  required?: boolean;
};

type DataItem_String = DataItem_Base & {
  type: "string";
  validations?: readonly ((v: Nullable<string>, key: string, ctx: DataItem_String, data: Nullable<Struct>) => (DataItemValidationResult | void))[];
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

type DataItem_Array<T extends DataItem | { [key: string]: DataItem } = DataItem | { [key: string]: DataItem }> = DataItem_Base & {
  type: "array";
  validations?: readonly ((v: Nullable<Array<any>>) => string)[];
  item: T;
  length?: number;
  minLength?: number;
  maxLength?: number;
};

type DataItem = Readonly<DataItem_String | DataItem_Number | DataItem_Boolean | DataItem_Date | DataItem_Array>;

type DataStruct = DataItem | { [key: string]: DataStruct };
type DataItemValueType<T extends DataStruct> =
  T extends { $$: any } ? (
    T["type"] extends DataItem_String["type"] ? string :
    T["type"] extends DataItem_Number["type"] ? number :
    T["type"] extends DataItem_Boolean["type"] ? boolean :
    T["type"] extends DataItem_Date["type"] ? Date :
    T["type"] extends DataItem_Array["type"] ? Array<DataItemValueType<T["item"]>> :
    any
  ) : { [P in keyof T]: DataItemValueType<T[P]> };