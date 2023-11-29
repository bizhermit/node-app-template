import { structKeys } from "#/data-items/struct";
import { dataItemKey } from "../../data-items";
import { DateData } from "../../data-items/date";
import { FileData } from "../../data-items/file";
import { NumberData } from "../../data-items/number";
import { StringData } from "../../data-items/string";
import { TimeData } from "../../data-items/time";
import formatDate from "../../objects/date/format";
import parseDate from "../../objects/date/parse";
import { withoutTime } from "../../objects/date/without-time";
import Time from "../../objects/time";
import { TimeUtils } from "../../objects/time/utilities";

type GetItemContext<D extends DataItem | DataContext> = {
  dataItem: D;
  key: string | number;
  data: { [key: string]: any } | null | undefined;
  index?: number;
  parentDataContext?: DataContext | null | undefined;
};

const getPushValidationMsgFunc = (msgs: Array<Message>, { key, index, dataItem, data }: GetItemContext<any>) => {
  const name = dataItem.label || dataItem.name || String(key);
  const ret = (res: string | null | undefined | ValidationResult, type: DataItemValidationResultType = "error") => {
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
  msgs: Array<Message>,
  ctx: GetItemContext<DataItem | DataContext>
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
  structKeys(di as DataContext).forEach(k => {
    if (ctx.key == null) {
      getItem(msgs, {
        key: k,
        dataItem: (di as DataContext)[k],
        data: ctx.data,
        index: undefined,
        parentDataContext: di as DataContext,
      });
      return;
    }
    getItem(msgs, {
      key: k,
      dataItem: (di as DataContext)[k],
      data: ctx.data?.[ctx.key],
      index: undefined,
      parentDataContext: di as DataContext,
    });
  });
};

const getStringItem = (msgs: Array<Message>, ctx: GetItemContext<DataItem_String>) => {
  const { dataItem: di, key, data } = ctx;
  const name = di.label || di.name || String(ctx.key);
  const pushMsg = getPushValidationMsgFunc(msgs, ctx);

  if (data) {
    const v = data[key];
    if (v != null && typeof v !== "string") data[key] = String(v);
  }
  const v = data?.[key] as string | null | undefined;

  if (di.required) {
    pushMsg(StringData.requiredValidation(v, name));
    if (pushMsg.hasError) return;
  }
  if (di.length != null) {
    pushMsg(StringData.lengthValidation(v, di.length, name));
    if (pushMsg.hasError) return;
  } else {
    if (di.minLength != null) {
      pushMsg(StringData.minLengthValidation(v, di.minLength, name));
      if (pushMsg.hasError) return;
    }
    if (di.maxLength != null) {
      pushMsg(StringData.maxLengthValidation(v, di.maxLength, name));
      if (pushMsg.hasError) return;
    }
  }
  switch (di.charType) {
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
  if (pushMsg.hasError) return;
  if (di.validations) {
    for (const validation of di.validations) {
      pushMsg(validation(v, ctx));
      if (pushMsg.hasError) return;
    }
  }
};

const getNumberItem = (msgs: Array<Message>, ctx: GetItemContext<DataItem_Number>) => {
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
    pushMsg(NumberData.requiredValidation(v, name));
    if (pushMsg.hasError) return;
  }
  if (di.min != null && di.max != null) {
    pushMsg(NumberData.rangeValidation(v, di.min, di.max, name));
    if (pushMsg.hasError) return;
  } else {
    if (di.min != null) {
      pushMsg(NumberData.minValidation(v, di.min, name));
      if (pushMsg.hasError) return;
    }
    if (di.max != null) {
      pushMsg(NumberData.maxValidation(v, di.max, name));
      if (pushMsg.hasError) return;
    }
  }
  if (di.float != null) {
    pushMsg(NumberData.floatValidation(v, di.float, name));
    if (pushMsg.hasError) return;
  }

  if (di.validations) {
    for (const validation of di.validations) {
      pushMsg(validation(v, ctx));
      if (pushMsg.hasError) return;
    }
  }
};

const getBooleanItem = (msgs: Array<Message>, ctx: GetItemContext<DataItem_Boolean>) => {
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

const getDateItem = (msgs: Array<Message>, ctx: GetItemContext<DataItem_Date>) => {
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
    pushMsg(DateData.requiredValidation(date, name));
    if (pushMsg.hasError) return;
  }
  if (di.min != null && di.max != null) {
    pushMsg(DateData.rangeValidation(date, di.min, di.max, di.type, name));
    if (pushMsg.hasError) return;
  } else {
    if (di.min) {
      pushMsg(DateData.minValidation(date, di.min, di.type, name));
      if (pushMsg.hasError) return;
    }
    if (di.max) {
      pushMsg(DateData.maxValidation(date, di.max, di.type, name));
      if (pushMsg.hasError) return;
    }
  }
  if (di.rangePair) {
    const pairCtx = ctx.parentDataContext?.[di.rangePair.name];
    if (pairCtx != null && dataItemKey in pairCtx && (pairCtx.type === "date" || pairCtx.type === "month" || pairCtx.type === "year")) {
      pushMsg(DateData.contextValidation(date, di.rangePair, ctx.data, di.type, name, pairCtx?.label));
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

const getTimeItem = (msgs: Array<Message>, ctx: GetItemContext<DataItem_Time>) => {
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
            data[key] = TimeData.format(TimeUtils.convertUnitToMilliseconds(timeNum, di.unit), di.mode);
          }
        }
      } catch {
        pushMsg(`${name}を時間型に変換できません。`);
        return;
      }
    }
  }

  if (di.required) {
    pushMsg(TimeData.requiredValidation(timeNum, name));
    if (pushMsg.hasError) return;
  }
  if (di.min != null && di.max != null) {
    pushMsg(TimeData.rangeValidation(timeNum, di.min, di.max, di.mode, di.unit, name));
    if (pushMsg.hasError) return;
  } else {
    if (di.min) {
      pushMsg(TimeData.minValidation(timeNum, di.min, di.mode, di.unit, name));
      if (pushMsg.hasError) return;
    }
    if (di.max) {
      pushMsg(TimeData.maxValidation(timeNum, di.max, di.mode, di.unit, name));
      if (pushMsg.hasError) return;
    }
  }
  if (di.rangePair) {
    const pairCtx = ctx.parentDataContext?.[di.rangePair.name];
    if (pairCtx != null && dataItemKey in pairCtx && pairCtx.type === "time") {
      pushMsg(TimeData.contextValidation(timeNum, di.rangePair, ctx.data, di.mode, di.unit, name, pairCtx?.unit, pairCtx?.label));
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

const getFileItem = (msgs: Array<Message>, ctx: GetItemContext<DataItem_File>) => {
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
      const f = FileData.fileTypeValidationAsServer(di.accept);
      v?.forEach(item => {
        pushMsg(f(item));
      });
    }

    if (di.fileSize != null) {
      v?.forEach(item => {
        if (item.size > di.fileSize!) {
          pushMsg(`${name}のサイズは${FileData.getSizeText(di.fileSize!)}以内でアップロードしてください。`);
        }
      });
    }

    if (di.totalFileSize != null) {
      const size = v?.reduce((pv, item) => {
        return pv + item.size;
      }, 0) as number ?? 0;
      if (size > di.totalFileSize) {
        pushMsg(`${name}の合計サイズは${FileData.getSizeText(di.totalFileSize)}以内でアップロードしてください。`);
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
      pushMsg(FileData.fileTypeValidationAsServer(di.accept)(v));
    }

    if (v != null && di.fileSize != null) {
      if (v.size > di.fileSize) {
        pushMsg(`${name}のサイズは${FileData.getSizeText(di.fileSize!)}以内でアップロードしてください。`);
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

const getArrayItem = (msgs: Array<Message>, ctx: GetItemContext<DataItem_Array>) => {
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

const getStructItem = (msgs: Array<Message>, ctx: GetItemContext<DataItem_Struct>) => {
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

export const hasError = (msgs: Array<Message>) => {
  return msgs.some(msg => msg?.type === "error");
};

export const getReturnMessages = (msgs: Array<Message>) => {
  return msgs.filter(msg => msg?.type === "error");
};