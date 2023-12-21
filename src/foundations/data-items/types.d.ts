declare namespace DI {

  type Key = "$$"

  type ValidationResultType = "error" | "warning" | "information";

  type ValidationResult = {
    type: DI.ValidationResultType;
    key?: string | number;
    index?: number;
    value?: any;
    name?: string;
    title?: string;
    body: string;
  };

  type Validation<T, D extends DataItem | DI.Context> =
    readonly ((v: T | null | undefined, ctx: {
      dataItem: D;
      key: string | number;
      data: { [v: string]: any } | Array<any> | null | undefined;
      index?: number;
      parentDataContext?: DI.Context | null | undefined;
    }) => ((Omit<DI.ValidationResult, "type" | "key" | "name"> & Partial<Pick<DI.ValidationResult, "type" | "key" | "name">>) | string | null | undefined))[];

  type Source<V> = Array<{ value: V } & { [v: string | number | symbol]: any }> | import("../client/hooks/loadable-array").LoadableArray;

  type SourceValue<D extends DataItem, T> =
    D extends { source: infer S } ? (
      S extends Array<infer V> ? (V["value"]) : T
    ) : T;

  type PartialRequired<D extends DataItem, Strict extends boolean, StrictValue, Value = StrictValue> =
    Strict extends true ? (
      D["required"] extends true ? DI.SourceValue<D, StrictValue> : DI.SourceValue<D, StrictValue> | null | undefined
    ) : (
      D["strict"] extends true ? (
        D["required"] extends true ? DI.SourceValue<D, StrictValue> : DI.SourceValue<D, StrictValue> | null | undefined
      ) : (
        D["required"] extends true ? DI.SourceValue<D, Value> | Value : DI.SourceValue<D, Value> | Value | null | undefined
      )
    );

  type VType<
    D extends (DataItem | DI.Context),
    Strict extends boolean = false,
    Side extends "client" | "page-api" | "app-api" = "client"
  > =
    D extends { $$: any } ? (
      D["type"] extends DataItem_String["type"] ? (
        DI.PartialRequired<D, Strict, string, StringValue>
      ) :
      D["type"] extends DataItem_Number["type"] ? (
        DI.PartialRequired<D, Strict, number, NumberValue>
      ) :
      D["type"] extends DataItem_Boolean["type"] ? (
        DI.PartialRequired<
          D,
          Strict,
          (D extends { trueValue: infer T } ? T : true) | (D extends { falseValue: infer F } ? F : false),
          (D extends { trueValue: infer T } ? T : true) | (D extends { falseValue: infer F } ? F : false) | BooleanValue | null | undefined
        >
      ) :
      D["type"] extends DataItem_Date["type"] ? (
        DI.PartialRequired<
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
        DI.PartialRequired<
          D,
          Strict,
          D["typeof"] extends "string" ? string :
          D["typeof"] extends "number" ? number :
          number,
          TimeValue
        >
      ) :
      D["type"] extends DataItem_File["type"] ? (
        DI.PartialRequired<
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
        DI.PartialRequired<
          D,
          Strict,
          Array<DI.VType<D["item"], Strict, Side>>
        >
      ) :
      D["type"] extends DataItem_Struct["type"] ? (
        DI.PartialRequired<
          D,
          Strict,
          { [P in keyof D["item"]]: D["item"][P] },
          { [P in keyof D["item"]]?: DI.VType<D["item"][P], Strict, Side> }
        >
      ) :
      any
    ) : (
      Strict extends true ?
      { [P in keyof D]: DI.VType<D[P], Strict, Side> } :
      { [P in keyof D]?: DI.VType<D[P], Strict, Side> }
    );

  type Prop<D extends DataItem> = D extends DataItem ? {
    [P in D["name"]]: DI.VType<D, true, "client">;
  } : never;

  type CrossProps<U> = Pick<U, keyof U>;
  type UnionToIntersection<A> = (A extends any ? (_: A) => void : never) extends ((_: infer B) => void) ? B : never;

  type Props<A extends ({ [v: string | number | symbol]: DataItem } | Array<DataItem>)> = A extends { [v: string | number | symbol]: DataItem } ?
    { [P in keyof A]: DI.VType<A[P], true, "client"> } :
    DI.CrossProps<DI.UnionToIntersection<DI.Prop<A[number]>>>;

  type Context = { [v: string]: DataItem | DI.Context };

}

type DataItem_Base<V = any> = {
  $$: V;
  name: string;
  label?: string;
  required?: boolean;
  strict?: boolean;
};

type DataContext = { [v: string]: DataItem | DI.Context };

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
  validations?: DI.Validation<string, DataItem_String>;
  length?: number;
  minLength?: number;
  maxLength?: number;
  charType?: StringCharType;
  source?: DI.Source<V>;
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
  validations?: DI.Validation<number, DataItem_Number>;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  float?: number;
  source?: DI.Source<V>;
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
  validations?: DI.Validation<T | F, DataItem_Boolean<T, F>>;
  trueValue: T;
  falseValue: F;
  source?: DI.Source<T | F>;
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
  validations?: DI.Validation<Date, DataItem_Date>;
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
  validations?: DI.Validation<number, DataItem_Time>;
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
  validations?: DI.Validation<Array<File | FileValue> | (File | FileValue), DataItem_File>;
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

type DataItem_Array<T extends DataItem | DI.Context = DataItem | DI.Context> = Readonly<DataItem_Base & {
  type: "array";
  validations?: DI.Validation<Array<any>, DataItem_Array<T>>;
  item: T;
  length?: number;
  minLength?: number;
  maxLength?: number;
}>;

/**
 * Struct
 */

type DataItem_Struct<T extends DI.Context = DI.Context> = Readonly<DataItem_Base & {
  type: "struct";
  validations?: DI.Validation<{ [v: string | number | symbol]: any }, DataItem_Struct<T>>;
  item: T;
}>;