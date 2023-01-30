import Divider from "@/components/elements/divider";
import RadioButtons from "@/components/elements/form-items/radio-buttons";
import { NavigationMode, useNavigation } from "@/components/elements/navigation-container";
import StructView from "@/components/elements/struct-view";
import { NextPage } from "next";

const Page: NextPage = () => {
  const navigation = useNavigation();

  return (
    <div className="flex-start w-100 h-100 p-1 gap-1">
      <StructView
        $keys={[
          { key: "navigationPosition" },
          { key: "navigationMode" },
          { key: "navigationState" }
        ]}
        $value={navigation}
      />
      <Divider />
      <RadioButtons<NavigationMode>
        $source={[
          "auto",
          "visible",
          "minimize",
          "manual",
          "none",
        ].map(v => {
          return { value: v, label: v };
        })}
        $value={navigation.navigationMode}
        $onChange={v => {
          navigation.setNavigationMode(v!);
        }}
      />
    </div>
  );
};

export default Page;