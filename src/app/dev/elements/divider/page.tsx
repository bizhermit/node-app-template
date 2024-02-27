import Divider from "#/client/elements/divider";
import TextBox from "#/client/elements/form/items/text-box";
import { colors } from "#/utilities/sandbox";
import React from "react";
import BaseLayout, { BaseSection, BaseSheet } from "../../_components/base-layout";

const Page = () => {
  return (
    <BaseLayout title="Divider">
      <BaseSheet stretch>
        <BaseSection>
          <Divider />
          <Divider $height={3} />
          <Divider $align="right" />
        </BaseSection>
        <BaseSection title="has children">
          <Divider $align="left">left</Divider>
          <Divider $align="center">center</Divider>
          <Divider $align="right">right</Divider>
          <Divider>
            <TextBox placeholder="react node" />
          </Divider>
        </BaseSection>
        <BaseSection title="color" stretch>
          {colors.map(color => {
            return (
              <React.Fragment key={color}>
                <Divider $color={color} $align="left">
                  {color}
                </Divider>
                <Divider
                  $color={color}
                  $reverseColor
                  $align="left"
                  className={`fgc-${color}_r bgc-${color}`}
                >
                  {`${color} reverse`}
                </Divider>
              </React.Fragment>
            );
          })}
        </BaseSection>
      </BaseSheet>
    </BaseLayout>
  );
};

export default Page;
