const sleep = (wait: number) => new Promise<void>(r => setTimeout(r, wait));

export default sleep;