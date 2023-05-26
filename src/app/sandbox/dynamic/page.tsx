import Text from "#/components/elements/text";

const Page: PageFC = (props) => {
  console.log("dynamic index", props);
  return (
    <div className="flex-stretch">
      <Text>
        dynamic index
      </Text>
      <pre>
        {JSON.stringify(props, null, 2)}
      </pre>
    </div>
  );
};

export default Page;