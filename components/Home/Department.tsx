import Link from "next/link";

const Department = ({
    text,
    containerStyles,
    hrefs,
  }: {
    text: string;
    containerStyles: string;
    hrefs: string;
  }) => {
    return (
      <Link href={hrefs}>
        
          <button
            className={`${containerStyles} group relative cursor-pointer overflow-hidden bg-accent uppercase`}
          >
            <span className='ease absolute top-1/2 h-0 w-64 origin-center -translate-x-20 rotate-45 bg-red-600 transition-all duration-300 group-hover:h-64 group-hover:-translate-y-32'></span>
            <span className='ease relative text-white transition duration-300 group-hover:text-white'>
              {text}
            </span>
          </button>
      </Link>
    );
  };
  
export default Department;
