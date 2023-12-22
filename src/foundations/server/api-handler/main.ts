import DateValidation from "../../data-items/date/validations";
import FileValidation from "../../data-items/file/validations";
import NumberValidation from "../../data-items/number/validations";
import StringValidation from "../../data-items/string/validations";
import TimeItemUtils from "../../data-items/time/utilities";
import TimeValidation from "../../data-items/time/validations";
import formatDate from "../../objects/date/format";
import parseDate from "../../objects/date/parse";
import { withoutTime } from "../../objects/date/without-time";
import equals from "../../objects/equal";
import getObjectType from "../../objects/name";
import parseNum from "../../objects/number/parse";
import Time from "../../objects/time";
import { TimeUtils } from "../../objects/time/utilities";

const getController = (msgs: Array<Api.Message>, props: { dataItem: DataItem; parent?: DataItem_Array | DataItem_Struct | undefined; index: number | undefined; }) => {
  const key = props.index == null ? props.dataItem.name : props.index;
  const label = props.dataItem.label || props.dataItem.name;
  const state = { hasError: false };

  return {
    key,
    label,
    state,
    pushMsg: (result: string | DI.ValidationResult | null | undefined, type: DI.ValidationResultType = "error") => {
      if (result) {
        if (type === "error") state.hasError = true;
        const title = (() => {
          switch (type) {
            case "error": return "入力エラー";
            case "warning": return undefined;
            default: return undefined;
          }
        })();
        if (typeof result === "string") msgs.push({ title, body: `${props.index == null ? "" : `[${props.index}]:`}${result}`, type });
        else msgs.push({ title, ...result });
        return type;
      }
    },
  } as const;
};

type ConvertFunc<D extends DataItem> = (
  msgs: Array<Api.Message>,
  data: { [v: string | number]: any } | null | undefined,
  ctx: {
    dataItem: D;
    parent?: DataItem_Array | DataItem_Struct | undefined;
    index?: number;
    siblings?: Readonly<Array<DataItem>> | Array<DataItem>;
  }
) => void;

export const acceptData = (
  msgs: Array<Api.Message>,
  data: { [v: string]: any },
  dataItems: Readonly<Api.RequestDataItems>,
) => {
  dataItems.forEach(item => {
    if (!item) return;
    switchType(msgs, data, { dataItem: item, siblings: dataItems });
  });
};

const switchType: ConvertFunc<any> = (msgs, v, c) => {
  switch (c.dataItem.type) {
    case "string":
      stringItem(msgs, v, c);
      break;
    case "number":
      numberItem(msgs, v, c);
      break;
    case "boolean":
      booleanItem(msgs, v, c);
      break;
    case "date":
    case "month":
    case "year":
      dateItem(msgs, v, c);
      break;
    case "time":
      timeItem(msgs, v, c);
      break;
    case "file":
      fileItem(msgs, v, c);
      break;
    case "array":
      arrayItem(msgs, v, c);
      break;
    case "struct":
      structItem(msgs, v, c);
      break;
    default:
      break;
  }
};

const stringItem: ConvertFunc<DataItem_String> = (msgs, data, { dataItem, parent, index, siblings }) => {
  const { key, label, pushMsg, state } = getController(msgs, { dataItem, parent, index });

  if (data) {
    const v = data[key];
    if (v != null && typeof v !== "string") data[key] = String(v);
  }
  const v = data?.[key] as string | null | undefined;

  if (dataItem.required) {
    if (pushMsg(StringValidation.required(v, label)) === "error") return;
  }

  if (dataItem.length != null) {
    if (pushMsg(StringValidation.length(v, dataItem.length, label)) === "error") return;
  } else {
    if (dataItem.minLength != null) {
      if (pushMsg(StringValidation.minLength(v, dataItem.minLength, label)) === "error") return;
    }
    if (dataItem.maxLength != null) {
      if (pushMsg(StringValidation.maxLength(v, dataItem.maxLength, label)) === "error") return;
    }
  }

  if (dataItem.charType) {
    switch (dataItem.charType) {
      case "h-num":
        pushMsg(StringValidation.halfWidthNumeric(v, label));
        break;
      case "f-num":
        pushMsg(StringValidation.fullWidthNumeric(v, label));
        break;
      case "num":
        pushMsg(StringValidation.numeric(v, label));
        break;
      case "h-alpha":
        pushMsg(StringValidation.halfWidthAlphabet(v, label));
        break;
      case "f-alpha":
        pushMsg(StringValidation.fullWidthAlphabet(v, label));
        break;
      case "alpha":
        pushMsg(StringValidation.alphabet(v, label));
        break;
      case "h-alpha-num":
        pushMsg(StringValidation.halfWidthAlphaNumeric(v, label));
        break;
      case "h-alpha-num-syn":
        pushMsg(StringValidation.halfWidthAlphaNumericAndSymbols(v, label));
        break;
      case "int":
        pushMsg(StringValidation.integer(v, label));
        break;
      case "h-katakana":
        pushMsg(StringValidation.halfWidthKatakana(v, label));
        break;
      case "f-katakana":
        pushMsg(StringValidation.fullWidthKatakana(v, label));
        break;
      case "katakana":
        pushMsg(StringValidation.katakana(v, label));
        break;
      case "email":
        pushMsg(StringValidation.mailAddress(v, label));
        break;
      case "tel":
        pushMsg(StringValidation.tel(v, label));
        break;
      case "url":
        pushMsg(StringValidation.url(v, label));
        break;
      default:
        break;
    }
    if (state.hasError) return;
  }

  if (v && dataItem.source) {
    if (!dataItem.source.find(item => equals(item.value, v))) {
      pushMsg(`${label}は有効な値ではありません。`);
      return;
    }
  }

  if (dataItem.validations) {
    for (const validation of dataItem.validations) {
      if (pushMsg(validation(v, { dataItem, data, key, parent, siblings })) === "error") return;
    }
  }
};

const numberItem: ConvertFunc<DataItem_Number> = (msgs, data, { dataItem, parent, index, siblings }) => {
  const { key, label, pushMsg } = getController(msgs, { dataItem, parent, index });

  if (data) {
    const v = data[key];
    try {
      if (typeof v === "string" && v.trim() === "") {
        data[key] = undefined;
      } else {
        if (v != null) {
          if ((data[key] = parseNum(v)) == null) throw new Error;
        }
        pushMsg(`${label}を数値型に変換しました。[${v}]->[${data[key]}]`, "warning");
      }
    } catch {
      pushMsg(`${label}を数値型に変換できません。`);
      return;
    }
  }
  const v = data?.[key] as number | null | undefined;

  if (dataItem.required) {
    if (pushMsg(NumberValidation.required(v, label)) === "error") return;
  }

  if (dataItem.min != null && dataItem.max != null) {
    if (pushMsg(NumberValidation.range(v, dataItem.min, dataItem.max, label)) === "error") return;
  } else {
    if (dataItem.min != null) {
      if (pushMsg(NumberValidation.min(v, dataItem.min, label)) === "error") return;
    }
    if (dataItem.max != null) {
      if (pushMsg(NumberValidation.max(v, dataItem.max, label)) === "error") return;
    }
  }

  if (dataItem.float != null) {
    if (pushMsg(NumberValidation.float(v, dataItem.float, label)) === "error") return;
  }

  if (v != null && dataItem.source) {
    if (!dataItem.source.find(item => equals(item.value, v))) {
      pushMsg(`${label}は有効な値ではありません。`);
      return;
    }
  }

  if (dataItem.validations) {
    for (const validation of dataItem.validations) {
      if (pushMsg(validation(v, { dataItem, data, key, parent, siblings })) === "error") return;
    }
  }
};

const booleanItem: ConvertFunc<DataItem_Boolean> = (msgs, data, { dataItem, parent, index, siblings }) => {
  const { key, label, pushMsg } = getController(msgs, { dataItem, parent, index });

  const tv = dataItem.trueValue ?? true;
  const fv = dataItem.falseValue ?? false;
  if (data) {
    const v = data[key];
    if (v != null && (!equals(v, tv) && !equals(v, fv))) {
      data[key] = undefined;
      pushMsg(`${label}を真偽値に変換できません。`);
      return;
    }
  }

  const v = data?.[key] as boolean | number | string | null | undefined;

  if (dataItem.required) {
    if (!equals(v, tv) && !equals(v, fv)) {
      pushMsg(`${label}を入力してください。`);
      return;
    }
  }

  if (v != null && dataItem.source) {
    if (!dataItem.source.find(item => equals(item.value, v))) {
      pushMsg(`${label}は有効な値ではありません。`);
      return;
    }
  }

  if (dataItem.validations) {
    for (const validation of dataItem.validations) {
      if (pushMsg(validation(v, { dataItem, data, key, parent, siblings })) === "error") return;
    }
  }
};

const dateItem: ConvertFunc<DataItem_Date> = (msgs, data, { dataItem, parent, index, siblings }) => {
  const { key, label, pushMsg } = getController(msgs, { dataItem, parent, index });

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
            switch (dataItem.type) {
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
        switch (dataItem.typeof) {
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
        pushMsg(`${label}を日付型に変換できません。`);
        return;
      }
    }
  }

  if (dataItem.required) {
    if (pushMsg(DateValidation.required(date, label)) === "error") return;
  }

  if (dataItem.min != null && dataItem.max != null) {
    if (pushMsg(DateValidation.range(date, dataItem.min, dataItem.max, dataItem.type, label)) === "error") return;
  } else {
    if (dataItem.min) {
      if (pushMsg(DateValidation.min(date, dataItem.min, dataItem.type, label)) === "error") return;
    }
    if (dataItem.max) {
      if (pushMsg(DateValidation.max(date, dataItem.max, dataItem.type, label)) === "error") return;
    }
  }

  if (dataItem.rangePair) {
    const pair = siblings?.find(item => item.name === dataItem.rangePair!.name);
    if (pair && (pair.type === "date" || pair.type === "month" || pair.type === "year")) {
      if (pushMsg(DateValidation.context(date, dataItem.rangePair, data, dataItem.type, label, pair.label || pair.name)) === "error") return;
    }
  }

  if (dataItem.validations) {
    const v = data?.[key];
    for (const validation of dataItem.validations) {
      if (pushMsg(validation(v, { dataItem, data, key, parent, siblings })) === "error") return;
    }
  }
};

const timeItem: ConvertFunc<DataItem_Time> = (msgs, data, { dataItem, parent, index, siblings }) => {
  const { key, label, pushMsg } = getController(msgs, { dataItem, parent, index });

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
            timeNum = data[key] = TimeUtils.convertMillisecondsToUnit(new Time(v).getTime(), dataItem.unit);
            break;
          default:
            if ("time" in v) {
              const tv = v.time;
              if (typeof tv === "number") {
                timeNum = data[key] = TimeUtils.convertMillisecondsToUnit(v.getTime(), dataItem.unit);
                break;
              }
            }
            throw new Error;
        }
        if (dataItem.typeof === "string") {
          if (timeNum != null) {
            data[key] = TimeItemUtils.format(TimeUtils.convertUnitToMilliseconds(timeNum, dataItem.unit), dataItem.mode);
          }
        }
      } catch {
        pushMsg(`${label}を時間型に変換できません。`);
        return;
      }
    }
  }

  if (dataItem.required) {
    if (pushMsg(TimeValidation.required(timeNum, label)) === "error") return;
  }

  if (dataItem.min != null && dataItem.max != null) {
    if (pushMsg(TimeValidation.range(timeNum, dataItem.min, dataItem.max, dataItem.mode, dataItem.unit, label)) === "error") return;
  } else {
    if (dataItem.min) {
      if (pushMsg(TimeValidation.min(timeNum, dataItem.min, dataItem.mode, dataItem.unit, label)) === "error") return;
    }
    if (dataItem.max) {
      if (pushMsg(TimeValidation.max(timeNum, dataItem.max, dataItem.mode, dataItem.unit, label)) === "error") return;
    }
  }
  if (dataItem.rangePair) {
    const pair = siblings?.find(item => item.name === dataItem.rangePair!.name);
    if (pair && pair.type === "time") {
      if (pushMsg(TimeValidation.context(timeNum, dataItem.rangePair, data, dataItem.mode, dataItem.unit, label, pair.unit, pair.label || pair.name)) === "error") return;
    }
  }

  if (dataItem.validations) {
    const v = data?.[key];
    for (const validation of dataItem.validations) {
      if (pushMsg(validation(v, { dataItem, data, key, parent, siblings })) === "error") return;
    }
  }
};

const fileItem: ConvertFunc<DataItem_File> = (msgs, data, { dataItem, parent, index, siblings }) => {
  const { key, label, pushMsg, state } = getController(msgs, { dataItem, parent, index });

  if (data) {
    const v = data[key];
    if (dataItem.multiple) {
      if (v != null && !Array.isArray(v)) {
        data[key] = [v];
      }
      data[key] = (data[key] as Array<FileValue<"app-api" | "page-api">>)?.filter(item => {
        if (item == null) return false;
        return item.size > 0;
      });
    } else {
      if (v != null && Array.isArray(v)) {
        if (v.length <= 1) {
          data[key] = v[0];
        } else {
          pushMsg(`${label}にファイルが複数設定されています。`);
          return;
        }
      }
      const vc = data[key] as FileValue<"app-api" | "page-api">;
      if (vc != null && vc.size === 0) {
        data[key] = undefined;
      }
    }
  }

  if (dataItem.multiple) {
    const v = data?.[key] as Array<FileValue<"app-api" | "page-api">> | null | undefined;

    if (dataItem.required) {
      if (v == null || v.length === 0) {
        if (pushMsg(`${label}をアップロードしてください。`) === "error") return;
      }
    }

    if (dataItem.accept) {
      const f = FileValidation.typeForServer(dataItem.accept);
      v?.forEach(item => pushMsg(f(item)));
    }

    if (dataItem.fileSize != null) {
      v?.forEach(item => {
        if (item.size > dataItem.fileSize!) {
          pushMsg(`${label}のサイズは${FileValidation.getSizeText(dataItem.fileSize!)}以内でアップロードしてください。`);
        }
      });
    }

    if (dataItem.totalFileSize != null) {
      const size = v?.reduce((pv, item) => pv + item.size, 0) ?? 0;
      if (size > dataItem.totalFileSize) {
        pushMsg(`${label}の合計サイズは${FileValidation.getSizeText(dataItem.totalFileSize)}以内でアップロードしてください。`);
      }
    }

    if (state.hasError) return;

    if (dataItem.validations) {
      for (const validation of dataItem.validations) {
        if (pushMsg(validation(v, { dataItem, data, key, parent, siblings })) === "error") return;
      }
    }

    return;
  }

  const v = data?.[key] as FileValue<"app-api" | "page-api"> | null | undefined;

  if (dataItem.required) {
    if (v == null) {
      pushMsg(`${label}をアップロードしてください。`);
    }
  }

  if (v != null && dataItem.accept != null) {
    pushMsg(FileValidation.typeForServer(dataItem.accept)(v));
  }

  if (v != null && dataItem.fileSize != null) {
    if (v.size > dataItem.fileSize) {
      pushMsg(`${label}のサイズは${FileValidation.getSizeText(dataItem.fileSize!)}以内でアップロードしてください。`);
    }
  }

  if (state.hasError) return;

  if (dataItem.validations) {
    for (const validation of dataItem.validations) {
      if (pushMsg(validation(v, { dataItem, data, key, parent, siblings })) === "error") return;
    }
  }
};

const arrayItem: ConvertFunc<DataItem_Array> = (msgs, data, { dataItem, parent, index, siblings }) => {
  const { key, label, pushMsg } = getController(msgs, { dataItem, parent, index });
  const v = data?.[key] as Array<any> | null | undefined;

  if (v !== null && getObjectType(v) !== "Array") {
    pushMsg(`${label}のデータ型が配列ではありません。`);
    return;
  }

  if (dataItem.required) {
    if (v == null) {
      pushMsg(`${label}を設定してください。`);
      return;
    }
  }

  if (dataItem.length != null) {
    if (v != null && v.length !== dataItem.length) {
      pushMsg(`${label}は${dataItem.length}件で設定してください。`);
    }
  } else {
    if (v != null && dataItem.minLength != null) {
      pushMsg(`${label}は${dataItem.minLength}件以上を設定してください。`);
    }
    if (v != null && dataItem.maxLength != null) {
      pushMsg(`${label}は${dataItem.maxLength}件以下を設定してください。`);
    }
  }

  if (dataItem.validations) {
    for (const validation of dataItem.validations) {
      if (pushMsg(validation(v, { dataItem, data, key, parent, siblings })) === "error") return;
    }
  }

  if (v == null) return;

  for (let i = 0, il = v.length; i < il; i++) {
    switchType(msgs, v, { dataItem: dataItem.item, parent: dataItem, index: i });
  }
};

const structItem: ConvertFunc<DataItem_Struct> = (msgs, data, { dataItem, parent, index, siblings }) => {
  const { key, label, pushMsg } = getController(msgs, { dataItem, parent, index });
  const v = data?.[key] as { [key: string | number]: any };

  if (v != null && getObjectType(v) !== "Object") {
    pushMsg(`${label}のデータ型が連想配列ではありません。`);
    return;
  }

  if (dataItem.required) {
    if (v == null) {
      pushMsg(`${label}を設定してください。`);
      return;
    }
  }

  if (dataItem.validations) {
    for (const validation of dataItem.validations) {
      if (pushMsg(validation(v, { dataItem, data, key, parent, siblings })) === "error") return;
    }
  }

  if (v == null) return;

  dataItem.item.forEach(item => {
    if (!item) return;
    switchType(msgs, v, { dataItem: item, parent: dataItem, siblings: dataItem.item });
  });
};

export const hasError = (msgs: Array<Api.Message>) => {
  return msgs.some(msg => msg?.type === "error");
};

export const getReturnMessages = (msgs: Array<Api.Message>) => {
  return msgs.filter(msg => msg?.type === "error");
};