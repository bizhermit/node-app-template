import getSession from "$/auth/session";

const Page: PageFC = async () => {
  const session = await getSession();

  return (
    <div>
      <pre>
        {JSON.stringify(session?.user ?? { state: 404 })}
      </pre>
    </div>
  );
};

export default Page;