import { TimeRadix as R } from "./consts";

class Time {

  protected time: number;

  constructor(time?: number | string | Date | Time | null) {
    this.time = 0;
    if (time == null) return this;
    if (typeof time === "number") {
      this.time = time;
      return this;
    }
    if (typeof time === "string") {
      let ctx = time.match(/^(\+|\-|)(\d{2}|$)(\d{2}|$)(\d{2}|$)(\d{3}|$)/);
      if (!ctx) ctx = time.match(/^(\+|\-|)(\d+)?(?::|時|$)(\d+)?(?::|分|$)(\d+)?(?:.|秒|$)(\d+)?(?:.*|$)/);
      if (ctx) {
        this.time = (Number(ctx[2] ?? "0") * R.H + Number(ctx[3] ?? "0") * R.M + Number(ctx[4] ?? "0") * R.S + Number(ctx[5] ?? "0")) * (ctx[1] === "-" ? -1 : 1);
      }
      return this;
    }
    if (typeof (time as any).time === "number") {
      this.time = (time as Time).time;
      return this;
    }
    this.time = ((time as Date).getTime() - (time as Date).getTimezoneOffset() * R.M) % 86400000;
    return this;
  }

  public format(pattern = "-hh:mm:ss.SSS") {
    return pattern
      .replace("+-", this.time < 0 ? "-" : "+")
      .replace("-", this.time < 0 ? "-" : "")
      .replace("hh", `0${Math.abs(this.getHours())}`.slice(-2))
      .replace("h", String(Math.abs(this.getHours())))
      .replace("mm", `0${Math.abs(this.getMinutes())}`.slice(-2))
      .replace("m", String(Math.abs(this.getMinutes())))
      .replace("ss", `0${Math.abs(this.getSeconds())}`.slice(-2))
      .replace("s", String(Math.abs(this.getSeconds())))
      .replace("SSS", `00${Math.abs(this.getMilliseconds())}`.slice(-3))
      .replace("SS", `00${Math.abs(this.getMilliseconds())}`.slice(-3).slice(2))
      .replace("S", String(Math.abs(this.getMilliseconds())));
  }

  public getTime() {
    return this.time;
  }

  public getHours() {
    if (this.time < 0) return Math.ceil(this.time / R.H);
    return Math.floor(this.time / R.H);
  }

  public setHours(hours: number, minutes?: number, seconds?: number, milliseconds?: number) {
    this.time = Math.max(0, hours * R.H + (minutes ?? this.getMinutes()) * R.M + (seconds ?? this.getSeconds()) * R.S + (milliseconds ?? this.getMilliseconds()));
    return this;
  }

  public getMinutes(include?: boolean) {
    if (include) {
      if (this.time < 0) return Math.ceil(this.time / R.M);
      return Math.floor(this.time / R.M);
    }
    if (this.time < 0) return Math.ceil(this.time / R.M) % 60;
    return Math.floor(this.time / R.M) % 60;
  }

  public setMinutes(minutes: number, seconds?: number, milliseconds?: number) {
    this.time = Math.max(0, this.getHours() * R.H + minutes * R.M + (seconds ?? this.getSeconds()) * R.S + (milliseconds ?? this.getMilliseconds()));
    return this;
  }

  public getSeconds(include?: boolean) {
    if (include) {
      if (this.time < 0) return Math.ceil(this.time / R.S);
      return Math.floor(this.time / R.S);
    }
    if (this.time < 0) return Math.ceil(this.time / R.S) % 60;
    return Math.floor(this.time / R.S) % 60;
  }

  public setSeconds(seconds: number, milliseconds?: number) {
    this.time = Math.max(0, this.getMinutes(true) * R.M + seconds * R.S + (milliseconds ?? this.getMilliseconds()));
    return this;
  }

  public getMilliseconds(include?: boolean) {
    if (include) return this.time;
    return this.time % R.S;
  }

  public setMilliseconds(milliseconds: number) {
    this.time = this.getSeconds(true) * R.S + Math.max(0, milliseconds);
    return this;
  }

  public clear() {
    this.time = 0;
    return this;
  }

  public getCopy() {
    return new Time(this);
  }

  public addHours(add: number) {
    this.time = Math.max(0, this.time + add * R.H);
    return this;
  }

  public addMinutes(add: number) {
    this.time = Math.max(0, this.time + add * R.M);
    return this;
  }

  public addSeconds(add: number) {
    this.time = Math.max(0, this.time + add * R.S);
    return this;
  }

  public addMilliseconds(add: number) {
    this.time = this.time + add;
    return this;
  }

  public isPlus() {
    return this.time >= 0;
  }

  public isMinus() {
    return this.time < 0;
  }

}

export default Time;
