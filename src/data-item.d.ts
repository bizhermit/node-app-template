type DataItemKey = "$$";

type DataValueType = string | number | boolean | Date | Array<DataValueType> | { [key: string]: DataValueType };

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

type DataItemValidation<T, D extends DataItem> =
  readonly ((v: Nullable<T>, key: string | number, ctx: D, data: Nullable<Struct | Array<any>>, index: Nullable<number>, pctx: DataContext | null | undefined)
    => ((Omit<DataItemValidationResult, "type" | "key" | "name"> & Partial<Pick<DataItemValidationResult, "type" | "key" | "name">>)| string | null | undefined))[];

type DataItem_Base = {
  $$: any;
  name?: string;
  label?: string;
  required?: boolean;
  strict?: boolean;
};

type DataContext = { [key: string]: DataItem };

type DataItem = DataContext
  | DataItem_String
  | DataItem_Number
  | DataItem_Boolean<any, any>
  | DataItem_Date
  | DataItem_Array<any>
  | DataItem_Struct<any>
  | (DataItem_Base & { type: "any" })
  ;

type DataItemValueType<D extends DataItem, Strict extends boolean = false> =
  D extends { $$: any } ? (
    D["type"] extends DataItem_String["type"] ? (
      Strict extends true ? (
        D["required"] extends true ? string : Nullable<string>
      ) : Nullable<string | number | boolean>
    ) :
    D["type"] extends DataItem_Number["type"] ? (
      Strict extends true ? (
        D["required"] extends true ? number : Nullable<number>
      ) : (
        D["strict"] extends true ? Nullable<number> : Nullable<number | string>
      )
    ) :
    D["type"] extends DataItem_Boolean["type"] ? (
      Strict extends true ? (
        D["required"] extends true ? (
          (D extends { trueValue: infer T } ? T : true) | (D extends { falseValue: infer F } ? F : false)
        ) : Nullable<(D extends { trueValue: infer T } ? T : true) | (D extends { falseValue: infer F } ? F : false)>
      ) : (
        D["strict"] extends true ?
        Nullable<(D extends { trueValue: infer T } ? T : true) | (D extends { falseValue: infer F } ? F : false)> :
        Nullable<(D extends { trueValue: infer T } ? T : true) | (D extends { falseValue: infer F } ? F : false) | boolean | string | number>
      )
    ) :
    D["type"] extends DataItem_Date["type"] ? (
      Strict extends true ? (
        D["required"] extends true ? Date : Nullable<Date>
      ) : DateValue | null | undefined
    ) :
    D["type"] extends DataItem_Time["type"] ? (
      Strict extends true ? (
        D["required"] extends true ? number : number | null | undefined
      ) : TimeValue | null | undefined
    ) :
    D["type"] extends DataItem_Array["type"] ? (
      Strict extends true ? (
        D["required"] extends true ? Array<DataItemValueType<D["item"], Strict>> : Nullable<Array<DataItemValueType<D["item"], Strict>>>
      ) : Array<DataItemValueType<D["item"], Strict>> | undefined
    ) :
    D["type"] extends DataItem_Struct["type"] ? (
      Strict extends true ? (
        D["required"] extends true ? { [P in keyof D["item"]]: D["item"][P] } : Nullable<{ [P in keyof D["item"]]: D["item"][P] }>
      ) : { [P in keyof D["item"]]?: DataItemValueType<D["item"][P], Strict> }
    ) :
    any
  ) : (
    Strict extends true ?
    { [P in keyof D]: DataItemValueType<D[P], Strict> } :
    { [P in keyof D]?: DataItemValueType<D[P], Strict> }
  )
  ;

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
  // styles
  width?: number | string;
  minWidth?: number | string;
  maxWidth?: number | string;
};

/**
 * Boolean
 */

type DataItem_Boolean = DataItem_Base & {
  type: "boolean";
  validations?: DataItemValidation<boolean | number | string, DataItem_Boolean>;
  trueValue?: boolean | number | string;
  falseValue?: boolean | number | string;
};

/**
 * Date
 */

type DateType = "date" | "month" | "year";
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

type DataItem_Date = DataItem_Base & {
  type: DateType;
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
  mode: TimeMode;
  unit: TimeUnit;
  validations?: DataItemValidation<Time, DataItem_Time>;
  min?: TimeValue;
  max?: TimeValue;
  rangePair?: TimeRangePair;
};

/**
 * Array
 */

type DataItem_Array<T extends DataItem | { [key: string]: DataItem } = DataItem | { [key: string]: DataItem }> = DataItem_Base & {
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

type DataItem_Struct<T extends { [key: string]: DataItem; } = { [key: string]: DataItem; }> = DataItem_Base & {
  type: "struct";
  validations?: DataItemValidation<Struct<any>, DataItem_Struct<T>>;
  item: T;
};