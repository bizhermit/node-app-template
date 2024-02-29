import replaceDynamicPathname from "./dynamic-pathname";

describe(("dynamic-pathname"), () => {
  describe("no slug", () => {
    const pathname = "/hoge/fuga/piyo" as any;

    it("params is null", () => {
      const replaced = replaceDynamicPathname(pathname, null);
      expect(replaced).toBe(pathname);
    });

    it("params is not null", () => {
      const replaced = replaceDynamicPathname(pathname, { hoge: 123 });
      expect(replaced).toBe(pathname);
    });
  });

  describe("[slug]", () => {
    describe("replace", () => {
      const pathname = "/[hoge]/fuga/piyo" as any;

      it("params is null", () => {
        const replaced = replaceDynamicPathname(pathname, null);
        expect(replaced).toBe("//fuga/piyo"); // TODO: better to throw error?
      });

      it("params is not null / value is null", () => {
        const replaced = replaceDynamicPathname(pathname, { fuga: 123 });
        expect(replaced).toBe("//fuga/piyo"); // TODO: better to throw error?
      });

      it("params is not null / value is not null", () => {
        const replaced = replaceDynamicPathname(pathname, { hoge: 123 });
        expect(replaced).toBe("/123/fuga/piyo");
      });
    });

    it("replace (duplicated)", () => {
      const pathname = "/[hoge]/fuga/[hoge]/piyo" as any;
      const replaced = replaceDynamicPathname(pathname, { hoge: 123 });
      expect(replaced).toBe("/123/fuga/123/piyo");
    });

    describe("replace some", () => {
      const pathname = "/[hoge]/[fuga]/piyo" as any;

      it("params is null", () => {
        const replaced = replaceDynamicPathname(pathname, null);
        expect(replaced).toBe("///piyo"); // TODO: better to throw error?
      });

      it("params is not null / value is not null", () => {
        const replaced = replaceDynamicPathname(pathname, { hoge: 123, fuga: 456 });
        expect(replaced).toBe("/123/456/piyo");
      });
    });

    it("slug end", () => {
      const pathname = "/[hoge]" as any;
      const replaced = replaceDynamicPathname(pathname, { hoge: 123 });
      expect(replaced).toBe("/123");
    });
  });

  describe("[...slug]", () => {
    describe("replace", () => {
      const pathname = "/[...hoge]/fuga/piyo" as any;

      it("params is null", () => {
        const replaced = replaceDynamicPathname(pathname, null);
        expect(replaced).toBe("//fuga/piyo"); // TODO: better to throw error?
      });

      it("params is not null / value is number", () => {
        const replaced = replaceDynamicPathname(pathname, { hoge: 123 });
        expect(replaced).toBe("/123/fuga/piyo");
      });

      it("params is not null / value is number array", () => {
        const replaced = replaceDynamicPathname(pathname, { hoge: [123, 456] });
        expect(replaced).toBe("/123/456/fuga/piyo");
      });
    });

    it("replace some", () => {
      const pathname = "/[hoge]/[...fuga]/piyo" as any;
      const replaced = replaceDynamicPathname(pathname, { hoge: 123, fuga: 456, piyo: 789 });
      expect(replaced).toBe("/123/456/piyo");
    });

    it("slug end", () => {
      const pathname = "/[...hoge]" as any;
      const replaced = replaceDynamicPathname(pathname, { hoge: 123 });
      expect(replaced).toBe("/123");
    });
  });

  describe("[[...slug]]", () => {
    describe("replace", () => {
      const pathname = "/[[...hoge]]/fuga/piyo" as any;

      it("params is null", () => {
        const replaced = replaceDynamicPathname(pathname, null);
        expect(replaced).toBe("//fuga/piyo"); // TODO: better to throw error?
      });

      it("params is not null / value is number", () => {
        const replaced = replaceDynamicPathname(pathname, { hoge: 123 });
        expect(replaced).toBe("/123/fuga/piyo");
      });

      it("params is not null / value is number array", () => {
        const replaced = replaceDynamicPathname(pathname, { hoge: [123, 456, 789] });
        expect(replaced).toBe("/123/456/789/fuga/piyo");
      });
    });

    it("replace some", () => {
      const pathname = "/[hoge]/[...fuga]/[[...piyo]]" as any;
      const replaced = replaceDynamicPathname(pathname, { hoge: 123, fuga: 456, piyo: 789 });
      expect(replaced).toBe("/123/456/789");
    });

    it("slug end", () => {
      const pathname = "/[[...hoge]]" as any;
      const replaced = replaceDynamicPathname(pathname, { hoge: 123 });
      expect(replaced).toBe("/123");
    });
  });

  describe("miss pattern", () => {
    it("not begin [slug]", () => {
      const pathname = "/hoge]/fuga" as any;
      const replaced = replaceDynamicPathname(pathname, { hoge: 123 });
      expect(replaced).toBe("/hoge]/fuga");
    });

    it("not close [slug]", () => {
      const pathname = "/[hoge/fuga" as any;
      const replaced = replaceDynamicPathname(pathname, { hoge: 123 });
      expect(replaced).toBe("/[hoge/fuga");
    });

    it("not close [...slug]", () => {
      const pathname = "/[...hoge/fuga" as any;
      const replaced = replaceDynamicPathname(pathname, { hoge: 123 });
      expect(replaced).toBe("/[...hoge/fuga");
    });

    it("not begin [...slug]", () => {
      const pathname = "/...hoge]/fuga" as any;
      const replaced = replaceDynamicPathname(pathname, { hoge: 123 });
      expect(replaced).toBe("/...hoge]/fuga");
    });

    it("not close [[...slug]]", () => {
      const pathname = "/[[...hoge/fuga" as any;
      const replaced = replaceDynamicPathname(pathname, { hoge: 123 });
      expect(replaced).toBe("/[[...hoge/fuga");
    });

    it("not close [[...slug]] as single", () => {
      const pathname = "/[[...hoge]/fuga" as any;
      const replaced = replaceDynamicPathname(pathname, { hoge: 123 });
      expect(replaced).toBe("/[123/fuga");
    });

    it("not begin [[...slug]]", () => {
      const pathname = "/...hoge]]/fuga" as any;
      const replaced = replaceDynamicPathname(pathname, { hoge: 123 });
      expect(replaced).toBe("/...hoge]]/fuga");
    });

    it("not begin [[...slug]] as single", () => {
      const pathname = "/[...hoge]]/fuga" as any;
      const replaced = replaceDynamicPathname(pathname, { hoge: 123 });
      expect(replaced).toBe("/123]/fuga");
    });
  });
});
