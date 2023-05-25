import Style from "$/components/elements/loading.module.scss";

const SuspenseLoading = () => {
  return (
    <div
      className={Style.wrap}
      tabIndex={0}
      data-fixed={true}
      data-appearance="bar"
    >
      <div className={`${Style.bar} bgc-main`} />
    </div>
  );
};

export default SuspenseLoading;