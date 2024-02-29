import getDynamicUrlContext from "./dynamic-url";

describe("dynamic-pathname", () => {
  describe("dynamic url", () => {
    describe("no slug", () => {
      const pathname = "/hoge/fuga" as any;
      const params = { hoge: 123, fuga: 345 };
      const res = getDynamicUrlContext(pathname, params);

      it("url", () => {
        expect(res.url).toBe("/hoge/fuga");
      });

      describe("params", () => {
        it("instance", () => {
          expect(res.data).not.toBe(params);
        });

        it("contents", () => {
          expect(res.data).toStrictEqual(params);
        });
      });
    });

    describe("slug", () => {
      const pathname = "/[hoge]/fuga" as any;
      const params = { hoge: 123, fuga: 345 };
      const res = getDynamicUrlContext(pathname, params);

      it("url", () => {
        expect(res.url).toBe("/123/fuga");
      });

      describe("params", () => {
        it("instance", () => {
          expect(res.data).not.toBe(params);
        });

        describe("contents", () => {
          it("not equal", () => {
            expect(res.data).not.toStrictEqual(params);
          });

          it("delete", () => {
            expect(res.data).not.toHaveProperty("hoge");
          });

          it("not deleted", () => {
            expect(res.data).toHaveProperty("fuga");
          });
        });
      });
    });
  });

  describe("append query", () => {
    describe("standard", () => {
      const pathname = "/[hoge]/fuga" as any;
      const params = { hoge: 123, fuga: 345, piyo: 789 };
      const res = getDynamicUrlContext(pathname, params, { appendQuery: true });

      it("url", () => {
        expect(res.url).toBe("/123/fuga?fuga=345&piyo=789");
      });

      describe("params", () => {
        it("instance", () => {
          expect(res.data).not.toBe(params);
        });

        describe("contents", () => {
          it("not equal", () => {
            expect(res.data).not.toStrictEqual(params);
          });

          it("delete", () => {
            expect(Object.keys(res.data)).toHaveLength(0);
          });
        });
      });
    });

    describe("array value", () => {
      const pathname = "/[hoge]/fuga" as any;
      const params = { hoge: 123, fuga: [456, 789] };
      const res = getDynamicUrlContext(pathname, params, { appendQuery: true });

      it("url", () => {
        expect(res.url).toBe("/123/fuga?fuga%5B0%5D=456&fuga%5B1%5D=789");
      });
    });
  });

  describe("leave dynamic key", () => {

  });

  describe("use origin params", () => {

  });

  describe("query array index", () => {

  });
});
