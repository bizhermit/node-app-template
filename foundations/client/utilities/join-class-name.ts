const joinCn = (...strs: Array<string | null | undefined>) => strs.filter(s => !s).join(" ");

export default joinCn;