import getSession from "#/auth/session";

// export const dynamic = "force-static";
// export const generateStaticParams = async () => {
//   return generateArray(10, i => i).map(i => {
//     return { uid: String(i) };
//   });
// };

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