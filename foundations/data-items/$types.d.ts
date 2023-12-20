type DataItemKey = "$$";

type DataValueType = string | number | boolean | Date | File | Array<DataValueType> | { [key: string]: DataValueType };

type DataItemValidationResultType = "error" | "warning" | "information";
type DataItemValidationResult = {
  type: DataItemValidationResultType;
  key?: string | number;
  index?: number;
  value?: any;
  name?: string;
  title?: string;
  body: string;
};

type DataItemValidation<T, D extends DataItem | DataContext> =
  readonly ((v: T | null | undefined, ctx: {
    dataItem: D;
    key: string | number;
    data: { [key: string]: any } | Array<any> | null | undefined;
    index?: number;
    parentDataContext?: DataContext | null | undefined;
  }) => ((Omit<DataItemValidationResult, "type" | "key" | "name"> & Partial<Pick<DataItemValidationResult, "type" | "key" | "name">>) | string | null | undefined))[];

type LoadableArray<T = { [v: string | number | symbol]: any }> = Array<T> | Readonly<Array<T>> | (() => Array<T>) | (() => Promise<Array<T>>);
type DataItemSource<V> = Array<{ value: V } & { [key: string]: any }> | LoadableArray

type DataItem_Base<V = any> = {
  $$: V;
  name?: string;
  label?: string;
  required?: boolean;
  strict?: boolean;
};

type DataContext = { [key: string]: DataItem | DataContext };

type DataItem = Readonly<DataItem_Base & { type: "any" }>
  | DataItem_String
  | DataItem_Number
  | DataItem_Boolean<any, any>
  | DataItem_Date
  | DataItem_Time
  | DataItem_File
  | DataItem_Array<any>
  | DataItem_Struct<any>
  ;

type DataItemSourceKeyValue<D extends DataItem, T> =
  D extends { source: infer S } ? (
    S extends Array<infer V> ? (V["value"]) : T
  ) : T;

type DataItemValueTypeRequired<D extends DataItem, Strict extends boolean, StrictValue, Value = StrictValue> =
  Strict extends true ? (
    D["required"] extends true ? DataItemSourceKeyValue<D, StrictValue> : DataItemSourceKeyValue<D, StrictValue> | null | undefined
  ) : (
    D["strict"] extends true ? (
      D["required"] extends true ? DataItemSourceKeyValue<D, StrictValue> : DataItemSourceKeyValue<D, StrictValue> | null | undefined
    ) : (
      D["required"] extends true ? DataItemSourceKeyValue<D, Value> | Value : DataItemSourceKeyValue<D, Value> | Value | null | undefined
    )
  );

type DataItemValueType<
  D extends (DataItem | DataContext),
  Strict extends boolean = false,
  Side extends "client" | "page-api" | "app-api" = "client"
> =
  D extends { $$: any } ? (
    D["type"] extends DataItem_String["type"] ? (
      DataItemValueTypeRequired<D, Strict, string, StringValue>
    ) :
    D["type"] extends DataItem_Number["type"] ? (
      DataItemValueTypeRequired<D, Strict, number, NumberValue>
    ) :
    D["type"] extends DataItem_Boolean["type"] ? (
      DataItemValueTypeRequired<
        D,
        Strict,
        (D extends { trueValue: infer T } ? T : true) | (D extends { falseValue: infer F } ? F : false),
        (D extends { trueValue: infer T } ? T : true) | (D extends { falseValue: infer F } ? F : false) | BooleanValue | null | undefined
      >
    ) :
    D["type"] extends DataItem_Date["type"] ? (
      DataItemValueTypeRequired<
        D,
        Strict,
        D["typeof"] extends "date" ? Date :
        D["typeof"] extends "number" ? number :
        D["typeof"] extends "string" ? string :
        string,
        DateValue
      >
    ) :
    D["type"] extends DataItem_Time["type"] ? (
      DataItemValueTypeRequired<
        D,
        Strict,
        D["typeof"] extends "string" ? string :
        D["typeof"] extends "number" ? number :
        number,
        TimeValue
      >
    ) :
    D["type"] extends DataItem_File["type"] ? (
      DataItemValueTypeRequired<
        D,
        Strict,
        D["multiple"] extends true ? (
          D["typeof"] extends "base64" ? Array<string> :
          D["typeof"] extends "file" ? Array<(Side extends "client" ? File : FileValue<Side>)> :
          Array<any>
        ) : (
          D["typeof"] extends "base64" ? string :
          D["typeof"] extends "file" ? (Side extends "client" ? File : FileValue<Side>) :
          any
        ),
        D["multiple"] extends true ? Array<FileValue<Side>> : Array<FileValue<Side>>
      >
    ) :
    D["type"] extends DataItem_Array["type"] ? (
      DataItemValueTypeRequired<
        D,
        Strict,
        Array<DataItemValueType<D["item"], Strict, Side>>
      >
    ) :
    D["type"] extends DataItem_Struct["type"] ? (
      DataItemValueTypeRequired<
        D,
        Strict,
        { [P in keyof D["item"]]: D["item"][P] },
        { [P in keyof D["item"]]?: DataItemValueType<D["item"][P], Strict, Side> }
      >
    ) :
    any
  ) : (
    Strict extends true ?
    { [P in keyof D]: DataItemValueType<D[P], Strict, Side> } :
    { [P in keyof D]?: DataItemValueType<D[P], Strict, Side> }
  )
  ;

type DataProp<D extends DataItem> = D extends DataItem ? {
  [P in D["name"]]: DataItemValueType<D, true, "client">;
} : never;

type CrossDataProps<U> = Pick<U, keyof U>;
type UnionToIntersection<A> = (A extends any ? (_: A) => void : never) extends ((_: infer B) => void) ? B : never;
type DataProps<A extends ({ [v: string | number | symbol]: DataItem } | Array<DataItem>)> = A extends { [v: string | number | symbol]: DataItem } ?
  { [P in keyof A]: DataItemValueType<A[P], true, "client"> } :
  CrossDataProps<UnionToIntersection<DataProp<A[number]>>>;

/**
 * String
 */

type StringValue = string | number | boolean;

type StringCharType =
  | "int"
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
  | "katakana"
  | "email"
  | "tel"
  | "url";

type DataItem_String<V extends string = string> = Readonly<DataItem_Base<V> & {
  type: "string";
  validations?: DataItemValidation<string, DataItem_String>;
  length?: number;
  minLength?: number;
  maxLength?: number;
  charType?: StringCharType;
  source?: DataItemSource<V>;
  // styles
  align?: "left" | "center" | "right";
  width?: number | string;
  minWidth?: number | string;
  maxWidth?: number | string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
}>;

/**
 * Number
 */

type NumberValue = number | string;

type DataItem_Number<V extends number = number> = Readonly<DataItem_Base<V> & {
  type: "number";
  validations?: DataItemValidation<number, DataItem_Number>;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  float?: number;
  source?: DataItemSource<V>;
  // styles
  align?: "left" | "center" | "right";
  width?: number | string;
  minWidth?: number | string;
  maxWidth?: number | string;
}>;

/**
 * Boolean
 */

type BooleanValue = boolean | string | number;

type DataItem_Boolean<
  T extends boolean | number | string = boolean | number | string,
  F extends boolean | number | string = boolean | number | string
> = Readonly<DataItem_Base<T | F> & {
  type: "boolean";
  validations?: DataItemValidation<T | F, DataItem_Boolean<T, F>>;
  trueValue: T;
  falseValue: F;
  source?: DataItemSource<T | F>;
}>;

/**
 * Date
 */

type DateType = "date" | "month" | "year";
type DateValueType = "string" | "number" | "date";
type DateValue = string | number | Date;

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

type DataItem_Date = Readonly<DataItem_Base & {
  type: DateType;
  typeof?: DateValueType;
  validations?: DataItemValidation<Date, DataItem_Date>;
  min?: DateValue;
  max?: DateValue;
  rangePair?: DateRangePair;
}>;

/**
 * Time
 */

type TimeMode = "hms" | "hm" | "h" | "ms";
type TimeUnit = "hour" | "minute" | "second" | "millisecond";
type TimeValue = number | string;
type TimeValueType = "number" | "string";

type TimeRangePair = {
  name: string;
  label?: string;
  position: "before" | "after";
  disallowSame?: boolean;
  unit?: TimeUnit;
};

type DataItem_Time = Readonly<DataItem_Base & {
  type: "time";
  typeof?: TimeValueType;
  mode: TimeMode;
  unit: TimeUnit;
  validations?: DataItemValidation<number, DataItem_Time>;
  min?: TimeValue;
  max?: TimeValue;
  rangePair?: TimeRangePair;
}>;

/**
 * File
 */

type FileValueType = "file" | "base64";

type DataItem_File = Readonly<DataItem_Base & {
  type: "file";
  typeof?: FileValueType;
  accept?: string;
  fileSize?: number;
  multiple?: boolean;
  totalFileSize?: number;
  validations?: DataItemValidation<Array<File | FileValue> | (File | FileValue), DataItem_File>;
}>;

type FileValue<Side extends "page-api" | "app-api" = "page-api" | "app-api"> = Side extends "page-api" ? {
  lastModifiedDate?: string;
  filepath?: string;
  newFilename?: string;
  hashAlgorithm?: boolean,
  originalFilename: string;
  mimetype: string;
  size: number;
  content?: string;
} : Blob;

/**
 * Array
 */

type DataItem_Array<T extends DataItem | DataContext = DataItem | DataContext> = Readonly<DataItem_Base & {
  type: "array";
  validations?: DataItemValidation<Array<any>, DataItem_Array<T>>;
  item: T;
  length?: number;
  minLength?: number;
  maxLength?: number;
}>;

/**
 * Struct
 */

type DataItem_Struct<T extends DataContext = DataContext> = Readonly<DataItem_Base & {
  type: "struct";
  validations?: DataItemValidation<{ [v: string | number | symbol]: any }, DataItem_Struct<T>>;
  item: T;
}>;