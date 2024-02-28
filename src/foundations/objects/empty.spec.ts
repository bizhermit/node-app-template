import { isEmpty, isNotEmpty, isNotNull, isNull } from "./empty";

describe("empty", () => {
  describe("isNull", () => {
    it("Null", () => {
      const result = isNull(null);
      expect(result).toBeTruthy();
    });

    it("Undefined", () => {
      const result = isNull(undefined);
      expect(result).toBeTruthy();
    });

    describe("String", () => {
      it("blank", () => {
        const result = isNull("");
        expect(result).toBeFalsy();
      });

      it("a", () => {
        const result = isNull("a");
        expect(result).toBeFalsy();
      });
    });

    describe("Number", () => {
      it("0", () => {
        const result = isNull(0);
        expect(result).toBeFalsy();
      });

      it("1", () => {
        const result = isNull(1);
        expect(result).toBeFalsy();
      });

      it("NaN", () => {
        const result = isNull(NaN);
        expect(result).toBeTruthy();
      });
    });

    describe("BigInt", () => {
      it("0n", () => {
        const result = isNull(BigInt(0));
        expect(result).toBeFalsy();
      });

      it("1n", () => {
        const result = isNull(BigInt(1));
        expect(result).toBeFalsy();
      });
    });

    describe("Boolean", () => {
      it("false", () => {
        const result = isNull(false);
        expect(result).toBeFalsy();
      });

      it("true", () => {
        const result = isNull(true);
        expect(result).toBeFalsy();
      });
    });

    describe("Array", () => {
      it("[]", () => {
        const result = isNull([]);
        expect(result).toBeFalsy();
      });

      it("[1]", () => {
        const result = isNull([1]);
        expect(result).toBeFalsy();
      });
    });

    describe("Object", () => {
      it("{}", () => {
        const result = isNull({});
        expect(result).toBeFalsy();
      });

      it("not empty", () => {
        const result = isNull({ "a": "" });
        expect(result).toBeFalsy();
      });
    });

    describe("Map", () => {
      it("empty", () => {
        const result = isNull(new Map());
        expect(result).toBeFalsy();
      });

      it("not empty", () => {
        const result = isNull(new Map([["a", ""]]));
        expect(result).toBeFalsy();
      });
    });

    describe("Set", () => {
      it("empty", () => {
        const result = isNull(new Set());
        expect(result).toBeFalsy();
      });

      it("not empty", () => {
        const result = isNull(new Set(["a"]));
        expect(result).toBeFalsy();
      });
    });
  });

  describe("isNotNull", () => {
    it("Null", () => {
      const result = isNotNull(null);
      expect(result).toBeFalsy();
    });

    it("Undefined", () => {
      const result = isNotNull(undefined);
      expect(result).toBeFalsy();
    });

    describe("String", () => {
      it("blank", () => {
        const result = isNotNull("");
        expect(result).toBeTruthy();
      });

      it("a", () => {
        const result = isNotNull("a");
        expect(result).toBeTruthy();
      });
    });

    describe("Number", () => {
      it("0", () => {
        const result = isNotNull(0);
        expect(result).toBeTruthy();
      });

      it("1", () => {
        const result = isNotNull(1);
        expect(result).toBeTruthy();
      });

      it("NaN", () => {
        const result = isNotNull(NaN);
        expect(result).toBeFalsy();
      });
    });

    describe("BigInt", () => {
      it("0n", () => {
        const result = isNotNull(BigInt(0));
        expect(result).toBeTruthy();
      });

      it("1n", () => {
        const result = isNotNull(BigInt(1));
        expect(result).toBeTruthy();
      });
    });

    describe("Boolean", () => {
      it("false", () => {
        const result = isNotNull(false);
        expect(result).toBeTruthy();
      });

      it("true", () => {
        const result = isNotNull(true);
        expect(result).toBeTruthy();
      });
    });

    describe("Array", () => {
      it("[]", () => {
        const result = isNotNull([]);
        expect(result).toBeTruthy();
      });

      it("[1]", () => {
        const result = isNotNull([1]);
        expect(result).toBeTruthy();
      });
    });

    describe("Object", () => {
      it("{}", () => {
        const result = isNotNull({});
        expect(result).toBeTruthy();
      });

      it("not empty", () => {
        const result = isNotNull({ "a": "" });
        expect(result).toBeTruthy();
      });
    });

    describe("Map", () => {
      it("empty", () => {
        const result = isNotNull(new Map());
        expect(result).toBeTruthy();
      });

      it("not empty", () => {
        const result = isNotNull(new Map([["a", ""]]));
        expect(result).toBeTruthy();
      });
    });

    describe("Set", () => {
      it("empty", () => {
        const result = isNotNull(new Set());
        expect(result).toBeTruthy();
      });

      it("not empty", () => {
        const result = isNotNull(new Set(["a"]));
        expect(result).toBeTruthy();
      });
    });
  });

  describe("isEmpty", () => {
    it("Null", () => {
      const result = isEmpty(null);
      expect(result).toBeTruthy();
    });

    it("Undefined", () => {
      const result = isEmpty(undefined);
      expect(result).toBeTruthy();
    });

    describe("String", () => {
      it("blank", () => {
        const result = isEmpty("");
        expect(result).toBeTruthy();
      });

      it("a", () => {
        const result = isEmpty("a");
        expect(result).toBeFalsy();
      });
    });

    describe("Number", () => {
      it("0", () => {
        const result = isEmpty(0);
        expect(result).toBeTruthy();
      });

      it("1", () => {
        const result = isEmpty(1);
        expect(result).toBeFalsy();
      });

      it("NaN", () => {
        const result = isEmpty(NaN);
        expect(result).toBeTruthy();
      });
    });

    describe("BigInt", () => {
      it("0n", () => {
        const result = isEmpty(BigInt(0));
        expect(result).toBeTruthy();
      });

      it("1n", () => {
        const result = isEmpty(BigInt(1));
        expect(result).toBeFalsy();
      });
    });

    describe("Boolean", () => {
      it("false", () => {
        const result = isEmpty(false);
        expect(result).toBeFalsy();
      });

      it("true", () => {
        const result = isEmpty(true);
        expect(result).toBeFalsy();
      });
    });

    describe("Array", () => {
      it("[]", () => {
        const result = isEmpty([]);
        expect(result).toBeTruthy();
      });

      it("[1]", () => {
        const result = isEmpty([1]);
        expect(result).toBeFalsy();
      });
    });

    describe("Object", () => {
      it("{}", () => {
        const result = isEmpty({});
        expect(result).toBeTruthy();
      });

      it("not empty", () => {
        const result = isEmpty({ "a": "" });
        expect(result).toBeFalsy();
      });
    });

    describe("Map", () => {
      it("empty", () => {
        const result = isEmpty(new Map());
        expect(result).toBeTruthy();
      });

      it("not empty", () => {
        const result = isEmpty(new Map([["a", ""]]));
        expect(result).toBeFalsy();
      });
    });

    describe("Set", () => {
      it("empty", () => {
        const result = isEmpty(new Set());
        expect(result).toBeTruthy();
      });

      it("not empty", () => {
        const result = isEmpty(new Set(["a"]));
        expect(result).toBeFalsy();
      });
    });
  });

  describe("isNotEmpty", () => {
    it("Null", () => {
      const result = isNotEmpty(null);
      expect(result).toBeFalsy();
    });

    it("Undefined", () => {
      const result = isNotEmpty(undefined);
      expect(result).toBeFalsy();
    });

    describe("String", () => {
      it("blank", () => {
        const result = isNotEmpty("");
        expect(result).toBeFalsy();
      });

      it("a", () => {
        const result = isNotEmpty("a");
        expect(result).toBeTruthy();
      });
    });

    describe("Number", () => {
      it("0", () => {
        const result = isNotEmpty(0);
        expect(result).toBeFalsy();
      });

      it("1", () => {
        const result = isNotEmpty(1);
        expect(result).toBeTruthy();
      });

      it("NaN", () => {
        const result = isNotEmpty(NaN);
        expect(result).toBeFalsy();
      });
    });

    describe("BigInt", () => {
      it("0n", () => {
        const result = isNotEmpty(BigInt(0));
        expect(result).toBeFalsy();
      });

      it("1n", () => {
        const result = isNotEmpty(BigInt(1));
        expect(result).toBeTruthy();
      });
    });

    describe("Boolean", () => {
      it("false", () => {
        const result = isNotEmpty(false);
        expect(result).toBeTruthy();
      });

      it("true", () => {
        const result = isNotEmpty(true);
        expect(result).toBeTruthy();
      });
    });

    describe("Array", () => {
      it("[]", () => {
        const result = isNotEmpty([]);
        expect(result).toBeFalsy();
      });

      it("[1]", () => {
        const result = isNotEmpty([1]);
        expect(result).toBeTruthy();
      });
    });

    describe("Object", () => {
      it("{}", () => {
        const result = isNotEmpty({});
        expect(result).toBeFalsy();
      });

      it("not empty", () => {
        const result = isNotEmpty({ "a": "" });
        expect(result).toBeTruthy();
      });
    });

    describe("Map", () => {
      it("empty", () => {
        const result = isNotEmpty(new Map());
        expect(result).toBeFalsy();
      });

      it("not empty", () => {
        const result = isNotEmpty(new Map([["a", ""]]));
        expect(result).toBeTruthy();
      });
    });

    describe("Set", () => {
      it("empty", () => {
        const result = isNotEmpty(new Set());
        expect(result).toBeFalsy();
      });

      it("not empty", () => {
        const result = isNotEmpty(new Set(["a"]));
        expect(result).toBeTruthy();
      });
    });
  });
});
