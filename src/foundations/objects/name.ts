type ObjectType =
  | "Null"
  | "Undefined"
  | "String"
  | "Number"
  | "BigInt"
  | "Boolean"
  | "Date"
  | "Array"
  | "Object"
  | "Map"
  | "Set"
  | "RegExp";

const getObjectType = (o: any) => toString.call(o).slice(8, -1) as ObjectType;

export default getObjectType;
