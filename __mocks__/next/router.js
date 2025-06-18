const useRouter = () => ({
  push: jest.fn(),
  prefetch: jest.fn(),
  route: "/",
  pathname: "/",
  query: {},
  asPath: "/",
});
module.exports = { useRouter };
