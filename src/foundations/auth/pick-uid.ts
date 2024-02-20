const pickUid = (pathname: string | null | undefined) => {
  return pathname?.match(/^\/([^\/|\?]*)/)?.[1];
};

export default pickUid;
