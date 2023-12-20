import { BaseSection } from "@/dev/_components/base-layout";

// export const dynamic = "force-static";
// export const generateStaticParams = async () => {
//   return [
//     "1",
//     "2",
//     "3",
//     "4",
//     "5",
//     "10",
//     "100",
//     "x",
//     "xxx",
//   ].map(slug => {
//     return { slug };
//   })
// };

const Page: PageFC = ({ params }) => {
  return (
    <BaseSection title="param/[slug]/page.tsx">
      <pre>
        {JSON.stringify(params, null, 2)}
      </pre>
    </BaseSection>
  );
};

export default Page;