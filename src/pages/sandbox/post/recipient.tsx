import NextLink from "#/client/elements/link";
import StructView from "#/client/elements/struct-view";
import SandboxLayoutProvider from "../../../app/sandbox/_components/sandbox-layout";

type Props = {
  data: {
    param1: string;
    param2: string;
  };
};

const Page: NextPageWithLayout<Props> = ({ data }) => {
  console.log(JSON.stringify(data, null, 2));
  return (
    <div className="flex p-m g-m">
      <h1>recipient</h1>
      <StructView
        $value={data}
      />
      <NextLink
        href="/sandbox/post/sender"
      >
        sender
      </NextLink>
    </div>
  )
};

Page.layout = (page) => {
  return (
    <SandboxLayoutProvider>
      {page}
    </SandboxLayoutProvider>
  );
};

// export const getServerSideProps: GetServerSideProps = async (ctx) => {
//   console.log("------------------", ctx.req.method);
//   if (ctx.req.method?.toUpperCase() === "POST") {
//     const buf = ctx.req.read();
//     const data = queryString.parse(buf?.toString());
//     return {
//       props: {
//         data,
//       }
//     };
//   }
//   return {
//     props: {
//       data: {},
//     }
//   };
// };

export default Page;