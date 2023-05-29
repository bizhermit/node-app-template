import StructView from "#/components/elements/struct-view";
import Text from "#/components/elements/text";

const EnvServer = () => {
  return (
    <section>
      <h1>Server</h1>
      {Object.keys(process.env).length > 0 ?
        <StructView $value={process.env} /> :
        <Text>no contents</Text>
      }
    </section>
  );
};

export default EnvServer;