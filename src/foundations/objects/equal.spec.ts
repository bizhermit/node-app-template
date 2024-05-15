import equals from "./equal";

describe("object equals", () => {
  describe("Null/Undefined", () => {
    it("null - null", () => {
      const result = equals(null, null);
      expect(result).toBe(true);
    });

    it("null - undefined", () => {
      const result = equals(null, undefined);
      expect(result).toBe(true);
    });

    it("null - blank", () => {
      const result = equals(null, "");
      expect(result).toBe(false);
    });

    it("undefined - blank", () => {
      const result = equals(undefined, "");
      expect(result).toBe(false);
    });

    it("null - 0", () => {
      const result = equals(null, 0);
      expect(result).toBe(false);
    });

    it("undefined - 0", () => {
      const result = equals(undefined, 0);
      expect(result).toBe(false);
    });

    it("null - false", () => {
      const result = equals(null, false);
      expect(result).toBe(false);
    });

    it("undefined - false", () => {
      const result = equals(undefined, false);
      expect(result).toBe(false);
    });

    it("blank - 0", () => {
      const result = equals("", 0);
      expect(result).toBe(false);
    });
  });

  describe("String", () => {
    it("'a' - 'a'", () => {
      const result = equals("a", "a");
      expect(result).toBe(true);
    });

    it("'' - 'a'", () => {
      const result = equals("", "a");
      expect(result).toBe(false);
    });

    describe("var", () => {
      let v = "a";

      it("same", () => {
        const result = equals(v, (() => {
          v += "";
          return v;
        })());
        expect(result).toBe(true);
      });

      it("different", () => {
        const result = equals(v, (() => {
          v += "z";
          return v;
        })());
        expect(result).toBe(false);
      });
    });
  });

  describe("Number", () => {
    it("0 - 0", () => {
      const result = equals(0, 0);
      expect(result).toBe(true);
    });

    it("0 - 1", () => {
      const result = equals(0, 1);
      expect(result).toBe(false);
    });

    describe("var", () => {
      let v = 0;

      it("same", () => {
        const result = equals(v, (() => {
          v += 0;
          return v;
        })());
        expect(result).toBe(true);
      });

      it("different", () => {
        const result = equals(v, (() => {
          v += 1;
          return v;
        })());
        expect(result).toBe(false);
      });
    });
  });

  describe("BigInt", () => {
    it("1n - 1n (same instance)", () => {
      const obj = BigInt(1);
      const result = equals(obj, obj);
      expect(result).toBe(true);
    });

    it("1n - 1n (different instance)", () => {
      const result = equals(BigInt(1), BigInt(1));
      expect(result).toBe(true);
    });

    it("0n - 1n", () => {
      const result = equals(BigInt(0), BigInt(1));
      expect(result).toBe(false);
    });

    it("0n - 0", () => {
      const result = equals(BigInt(0), 0);
      expect(result).toBe(false);
    });

    it("0n - false", () => {
      const result = equals(BigInt(0), false);
      expect(result).toBe(false);
    });

    it("0n - '0'", () => {
      const result = equals(BigInt(0), "0");
      expect(result).toBe(false);
    });

    it("0n - '0n'", () => {
      const result = equals(BigInt(0), "0n");
      expect(result).toBe(false);
    });

    it("1n - 1", () => {
      const result = equals(BigInt(1), 1);
      expect(result).toBe(false);
    });

    it("1n - true", () => {
      const result = equals(BigInt(1), true);
      expect(result).toBe(false);
    });

    it("1n - '1'", () => {
      const result = equals(BigInt(1), "1");
      expect(result).toBe(false);
    });

    it("1n - '1n'", () => {
      const result = equals(BigInt(1), "1n");
      expect(result).toBe(false);
    });

    describe("var", () => {
      let v = BigInt(0);

      it("same", () => {
        const result = equals(v, (() => {
          v += BigInt(0);
          return v;
        })());
        expect(result).toBe(true);
      });

      it("different", () => {
        const result = equals(v, (() => {
          v += BigInt(1);
          return v;
        })());
        expect(result).toBe(false);
      });
    });
  });

  describe("Boolean", () => {
    it("true - true", () => {
      const result = equals(true, true);
      expect(result).toBe(true);
    });

    it("true - false", () => {
      const result = equals(true, false);
      expect(result).toBe(false);
    });

    describe("var", () => {
      let v = false;

      it("same", () => {
        const result = equals(v, (() => {
          v = false;
          return v;
        })());
        expect(result).toBe(true);
      });

      it("different", () => {
        const result = equals(v, (() => {
          v = true;
          return v;
        })());
        expect(result).toBe(false);
      });
    });
  });

  describe("Array", () => {
    describe("same instance", () => {
      const v: any[] = [];

      it("same", () => {
        const result = equals(v, v);
        expect(result).toBe(true);
      });

      it("pushed", () => {
        const result = equals(v, (() => {
          v.push("a");
          return v;
        })());
        expect(result).toBe(true);
      });
    });

    it("different instance", () => {
      const result = equals([], []);
      expect(result).toBe(false);
    });
  });

  describe("Object", () => {
    describe("same instance", () => {
      const v: { [v: string | number | symbol]: any } = {};

      it("same", () => {
        const result = equals(v, v);
        expect(result).toBe(true);
      });

      it("pushed", () => {
        const result = equals(v, (() => {
          v["a"] = "";
          return v;
        })());
        expect(result).toBe(true);
      });
    });

    it("different instance", () => {
      const result = equals({}, {});
      expect(result).toBe(false);
    });
  });

  describe("Map", () => {
    describe("same instance", () => {
      const v = new Map();

      it("same", () => {
        const result = equals(v, v);
        expect(result).toBe(true);
      });

      it("set", () => {
        const result = equals(v, (() => {
          v.set("a", "");
          return v;
        })());
        expect(result).toBe(true);
      });
    });

    it("different instance", () => {
      const result = equals(new Map(), new Map());
      expect(result).toBe(false);
    });
  });

  describe("Set", () => {
    describe("same instance", () => {
      const v = new Set();

      it("same", () => {
        const result = equals(v, v);
        expect(result).toBe(true);
      });

      it("added", () => {
        const result = equals(v, (() => {
          v.add("a");
          return v;
        })());
        expect(result).toBe(true);
      });
    });

    it("different instance", () => {
      const result = equals(new Set(), new Set());
      expect(result).toBe(false);
    });
  });

  describe("RegExp", () => {
    describe("same instance", () => {
      let v = new RegExp(".*");

      it("same", () => {
        const result = equals(v, v);
        expect(result).toBe(true);
      });

      it("new", () => {
        const result2 = equals(v, (() => {
          v = new RegExp(".*");
          return v;
        })());
        expect(result2).toBe(false);
      });
    });

    it("different instance", () => {
      const result = equals(new RegExp(".*"), new RegExp(".*"));
      expect(result).toBe(false);
    });
  });
});
