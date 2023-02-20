type DataItemKey = "$$";

type DataValueType = string | number | boolean | Date | File | Array<DataValueType> | { [key: string]: DataValueType };

type DataItemValidationResultType = "error" | "warning" | "information";
type DataItemValidationResult = {
  type: DataItemValidationResultType;
  key: string | number;
  index?: number;
  value?: any;
  name: string;
  title?: string;
  body: string;
};

type DataItemValidation<T, D extends (DataItem | DataContext)> =
  readonly ((v: T | null | undefined, key: string | number, ctx: D, data: Struct | Array<any> | null | undefined, index: number | null | undefined, pctx: DataContext | null | undefined)
    => ((Omit<DataItemValidationResult, "type" | "key" | "name"> & Partial<Pick<DataItemValidationResult, "type" | "key" | "name">>) | string | null | undefined))[];

type DataItem_Base = {
  $$: any;
  name?: string;
  label?: string;
  required?: boolean;
  strict?: boolean;
};

type DataContext = { [key: string]: DataItem | DataContext };

type DataItem = (DataItem_Base & { type: "any" })
  | DataItem_String
  | DataItem_Number
  | DataItem_Boolean<any, any>
  | DataItem_Date
  | DataItem_Time
  | DataItem_File
  | DataItem_Array<any>
  | DataItem_Struct<any>
  ;

type DataItemValueType<D extends (DataItem | DataContext), Strict extends boolean = false, Side extends "client" | "server" = "client"> =
  D extends { $$: any } ? (
    D["type"] extends DataItem_String["type"] ? (
      Strict extends true ? (
        D["required"] extends true ? string : string | null | undefined
      ) : string | number | boolean | null | undefined
    ) :
    D["type"] extends DataItem_Number["type"] ? (
      Strict extends true ? (
        D["required"] extends true ? number : number | null | undefined
      ) : (
        D["strict"] extends true ? number | null | undefined : number | string | null | undefined
      )
    ) :
    D["type"] extends DataItem_Boolean["type"] ? (
      Strict extends true ? (
        D["required"] extends true ? (
          (D extends { trueValue: infer T } ? T : true) | (D extends { falseValue: infer F } ? F : false)
        ) : (D extends { trueValue: infer T } ? T : true) | (D extends { falseValue: infer F } ? F : false) | null | undefined
      ) : (
        D["strict"] extends true ?
        (D extends { trueValue: infer T } ? T : true) | (D extends { falseValue: infer F } ? F : false) | null | undefined :
        (D extends { trueValue: infer T } ? T : true) | (D extends { falseValue: infer F } ? F : false) | boolean | string | number | null | undefined
      )
    ) :
    D["type"] extends DataItem_Date["type"] ? (
      Strict extends true ? (
        D["required"] extends true ? (
          D["typeof"] extends "date" ? Date :
          D["typeof"] extends "number" ? number :
          D["typeof"] extends "string" ? string :
          string
        ) : (
          D["typeof"] extends "date" ? Date :
          D["typeof"] extends "number" ? number :
          D["typeof"] extends "string" ? string :
          string
        ) | null | undefined
      ) : DateValue | null | undefined
    ) :
    D["type"] extends DataItem_Time["type"] ? (
      Strict extends true ? (
        D["required"] extends true ? (
          D["typeof"] extends "string" ? string :
          D["typeof"] extends "number" ? number :
          number
        ) : (
          D["typeof"] extends "string" ? string :
          D["typeof"] extends "number" ? number :
          number
        ) | null | undefined
      ) : TimeValue | null | undefined
    ) :
    D["type"] extends DataItem_File["type"] ? (
      Strict extends true ? (
        D["required"] extends true ? (
          D["multiple"] extends true ? (
            Array<D["typeof"] extends "base64" ? string : (Side extends "server" ? FileValue : File)>
          ) : (
            D["typeof"] extends "base64" ? string : (Side extends "server" ? FileValue : File)
          )
        ) : (
          D["multiple"] extends true ? (
            Array<(D["typeof"] extends "base64" ? string : (Side extends "server" ? FileValue : File))> | null | undefined
          ) : (
            (D["typeof"] extends "base64" ? string : (Side extends "server" ? FileValue : File)) | null | undefined
          )
        )
      ) : D["multiple"] extends true ? (
        Array<(Side extends "server" ? FileValue : File) | string | null | undefined> | null | undefined
      ) : (Side extends "server" ? FileValue : File) | string | null | undefined
    ) :
    D["type"] extends DataItem_Array["type"] ? (
      Strict extends true ? (
        D["required"] extends true ? Array<DataItemValueType<D["item"], Strict, Side>> : Array<DataItemValueType<D["item"], Strict, Side>> | null | undefined
      ) : Array<DataItemValueType<D["item"], Strict, Side>> | undefined
    ) :
    D["type"] extends DataItem_Struct["type"] ? (
      Strict extends true ? (
        D["required"] extends true ? { [P in keyof D["item"]]: D["item"][P] } : { [P in keyof D["item"]]: D["item"][P] } | null | undefined
      ) : { [P in keyof D["item"]]?: DataItemValueType<D["item"][P], Strict, Side> }
    ) :
    any
  ) : (
    Strict extends true ?
    { [P in keyof D]: DataItemValueType<D[P], Strict, Side> } :
    { [P in keyof D]?: DataItemValueType<D[P], Strict, Side> }
  )
  ;

type LoadableArray<T = Struct> = Array<T> | (() => Array<T>) | (() => Promise<Array<T>>);

/**
 * String
 */

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

type DataItem_String = DataItem_Base & {
  type: "string";
  validations?: DataItemValidation<string, DataItem_String>;
  length?: number;
  minLength?: number;
  maxLength?: number;
  charType?: StringCharType;
  source?: LoadableArray;
  // styles
  width?: number | string;
  minWidth?: number | string;
  maxWidth?: number | string;
};

/**
 * Number
 */

type DataItem_Number = DataItem_Base & {
  type: "number";
  validations?: DataItemValidation<number, DataItem_Number>;
  min?: number;
  max?: number;
  float?: number;
  source?: LoadableArray;
  // styles
  width?: number | string;
  minWidth?: number | string;
  maxWidth?: number | string;
};

/**
 * Boolean
 */

type DataItem_Boolean<T extends boolean | number | string = boolean | number | string, F extends boolean | number | string = boolean | number | string> = DataItem_Base & {
  type: "boolean";
  validations?: DataItemValidation<T | F, DataItem_Boolean<T, F>>;
  trueValue: T;
  falseValue: F;
};

/**
 * Date
 */

type DateType = "date" | "month" | "year";
type DateValue = string | number | Date;
type DateValueType = "string" | "number" | "date";

type DateRangePair = {
  name: string;
  label?: string;
  position: "before" | "after";
  disallowSame?: boolean;
};

type ValidDays = "weekday" | "holiday" | string
  | Array<DateValue | { date: DateValue; valid?: boolean; }>
  | ((date: Date) => boolean);
type ValidDaysMode = "allow" | "disallow";

type DataItem_Date = DataItem_Base & {
  type: DateType;
  typeof?: DateValueType;
  validations?: DataItemValidation<Date, DataItem_Date>;
  min?: DateValue;
  max?: DateValue;
  rangePair?: DateRangePair;
};

/**
 * Time
 */

type TimeMode = "hms" | "hm" | "h" | "ms";
type TimeUnit = "hour" | "minute" | "second" | "millisecond";
type TimeValue = number | string;

type TimeRangePair = {
  name: string;
  label?: string;
  position: "before" | "after";
  disallowSame?: boolean;
  unit?: TimeUnit;
};

type DataItem_Time = DataItem_Base & {
  type: "time";
  typeof?: "number" | "string";
  mode: TimeMode;
  unit: TimeUnit;
  validations?: DataItemValidation<number, DataItem_Time>;
  min?: TimeValue;
  max?: TimeValue;
  rangePair?: TimeRangePair;
};

/**
 * File
 */

type FileValueType = "file" | "base64";

type DataItem_File = DataItem_Base & {
  type: "file";
  typeof?: FileValueType;
  accept?: string;
  fileSize?: number;
  multiple?: boolean;
  totalFileSize?: number;
  validations?: DataItemValidation<Array<File | FileValue> | (File | FileValue), DataItem_File>;
};

type FileValue = {
  lastModifiedDate: string;
  filepath: string;
  newFilename: string;
  originalFilename: string;
  mimetype: string;
  hashAlgorithm: boolean,
  size: number;
};

/**
 * Array
 */

type DataItem_Array<T extends DataItem | DataContext = DataItem | DataContext> = DataItem_Base & {
  type: "array";
  validations?: DataItemValidation<Array<any>, DataItem_Array<T>>;
  item: T;
  length?: number;
  minLength?: number;
  maxLength?: number;
};

/**
 * Struct
 */

type DataItem_Struct<T extends DataContext = DataContext> = DataItem_Base & {
  type: "struct";
  validations?: DataItemValidation<Struct<any>, DataItem_Struct<T>>;
  item: T;
};