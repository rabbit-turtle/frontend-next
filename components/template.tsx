function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <section className="fixed left-0 bottom-0 top-0 right-0 lg:bg-rabbit-turtle bg-cover bg-white"></section>
      <section className="flex flex-col justify-center relative w-full max-w-lg bg-white min-h-screen max-h-screen lg:m-floatingr mx-auto overflow-auto">
        {children}
      </section>
    </>
  );
}

export default Template;
