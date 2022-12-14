export const fileSizeText = (size: number) => {
  if (size < 1024) return `${size}B`;
  if (size < 1048576) return `${Math.floor(size / 1024 * 10) / 10}KB`;
  if (size < 1073741824) return `${Math.floor(size / 1048576 * 10) / 10}MB`;
  return `${Math.floor(size / 1073741824 * 10) / 10}GB`;
};

export const fileTypeValidation = (accept: string) => {
  const accepts = accept.split(",");
  const validAccept = (file: File) => {
    if (file == null) return true;
    return accepts.some(accept => {
      if (accept.startsWith(".")) return file.name.endsWith(accept);
      const reg = new RegExp(accept);
      return (file.type || "").match(reg);
    });
  };
  return (files: File | Array<File>) => {
    const values = Array.isArray(files) ? files : [files];
    let ret = "";
    for (const file of values) {
      if (validAccept(file)) continue;
      ret = "許可されていないファイル拡張子です。";
      break;
    }
    return ret;
  };
};

export const fileSizeValidation = (fileSize: number) => {
  return (files: File | Array<File>) => {
    const values = Array.isArray(files) ? files : [files];
    let ret = "";
    for (const file of values) {
      if (file == null || file.size <= fileSize) continue;
      ret = `ファイルサイズは${fileSizeText(fileSize)}以内でアップロードしてください`;
      break;
    }
    return ret;
  };
};

export const totalFileSizeValidation = (totalFileSize: number) => {
  return (files: File | Array<File>) => {
    const values = Array.isArray(files) ? files : [files];
    const sum = values.reduce((sum, file) => sum + (file?.size || 0), 0);
    if (sum <= totalFileSize) return "";
    return `ファイル合計サイズは${fileSizeText(totalFileSize)}以内でアップロードしてください`;
  };
};