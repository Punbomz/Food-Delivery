export default function Skeleton() {
    return(
        <>
            <div className="flex w-full flex-col gap-4 lg:gap-8">
                <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-6">
                    <div className="skeleton h-24 w-24 lg:h-40 lg:w-40 shrink-0 rounded-full"></div>
                    
                    <div className="flex flex-col gap-3 lg:gap-5 w-full lg:flex-1">
                    <div className="skeleton h-5 lg:h-8 w-full lg:w-3/4"></div>
                    <div className="skeleton h-5 lg:h-8 w-5/6 lg:w-2/3"></div>
                    <div className="skeleton h-5 lg:h-8 w-3/4 lg:w-1/2"></div>
                    </div>
                </div>
                
                <div className="skeleton h-64 lg:h-[600px] w-full rounded-lg"></div>
            </div>
        </>
    );
}