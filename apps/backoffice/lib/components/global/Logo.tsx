
const Logo = (props) => {
  return (
    <>
      <div className="logo">
        <span>A</span>
        <span className="logo__em">A</span>
      </div>

      <style jsx>{`
        .logo {
          font-size: 1.3rem;
          color: var(--color-white);

          &__em {
            color: var(--color-primary);
          }
        }
      `}</style>
    </>
  );
};

Logo.defaultProps = {};

export default Logo;
