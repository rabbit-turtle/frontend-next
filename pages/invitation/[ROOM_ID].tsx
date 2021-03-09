import { GetServerSideProps } from 'next';

function Invitation() {
  return <div></div>;
}

export const getServerSideProps: GetServerSideProps = async context => {
  const isLogined = context.req.cookies ? true : false;
  //
  return {
    props: {
      isLogined,
    },
  };
};

export default Invitation;
