export const convertToBase64 = (file: File | null | undefined) => {
  return new Promise<string | ArrayBuffer>((resolve, reject) => {
    if (file == null) {
      reject("file not set.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result == null) reject("convert failed.");
      else resolve(reader.result);
    };
    reader.readAsDataURL(file);
  });
};

export const convertToFile = (base64: string | ArrayBuffer | null | undefined, fileName: string, options?: FilePropertyBag) => {
  if (base64 == null) throw new Error("base64 not set");
  if (typeof base64 === "string") {
    const bin = decodeURIComponent(escape(atob(base64.replace(/^.*,/, ""))));
    let u8a = new Uint8Array(bin.length);
    for (let i = 0, il = bin.length; i < il; i++) {
      u8a[i] = bin.charCodeAt(i);
    }
    return new File([u8a.buffer], fileName, options);
  }
  return new File([new Uint8Array(base64)], fileName, options);
};
