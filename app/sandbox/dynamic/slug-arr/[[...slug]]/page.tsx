const Page: PageFC = ({ params }) => {
  return (
    <>
    <h1>slug array</h1>
    <p>
      <pre>
        {JSON.stringify(params, null, 2)}
      </pre>
    </p>
    </>
  );  
};

export default Page;