namespace ArrayValidation {

  const defaultLabel = "値";
  const defaultActLabel = "選択";

  export const required = (v: Array<any> | null | undefined, label?: string, actLabel?: string) => {
    if (v == null || v.length === 0) return `${label || defaultLabel}を${actLabel || defaultActLabel}してください。`;
    return undefined;
  };

  export const length = (v: Array<any> | null | undefined, length: number, label?: string, actLabel?: string) => {
    if (v == null || v.length === length) return undefined;
    return `${label || defaultLabel}件で${actLabel || defaultActLabel}してください。`;
  };

  export const range = (v: Array<any> | null | undefined, min: number, max: number, label?: string, actLabel?: string) => {
    if (v == null || (min <= v.length && v.length <= max)) return undefined;
    return `${label || defaultLabel}は${min}件以上${max}件以下を${actLabel || defaultActLabel}してください。`;
  };

  export const minLength = (v: Array<any> | null | undefined, min: number, label?: string, actLabel?: string) => {
    if (v == null || v.length >= min) return undefined;
    return `${label || defaultLabel}は${min}件以上を${actLabel || defaultActLabel}してください。`;
  };

  export const maxLength = (v: Array<any> | null | undefined, max: number, label?: string, actLabel?: string) => {
    if (v == null || v.length <= max) return undefined;
    return `${label || defaultLabel}は${max}件以下を${actLabel || defaultActLabel}してください。`;
  };

}

export default ArrayValidation;