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

type DataItem_Boolean<T = true, F = false> = DataItem_Base & {
  type: "boolean";
  validations?: DataItemValidation<T | F, DataItem_Boolean<T, F>>;
  trueValue?: T;
  falseValue?: F;
  // styles
  width?: number;
};

type DataItem_Date = DataItem_Base & {
  type: "date" | "month";
  validations?: DataItemValidation<Date, DataItem_Date>;
  min?: string | Date;
  max?: string | Date;
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

type DataItem_Struct<T extends { [key: string]: DataItem; } = { [key: string]: DataItem; }> = DataItem_Base & {
  type: "struct";
  validations?: DataItemValidation<Struct<any>, DataItem_Struct<T>>;
  item: T;
};

type DataContext = { [key: string]: DataItem };

type DataItem = DataContext
  | DataItem_String
  | DataItem_Number
  | DataItem_Boolean
  | DataItem_Date
  | DataItem_Array<any>
  | DataItem_Struct<any>
  ;

type DataItemValueType<T extends DataItem, Strict extends boolean = false> =
  T extends { $$: any } ? (
    T["type"] extends DataItem_String["type"] ? (
      Strict extends true ? (
        T["required"] extends true ? string : Nullable<string>
      ) : string | number | boolean | undefined
    ) :
    T["type"] extends DataItem_Number["type"] ? (
      Strict extends true ? (
        T["required"] extends true ? number : Nullable<number>
      ) : number | string | undefined
    ) :
    T["type"] extends DataItem_Boolean["type"] ? (
      Strict extends true ? (
        T["required"] extends true ? (
          DataItem_Boolean["trueValue"] | DataItem_Boolean["falseValue"]
        ) : Nullable<DataItem_Boolean["trueValue"] | DataItem_Boolean["falseValue"]>
      ) : boolean | string | number | undefined
    ) :
    T["type"] extends DataItem_Date["type"] ? (
      Strict extends true ? (
        T["required"] extends true ? Date : Nullable<Date>
      ) : Date | string | undefined
    ) :
    T["type"] extends DataItem_Array["type"] ? (
      Strict extends true ? (
        T["required"] extends true ? Array<DataItemValueType<T["item"]>> : Nullable<Array<DataItemValueType<T["item"]>>>
      ) : Array<DataItemValueType<T["item"]>> | undefined
    ) :
    T["type"] extends DataItem_Struct["type"] ? (
      Strict extends true ? (
        T["required"] extends true ? { [P in keyof T["item"]]: T["item"][P] } : Nullable<{ [P in keyof T["item"]]: T["item"][P] }>
      ) : { [P in keyof T["item"]]?: DataItemValueType<T["item"][P]> }
    ) :
    any
  ) : (
    Strict extends true ?
    { [P in keyof T]: DataItemValueType<T[P]> } :
    { [P in keyof T]?: DataItemValueType<T[P]> }
  )
  ;