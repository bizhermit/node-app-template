import { dataItemKey } from "../../data-items";
import DateValidation from "../../data-items/date/validations";
import FileValidation from "../../data-items/file/validations";
import NumberValidation from "../../data-items/number/validations";
import StringValidation from "../../data-items/string/validations";
import TimeItemUtils from "../../data-items/time/utilities";
import TimeValidation from "../../data-items/time/validations";
import formatDate from "../../objects/date/format";
import parseDate from "../../objects/date/parse";
import { withoutTime } from "../../objects/date/without-time";
import structKeys from "../../objects/struct/keys";
import Time from "../../objects/time";
import { TimeUtils } from "../../objects/time/utilities";

type GetItemContext<D extends DataItem | DI.Context> = {
  dataItem: D;
  key: string | number;
  data: { [key: string]: any } | null | undefined;
  index?: number;
  parentDataContext?: DI.Context | null | undefined;
};

const getPushValidationMsgFunc = (msgs: Array<Api.Message>, { key, index, dataItem, data }: GetItemContext<any>) => {
  const name = dataItem.label || dataItem.name || String(key);
  const ret = (res: string | null | undefined | Omit<DI.ValidationResult, "type" | "key" | "name"> & Partial<Pick<DI.ValidationResult, "type" | "key" | "name">>, type: DI.ValidationResultType = "error") => {
    if (res) {
      if (type === "error") ret.hasError = true;
      if (typeof res === "string") {
        msgs.push({ title: "入力エラー", type, key, name, index, body: `${index != null ? `${index}:` : ""}${res}`, value: data?.[key] });
      } else {
        msgs.push({ title: "入力エラー", type, key, name, index, value: data?.[key], ...res });
      }
    }
  };
  ret.hasError = false;
  return ret;
};

export const getItem = (
  msgs: Array<Api.Message>,
  ctx: GetItemContext<DataItem | DI.Context>
) => {
  const { dataItem: di } = ctx;
  if (di == null) return;
  if (dataItemKey in di) {
    switch (di.type) {
      case "string":
        getStringItem(msgs, ctx as GetItemContext<DataItem_String>);
        break;
      case "number":
        getNumberItem(msgs, ctx as GetItemContext<DataItem_Number>);
        break;
      case "boolean":
        getBooleanItem(msgs, ctx as GetItemContext<DataItem_Boolean>);
        break;
      case "date":
      case "month":
      case "year":
        getDateItem(msgs, ctx as GetItemContext<DataItem_Date>);
        break;
      case "time":
        getTimeItem(msgs, ctx as GetItemContext<DataItem_Time>);
        break;
      case "array":
        getArrayItem(msgs, ctx as GetItemContext<DataItem_Array>);
        break;
      case "struct":
        getStructItem(msgs, ctx as GetItemContext<DataItem_Struct>);
        break;
      case "file":
        getFileItem(msgs, ctx as GetItemContext<DataItem_File>);
        break;
      default:
        break;
    }
    return;
  }
  structKeys(di as DI.Context).forEach(k => {
    if (ctx.key == null) {
      getItem(msgs, {
        key: k,
        dataItem: (di as DI.Context)[k],
        data: ctx.data,
        index: undefined,
        parentDataContext: di as DI.Context,
      });
      return;
    }
    getItem(msgs, {
      key: k,
      dataItem: (di as DI.Context)[k],
      data: ctx.data?.[ctx.key],
      index: undefined,
      parentDataContext: di as DI.Context,
    });
  });
};

const getStringItem = (msgs: Array<Api.Message>, ctx: GetItemContext<DataItem_String>) => {
  const { dataItem: di, key, data } = ctx;
  const name = di.label || di.name || String(ctx.key);
  const pushMsg = getPushValidationMsgFunc(msgs, ctx);

  if (data) {
    const v = data[key];
    if (v != null && typeof v !== "string") data[key] = String(v);
  }
  const v = data?.[key] as string | null | undefined;

  if (di.required) {
    pushMsg(StringValidation.required(v, name));
    if (pushMsg.hasError) return;
  }
  if (di.length != null) {
    pushMsg(StringValidation.length(v, di.length, name));
    if (pushMsg.hasError) return;
  } else {
    if (di.minLength != null) {
      pushMsg(StringValidation.minLength(v, di.minLength, name));
      if (pushMsg.hasError) return;
    }
    if (di.maxLength != null) {
      pushMsg(StringValidation.maxLength(v, di.maxLength, name));
      if (pushMsg.hasError) return;
    }
  }
  switch (di.charType) {
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
    case "email":
      pushMsg(StringValidation.mailAddress(v, name));
      break;
    case "tel":
      pushMsg(StringValidation.tel(v, name));
      break;
    case "url":
      pushMsg(StringValidation.url(v, name));
      break;
    default:
      break;
  }
  if (pushMsg.hasError) return;
  if (di.validations) {
    for (const validation of di.validations) {
      pushMsg(validation(v, ctx));
      if (pushMsg.hasError) return;
    }
  }
};

const getNumberItem = (msgs: Array<Api.Message>, ctx: GetItemContext<DataItem_Number>) => {
  const { dataItem: di, key, data } = ctx;
  const name = di.label || di.name || String(key);
  const pushMsg = getPushValidationMsgFunc(msgs, ctx);

  if (data) {
    const v = data[key];
    if (v != null && typeof v !== "number") {
      if (di.strict) {
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

  const v = data?.[key] as number | null | undefined;

  if (di.required) {
    pushMsg(NumberValidation.required(v, name));
    if (pushMsg.hasError) return;
  }
  if (di.min != null && di.max != null) {
    pushMsg(NumberValidation.range(v, di.min, di.max, name));
    if (pushMsg.hasError) return;
  } else {
    if (di.min != null) {
      pushMsg(NumberValidation.min(v, di.min, name));
      if (pushMsg.hasError) return;
    }
    if (di.max != null) {
      pushMsg(NumberValidation.max(v, di.max, name));
      if (pushMsg.hasError) return;
    }
  }
  if (di.float != null) {
    pushMsg(NumberValidation.float(v, di.float, name));
    if (pushMsg.hasError) return;
  }

  if (di.validations) {
    for (const validation of di.validations) {
      pushMsg(validation(v, ctx));
      if (pushMsg.hasError) return;
    }
  }
};

const getBooleanItem = (msgs: Array<Api.Message>, ctx: GetItemContext<DataItem_Boolean>) => {
  const { dataItem: di, key, data } = ctx;
  const name = di.label || di.name || String(key);
  const pushMsg = getPushValidationMsgFunc(msgs, ctx);

  const tv = di.trueValue ?? true;
  const fv = di.falseValue ?? false;
  if (data) {
    const v = data[key];
    if (v != null && (v !== tv && v !== fv)) {
      if (di.strict) {
        data[key] = undefined;
        pushMsg(`${name}をundefindに変換しました。[${v}]->x[${tv}/${fv}]`, "warning");
      } else {
        data[key] = v ? tv : fv;
        pushMsg(`${name}を真偽値に変換しました。[${v}]->[${data[key]}]`, "warning");
      }
    }
  }

  const v = data?.[key] as boolean | number | string | null | undefined;

  if (di.required) {
    if (v !== tv && v !== fv) {
      pushMsg(`${name}を入力してください。`);
      if (pushMsg.hasError) return;
    }
  }

  if (di.validations) {
    for (const validation of di.validations) {
      pushMsg(validation(v, ctx));
      if (pushMsg.hasError) return;
    }
  }
};

const getDateItem = (msgs: Array<Api.Message>, ctx: GetItemContext<DataItem_Date>) => {
  const { dataItem: di, key, data } = ctx;
  const name = di.label || di.name || String(key);
  const pushMsg = getPushValidationMsgFunc(msgs, ctx);

  let date: Date | undefined = undefined;
  if (data) {
    const v = data[key];
    const t = typeof v;
    if (v != null) {
      try {
        if (t === "string" || t === "number") {
          date = parseDate(v);
          if (date) {
            withoutTime(date);
            switch (di.type) {
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
        switch (di.typeof) {
          case "date":
            data[key] = date;
            break;
          case "number":
            data[key] = date?.getTime();
            break;
          default:
            data[key] = formatDate(date);
            break;
        }
      } catch {
        pushMsg(`${name}を日付型に変換できません。`);
        return;
      }
    }
  }

  if (di.required) {
    pushMsg(DateValidation.required(date, name));
    if (pushMsg.hasError) return;
  }
  if (di.min != null && di.max != null) {
    pushMsg(DateValidation.range(date, di.min, di.max, di.type, name));
    if (pushMsg.hasError) return;
  } else {
    if (di.min) {
      pushMsg(DateValidation.min(date, di.min, di.type, name));
      if (pushMsg.hasError) return;
    }
    if (di.max) {
      pushMsg(DateValidation.max(date, di.max, di.type, name));
      if (pushMsg.hasError) return;
    }
  }
  if (di.rangePair) {
    const pairCtx = ctx.parentDataContext?.[di.rangePair.name];
    if (pairCtx != null && dataItemKey in pairCtx && (pairCtx.type === "date" || pairCtx.type === "month" || pairCtx.type === "year")) {
      pushMsg(DateValidation.context(date, di.rangePair, ctx.data, di.type, name, pairCtx?.label));
      if (pushMsg.hasError) return;
    }
  }

  if (di.validations) {
    for (const validation of di.validations) {
      pushMsg(validation(date, ctx));
      if (pushMsg.hasError) return;
    }
  }
};

const getTimeItem = (msgs: Array<Api.Message>, ctx: GetItemContext<DataItem_Time>) => {
  const { dataItem: di, key, data } = ctx;
  const name = di.label || di.name || String(key);
  const pushMsg = getPushValidationMsgFunc(msgs, ctx);

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
            timeNum = data[key] = TimeUtils.convertMillisecondsToUnit(new Time(v).getTime(), di.unit);
            break;
          default:
            if ("time" in v) {
              const tv = v.time;
              if (typeof tv === "number") {
                timeNum = data[key] = TimeUtils.convertMillisecondsToUnit(v.getTime(), di.unit);
                break;
              }
            }
            throw new Error;
        }
        if (di.typeof === "string") {
          if (timeNum != null) {
            data[key] = TimeItemUtils.format(TimeUtils.convertUnitToMilliseconds(timeNum, di.unit), di.mode);
          }
        }
      } catch {
        pushMsg(`${name}を時間型に変換できません。`);
        return;
      }
    }
  }

  if (di.required) {
    pushMsg(TimeValidation.required(timeNum, name));
    if (pushMsg.hasError) return;
  }
  if (di.min != null && di.max != null) {
    pushMsg(TimeValidation.range(timeNum, di.min, di.max, di.mode, di.unit, name));
    if (pushMsg.hasError) return;
  } else {
    if (di.min) {
      pushMsg(TimeValidation.min(timeNum, di.min, di.mode, di.unit, name));
      if (pushMsg.hasError) return;
    }
    if (di.max) {
      pushMsg(TimeValidation.max(timeNum, di.max, di.mode, di.unit, name));
      if (pushMsg.hasError) return;
    }
  }
  if (di.rangePair) {
    const pairCtx = ctx.parentDataContext?.[di.rangePair.name];
    if (pairCtx != null && dataItemKey in pairCtx && pairCtx.type === "time") {
      pushMsg(TimeValidation.context(timeNum, di.rangePair, ctx.data, di.mode, di.unit, name, pairCtx?.unit, pairCtx?.label));
      if (pushMsg.hasError) return;
    }
  }

  if (di.validations) {
    for (const validation of di.validations) {
      pushMsg(validation(timeNum, ctx));
      if (pushMsg.hasError) return;
    }
  }
};

const getFileItem = (msgs: Array<Api.Message>, ctx: GetItemContext<DataItem_File>) => {
  const { dataItem: di, key, data } = ctx;
  const name = di.label || di.name || String(key);
  const pushMsg = getPushValidationMsgFunc(msgs, ctx);

  if (data) {
    const v = data[key];
    if (di.multiple) {
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

  if (di.multiple) {
    const v = data?.[key] as Array<FileValue> | null | undefined;

    if (di.required) {
      if (v == null || v.length === 0) {
        pushMsg(`${name}をアップロードしてください。`);
        if (pushMsg.hasError) return;
      }
    }

    if (di.accept) {
      const f = FileValidation.typeForServer(di.accept);
      v?.forEach(item => {
        pushMsg(f(item));
      });
    }

    if (di.fileSize != null) {
      v?.forEach(item => {
        if (item.size > di.fileSize!) {
          pushMsg(`${name}のサイズは${FileValidation.getSizeText(di.fileSize!)}以内でアップロードしてください。`);
        }
      });
    }

    if (di.totalFileSize != null) {
      const size = v?.reduce((pv, item) => {
        return pv + item.size;
      }, 0) as number ?? 0;
      if (size > di.totalFileSize) {
        pushMsg(`${name}の合計サイズは${FileValidation.getSizeText(di.totalFileSize)}以内でアップロードしてください。`);
      }
    }
  } else {
    const v = data?.[key] as FileValue | null | undefined;

    if (di.required) {
      if (v == null) {
        pushMsg(`${name}をアップロードしてください。`);
      }
    }

    if (v != null && di.accept != null) {
      pushMsg(FileValidation.typeForServer(di.accept)(v));
    }

    if (v != null && di.fileSize != null) {
      if (v.size > di.fileSize) {
        pushMsg(`${name}のサイズは${FileValidation.getSizeText(di.fileSize!)}以内でアップロードしてください。`);
      }
    }
  }

  if (di.validations) {
    for (const validation of di.validations) {
      pushMsg(validation(data?.[key], ctx));
      if (pushMsg.hasError) return;
    }
  }
};

const getArrayItem = (msgs: Array<Api.Message>, ctx: GetItemContext<DataItem_Array>) => {
  const { dataItem: di, key, data } = ctx;
  const name = di.label || di.name || String(key);
  const pushMsg = getPushValidationMsgFunc(msgs, ctx);

  const v = data?.[key] as Array<any> | null | undefined;

  if (v != null && !Array.isArray(v)) {
    pushMsg(`${name}の形式が配列ではありません。`);
    return;
  }
  if (di.required) {
    if (v == null || v.length === 0) {
      pushMsg(`${name}は1件以上設定してください。`);
      if (pushMsg.hasError) return;
    }
  }
  if (di.length != null) {
    if (v != null && v.length !== di.length) {
      pushMsg(`${name}は${di.minLength}件で設定してください。`);
    }
  } else {
    if (di.minLength != null) {
      if (v != null && v.length < di.minLength) {
        pushMsg(`${name}は${di.minLength}件以上を設定してください。`);
      }
    }
    if (di.maxLength != null) {
      if (v == null || v.length > di.maxLength) {
        pushMsg(`${name}は${di.maxLength}件以内で設定してください。`);
      }
    }
  }
  if (di.validations) {
    for (const validation of di.validations) {
      pushMsg(validation(v, ctx));
    }
  }

  if (di.required !== true && v == null) return;

  const itemIsStruct = dataItemKey in di.item;
  v?.forEach((item, index) => {
    if (itemIsStruct) {
      getItem(msgs, {
        key: index,
        dataItem: di.item,
        data: v,
        index,
        parentDataContext: ctx.parentDataContext,
      });
      return;
    }
    getItem(msgs, {
      key: null!,
      dataItem: di.item,
      data: item,
      index,
      parentDataContext: ctx.parentDataContext,
    });
  });
};

const getStructItem = (msgs: Array<Api.Message>, ctx: GetItemContext<DataItem_Struct>) => {
  const { dataItem: di, key, data } = ctx;
  const name = di.label || di.name || String(key);
  const pushMsg = getPushValidationMsgFunc(msgs, ctx);

  const v = data?.[key] as { [key: string]: any } | null | undefined;

  if (v != null && typeof v !== "object") {
    pushMsg(`${name}の形式が構造体ではありません。`);
    return;
  }
  if (di.required) {
    if (v == null) {
      pushMsg(`${name}を設定してください。`);
      if (pushMsg.hasError) return;
    }
  }
  if (di.validations) {
    for (const validation of di.validations) {
      pushMsg(validation(v, ctx));
    }
  }

  if (di.required !== true && v == null) return;

  getItem(msgs, {
    key: null!,
    dataItem: di.item,
    data: v!,
    index: undefined,
    parentDataContext: ctx.parentDataContext,
  });
};

export const hasError = (msgs: Array<Api.Message>) => {
  return msgs.some(msg => msg?.type === "error");
};

export const getReturnMessages = (msgs: Array<Api.Message>) => {
  return msgs.filter(msg => msg?.type === "error");
};