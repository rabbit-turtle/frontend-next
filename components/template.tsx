function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <section className="fixed left-0 bottom-0 top-0 right-0 lg:bg-rabbit-turtle bg-cover bg-white"></section>
      <section className="flex flex-col justify-start relative w-full max-w-md bg-white min-h-full max-h-full lg:m-floatingr mx-auto">
        {children}
      </section>
    </>
  );
}

export default Template;
