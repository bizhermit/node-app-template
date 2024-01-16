import BaseLayout from "../../../../dev/_components/base-layout";

// export const dynamic = "force-static";
// export const generateStaticParams = async () => {
//   return [
//     ...[
//       "1",
//       "2",
//       "3",
//       "4",
//       "5",
//       "10",
//       "100",
//       "x",
//       "xxx",
//     ].map(slug => {
//       return { slug: [slug] };
//     }),
//     { slug: ["3"] },
//     { slug: ["4", "5"] },
//   ];
// };

const Page: PageFC = ({ params }) => {
  return (
    <BaseLayout title="[...slug]">
      <pre>
        {JSON.stringify(params, null, 2)}
      </pre>
    </BaseLayout>
  );
};

export default Page;