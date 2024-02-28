import equals from "./equal";

describe("object equals", () => {
  describe("Null/Undefined", () => {
    it("null - null", () => {
      const result = equals(null, null);
      expect(result).toEqual(true);
    });

    it("null - undefined", () => {
      const result = equals(null, undefined);
      expect(result).toBeTruthy();
    });

    it("null - blank", () => {
      const result = equals(null, "");
      expect(result).toBeFalsy();
    });

    it("undefined - blank", () => {
      const result = equals(undefined, "");
      expect(result).toBeFalsy();
    });

    it("null - 0", () => {
      const result = equals(null, 0);
      expect(result).toBeFalsy();
    });

    it("undefined - 0", () => {
      const result = equals(undefined, 0);
      expect(result).toBeFalsy();
    });

    it("null - false", () => {
      const result = equals(null, false);
      expect(result).toBeFalsy();
    });

    it("undefined - false", () => {
      const result = equals(undefined, false);
      expect(result).toBeFalsy();
    });

    it("blank - 0", () => {
      const result = equals("", 0);
      expect(result).toBeFalsy();
    });
  });

  describe("String", () => {
    it("'a' - 'a'", () => {
      const result = equals("a", "a");
      expect(result).toBeTruthy();
    });

    it("'' - 'a'", () => {
      const result = equals("", "a");
      expect(result).toBeFalsy();
    });

    describe("var", () => {
      let v = "a";

      it("same", () => {
        const result = equals(v, (() => {
          v += "";
          return v;
        })());
        expect(result).toBeTruthy();
      });

      it("different", () => {
        const result = equals(v, (() => {
          v += "z";
          return v;
        })());
        expect(result).toBeFalsy();
      });
    });
  });

  describe("Number", () => {
    it("0 - 0", () => {
      const result = equals(0, 0);
      expect(result).toBeTruthy();
    });

    it("0 - 1", () => {
      const result = equals(0, 1);
      expect(result).toBeFalsy();
    });

    describe("var", () => {
      let v = 0;

      it("same", () => {
        const result = equals(v, (() => {
          v += 0;
          return v;
        })());
        expect(result).toBeTruthy();
      });

      it("different", () => {
        const result = equals(v, (() => {
          v += 1;
          return v;
        })());
        expect(result).toBeFalsy();
      });
    });
  });

  describe("BigInt", () => {
    it("1n - 1n (same instance)", () => {
      const obj = BigInt(1);
      const result = equals(obj, obj);
      expect(result).toBeTruthy();
    });

    it("1n - 1n (different instance)", () => {
      const result = equals(BigInt(1), BigInt(1));
      expect(result).toBeTruthy();
    });

    it("0n - 1n", () => {
      const result = equals(BigInt(0), BigInt(1));
      expect(result).toBeFalsy();
    });

    it("0n - 0", () => {
      const result = equals(BigInt(0), 0);
      expect(result).toBeFalsy();
    });

    it("0n - false", () => {
      const result = equals(BigInt(0), false);
      expect(result).toBeFalsy();
    });

    it("0n - '0'", () => {
      const result = equals(BigInt(0), "0");
      expect(result).toBeFalsy();
    });

    it("0n - '0n'", () => {
      const result = equals(BigInt(0), "0n");
      expect(result).toBeFalsy();
    });

    it("1n - 1", () => {
      const result = equals(BigInt(1), 1);
      expect(result).toBeFalsy();
    });

    it("1n - true", () => {
      const result = equals(BigInt(1), true);
      expect(result).toBeFalsy();
    });

    it("1n - '1'", () => {
      const result = equals(BigInt(1), "1");
      expect(result).toBeFalsy();
    });

    it("1n - '1n'", () => {
      const result = equals(BigInt(1), "1n");
      expect(result).toBeFalsy();
    });

    describe("var", () => {
      let v = BigInt(0);

      it("same", () => {
        const result = equals(v, (() => {
          v += BigInt(0);
          return v;
        })());
        expect(result).toBeTruthy();
      });

      it("different", () => {
        const result = equals(v, (() => {
          v += BigInt(1);
          return v;
        })());
        expect(result).toBeFalsy();
      });
    });
  });

  describe("Boolean", () => {
    it("true - true", () => {
      const result = equals(true, true);
      expect(result).toBeTruthy();
    });

    it("true - false", () => {
      const result = equals(true, false);
      expect(result).toBeFalsy();
    });

    describe("var", () => {
      let v = false;

      it("same", () => {
        const result = equals(v, (() => {
          v = false;
          return v;
        })());
        expect(result).toBeTruthy();
      });

      it("different", () => {
        const result = equals(v, (() => {
          v = true;
          return v;
        })());
        expect(result).toBeFalsy();
      });
    });
  });

  describe("Array", () => {
    describe("same instance", () => {
      const v: any[] = [];

      it("same", () => {
        const result = equals(v, v);
        expect(result).toBeTruthy();
      });

      it("pushed", () => {
        const result = equals(v, (() => {
          v.push("a");
          return v;
        })());
        expect(result).toBeTruthy();
      });
    });

    it("different instance", () => {
      const result = equals([], []);
      expect(result).toBeFalsy();
    });
  });

  describe("Object", () => {
    describe("same instance", () => {
      const v: { [v: string | number | symbol]: any } = {};

      it("same", () => {
        const result = equals(v, v);
        expect(result).toBeTruthy();
      });

      it("pushed", () => {
        const result = equals(v, (() => {
          v["a"] = "";
          return v;
        })());
        expect(result).toBeTruthy();
      });
    });

    it("different instance", () => {
      const result = equals({}, {});
      expect(result).toBeFalsy();
    });
  });

  describe("Map", () => {
    describe("same instance", () => {
      const v = new Map();

      it("same", () => {
        const result = equals(v, v);
        expect(result).toBeTruthy();
      });

      it("set", () => {
        const result = equals(v, (() => {
          v.set("a", "");
          return v;
        })());
        expect(result).toBeTruthy();
      });
    });

    it("different instance", () => {
      const result = equals(new Map(), new Map());
      expect(result).toBeFalsy();
    });
  });

  describe("Set", () => {
    describe("same instance", () => {
      const v = new Set();

      it("same", () => {
        const result = equals(v, v);
        expect(result).toBeTruthy();
      });

      it("added", () => {
        const result = equals(v, (() => {
          v.add("a");
          return v;
        })());
        expect(result).toBeTruthy();
      });
    });

    it("different instance", () => {
      const result = equals(new Set(), new Set());
      expect(result).toBeFalsy();
    });
  });

  describe("RegExp", () => {
    describe("same instance", () => {
      let v = new RegExp(".*");

      it("same", () => {
        const result = equals(v, v);
        expect(result).toBeTruthy();
      });

      it("new", () => {
        const result2 = equals(v, (() => {
          v = new RegExp(".*");
          return v;
        })());
        expect(result2).toBeFalsy();
      });
    });

    it("different instance", () => {
      const result = equals(new RegExp(".*"), new RegExp(".*"));
      expect(result).toBeFalsy();
    });
  });
});
