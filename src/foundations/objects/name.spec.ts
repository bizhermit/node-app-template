import getObjectType from "./name";

describe("object name", () => {
  it("Null", () => {
    const name = getObjectType(null);
    expect(name).toBe("Null");
  });

  it("Undefined", () => {
    const name = getObjectType(undefined);
    expect(name).toBe("Undefined");
  });

  it("String", () => {
    const name = getObjectType("string");
    expect(name).toBe("String");
  });

  it("Number", () => {
    const name = getObjectType(0);
    expect(name).toBe("Number");
  });

  it("Bigint", () => {
    const name = getObjectType(BigInt("0"));
    expect(name).toBe("BigInt");
  });

  it("Boolean", () => {
    const name = getObjectType(false);
    expect(name).toBe("Boolean");
  });

  it("Date", () => {
    const name = getObjectType(new Date());
    expect(name).toBe("Date");
  });

  it("Array", () => {
    const name = getObjectType([]);
    expect(name).toBe("Array");
  });

  it("Object", () => {
    const name = getObjectType({});
    expect(name).toBe("Object");
  });

  it("Map", () => {
    const name = getObjectType(new Map());
    expect(name).toBe("Map");
  });

  it("Set", () => {
    const name = getObjectType(new Set());
    expect(name).toBe("Set");
  });

  it("EegExp", () => {
    const name = getObjectType(new RegExp(".*"));
    expect(name).toBe("RegExp");
  });
});
