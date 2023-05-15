import { Link } from 'react-router-dom';
import wiwynnLogo from '../../assets/icons/wiwynn_logo_blue.svg';
import { useAppDispatch } from '../../store';
import { userAction } from '../../store/userSlice';

const Unauthorized = () => {
  const dispatch = useAppDispatch();
  return (
    <main>
      <section className="h-full w-full min-w-[990px] bg-white">
        <div className="flex h-full flex-col items-center justify-center px-20">
          <img src={wiwynnLogo} alt="Wiwynn Logo" className="mb-14 w-[18em]" />
          {/* <h1 className="mb-16 text-5xl text-[#445566]">401</h1> */}
          <h3 className="mb-20 text-2xl text-[#445566]">
            You don&apos;t have permission to access the resource.
          </h3>
          <hr className="mt-4 w-full border-t border-[#F0F0F0]" />
          <p className="mt-4 text-sm text-[#5b5b5b]">
            The resource that you are attempting to access is protected and you don&apos;t
            have the necessary permission to view it.
          </p>
          <div className="flex gap-16 px-4">
            <Link to="/" className="mt-4 text-sm text-[#4F8DEE]">
              Go back to home page
            </Link>
            <Link
              to="/signin"
              className="mt-4 text-sm text-[#4F8DEE]"
              onClick={() => dispatch(userAction.signOut())}
            >
              Go sign in
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Unauthorized;
