import getObjectType from "./name";

describe("object name", () => {
  it("Null", () => {
    const name = getObjectType(null);
    expect(name).toEqual("Null");
  });

  it("Undefined", () => {
    expect(getObjectType(undefined)).toEqual("Undefined");
  });

  it("String", () => {
    const name = getObjectType("string");
    expect(name).toEqual("String");
  });

  it("Number", () => {
    const name = getObjectType(0);
    expect(name).toEqual("Number");
  });

  it("Bigint", () => {
    const name = getObjectType(BigInt("0"));
    expect(name).toEqual("BigInt");
  });

  it("Boolean", () => {
    const name = getObjectType(false);
    expect(name).toEqual("Boolean");
  });

  it("Date", () => {
    const name = getObjectType(new Date());
    expect(name).toEqual("Date");
  });

  it("Array", () => {
    const name = getObjectType([]);
    expect(name).toEqual("Array");
  });

  it("Object", () => {
    const name = getObjectType({});
    expect(name).toEqual("Object");
  });

  it("Map", () => {
    const name = getObjectType(new Map());
    expect(name).toEqual("Map");
  });

  it("Set", () => {
    const name = getObjectType(new Set());
    expect(name).toEqual("Set");
  });

  it("EegExp", () => {
    const name = getObjectType(new RegExp(".*"));
    expect(name).toEqual("RegExp");
  });
});
