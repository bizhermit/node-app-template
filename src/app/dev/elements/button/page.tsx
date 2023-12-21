/* eslint-disable no-console */
"use client";

import Button from "#/client/elements/button";
import Divider from "#/client/elements/divider";
import Form from "#/client/elements/form";
import TextBox from "#/client/elements/form/items/text-box";
import ToggleBox from "#/client/elements/form/items/toggle-box";
import { CloudDownloadIcon, CloudUploadIcon, DownIcon, HomeIcon, PlusIcon } from "#/client/elements/icon";
import { colors } from "#/utilities/sandbox";
import BaseLayout, { BaseRow, BaseSection, BaseSheet } from "@/dev/_components/base-layout";
import ControlLayout, { ControlItem } from "@/dev/_components/control-layout";
import { useState } from "react";

const Page = () => {
  const [disabled, setDisabled] = useState(false);

  return (
    <BaseLayout title="Button">
      <ControlLayout>
        <ControlItem caption="disabled">
          <ToggleBox
            $value={disabled}
            $onChange={v => setDisabled(v!)}
          />
        </ControlItem>
      </ControlLayout>
      <BaseSheet>
        <BaseSection title="on click">
          <BaseRow>
            <Button
              disabled={disabled}
              onClick={() => {
                console.log("click");
              }}
            >
              sync event
            </Button>
            <Button
              disabled={disabled}
              onClick={async (unlock) => {
                console.log("click func start");
                await new Promise(resolve => setTimeout(resolve, 2000));
                console.log("click func end");
                unlock();
              }}
            >
              async event
            </Button>
          </BaseRow>
        </BaseSection>
        <Divider />
        <BaseSection title="in form">
          <Form
            $layout="flex"
            onSubmit={false}
            $disabled={disabled}
          >
            <TextBox name="text" $required />
            <BaseRow>
              <Button type="submit">submit</Button>
              <Button type="reset">reset</Button>
              <Button type="submit" $notDependsOnForm>submit (not depend on form error)</Button>
              <Button onClick={() => console.log("click in form")}>button</Button>
            </BaseRow>
          </Form>
        </BaseSection>
        <Divider />
        <BaseSection title="appearance">
          <h3>outline/text</h3>
          <BaseRow>
            <Button disabled={disabled}>default</Button>
            <Button disabled={disabled} $outline>outline</Button>
            <Button disabled={disabled} $text>text</Button>
          </BaseRow>
          <h3>angular/round</h3>
          <BaseRow>
            <Button disabled={disabled}>default</Button>
            <Button disabled={disabled} $round>round</Button>
            <Button disabled={disabled} $round $outline>round</Button>
          </BaseRow>
          <h3>wide/fit</h3>
          <BaseRow>
            <Button disabled={disabled}>wide</Button>
            <Button disabled={disabled} $fitContent>fit</Button>
          </BaseRow>
          <h3>icon</h3>
          <BaseRow>
            <Button disabled={disabled} $icon={<CloudDownloadIcon />}>download</Button>
            <Button disabled={disabled} $icon={<CloudDownloadIcon />} $iconPosition="right">download</Button>
            <Button disabled={disabled} $icon={<CloudDownloadIcon />} $round>download</Button>
            <Button disabled={disabled} $icon={<CloudDownloadIcon />} $round $iconPosition="right">download</Button>
            <Button disabled={disabled} $icon={<CloudDownloadIcon />} />
            <Button disabled={disabled} $icon={<CloudDownloadIcon />} $round />
          </BaseRow>
          <BaseRow>
            <Button disabled={disabled} $icon={<CloudDownloadIcon />} $outline>download</Button>
            <Button disabled={disabled} $icon={<CloudDownloadIcon />} $outline $iconPosition="right">download</Button>
            <Button disabled={disabled} $icon={<CloudDownloadIcon />} $outline $round>download</Button>
            <Button disabled={disabled} $icon={<CloudDownloadIcon />} $outline $round $iconPosition="right">download</Button>
            <Button disabled={disabled} $icon={<CloudDownloadIcon />} $outline />
            <Button disabled={disabled} $icon={<CloudDownloadIcon />} $outline $round />
          </BaseRow>
          <h3>fill label</h3>
          <BaseRow>
            <Button disabled={disabled} $icon={<CloudUploadIcon />} $fillLabel>uplaod</Button>
            <Button disabled={disabled} $icon={<CloudUploadIcon />} $fillLabel $iconPosition="right">uplaod</Button>
            <Button disabled={disabled} $icon={<CloudUploadIcon />} $fillLabel $round>uplaod</Button>
            <Button disabled={disabled} $icon={<CloudUploadIcon />} $fillLabel $round $iconPosition="right">uplaod</Button>
          </BaseRow>
          <h3>size</h3>
          <BaseRow>
            <Button disabled={disabled} $size="xs">XS</Button>
            <Button disabled={disabled} $size="s">S</Button>
            <Button disabled={disabled} $size="m">M</Button>
            <Button disabled={disabled} $size="l">L</Button>
            <Button disabled={disabled} $size="xl">XL</Button>
          </BaseRow>
          <BaseRow>
            <Button disabled={disabled} $size="xs" $icon={<PlusIcon />} />
            <Button disabled={disabled} $size="s" $icon={<PlusIcon />} />
            <Button disabled={disabled} $size="m" $icon={<PlusIcon />} />
            <Button disabled={disabled} $size="l" $icon={<PlusIcon />} />
            <Button disabled={disabled} $size="xl" $icon={<PlusIcon />} />
          </BaseRow>
          <h3>custom body</h3>
          <BaseRow>
            <Button disabled={disabled} $noPadding $fitContent>no padding axis x</Button>
            <Button disabled={disabled} $noPadding $fitContent>hoge<br />fuga<br />piyo</Button>
            <Button disabled={disabled} style={{ width: 100, height: 100 }} $fitContent>100x100</Button>
            <Button disabled={disabled} style={{ width: 200 }} $icon={<DownIcon />} $fillLabel $iconPosition="right">w200</Button>
          </BaseRow>
          <h3>color</h3>
          {colors.map(color => {
            return (
              <BaseRow key={color}>
                <Button disabled={disabled} $color={color}>{color}</Button>
                <Button disabled={disabled} $color={color} $icon={<HomeIcon />}></Button>
                <Button disabled={disabled} $color={color} $outline>{color}</Button>
                <Button disabled={disabled} $color={color} $outline $icon={<HomeIcon />}></Button>
                <Button disabled={disabled} $color={color} $text>{color}</Button>
                <Button disabled={disabled} $color={color} $text $icon={<HomeIcon />}></Button>
              </BaseRow>
            );
          })}
        </BaseSection>
      </BaseSheet>
    </BaseLayout>
  );
};

export default Page;