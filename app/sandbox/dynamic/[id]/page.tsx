import Text from "#/client/elements/text";

type Params = {
  id: string;
};

export const dynamic = "force-static";
export const generateStaticParams = async () => {
  return [
    "",
    "1",
    "2",
    "3",
    "4",
    "5",
    "10",
    "100",
    "x",
    "xxx",
  ].map(id => {
    return { id };
  })
};


const Page: PageFC<Params> = (props) => {
  console.log("dyanmic", props);
  console.log("- ", props.params.id);
  return (
    <div className="flex column">
      <Text>
        dynamic routing
      </Text>
      <pre>
        {JSON.stringify(props, null, 2)}
      </pre>
    </div>
  );
};

export default Page;