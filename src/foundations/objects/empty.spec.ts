import { isEmpty, isNotEmpty, isNotNull, isNull } from "./empty";

describe("empty", () => {
  describe("isNull", () => {
    it("Null", () => {
      const result = isNull(null);
      expect(result).toBe(true);
    });

    it("Undefined", () => {
      const result = isNull(undefined);
      expect(result).toBe(true);
    });

    describe("String", () => {
      it("blank", () => {
        const result = isNull("");
        expect(result).toBe(false);
      });

      it("a", () => {
        const result = isNull("a");
        expect(result).toBe(false);
      });
    });

    describe("Number", () => {
      it("0", () => {
        const result = isNull(0);
        expect(result).toBe(false);
      });

      it("1", () => {
        const result = isNull(1);
        expect(result).toBe(false);
      });

      it("NaN", () => {
        const result = isNull(NaN);
        expect(result).toBe(true);
      });
    });

    describe("BigInt", () => {
      it("0n", () => {
        const result = isNull(BigInt(0));
        expect(result).toBe(false);
      });

      it("1n", () => {
        const result = isNull(BigInt(1));
        expect(result).toBe(false);
      });
    });

    describe("Boolean", () => {
      it("false", () => {
        const result = isNull(false);
        expect(result).toBe(false);
      });

      it("true", () => {
        const result = isNull(true);
        expect(result).toBe(false);
      });
    });

    describe("Array", () => {
      it("[]", () => {
        const result = isNull([]);
        expect(result).toBe(false);
      });

      it("[1]", () => {
        const result = isNull([1]);
        expect(result).toBe(false);
      });
    });

    describe("Object", () => {
      it("{}", () => {
        const result = isNull({});
        expect(result).toBe(false);
      });

      it("not empty", () => {
        const result = isNull({ "a": "" });
        expect(result).toBe(false);
      });
    });

    describe("Map", () => {
      it("empty", () => {
        const result = isNull(new Map());
        expect(result).toBe(false);
      });

      it("not empty", () => {
        const result = isNull(new Map([["a", ""]]));
        expect(result).toBe(false);
      });
    });

    describe("Set", () => {
      it("empty", () => {
        const result = isNull(new Set());
        expect(result).toBe(false);
      });

      it("not empty", () => {
        const result = isNull(new Set(["a"]));
        expect(result).toBe(false);
      });
    });
  });

  describe("isNotNull", () => {
    it("Null", () => {
      const result = isNotNull(null);
      expect(result).toBe(false);
    });

    it("Undefined", () => {
      const result = isNotNull(undefined);
      expect(result).toBe(false);
    });

    describe("String", () => {
      it("blank", () => {
        const result = isNotNull("");
        expect(result).toBe(true);
      });

      it("a", () => {
        const result = isNotNull("a");
        expect(result).toBe(true);
      });
    });

    describe("Number", () => {
      it("0", () => {
        const result = isNotNull(0);
        expect(result).toBe(true);
      });

      it("1", () => {
        const result = isNotNull(1);
        expect(result).toBe(true);
      });

      it("NaN", () => {
        const result = isNotNull(NaN);
        expect(result).toBe(false);
      });
    });

    describe("BigInt", () => {
      it("0n", () => {
        const result = isNotNull(BigInt(0));
        expect(result).toBe(true);
      });

      it("1n", () => {
        const result = isNotNull(BigInt(1));
        expect(result).toBe(true);
      });
    });

    describe("Boolean", () => {
      it("false", () => {
        const result = isNotNull(false);
        expect(result).toBe(true);
      });

      it("true", () => {
        const result = isNotNull(true);
        expect(result).toBe(true);
      });
    });

    describe("Array", () => {
      it("[]", () => {
        const result = isNotNull([]);
        expect(result).toBe(true);
      });

      it("[1]", () => {
        const result = isNotNull([1]);
        expect(result).toBe(true);
      });
    });

    describe("Object", () => {
      it("{}", () => {
        const result = isNotNull({});
        expect(result).toBe(true);
      });

      it("not empty", () => {
        const result = isNotNull({ "a": "" });
        expect(result).toBe(true);
      });
    });

    describe("Map", () => {
      it("empty", () => {
        const result = isNotNull(new Map());
        expect(result).toBe(true);
      });

      it("not empty", () => {
        const result = isNotNull(new Map([["a", ""]]));
        expect(result).toBe(true);
      });
    });

    describe("Set", () => {
      it("empty", () => {
        const result = isNotNull(new Set());
        expect(result).toBe(true);
      });

      it("not empty", () => {
        const result = isNotNull(new Set(["a"]));
        expect(result).toBe(true);
      });
    });
  });

  describe("isEmpty", () => {
    it("Null", () => {
      const result = isEmpty(null);
      expect(result).toBe(true);
    });

    it("Undefined", () => {
      const result = isEmpty(undefined);
      expect(result).toBe(true);
    });

    describe("String", () => {
      it("blank", () => {
        const result = isEmpty("");
        expect(result).toBe(true);
      });

      it("a", () => {
        const result = isEmpty("a");
        expect(result).toBe(false);
      });
    });

    describe("Number", () => {
      it("0", () => {
        const result = isEmpty(0);
        expect(result).toBe(true);
      });

      it("1", () => {
        const result = isEmpty(1);
        expect(result).toBe(false);
      });

      it("NaN", () => {
        const result = isEmpty(NaN);
        expect(result).toBe(true);
      });
    });

    describe("BigInt", () => {
      it("0n", () => {
        const result = isEmpty(BigInt(0));
        expect(result).toBe(true);
      });

      it("1n", () => {
        const result = isEmpty(BigInt(1));
        expect(result).toBe(false);
      });
    });

    describe("Boolean", () => {
      it("false", () => {
        const result = isEmpty(false);
        expect(result).toBe(false);
      });

      it("true", () => {
        const result = isEmpty(true);
        expect(result).toBe(false);
      });
    });

    describe("Array", () => {
      it("[]", () => {
        const result = isEmpty([]);
        expect(result).toBe(true);
      });

      it("[1]", () => {
        const result = isEmpty([1]);
        expect(result).toBe(false);
      });
    });

    describe("Object", () => {
      it("{}", () => {
        const result = isEmpty({});
        expect(result).toBe(true);
      });

      it("not empty", () => {
        const result = isEmpty({ "a": "" });
        expect(result).toBe(false);
      });
    });

    describe("Map", () => {
      it("empty", () => {
        const result = isEmpty(new Map());
        expect(result).toBe(true);
      });

      it("not empty", () => {
        const result = isEmpty(new Map([["a", ""]]));
        expect(result).toBe(false);
      });
    });

    describe("Set", () => {
      it("empty", () => {
        const result = isEmpty(new Set());
        expect(result).toBe(true);
      });

      it("not empty", () => {
        const result = isEmpty(new Set(["a"]));
        expect(result).toBe(false);
      });
    });
  });

  describe("isNotEmpty", () => {
    it("Null", () => {
      const result = isNotEmpty(null);
      expect(result).toBe(false);
    });

    it("Undefined", () => {
      const result = isNotEmpty(undefined);
      expect(result).toBe(false);
    });

    describe("String", () => {
      it("blank", () => {
        const result = isNotEmpty("");
        expect(result).toBe(false);
      });

      it("a", () => {
        const result = isNotEmpty("a");
        expect(result).toBe(true);
      });
    });

    describe("Number", () => {
      it("0", () => {
        const result = isNotEmpty(0);
        expect(result).toBe(false);
      });

      it("1", () => {
        const result = isNotEmpty(1);
        expect(result).toBe(true);
      });

      it("NaN", () => {
        const result = isNotEmpty(NaN);
        expect(result).toBe(false);
      });
    });

    describe("BigInt", () => {
      it("0n", () => {
        const result = isNotEmpty(BigInt(0));
        expect(result).toBe(false);
      });

      it("1n", () => {
        const result = isNotEmpty(BigInt(1));
        expect(result).toBe(true);
      });
    });

    describe("Boolean", () => {
      it("false", () => {
        const result = isNotEmpty(false);
        expect(result).toBe(true);
      });

      it("true", () => {
        const result = isNotEmpty(true);
        expect(result).toBe(true);
      });
    });

    describe("Array", () => {
      it("[]", () => {
        const result = isNotEmpty([]);
        expect(result).toBe(false);
      });

      it("[1]", () => {
        const result = isNotEmpty([1]);
        expect(result).toBe(true);
      });
    });

    describe("Object", () => {
      it("{}", () => {
        const result = isNotEmpty({});
        expect(result).toBe(false);
      });

      it("not empty", () => {
        const result = isNotEmpty({ "a": "" });
        expect(result).toBe(true);
      });
    });

    describe("Map", () => {
      it("empty", () => {
        const result = isNotEmpty(new Map());
        expect(result).toBe(false);
      });

      it("not empty", () => {
        const result = isNotEmpty(new Map([["a", ""]]));
        expect(result).toBe(true);
      });
    });

    describe("Set", () => {
      it("empty", () => {
        const result = isNotEmpty(new Set());
        expect(result).toBe(false);
      });

      it("not empty", () => {
        const result = isNotEmpty(new Set(["a"]));
        expect(result).toBe(true);
      });
    });
  });
});
