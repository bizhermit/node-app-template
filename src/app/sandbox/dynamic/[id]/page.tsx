import Text from "#/client/elements/text";

type Params = {
  id: string;
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