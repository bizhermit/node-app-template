type DataItemKey = "$$";

type DataValueType = string | number | boolean | Date | Array<DataValueType> | { [key: string]: DataValueType };

type DataItemValidationResult = {
  type: "error" | "warning" | "information";
  key: string | number;
  index?: number;
  value?: any;
  name: string;
  title?: string;
  body: string;
};

type DataItemValidation<T, D extends DataItem> =
  readonly ((v: Nullable<T>, key: string | number, ctx: D, data: Nullable<Struct | Array<any>>, index: Nullable<number>)
    => (DataItemValidationResult | void))[];

type StringCharType = "int"
  | "h-num"
  | "f-num"
  | "num"
  | "h-alpha"
  | "f-alpha"
  | "alpha"
  | "h-alpha-num"
  | "h-alpha-num-syn"
  | "h-katakana"
  | "f-katakana"
  | "katakana";

type DataItem_Base = {
  $$: any;
  name?: string;
  label?: string;
  required?: boolean;
};

type DataItem_String = DataItem_Base & {
  type: "string";
  validations?: DataItemValidation<string, DataItem_String>;
  length?: number;
  minLength?: number;
  maxLength?: number;
  charType?: StringCharType;
  // styles
  width?: number | string;
};

type DataItem_Number = DataItem_Base & {
  type: "number";
  validations?: DataItemValidation<number, DataItem_Number>;
  min?: number;
  max?: number;
  // styles
  width?: number;
};

type DataItem_Boolean = DataItem_Base & {
  type: "boolean";
  validations?: DataItemValidation<boolean, DataItem_Boolean>;
  min?: string;
  max?: string;
  // styles
  width?: number;
};

type DataItem_Date = DataItem_Base & {
  type: "date" | "month";
  validations?: DataItemValidation<string, DataItem_Date>;
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
  validations?: DataItemValidation<Array<any>, DataItem_Array<T>>;
  item: T;
  length?: number;
  minLength?: number;
  maxLength?: number;
};

type DataItem = DataItem_String | DataItem_Number | DataItem_Boolean | DataItem_Date | DataItem_Array<any>;

type DataStruct = DataItem | { [key: string]: DataStruct };
type DataItemValueType<T extends DataStruct, Strict extends boolean = false> =
  T extends { $$: any } ? (
    T["type"] extends DataItem_String["type"] ? (Strict extends true ? string : string | number | boolean | undefined) :
    T["type"] extends DataItem_Number["type"] ? (Strict extends true ? number : number | string | undefined) :
    T["type"] extends DataItem_Boolean["type"] ? (Strict extends true ? boolean : boolean | string | number | undefined) :
    T["type"] extends DataItem_Date["type"] ? (Strict extends true ? Date : Date | string | undefined) :
    T["type"] extends DataItem_Array["type"] ? Array<DataItemValueType<T["item"]>> | undefined :
    any
  ) : (
    { [P in keyof T]: DataItemValueType<Strict extends true ? T[P] : T[P] | undefined> }
  )
  ;