import Text from "#/components/elements/text";

type Params = {
  id: string;
};

const Page: PageFC<Params> = (props) => {
  console.log("dyanmic", props);
  console.log("- ", props.params.id);
  return (
    <div className="flex-stretch">
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