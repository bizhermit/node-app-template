import clone from "./clone";

describe("object clone", () => {
  describe("Null", () => {
    const v = null;
    const r = clone(v);
    expect(r).toBe(v);
  });

  describe("Undefined", () => {
    const v = undefined;
    const r = clone(v);
    expect(r).toBe(v);
  });

  describe("String", () => {
    const v = "a";
    const r = clone(v);
    expect(r).toBe(v);
  });

  describe("Number", () => {
    const v = 1;
    const r = clone(v);
    expect(r).toBe(v);
  });

  describe("BigInt", () => {
    const v = BigInt(1);
    const r = clone(v);
    expect(r).toBe(v);
  });

  describe("Boolean", () => {
    const v = true;
    const r = clone(v);
    expect(r).toBe(v);
  });

  describe("Array", () => {
    const v = [1, 2, 3];
    const r = clone(v);

    it("instance", () => {
      expect(r).not.toBe(v);
    });

    it("contents", () => {
      expect(r).toStrictEqual(v);
    });

    it("cloned push", () => {
      r.push(4);
      expect(r).not.toStrictEqual(v);
    });

    describe("deep", () => {
      const deepValue = [{ a: 1 }, ["b1", "b2"], new Map([["c1", 1], ["c2", 2]]), new Set(["d1", "d2"])];
      const clonedDeepValue = clone(deepValue);

      describe("root", () => {
        it("instance", () => {
          expect(clonedDeepValue).not.toBe(deepValue);
        });

        it("contents", () => {
          expect(clonedDeepValue).toStrictEqual(deepValue);
        });
      });

      describe("- 0", () => {
        it("instance", () => {
          expect(clonedDeepValue[0]).not.toBe(deepValue[0]);
        });

        it("contents", () => {
          expect(clonedDeepValue[0]).toStrictEqual(deepValue[0]);
        });
      });

      describe("- 1", () => {
        it("instance", () => {
          expect(clonedDeepValue[1]).not.toBe(deepValue[1]);
        });

        it("contents", () => {
          expect(clonedDeepValue[1]).toStrictEqual(deepValue[1]);
        });
      });

      describe("- 2", () => {
        it("instance", () => {
          expect(clonedDeepValue[2]).not.toBe(deepValue[2]);
        });

        it("contents", () => {
          expect(clonedDeepValue[2]).toStrictEqual(deepValue[2]);
        });
      });

      describe("- 3", () => {
        it("instance", () => {
          expect(clonedDeepValue[3]).not.toBe(deepValue[3]);
        });

        it("contents", () => {
          expect(clonedDeepValue[3]).toStrictEqual(deepValue[3]);
        });
      });
    });
  });

  describe("Object", () => {
    const v = { a: 1, b: 2, c: 3 };
    const r = clone(v);

    it("instance", () => {
      expect(r).not.toBe(v);
    });

    it("contents", () => {
      expect(r).toStrictEqual(v);
    });

    it("cloned edit same value", () => {
      r.a = 1;
      expect(r).toStrictEqual(v);
    });

    it("cloned edit", () => {
      r.a = 0;
      expect(r).not.toStrictEqual(v);
    });

    describe("deep", () => {
      const deepValue = { a: { a: 1 }, b: ["b1", "b2"], c: new Map([["c1", 1], ["c2", 2]]), d: new Set(["d1", "d2"]) };
      const clonedDeepValue = clone(deepValue);

      describe("root", () => {
        it("instance", () => {
          expect(clonedDeepValue).not.toBe(deepValue);
        });

        it("contents", () => {
          expect(clonedDeepValue).toStrictEqual(deepValue);
        });
      });

      describe("- 0", () => {
        it("instance", () => {
          expect(clonedDeepValue.a).not.toBe(deepValue.a);
        });

        it("contents", () => {
          expect(clonedDeepValue.a).toStrictEqual(deepValue.a);
        });
      });

      describe("- 1", () => {
        it("instance", () => {
          expect(clonedDeepValue.b).not.toBe(deepValue.b);
        });

        it("contents", () => {
          expect(clonedDeepValue.b).toStrictEqual(deepValue.b);
        });
      });

      describe("- 2", () => {
        it("instance", () => {
          expect(clonedDeepValue.c).not.toBe(deepValue.c);
        });

        it("contents", () => {
          expect(clonedDeepValue.c).toStrictEqual(deepValue.c);
        });
      });

      describe("- 3", () => {
        it("instance", () => {
          expect(clonedDeepValue.d).not.toBe(deepValue.d);
        });

        it("contents", () => {
          expect(clonedDeepValue.d).toStrictEqual(deepValue.d);
        });
      });
    });
  });

  describe("Map", () => {
    const v = new Map([["a", 1], ["b", 2], ["c", 3]]);
    const r = clone(v);

    it("instance", () => {
      expect(r).not.toBe(v);
    });

    it("contents", () => {
      expect(r).toStrictEqual(v);
    });

    it("cloned set same value", () => {
      r.set("a", 1);
      expect(r).toStrictEqual(v);
    });

    it("cloned add value", () => {
      r.set("d", 4);
      expect(r).not.toStrictEqual(v);
    });

    describe("deep", () => {
      const deepValue = new Map([
        ["a", { a: 1 }],
        ["b", ["b1", "b2"]],
      ]);
      const clonedDeepValue = clone(deepValue);

      describe("root", () => {
        it("instance", () => {
          expect(clonedDeepValue).not.toBe(deepValue);
        });

        it("contents", () => {
          expect(clonedDeepValue).toStrictEqual(deepValue);
        });
      });

      describe("- a", () => {
        it("instance", () => {
          expect(clonedDeepValue.get("a")).not.toBe(deepValue.get("a"));
        });

        it("contents", () => {
          expect(clonedDeepValue.get("a")).toStrictEqual(deepValue.get("a"));
        });
      });

      describe("- b", () => {
        it("instance", () => {
          expect(clonedDeepValue.get("b")).not.toBe(deepValue.get("b"));
        });

        it("contents", () => {
          expect(clonedDeepValue.get("b")).toStrictEqual(deepValue.get("b"));
        });
      });
    });
  });

  describe("Set", () => {
    const v = new Set([1, 2, 3]);
    const r = clone(v);

    it("instance", () => {
      expect(r).not.toBe(v);
    });

    it("contents", () => {
      expect(r).toStrictEqual(v);
    });

    it("cloned add same value", () => {
      r.add(2);
      expect(r).toStrictEqual(v);
    });

    it("cloned add", () => {
      r.add(4);
      expect(r).not.toStrictEqual(v);
    });

    describe("deep", () => {
      const deepValue = new Set([{ a: 1 }, [2]]);
      const clonedDeepValue = clone(deepValue);

      describe("root", () => {
        it("instance", () => {
          expect(clonedDeepValue).not.toBe(deepValue);
        });

        it("contents", () => {
          expect(clonedDeepValue).toStrictEqual(deepValue);
        });
      });

      describe("- 0", () => {
        it("instance", () => {
          expect(Array.from(clonedDeepValue.entries())[0]).not.toBe(Array.from(deepValue.entries())[0]);
        });

        it("contents", () => {
          expect(Array.from(clonedDeepValue.entries())[0]).toStrictEqual(Array.from(deepValue.entries())[0]);
        });
      });

      describe("- 1", () => {
        it("instance", () => {
          expect(Array.from(clonedDeepValue.entries())[1]).not.toBe(Array.from(deepValue.entries())[1]);
        });

        it("contents", () => {
          expect(Array.from(clonedDeepValue.entries())[1]).toStrictEqual(Array.from(deepValue.entries())[1]);
        });
      });
    });
  });

  describe("RegExp", () => {
    const v = new RegExp(".*");
    const r = clone(v);

    it("instance", () => {
      expect(r).not.toBe(v);
    });

    it("contents", () => {
      expect(r).toStrictEqual(v);
    });
  });
});
