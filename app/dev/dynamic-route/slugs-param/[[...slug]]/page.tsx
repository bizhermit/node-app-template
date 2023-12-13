import BaseLayout from "@/dev/_components/base-layout";

const Page: PageFC = ({ params }) => {
  return (
    <BaseLayout title="[[...slug]]">
      <pre>
        {JSON.stringify(params, null, 2)}
      </pre>
    </BaseLayout>
  );
};

export default Page;