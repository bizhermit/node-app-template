import { colors } from "#/utilities/sandbox";
import BaseLayout, { BaseSheet } from "../_components/base-layout";

const Page = () => {
  return (
    <BaseLayout title="Color">
      <BaseSheet>
        <table>
          <tbody>
            {colors.map(color => {
              return (
                <tr key={color}>
                  <th>{color}</th>
                  <td className={`fgc-${color}`}>
                    <span>fgc-{color}</span>
                  </td>
                  <td className={`bgc-${color} fgc-${color}_r`}>
                    <span>bgc-{color}</span>
                  </td>
                  <td>
                    <div
                      className={`bdc-${color}`}
                      style={{ border: "2px solid" }}
                    >
                      <span>bdc-{color}</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </BaseSheet>
    </BaseLayout>
  );
};

export default Page;