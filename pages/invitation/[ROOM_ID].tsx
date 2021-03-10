import { GetServerSideProps } from 'next';

function Invitation({ isLogined }: { isLogined: boolean }) {
  return <div></div>;
}

export const getServerSideProps: GetServerSideProps = async context => {
  const isLogined = context.req.cookies.token ? true : false;

  return {
    props: {
      isLogined,
    },
  };
};

export default Invitation;
