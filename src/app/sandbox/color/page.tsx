import Row from "#/components/elements/row";
import { colors } from "#/utilities/sandbox";

const Page = () => {
  return (
    <div className="flex column p-xs w-100">
      {colors.map(color => {
        return (
          <Row key={color} className="w-100">
            <div className={`flex-1 p-xs c-${color}`}>
              <span>c-{color}</span>
            </div>
            <div className={`flex-1 p-xs fgc-${color}`}>
              <span>fgc-{color}</span>
            </div>
            <div className={`flex-1 p-xs bgc-${color}`}>
              <span>bgc-{color}</span>
            </div>
            <div className={`flex-1 p-xs bgc-${color}_r`}>
              <span>bgc-{color}_r</span>
            </div>
            <div className={`flex-1 p-xs`}>
              <span className={`bdc-${color}`} style={{ border: "0.3rem solid" }}>bdc-{color}</span>
            </div>
            <div className={`flex-1 p-xs c-${color}`}>
              <span className={`bdc-${color}_r`} style={{ border: "0.3rem solid" }}>bdc-{color}_r</span>
            </div>
          </Row>
        );
      })}
    </div>
  );
};

export default Page;