import getDynamicUrlContext from "./dynamic-url";

describe("dynamic-url", () => {
  describe("context", () => {
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
            expect(Object.keys(res.data)).toHaveLength(2);
          });

          it("not delete", () => {
            expect(res.data.fuga).toBe(params.fuga);
            expect(res.data.piyo).toBe(params.piyo);
            expect(res.data.hoge).toBeUndefined();
          });
        });
      });
    });

    describe("value types", () => {
      const pathname = "/hoge" as any;

      it("String", () => {
        const params = { hoge: "", fuga: "abc", piyo: "test?test" };
        const res = getDynamicUrlContext(pathname, params, { appendQuery: true });
        expect(res.url).toBe("/hoge?hoge=&fuga=abc&piyo=test%3Ftest");
      });

      it("Number", () => {
        const params = { hoge: -1, fuga: 0, piyo: 3.14 };
        const res = getDynamicUrlContext(pathname, params, { appendQuery: true });
        expect(res.url).toBe("/hoge?hoge=-1&fuga=0&piyo=3.14");
      });

      it("Boolean", () => {
        const params = { hoge: true, fuga: false };
        const res = getDynamicUrlContext(pathname, params, { appendQuery: true });
        expect(res.url).toBe("/hoge?hoge=true&fuga=false");
      });

      describe("Array", () => {
        const params = { hoge: [123], fuga: [456, 789, 0] };

        it("parallel", () => {
          const res = getDynamicUrlContext(pathname, params, { appendQuery: true });
          expect(res.url).toBe("/hoge?hoge=123&fuga=456&fuga=789&fuga=0");
        });

        it("index", () => {
          const res = getDynamicUrlContext(pathname, params, { appendQuery: true, queryArrayIndex: true });
          expect(res.url).toBe("/hoge?hoge%5B0%5D=123&fuga%5B0%5D=456&fuga%5B1%5D=789&fuga%5B2%5D=0");
        });
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
