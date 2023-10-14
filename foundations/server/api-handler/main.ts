import DatetimeUtils from "@bizhermit/basic-utils/dist/datetime-utils";
import Time, { TimeUtils } from "@bizhermit/time";
import { dataItemKey } from "../../data-items";
import { DateData } from "../../data-items/date";
import { FileData } from "../../data-items/file";
import { NumberData } from "../../data-items/number";
import { StringData } from "../../data-items/string";
import { TimeData } from "../../data-items/time";

const getPushValidationMsgFunc = (msgs: Array<Message>, key: string | number, ctx: DataItem, data?: Struct, index?: number, _pctx?: DataContext) => {
  const name = ctx.label || ctx.name || String(key);
  return (res: string | null | undefined | ValidationResult, type: DataItemValidationResultType = "error") => {
    if (res) {
      if (typeof res === "string") {
        msgs.push({ title: "入力エラー", type, key, name, index, body: `${index != null ? `${index}:` : ""}${res}`, value: data?.[key] });
      } else {
        msgs.push({ title: "入力エラー", type, key, name, index, value: data?.[key], ...res });
      }
    }
  };
};

export const getItem = (
  msgs: Array<Message>,
  key: string | number | null | undefined = undefined,
  ctx: DataItem | DataContext | null | undefined = undefined,
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
      case "year":
        getDateItem(msgs, key!, ctx, data, index, pctx);
        break;
      case "time":
        getTimeItem(msgs, key!, ctx, data, index, pctx);
        break;
      case "array":
        getArrayItem(msgs, key!, ctx, data, index, pctx);
        break;
      case "struct":
        getStructItem(msgs, key!, ctx, data, index, pctx);
        break;
      case "file":
        getFileItem(msgs, key!, ctx, data, index, pctx);
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

const getStringItem = (msgs: Array<Message>, key: string | number, ctx: DataItem_String, data?: Struct, index?: number, pctx?: DataContext) => {
  const name = ctx.label || ctx.name || String(key);
  const pushMsg = getPushValidationMsgFunc(msgs, key, ctx, data, index, pctx);

  if (data) {
    const v = data[key];
    if (v != null && typeof v !== "string") data[key] = String(v);
  }
  const v = data?.[key] as Nullable<string>;

  if (ctx.required) {
    pushMsg(StringData.requiredValidation(v, name));
  }
  if (ctx.length != null) {
    pushMsg(StringData.lengthValidation(v, ctx.length, name));
  }
  if (ctx.minLength != null) {
    pushMsg(StringData.minLengthValidation(v, ctx.minLength, name));
  }
  if (ctx.maxLength != null) {
    pushMsg(StringData.maxLengthValidation(v, ctx.maxLength, name));
  }
  switch (ctx.charType) {
    case "h-num":
      pushMsg(StringData.halfWidthNumericValidation(v, name));
      break;
    case "f-num":
      pushMsg(StringData.fullWidthNumericValidation(v, name));
      break;
    case "num":
      pushMsg(StringData.numericValidation(v, name));
      break;
    case "h-alpha":
      pushMsg(StringData.halfWidthAlphabetValidation(v, name));
      break;
    case "f-alpha":
      pushMsg(StringData.fullWidthAlphabetValidation(v, name));
      break;
    case "alpha":
      pushMsg(StringData.alphabetValidation(v, name));
      break;
    case "h-alpha-num":
      pushMsg(StringData.halfWidthAlphaNumericValidation(v, name));
      break;
    case "h-alpha-num-syn":
      pushMsg(StringData.halfWidthAlphaNumericAndSymbolsValidation(v, name));
      break;
    case "int":
      pushMsg(StringData.integerValidation(v, name));
      break;
    case "h-katakana":
      pushMsg(StringData.halfWidthKatakanaValidation(v, name));
      break;
    case "f-katakana":
      pushMsg(StringData.fullWidthKatakanaValidation(v, name));
      break;
    case "katakana":
      pushMsg(StringData.katakanaValidation(v, name));
      break;
    case "email":
      pushMsg(StringData.mailAddressValidation(v, name));
      break;
    case "tel":
      pushMsg(StringData.telValidation(v, name));
      break;
    case "url":
      pushMsg(StringData.urlValidation(v, name));
      break;
    default:
      break;
  }
  if (ctx.validations) {
    for (const validation of ctx.validations) {
      pushMsg(validation(v, key, ctx, data, index, pctx));
    }
  }
};

const getNumberItem = (msgs: Array<Message>, key: string | number, ctx: DataItem_Number, data?: Struct, index?: number, pctx?: DataContext) => {
  const name = ctx.label || ctx.name || String(key);
  const pushMsg = getPushValidationMsgFunc(msgs, key, ctx, data, index, pctx);

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
    pushMsg(NumberData.requiredValidation(v, name));
  }
  if (ctx.min != null && ctx.max != null) {
    pushMsg(NumberData.rangeValidation(v, ctx.min, ctx.max, name));
  } else {
    if (ctx.min != null) {
      pushMsg(NumberData.minValidation(v, ctx.min, name));
    }
    if (ctx.max != null) {
      pushMsg(NumberData.maxValidation(v, ctx.max, name));
    }
  }
  if (ctx.float != null) {
    pushMsg(NumberData.floatValidation(v, ctx.float, name));
  }

  if (ctx.validations) {
    for (const validation of ctx.validations) {
      pushMsg(validation(v, key, ctx, data, index, pctx));
    }
  }
};

const getBooleanItem = (msgs: Array<Message>, key: string | number, ctx: DataItem_Boolean, data?: Struct, index?: number, pctx?: DataContext) => {
  const name = ctx.label || ctx.name || String(key);
  const pushMsg = getPushValidationMsgFunc(msgs, key, ctx, data, index, pctx);

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

  const v = data?.[key] as boolean | number | string | null | undefined;

  if (ctx.required) {
    if (v !== tv && v !== fv) {
      pushMsg(`${name}を入力してください。`);
    }
  }

  if (ctx.validations) {
    for (const validation of ctx.validations) {
      pushMsg(validation(v, key, ctx, data, index, pctx));
    }
  }
};

const getDateItem = (msgs: Array<Message>, key: string | number, ctx: DataItem_Date, data?: Struct, index?: number, pctx?: DataContext) => {
  const name = ctx.label || ctx.name || String(key);
  const pushMsg = getPushValidationMsgFunc(msgs, key, ctx, data, index, pctx);

  let date: Date | undefined = undefined;
  if (data) {
    const v = data[key];
    const t = typeof v;
    if (v != null) {
      try {
        if (t === "string" || t === "number") {
          date = DatetimeUtils.convert(v);
          if (date) {
            DatetimeUtils.removeTime(date);
            switch (ctx.type) {
              case "year":
                date.setDate(1);
                date.setMonth(0);
                break;
              case "month":
                date.setDate(1);
                break;
              default:
                break;
            }
          }
        } else {
          throw new Error;
        }
        switch (ctx.typeof) {
          case "date":
            data[key] = date;
            break;
          case "number":
            data[key] = date?.getTime();
            break;
          default:
            data[key] = DatetimeUtils.format(date);
            break;
        }
      } catch {
        pushMsg(`${name}を日付型に変換できません。`);
        return;
      }
    }
  }

  if (ctx.required) {
    pushMsg(DateData.requiredValidation(date, name));
  }
  if (ctx.min != null && ctx.max != null) {
    pushMsg(DateData.rangeValidation(date, ctx.min, ctx.max, ctx.type, name));
  } else {
    if (ctx.min) {
      pushMsg(DateData.minValidation(date, ctx.min, ctx.type, name));
    }
    if (ctx.max) {
      pushMsg(DateData.maxValidation(date, ctx.max, ctx.type, name));
    }
  }
  if (ctx.rangePair) {
    const pairCtx = pctx?.[ctx.rangePair.name];
    if (pairCtx != null && dataItemKey in pairCtx && (pairCtx.type === "date" || pairCtx.type === "month" || pairCtx.type === "year")) {
      pushMsg(DateData.contextValidation(date, ctx.rangePair, data, ctx.type, name, pairCtx?.label));
    }
  }

  if (ctx.validations) {
    for (const validation of ctx.validations) {
      pushMsg(validation(date, key, ctx, data, index, pctx));
    }
  }
};

const getTimeItem = (msgs: Array<Message>, key: string | number, ctx: DataItem_Time, data?: Struct, index?: number, pctx?: DataContext) => {
  const name = ctx.label || ctx.name || String(key);
  const pushMsg = getPushValidationMsgFunc(msgs, key, ctx, data, index, pctx);

  let timeNum: number | undefined = undefined;
  if (data) {
    const v = data[key];
    const t = typeof v;
    if (v != null) {
      try {
        switch (t) {
          case "number":
            break;
          case "string":
            timeNum = data[key] = TimeUtils.convertMillisecondsToUnit(new Time(v).getTime(), ctx.unit);
            break;
          default:
            if ("time" in v) {
              const tv = v.time;
              if (typeof tv === "number") {
                timeNum = data[key] = TimeUtils.convertMillisecondsToUnit(v.getTime(), ctx.unit);
                break;
              }
            }
            throw new Error;
        }
        if (ctx.typeof === "string") {
          if (timeNum != null) {
            data[key] = TimeData.format(TimeUtils.convertUnitToMilliseconds(timeNum, ctx.unit), ctx.mode);
          }
        }
      } catch {
        pushMsg(`${name}を時間型に変換できません。`);
        return;
      }
    }
  }

  if (ctx.required) {
    pushMsg(TimeData.requiredValidation(timeNum, name));
  }
  if (ctx.min != null && ctx.max != null) {
    pushMsg(TimeData.rangeValidation(timeNum, ctx.min, ctx.max, ctx.mode, ctx.unit, name));
  } else {
    if (ctx.min) {
      pushMsg(TimeData.minValidation(timeNum, ctx.min, ctx.mode, ctx.unit, name));
    }
    if (ctx.max) {
      pushMsg(TimeData.maxValidation(timeNum, ctx.max, ctx.mode, ctx.unit, name));
    }
  }
  if (ctx.rangePair) {
    const pairCtx = pctx?.[ctx.rangePair.name];
    if (pairCtx != null && dataItemKey in pairCtx && pairCtx.type === "time") {
      pushMsg(TimeData.contextValidation(timeNum, ctx.rangePair, data, ctx.mode, ctx.unit, name, pairCtx?.unit, pairCtx?.label));
    }
  }

  if (ctx.validations) {
    for (const validation of ctx.validations) {
      pushMsg(validation(timeNum, key, ctx, data, index, pctx));
    }
  }
};

const getFileItem = (msgs: Array<Message>, key: string | number, ctx: DataItem_File, data?: Struct, index?: number, pctx?: DataContext) => {
  const name = ctx.label || ctx.name || String(key);
  const pushMsg = getPushValidationMsgFunc(msgs, key, ctx, data, index, pctx);

  if (data) {
    const v = data[key];
    if (ctx.multiple) {
      if (v != null && !Array.isArray(v)) {
        data[key] = [v];
      }
      data[key] = (data[key] as Array<FileValue>)?.filter(item => {
        if (item == null) return false;
        return item.size > 0;
      });
    } else {
      if (v != null && Array.isArray(v)) {
        if (v.length <= 1) {
          data[key] = v[0];
        } else {
          pushMsg(`${name}にファイルが複数設定されています。`);
          return;
        }
      }
      const vc = data[key] as FileValue;
      if (vc != null && vc.size === 0) {
        data[key] = undefined;
      }
    }
  }

  if (ctx.multiple) {
    const v = data?.[key] as Array<FileValue> | null | undefined;

    if (ctx.required) {
      if (v == null || v.length === 0) {
        pushMsg(`${name}をアップロードしてください。`);
      }
    }

    if (ctx.accept) {
      const f = FileData.fileTypeValidationAsServer(ctx.accept);
      v?.forEach(item => {
        pushMsg(f(item));
      });
    }

    if (ctx.fileSize != null) {
      v?.forEach(item => {
        if (item.size > ctx.fileSize!) {
          pushMsg(`${name}のサイズは${FileData.getSizeText(ctx.fileSize!)}以内でアップロードしてください。`);
        }
      });
    }

    if (ctx.totalFileSize != null) {
      const size = v?.reduce((pv, item) => {
        return pv + item.size;
      }, 0) as number ?? 0;
      if (size > ctx.totalFileSize) {
        pushMsg(`${name}の合計サイズは${FileData.getSizeText(ctx.totalFileSize)}以内でアップロードしてください。`);
      }
    }
  } else {
    const v = data?.[key] as FileValue | null | undefined;

    if (ctx.required) {
      if (v == null) {
        pushMsg(`${name}をアップロードしてください。`);
      }
    }

    if (v != null && ctx.accept != null) {
      pushMsg(FileData.fileTypeValidationAsServer(ctx.accept)(v));
    }

    if (v != null && ctx.fileSize != null) {
      if (v.size > ctx.fileSize) {
        pushMsg(`${name}のサイズは${FileData.getSizeText(ctx.fileSize!)}以内でアップロードしてください。`);
      }
    }
  }

  if (ctx.validations) {
    for (const validation of ctx.validations) {
      pushMsg(validation(data?.[key], key, ctx, data, index, pctx));
    }
  }
};

const getArrayItem = (msgs: Array<Message>, key: string | number, ctx: DataItem_Array, data?: Struct, index?: number, pctx?: DataContext) => {
  const name = ctx.label || ctx.name || String(key);
  const pushMsg = getPushValidationMsgFunc(msgs, key, ctx, data, index, pctx);

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
      pushMsg(validation(v, key, ctx, data, index, pctx));
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

const getStructItem = (msgs: Array<Message>, key: string | number, ctx: DataItem_Struct, data?: Struct, index?: number, pctx?: DataContext) => {
  const name = ctx.label || ctx.name || String(key);
  const pushMsg = getPushValidationMsgFunc(msgs, key, ctx, data, index, pctx);

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
      pushMsg(validation(v, key, ctx, data, index, pctx));
    }
  }

  if (ctx.required !== true && v == null) return;

  getItem(msgs, null, ctx.item, v!, undefined, pctx);
};

export const hasError = (msgs: Array<Message>) => {
  return msgs.some(msg => msg?.type === "error");
};

export const getReturnMessages = (msgs: Array<Message>) => {
  return msgs.filter(msg => msg?.type === "error");
};