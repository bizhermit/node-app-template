import type { NextApiRequest, NextApiResponse } from "next";
import StringValidation from "@/validations/string";
import * as os from "os";
import { dataItemKey } from "@/data-items/data-item-wrapper";
import NumberValidation from "@/validations/number";
import DatetimeUtils from "@bizhermit/basic-utils/dist/datetime-utils";
import DateValidation from "@/validations/date";

type QueryStruct = Partial<{ [key: string]: string | Array<string> }>;
type SessionStruct = { [key: string]: any };
type MessageContext = DataItemValidationResult | undefined;

const getItem = (
  msgs: Array<MessageContext>,
  key: Nullable<string | number> = undefined,
  ctx: Nullable<DataItem> | DataContext = undefined,
  data?: Struct,
  index?: number,
  pctx?: DataContext,
) => {
  if (ctx == null) return;
  if (dataItemKey in ctx) {
    switch (ctx.type) {
      case "string":
        getStringItem(msgs, key!, ctx, data, index, pctx);
        break;
      case "number":
        getNumberItem(msgs, key!, ctx, data, index, pctx);
        break;
      case "boolean":
        getBooleanItem(msgs, key!, ctx, data, index, pctx);
        break;
      case "date":
      case "month":
        getDateItem(msgs, key!, ctx, data, index, pctx);
        break;
      case "array":
        getArrayItem(msgs, key!, ctx, data, index, pctx);
        break;
      case "struct":
        getStructItem(msgs, key!, ctx, data, index, pctx);
        break;
      default:
        break;
    }
    return;
  }
  Object.keys(ctx).forEach(k => {
    if (key == null) {
      getItem(msgs, k, ctx[k], data, undefined, ctx);
      return;
    }
    getItem(msgs, k, ctx[k], data?.[key], undefined, ctx);
  });
};

const getStringItem = (msgs: Array<MessageContext>, key: string | number, ctx: DataItem_String, data?: Struct, index?: number, pctx?: DataContext) => {
  const name = ctx.label || ctx.name || String(key);
  const pushMsg = (res: string | undefined, type: DataItemValidationResultType = "error") => {
    if (res) {
      msgs.push({
        type,
        key,
        name,
        index,
        body: `${index != null ? `${index}:` : ""}${res}`,
        value: data?.[key],
      });
    }
  };

  if (data) {
    const v = data[key];
    if (v != null && typeof v !== "string") data[key] = String(v);
  }
  const v = data?.[key] as Nullable<string>;

  if (ctx.required) {
    pushMsg(StringValidation.required(v, name));
  }
  if (ctx.length != null) {
    pushMsg(StringValidation.length(v, ctx.length, name));
  }
  if (ctx.minLength != null) {
    pushMsg(StringValidation.minLength(v, ctx.minLength, name));
  }
  if (ctx.maxLength != null) {
    pushMsg(StringValidation.maxLength(v, ctx.maxLength, name));
  }
  switch (ctx.charType) {
    case "h-num":
      pushMsg(StringValidation.halfWidthNumeric(v, name));
      break;
    case "f-num":
      pushMsg(StringValidation.fullWidthNumeric(v, name));
      break;
    case "num":
      pushMsg(StringValidation.numeric(v, name));
      break;
    case "h-alpha":
      pushMsg(StringValidation.halfWidthAlphabet(v, name));
      break;
    case "f-alpha":
      pushMsg(StringValidation.fullWidthAlphabet(v, name));
      break;
    case "alpha":
      pushMsg(StringValidation.alphabet(v, name));
      break;
    case "h-alpha-num":
      pushMsg(StringValidation.halfWidthAlphaNumeric(v, name));
      break;
    case "h-alpha-num-syn":
      pushMsg(StringValidation.halfWidthAlphaNumericAndSymbols(v, name));
      break;
    case "int":
      pushMsg(StringValidation.integer(v, name));
      break;
    case "h-katakana":
      pushMsg(StringValidation.halfWidthKatakana(v, name));
      break;
    case "f-katakana":
      pushMsg(StringValidation.fullWidthKatakana(v, name));
      break;
    case "katakana":
      pushMsg(StringValidation.katakana(v, name));
      break;
    default:
      break;
  }
  if (ctx.validations) {
    for (const validation of ctx.validations) {
      const res = validation(v, key, ctx, data, index, pctx);
      if (res) msgs.push(res);
    }
  }
};

const getNumberItem = (msgs: Array<MessageContext>, key: string | number, ctx: DataItem_Number, data?: Struct, index?: number, pctx?: DataContext) => {
  const name = ctx.label || ctx.name || String(key);
  const pushMsg = (res: string | undefined, type: DataItemValidationResultType = "error") => {
    if (res) {
      msgs.push({
        type,
        key,
        name,
        index,
        body: `${index != null ? `${index}:` : ""}${res}`,
        value: data?.[key],
      });
    }
  };

  if (data) {
    const v = data[key];
    if (v != null && typeof v !== "number") {
      if (ctx.strict) {
        data[key] = undefined;
        pushMsg(`${name}をundefindに変換しました。[${typeof v}]->x[number]`, "warning");
      } else {
        try {
          if (typeof v === "string" && v.trim() === "") {
            data[key] = undefined;
          } else {
            if (isNaN(data[key] = Number(v))) throw new Error;
            pushMsg(`${name}を数値型に変換しました。[${v}]->[${data[key]}]`, "warning");
          }
        } catch {
          pushMsg(`${name}を数値型に変換できません。`);
          return;
        }
      }
    }
  }

  const v = data?.[key] as Nullable<number>;

  if (ctx.required) {
    pushMsg(NumberValidation.required(v, name));
  }
  if (ctx.min != null && ctx.max != null) {
    pushMsg(NumberValidation.range(v, ctx.min, ctx.max, name));
  } else {
    if (ctx.min != null) {
      pushMsg(NumberValidation.min(v, ctx.min, name));
    }
    if (ctx.max != null) {
      pushMsg(NumberValidation.max(v, ctx.max, name));
    }
  }

  if (ctx.validations) {
    for (const validation of ctx.validations) {
      const res = validation(v, key, ctx, data, index, pctx);
      if (res) msgs.push(res);
    }
  }
};

const getBooleanItem = (msgs: Array<MessageContext>, key: string | number, ctx: DataItem_Boolean, data?: Struct, index?: number, pctx?: DataContext) => {
  const name = ctx.label || ctx.name || String(key);
  const pushMsg = (res: string | undefined, type: DataItemValidationResultType = "error") => {
    if (res) {
      msgs.push({
        type,
        key,
        name,
        index,
        body: `${index != null ? `${index}:` : ""}${res}`,
        value: data?.[key],
      });
    }
  };

  const tv = ctx.trueValue ?? true;
  const fv = ctx.falseValue ?? false;
  if (data) {
    const v = data[key];
    if (v != null && (v !== tv && v !== fv)) {
      if (ctx.strict) {
        data[key] = undefined;
        pushMsg(`${name}をundefindに変換しました。[${v}]->x[${tv}/${fv}]`, "warning");
      } else {
        data[key] = v ? tv : fv;
        pushMsg(`${name}を真偽値に変換しました。[${v}]->[${data[key]}]`, "warning");
      }
    }
  }

  const v = data?.[key] as Nullable<boolean | number | string>;

  if (ctx.required) {
    if (v !== tv && v !== fv) {
      pushMsg(`${name}を入力してください。`);
    }
  }

  if (ctx.validations) {
    for (const validation of ctx.validations) {
      const res = validation(v, key, ctx, data, index, pctx);
      if (res) msgs.push(res);
    }
  }
};

const getDateItem = (msgs: Array<MessageContext>, key: string | number, ctx: DataItem_Date, data?: Struct, index?: number, pctx?: DataContext) => {
  const name = ctx.label || ctx.name || String(key);
  const pushMsg = (res: string | undefined, type: DataItemValidationResultType = "error") => {
    if (res) {
      msgs.push({
        type,
        key,
        name,
        index,
        body: `${index != null ? `${index}:` : ""}${res}`,
        value: data?.[key],
      });
    }
  };

  if (data) {
    const v = data[key];
    const t = typeof v;
    if (v != null) {
      try {
        if (t === "string" || t === "number") {
          data[key] = DatetimeUtils.convert(v);
        } else {
          throw new Error;
        }
      } catch {
        pushMsg(`${name}を日付型に変換できません。`);
        return;
      }
    }
  }

  const v = data?.[key] as Nullable<Date>;

  if (ctx.required) {
    pushMsg(DateValidation.required(v, name));
  }
  if (ctx.min != null && ctx.max != null) {
    pushMsg(DateValidation.range(v, ctx.min, ctx.max, ctx.type, name));
  } else {
    if (ctx.min) {
      pushMsg(DateValidation.min(v, ctx.min, ctx.type, name));
    }
    if (ctx.max) {
      pushMsg(DateValidation.max(v, ctx.max, ctx.type, name));
    }
  }
  if (ctx.rangePair) {
    pushMsg(DateValidation.context(v, ctx.rangePair, data, ctx.type, name, pctx?.[ctx.rangePair.name]?.label));
  }

  if (ctx.validations) {
    for (const validation of ctx.validations) {
      const res = validation(v, key, ctx, data, index, pctx);
      if (res) msgs.push(res);
    }
  }
};

const getArrayItem = (msgs: Array<MessageContext>, key: string | number, ctx: DataItem_Array, data?: Struct, index?: number, pctx?: DataContext) => {
  const name = ctx.label || ctx.name || String(key);
  const pushMsg = (res: string | undefined, type: DataItemValidationResultType = "error") => {
    if (res) {
      msgs.push({
        type,
        key,
        name,
        index,
        body: `${index != null ? `${index}:` : ""}${res}`,
        value: data?.[key],
      });
    }
  };

  const v = data?.[key] as Nullable<Array<any>>;

  if (v != null && !Array.isArray(v)) {
    pushMsg(`${name}の形式が配列ではありません。`);
    return;
  }
  if (ctx.required) {
    if (v == null || v.length === 0) {
      pushMsg(`${name}は1件以上設定してください。`);
    }
  }
  if (ctx.length != null) {
    if (v != null && v.length !== ctx.length) {
      pushMsg(`${name}は${ctx.minLength}件で設定してください。`);
    }
  }
  if (ctx.minLength != null) {
    if (v != null && v.length < ctx.minLength) {
      pushMsg(`${name}は${ctx.minLength}件以上を設定してください。`);
    }
  }
  if (ctx.maxLength != null) {
    if (v == null || v.length > ctx.maxLength) {
      pushMsg(`${name}は${ctx.maxLength}件以内で設定してください。`);
    }
  }
  if (ctx.validations) {
    for (const validation of ctx.validations) {
      const res = validation(v, key, ctx, data, index, pctx);
      if (res) msgs.push(res);
    }
  }

  if (ctx.required !== true && v == null) return;

  const itemIsStruct = dataItemKey in ctx.item;
  v?.forEach((item, index) => {
    if (itemIsStruct) {
      getItem(msgs, index, ctx.item, v, index, pctx);
      return;
    }
    getItem(msgs, null, ctx.item, item, index, pctx);
  });
};

const getStructItem = (msgs: Array<MessageContext>, key: string | number, ctx: DataItem_Struct, data?: Struct, index?: number, pctx?: DataContext) => {
  const name = ctx.label || ctx.name || String(key);
  const pushMsg = (res: string | undefined, type: DataItemValidationResultType = "error") => {
    if (res) {
      msgs.push({
        type,
        key,
        name,
        index,
        body: `${index != null ? `${index}:` : ""}${res}`,
        value: data?.[key],
      });
    }
  };

  const v = data?.[key] as Nullable<Struct<any>>;

  if (v != null && typeof v !== "object") {
    pushMsg(`${name}の形式が構造体ではありません。`);
    return;
  }
  if (ctx.required) {
    if (v == null) {
      pushMsg(`${name}を設定してください。`);
    }
  }
  if (ctx.validations) {
    for (const validation of ctx.validations) {
      const res = validation(v, key, ctx, data, index, pctx);
      if (res) msgs.push(res);
    }
  }

  if (ctx.required !== true && v == null) return;

  getItem(msgs, null, ctx.item, v!, undefined, pctx);
};

const getSession = (req: NextApiRequest, _res: NextApiResponse): SessionStruct => {
  return (req as any).session ?? (global as any)._session ?? {};
};

type MethodProcess<Req extends DataContext, Res extends DataContext> =
  (context: {
    req: NextApiRequest;
    res: NextApiResponse;
    getCookies: <T extends QueryStruct = QueryStruct>() => T;
    getSession: () => SessionStruct;
    setStatus: (code: number) => void;
    hasError: () => boolean;
    getData: () => DataItemValueType<Req, true>;
  }) => Promise<void | DataItemValueType<Res, true>>;

const apiHandler = <
  GetReq extends DataContext = DataContext,
  GetRes extends DataContext = DataContext,
  PostReq extends DataContext = DataContext,
  PostRes extends DataContext = DataContext,
  PutReq extends DataContext = DataContext,
  PutRes extends DataContext = DataContext,
  DeleteReq extends DataContext = DataContext,
  DeleteRes extends DataContext = DataContext
>(methods: {
  $get?: { req?: GetReq; res?: GetRes; };
  get?: MethodProcess<GetReq, GetRes>;
  $post?: { req?: PostReq; res?: PostRes; };
  post?: MethodProcess<PostReq, PostRes>;
  $put?: { req?: PutReq; res?: PutRes; };
  put?: MethodProcess<PutReq, PutRes>;
  $delete?: { req?: DeleteReq; res?: DeleteRes; };
  delete?: MethodProcess<DeleteReq, DeleteRes>;
}) => {
  const f = async (req: NextApiRequest, res: NextApiResponse) => {
    let statusCode: number | undefined = undefined;
    const msgs: Array<MessageContext> = [];
    const hasError = () => {
      return msgs.some(msg => msg?.type === "error");
    };
    const getReturnMessages = () => {
      return msgs.filter(msg => msg?.type === "error");
    };

    try {
      const method = (req.method?.toLocaleLowerCase() ?? "get") as ApiMethods;
      const handler = methods[method];
      if (handler == null) {
        res.status(404).json({});
        return;
      }

      const dataContext = methods[`$${method}`]?.req;
      const reqData = await (async () => {
        let retData: Struct = { ...req.query };
        if (req.body != null) {
          const contentType = req.headers["content-type"]?.match(/([^\;]*)/)?.[1];
          if (contentType === "multipart/form-data" && typeof req.body === "string") {
            const key = req.body.match(/([^(?:\r?\n)]*)/)?.[0];
            if (key) {
              const body: { [key: string]: any } = {};
              req.body.split(key).forEach(item => {
                if (item.startsWith("--")) return;
                const lines = item.split(/\r?\n/);
                lines.splice(lines.length - 1, 1);
                lines.splice(0, 1);
                const name = lines[0]?.match(/\sname="([^\"]*)"/)?.[1];
                if (!name) return;
                const headerEndLineIndex = lines.findIndex(line => line === "");
                let value = lines.slice(headerEndLineIndex + 1).join(os.EOL) as any;
                if (headerEndLineIndex > 1) {
                  if (value) {
                    value = {
                      fileName: lines[0]?.match(/\sfilename="([^\"]*)"/)?.[1],
                      contentType: lines[1].match(/Content-Type:\s([^\s|\r?\n|;]*)/)?.[1],
                      value,
                    };
                  } else {
                    value = undefined;
                  }
                }
                if (name in body) {
                  if (!Array.isArray(body[name])) body[name] = [body[name]];
                  body[name].push(value);
                  return;
                }
                body[name] = value;
              });
              retData = { ...retData, ...body };
            }
          } else {
            retData = { ...retData, ...req.body };
          }
        }
        if (dataContext == null) return retData;
        getItem(msgs, null, dataContext, retData);
        if (hasError()) {
          statusCode = 400;
          throw new Error("validation error");
        }
        return retData;
      })();

      const resData = await handler({
        req,
        res,
        getCookies: () => req.cookies as any,
        getSession: () => getSession(req, res),
        setStatus: (code: number) => statusCode = code,
        hasError,
        getData: () => reqData as any,
      });

      res.status(statusCode ?? (resData == null ? 204 : 200)).json({
        messages: getReturnMessages(),
        data: resData
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      // console.log(e);
      res.status(statusCode ?? 500).json({
        messages: getReturnMessages(),
      });
    }
  };
  f.$get = methods.$get as { req: GetReq; res: GetRes; };
  f.$post = methods.$post as { req: PostReq; res: PostRes; };
  f.$put = methods.$put as { req: PutReq; res: PutRes; };
  f.$delete = methods.$delete as { req: DeleteReq; res: DeleteRes; };
  return f;
};

export default apiHandler;